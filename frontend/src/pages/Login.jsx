import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "worker",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log("Firebase login successful:", user);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          role: formData.role,
        })
      );
      const data = await axios.get(`${BASE_URL}/api/users/email/${user.email}`);
      localStorage.setItem("uid", data.data.id);
      localStorage.setItem("user", JSON.stringify(data.data));
      
      try {
        const roleData = await axios.get(`${BASE_URL}/api/${formData.role}s/user/${data.data.id}`);
        if (formData.role === "worker") {
          localStorage.setItem("wid", roleData.data.id);
        } else {
          localStorage.setItem("cid", roleData.data.id);
        }
      } catch (e) {
        console.error("Could not fetch user role. Record might not exist yet.", e);
      }
      
      console.log("User ID stored in localStorage:", data.data.id);
      navigate(
        formData.role === "worker"
          ? "/worker/dashboard"
          : "/contractor/dashboard"
      );
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
      {/* 3D Decorative Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.15),transparent_60%)]"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.1),transparent_50%)]"></div>
        </div>
        
        {/* CSS 3D Interactive Scene */}
        <div className="relative z-10 perspective-1000 transform-3d">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 animate-spin-slow-3d preserve-3d">
            {/* Outer Box */}
            <div className="absolute inset-0 border-[1px] border-indigo-500/20 rounded-3xl bg-indigo-500/5 backdrop-blur-sm" style={{ transform: 'rotateX(60deg) translateZ(-50px)' }}></div>
            {/* Middle Circle */}
            <div className="absolute inset-8 border border-emerald-400/30 rounded-full bg-emerald-400/5 backdrop-blur-md animate-pulse-slow" style={{ transform: 'rotateY(45deg) translateZ(50px)' }}></div>
            {/* Inner Box */}
            <div className="absolute inset-16 border-2 border-indigo-400/40 rounded-xl bg-indigo-500/10 backdrop-blur-lg" style={{ transform: 'rotateX(-30deg) rotateY(30deg) translateZ(80px)' }}></div>
            
            {/* Core Floating Object */}
            <div className="absolute inset-1/2 -ml-8 -mt-8 w-16 h-16 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.6)] animate-float-3d" style={{ transform: 'translateZ(120px)' }}></div>
          </div>
        </div>

        <div className="absolute bottom-12 text-center w-full px-12 text-slate-400 font-medium z-20">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">QuickHire</h2>
          <p className="text-slate-400">The premier platform for professional labor management.</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-md space-y-8 animate-fade-in pb-12">
          {/* Logo (Mobile Only) */}
          <Link to="/" className="lg:hidden flex items-center space-x-3 mb-10 group">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/40 rounded-xl group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">QuickHire</span>
          </Link>

          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "worker" })}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData.role === "worker"
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10"
                      : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                >
                  Worker
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "contractor" })}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData.role === "contractor"
                      ? "border-secondary-600 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 shadow-md shadow-secondary-500/10"
                      : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-secondary-300 dark:hover:border-secondary-700"
                    }`}
                >
                  Contractor
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input pl-12 py-3.5 text-base"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="input pl-12 py-3.5 text-base"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline hover:text-primary-700"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn py-4 text-lg mt-4 flex items-center justify-center ${formData.role === 'contractor' ? 'btn-secondary' : 'btn-primary'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Friendly Firebase errors */
function getFriendlyError(code) {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Login failed. Please try again.";
  }
}