import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/user/login", { phone, password });
      localStorage.setItem("eh_token", data.token);
      localStorage.setItem("eh_user_phone", phone);
      localStorage.setItem("eh_user_password", password);
      
      // Redirect to chat after successful login
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
      
    } catch (error) {
      setErr(error?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border-2 border-white p-6 rounded-none">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-10 w-10 border-2 border-white grid place-items-center">
              <div className="h-4 w-4 bg-white" />
            </div>
            <h2 className="text-xl font-mono text-white tracking-wider">SIGN IN TO EASYHEALTH</h2>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-white mb-2">PHONE NUMBER</label>
              <input
                type="tel"
                placeholder="+911234567890"
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

            {err ? (
              <div className="text-red-400 text-sm font-mono border border-red-400 p-2">{err}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "CONTINUE"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/register" 
              className="text-white font-mono hover:text-gray-300 transition-colors"
            >
              CREATE ACCOUNT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 