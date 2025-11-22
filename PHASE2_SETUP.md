# Phase 2: Hospital Finder Setup Guide

## Overview
Phase 2 adds real-time nearby hospital search using Google Places API. When users share their location and chat about medical reports, the app will show actual nearby hospitals with:
- Hospital name, address, phone number
- Google ratings and reviews
- Distance from user
- Open/Closed status
- Direct link to Google Maps
- Website (if available)

## Setup Steps

### 1. Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Places API**
   - **Places API (New)** 
   - **Geocoding API** (optional, for better address lookup)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. **Restrict your API key** (Important for security):
   - Application restrictions: HTTP referrers or IP addresses
   - API restrictions: Select only Places API

### 2. Add API Key to Backend

Update `backend/.env`:
```env
GOOGLE_PLACES_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Test the Integration

Start your backend server:
```bash
cd backend
npm run dev
```

### 4. How It Works

**Backend Flow:**
1. User sends message with medical report
2. Backend fetches user's location from database
3. Calls Google Places API to find nearby hospitals (5km radius)
4. Gets top 3 hospitals with details
5. Formats hospital info and sends to frontend

**Frontend Flow:**
1. Displays AI analysis of medical report
2. Shows hospital cards below the message
3. Each card has:
   - Hospital details
   - Click-to-call phone number
   - "View on Google Maps" button
   - Website link

### 5. Features

✅ Real-time hospital search based on user location
✅ Distance calculation (Haversine formula)
✅ Google ratings and reviews
✅ Open/Closed status
✅ Direct Google Maps integration
✅ Click-to-call phone numbers
✅ Responsive hospital cards

### 6. API Usage & Costs

**Google Places API Pricing:**
- Nearby Search: $32 per 1000 requests
- Place Details: $17 per 1000 requests
- **Free tier**: $200 credit per month (~6,000 searches)

**Optimization:**
- Results cached per user location
- Only searches when location available
- Limits to top 3 hospitals
- Graceful fallback if API fails

### 7. Future Enhancements

🔜 **Phase 3 Ideas:**
- Filter by specialty (cardiologist, dermatologist, etc.)
- Show doctor availability and timings
- Book appointments directly
- Save favorite hospitals
- Emergency services (ambulance, blood banks)
- Pharmacy finder
- Insurance network hospitals
- User reviews and ratings

### 8. Testing

Test the hospital finder:
1. Register/Login to the app
2. Grant location permission
3. Upload a medical report or ask a health question
4. Check if hospitals appear below the AI response
5. Click "View on Google Maps" to verify location
6. Test phone number click-to-call

### 9. Troubleshooting

**No hospitals showing?**
- Check if `GOOGLE_PLACES_API_KEY` is set in `.env`
- Verify Places API is enabled in Google Cloud Console
- Check backend logs for API errors
- Ensure user has granted location permission
- Try increasing search radius in `placesService.js`

**API quota exceeded?**
- Monitor usage at [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- Set up billing alerts
- Implement caching to reduce API calls

### 10. Security Notes

⚠️ **Important:**
- Never commit API keys to Git
- Add `.env` to `.gitignore`
- Use API key restrictions
- Set up billing alerts
- Monitor API usage regularly
- Use environment variables for production

---

**Ready to go!** Once you add your Google Places API key, the hospital finder will work automatically. 🏥
