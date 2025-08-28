import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0E1430] rounded-2xl border border-white/10 p-8 shadow-[0_0_100px_-20px_rgba(99,102,241,.35)]">
        <h1 className="text-center text-2xl font-semibold tracking-wide mb-6">EasyHealth</h1>
        <div className="flex flex-col gap-3">
          <Link to="/login" className="w-full bg-indigo-500 hover:bg-indigo-600 transition text-white py-3 rounded-xl text-center">Login</Link>
          <Link to="/register" className="w-full bg-white/10 hover:bg-white/20 transition text-white py-3 rounded-xl text-center border border-white/10">Register</Link>
          <Link to="/chat" className="w-full bg-white/10 hover:bg-white/20 transition text-white py-3 rounded-xl text-center border border-white/10">Open Chat</Link>
        </div>
      </div>
    </div>
  );
} 