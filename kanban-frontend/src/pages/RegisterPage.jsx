import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.username, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
               <Layout className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Join teams working with KanbanPro.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 sm:text-sm"
                  placeholder="johndoe123"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                >
                  Register
                </button>
              </div>
            </form>

            <div className="mt-6 text-center lg:text-left">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Image/Branding */}
      <div className="hidden lg:block relative flex-1 w-0">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Team collaboration"
        />
        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
           <div className="max-w-md text-center">
              <h3 className="text-4xl font-extrabold text-white mb-4">
                Build better together.
              </h3>
              <p className="text-lg text-indigo-100 font-medium">
                Create your team's workspace and start delivering projects with clarity.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
