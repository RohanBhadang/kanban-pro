import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 lg:p-8">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1000px] flex bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                 <Layout className="h-8 w-8 text-indigo-600" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">KANBANPRO</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Organize your <br />
              <span className="text-indigo-200">workflow</span> effectively.
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
              Stop juggling tools. Start delivering results with the world's most intuitive project tracker.
            </p>
          </div>

          <div className="relative z-10">
             <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-indigo-600 bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    U{i}
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-indigo-600 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs">
                  +1k
                </div>
             </div>
             <p className="text-sm text-indigo-200 font-medium">Trusted by teams worldwide</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 text-red-600 text-sm font-bold animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
                placeholder="hello@company.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                 <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              <span>Sign In to Account</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-black hover:underline underline-offset-4">
                Join Pro Today
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
