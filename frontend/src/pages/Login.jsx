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
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0E1430] rounded-2xl border border-white/10 p-8 shadow-[0_0_100px_-20px_rgba(99,102,241,.35)]">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-white/20 grid place-items-center">
            <div className="h-4 w-4 rounded-full bg-white/40" />
          </div>
          <h2 className="text-xl font-medium">Sign in to EasyHealth</h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
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

          {err ? (
            <div className="text-red-400 text-sm">{err}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white py-3 rounded-xl"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link className="text-indigo-400 hover:underline" to="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 