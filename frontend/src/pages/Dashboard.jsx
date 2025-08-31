import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border-2 border-white p-6 rounded-none">
          <h1 className="text-center text-2xl font-mono text-white mb-8 tracking-wider">
            EasyHealth
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-white text-black px-6 py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200"
            >
              LOGIN
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-black px-6 py-3 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200"
            >
              REGISTER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 