import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationPermission, setLocationPermission] = useState("pending");
  const [locationLoading, setLocationLoading] = useState(false);

  // Show location popup when component mounts
  useEffect(() => {
    // Check if user has already granted location permission
    const hasLocationPermission = localStorage.getItem("eh_location_granted");
    if (!hasLocationPermission) {
      setShowLocationPopup(true);
    } else {
      setLocationPermission("granted");
    }
  }, []);

  const handleLocationPermission = async (granted) => {
    setLocationLoading(true);
    setShowLocationPopup(false);

    if (!granted) {
      setLocationPermission("denied");
      setLocationLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocationPermission("not-supported");
      setLocationLoading(false);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates (reverse geocoding)
      let address = null;
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
      } catch (geoError) {
        console.log("Reverse geocoding failed:", geoError);
      }

      // Send location to backend
      const success = await sendLocationToBackend(latitude, longitude, address);
      
      if (success) {
        setLocationPermission("granted");
        localStorage.setItem("eh_location_granted", "true");
      } else {
        setLocationPermission("error");
      }
      
    } catch (error) {
      console.error("Location access error:", error);
      setLocationPermission("denied");
    } finally {
      setLocationLoading(false);
    }
  };

  const sendLocationToBackend = async (latitude, longitude, address) => {
    try {
      const phone = localStorage.getItem("eh_user_phone");
      if (!phone) {
        return false;
      }

      const response = await api.post("/api/location", {
        latitude,
        longitude,
        address,
        phone
      });

      return true;
    } catch (error) {
      console.error("Failed to send location to backend:", error);
      return false;
    }
  };

  const send = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() && !mediaFile) return;

    const userMsg = { 
      role: "user", 
      text: input.trim() || "", 
      media: mediaFile ? mediaFile.name : null,
      id: Date.now() + "u" 
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setMediaFile(null);
    setSending(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("message", userMsg.text);
      formData.append("phone", localStorage.getItem("eh_user_phone"));
      if(mediaFile) formData.append("file", mediaFile);

      const { data } = await api.post("/api/chat/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const botMsg = { 
        role: "bot", 
        text: data?.botReply ?? "", 
        id: Date.now() + "b" 
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setMediaFile(file);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Location Permission Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-white p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h2 className="text-xl font-mono text-white mb-4 tracking-wider">
                LOCATION ACCESS REQUIRED
              </h2>
              <p className="text-white font-mono text-sm mb-6 leading-relaxed">
                EasyHealth needs your location to provide personalized health recommendations and emergency services.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleLocationPermission(false)}
                  className="flex-1 bg-black text-white py-3 font-mono border-2 border-white hover:bg-white hover:text-black transition-all duration-200"
                >
                  DENY
                </button>
                <button
                  onClick={() => handleLocationPermission(true)}
                  className="flex-1 bg-white text-black py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200"
                >
                  ALLOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {locationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-white p-6 text-center">
            <div className="text-white font-mono mb-4">Getting your location...</div>
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent mx-auto"></div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-2 border-white bg-gray-900 p-4 flex items-center justify-between">
        <h1 className="text-lg font-mono text-white">EASYHEALTH CHAT</h1>
        <div className="flex items-center gap-4">
          {locationPermission === "granted" && (
            <span className="text-green-400 text-sm font-mono">📍 Location Active</span>
          )}
          {locationPermission === "denied" && (
            <span className="text-red-400 text-sm font-mono">📍 Location Denied</span>
          )}
          {locationPermission === "error" && (
            <span className="text-yellow-400 text-sm font-mono">📍 Location Error</span>
          )}
          <Link to="/" className="text-white font-mono hover:text-gray-300 transition-colors">
            ← BACK
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-black pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 mt-10 font-mono">
            START YOUR CONVERSATION...
            {locationPermission === "granted" && (
              <div className="text-green-400 text-sm mt-2">📍 Location services enabled for better health insights</div>
            )}
            {locationPermission === "denied" && (
              <div className="text-red-400 text-sm mt-2">📍 Location access denied - some features may be limited</div>
            )}
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`max-w-2xl ${m.role === "user" ? "ml-auto" : ""}`}>
              <div className={`inline-block border-2 border-white px-4 py-3 ${
                m.role === "user" ? "bg-white text-black" : "bg-gray-900 text-white"
              }`}>
                {m.media && (
                  <div className="mb-2 text-sm font-mono">📎 {m.media}</div>
                )}
                {m.text && (
                  <p className="whitespace-pre-wrap leading-relaxed font-mono">{m.text}</p>
                )}
              </div>
            </div>
          ))
        )}
        {error && (
          <div className="text-red-400 text-sm font-mono border border-red-400 p-2 max-w-2xl">
            {error}
          </div>
        )}
      </main>

      <form onSubmit={send} className="sticky bottom-0 z-50 p-4 border-2 border-white bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <label className="bg-white text-black px-3 py-2 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">
              📎 ADD MEDIA
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </label>
            {mediaFile && <span className="text-white font-mono text-sm">{mediaFile.name}</span>}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 bg-black text-white border-2 border-white px-3 py-2 font-mono focus:outline-none focus:border-gray-400"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="px-6 py-2 bg-white text-black font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
              disabled={sending || (!input.trim() && !mediaFile)}
            >
              {sending ? "SENDING..." : "SEND"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
