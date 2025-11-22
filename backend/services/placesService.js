import dotenv from "dotenv";
dotenv.config();

/**
 * Find nearby hospitals using Google Places API
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radius - Search radius in meters (default 5000m = 5km)
 * @returns {Promise<Array>} Array of nearby hospitals with details
 */
export async function findNearbyHospitals(latitude, longitude, radius = 5000) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn("Google Places API key not configured");
      return [];
    }

    // Google Places API - Nearby Search
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API Error:", data.status, data.error_message);
      return [];
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Get top 3 hospitals and fetch detailed info
    const hospitals = await Promise.all(
      data.results.slice(0, 3).map(async (place) => {
        const details = await getPlaceDetails(place.place_id, apiKey);
        return {
          name: place.name,
          address: place.vicinity,
          rating: place.rating || "N/A",
          totalRatings: place.user_ratings_total || 0,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          distance: calculateDistance(
            latitude,
            longitude,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          phone: details.phone || "Not available",
          website: details.website || null,
          openNow: place.opening_hours?.open_now ? "Open Now" : "Closed",
          placeId: place.place_id
        };
      })
    );

    return hospitals;
  } catch (error) {
    console.error("Error finding nearby hospitals:", error);
    return [];
  }
}

/**
 * Get detailed information about a place
 */
async function getPlaceDetails(placeId, apiKey) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,opening_hours&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.result) {
      return {
        phone: data.result.formatted_phone_number,
        website: data.result.website,
        openingHours: data.result.opening_hours
      };
    }

    return {};
  } catch (error) {
    console.error("Error fetching place details:", error);
    return {};
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance.toFixed(1) + " km";
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
