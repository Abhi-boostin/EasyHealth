export default function HospitalCard({ hospital, index }) {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${hospital.location.lat},${hospital.location.lng}&query_place_id=${hospital.placeId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-900 border-2 border-white p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-mono font-bold text-lg">
          {index + 1}. {hospital.name}
        </h3>
        <span className={`text-xs font-mono px-2 py-1 border ${
          hospital.openNow === "Open Now" 
            ? "text-green-400 border-green-400" 
            : "text-red-400 border-red-400"
        }`}>
          {hospital.openNow}
        </span>
      </div>

      <div className="space-y-2 text-sm font-mono text-white">
        <div className="flex items-start gap-2">
          <span className="text-white">📍</span>
          <span>{hospital.address}</span>
        </div>

        {hospital.phone !== "Not available" && (
          <div className="flex items-center gap-2">
            <span className="text-white">📞</span>
            <a 
              href={`tel:${hospital.phone}`}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {hospital.phone}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-white">⭐</span>
          <span>
            {hospital.rating}/5 
            {hospital.totalRatings > 0 && (
              <span className="text-gray-400"> ({hospital.totalRatings} reviews)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white">📏</span>
          <span>{hospital.distance} away</span>
        </div>

        {hospital.website && (
          <div className="flex items-center gap-2">
            <span className="text-white">🌐</span>
            <a 
              href={hospital.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline truncate"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      <button
        onClick={openGoogleMaps}
        className="w-full mt-3 bg-white text-black py-2 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200"
      >
        📍 VIEW ON GOOGLE MAPS
      </button>
    </div>
  );
}
