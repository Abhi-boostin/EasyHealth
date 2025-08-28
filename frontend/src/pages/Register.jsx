import { useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const register = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const { data } = await api.post("/api/user/register", { phone, password });
      setOtpSent(true);
      setMsg(data?.msg || "OTP sent");
    } catch (error) {
      setErr(error?.response?.data?.msg || "Register failed");
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      const { data } = await api.post("/api/user/verify-otp", { phone, otp });
      setMsg(data?.msg || "Verified");
    } catch (error) {
      setErr(error?.response?.data?.msg || "Verify failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0E1430] rounded-2xl border border-white/10 p-8 shadow-[0_0_100px_-20px_rgba(99,102,241,.35)]">
        <h2 className="text-xl font-medium text-center mb-6">Create your account</h2>

        {!otpSent ? (
          <form onSubmit={register} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+911234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-indigo-400"
                required
              />
            </div>
            {err ? <div className="text-red-400 text-sm">{err}</div> : null}
            {msg ? <div className="text-green-400 text-sm">{msg}</div> : null}
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition text-white py-3 rounded-xl">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-indigo-400"
                required
              />
            </div>
            {err ? <div className="text-red-400 text-sm">{err}</div> : null}
            {msg ? <div className="text-green-400 text-sm">{msg}</div> : null}
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition text-white py-3 rounded-xl">
              Verify
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link className="text-indigo-400 hover:underline" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 