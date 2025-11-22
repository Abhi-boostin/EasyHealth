import { useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setErr(""); 
    setMsg("");
    
    if (!validatePhone(phone)) {
      setErr("Please enter a valid phone number (e.g., +917017397663 or 7017397663)");
      return;
    }
    
    if (!validatePassword(password)) {
      setErr("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const { data } = await api.post("/api/user/register", { 
        phone: formattedPhone, 
        password 
      });
      setOtpSent(true);
      setMsg(data.msg || "OTP sent to your phone number");
    } catch (error) {
      setErr(error?.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (!cleaned.startsWith('+')) {
      return `+91${cleaned}`;
    }
    return cleaned;
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setErr(""); 
    setMsg("");
    
    if (!otp || otp.length !== 6) {
      setErr("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const { data } = await api.post("/api/user/verify-otp", { 
        phone: formattedPhone, 
        otp 
      });
      setMsg(data?.msg || "OTP verified successfully!");
      
      // Store user data for chat
      localStorage.setItem("eh_user_phone", formattedPhone);
      localStorage.setItem("eh_user_password", password);
      
      // Redirect to chat after a short delay
      setTimeout(() => {
        navigate("/chat");
      }, 1500);
      
    } catch (error) {
      setErr(error?.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border-2 border-white p-6 rounded-none">
          <h2 className="text-center text-xl font-mono text-white mb-6 tracking-wider">
            CREATE ACCOUNT
          </h2>

          {!otpSent ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-white mb-2">PHONE NUMBER</label>
                <input
                  type="tel"
                  placeholder="+917017397663"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black text-white border-2 border-white px-3 py-2 font-mono focus:outline-none focus:border-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-white mb-2">PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black text-white border-2 border-white px-3 py-2 font-mono focus:outline-none focus:border-gray-400"
                  required
                />
              </div>
              
              {err ? <div className="text-red-400 text-sm font-mono border border-red-400 p-2">{err}</div> : null}
              {msg ? <div className="text-green-400 text-sm font-mono border border-green-400 p-2">{msg}</div> : null}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "SENDING..." : "SEND OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="bg-green-900 border-2 border-green-400 p-4 mb-4">
                <div className="text-center">
                  <div className="text-green-400 text-sm font-mono">
                    📱 OTP sent to {phone}
                  </div>
                  <div className="text-green-400 text-xs font-mono mt-2">
                    Please check your SMS messages
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-white mb-2">ENTER OTP</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-black text-white border-2 border-white px-3 py-2 font-mono focus:outline-none focus:border-gray-400 text-center text-lg tracking-widest"
                  required
                  maxLength={6}
                />
              </div>
              
              {err ? <div className="text-red-400 text-sm font-mono border border-red-400 p-2">{err}</div> : null}
              {msg ? <div className="text-green-400 text-sm font-mono border border-green-400 p-2">{msg}</div> : null}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "VERIFY OTP"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-white font-mono hover:text-gray-300 transition-colors"
            >
              ← BACK TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 