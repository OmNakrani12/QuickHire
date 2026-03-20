import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import axios from "axios";
import Cookies from "js-cookie";

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

      if (!user.emailVerified) {
        // Redirect to verify email
        navigate("/verify-email", { state: { formData: { ...formData, email: user.email } } });
        return;
      }

      console.log("Firebase login successful:", user);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          role: formData.role,
        })
      );
      await Cookies.set("auth_token", await user.getIdToken(), { secure: true, sameSite: "strict" });

      try {
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
      } catch (backendError) {
        // If 404, it means they verified email, but the backend record was never created.
        // We must create it now to recover.
        if (backendError.response && backendError.response.status === 404) {
          const pendingStr = localStorage.getItem('pending_registration');
          const pendingData = pendingStr ? JSON.parse(pendingStr) : {
            name: user.displayName || "User",
            email: user.email,
            role: formData.role,
            phone: ""
          };

          try {
            const createRes = await axios.post(`${BASE_URL}/api/users`, {
              uid: user.uid,
              name: pendingData.name,
              email: user.email,
              role: pendingData.role,
              phone: pendingData.phone,
            });
            const dbUser = createRes.data;
            localStorage.setItem("uid", dbUser.id);
            localStorage.setItem("user", JSON.stringify(dbUser));
            localStorage.removeItem('pending_registration');

            const roleRes = await axios.post(`${BASE_URL}/api/${pendingData.role}s`, {
              user: { id: dbUser.id }
            });
            const roleData = roleRes.data;
            if (pendingData.role === "worker") {
              localStorage.setItem("wid", roleData.id);
            } else {
              localStorage.setItem("cid", roleData.id);
            }

            navigate(
              pendingData.role === "worker"
                ? "/worker/dashboard"
                : "/contractor/dashboard"
            );
          } catch (createErr) {
            console.error("Failed to recover user creation:", createErr);
            setError("Failed to initialize your account. Please contact support.");
          }
        } else {
          setError("An error occurred connecting to our servers.");
        }
      }
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

        {/* Professional Minimalist 3D Core Scene */}
        <div className="relative z-10 w-full flex items-center justify-center p-12">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center preserve-3d">
            {/* Outer Orbital Rings */}
            <div
              className="absolute inset-0 rounded-full border border-slate-600/30 border-l-indigo-500/40 border-r-emerald-500/40"
              style={{ transform: 'rotateX(65deg) rotateY(15deg)', animation: 'spin 15s linear infinite' }}
            ></div>
            <div
              className="absolute inset-8 rounded-full border border-slate-600/20 border-t-indigo-400/30"
              style={{ transform: 'rotateX(75deg) rotateY(-15deg)', animation: 'spin 10s linear infinite reverse' }}
            ></div>

            {/* Central Premium Glass Core */}
            <div
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-float-3d z-10"
            >
              <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10"></div>
                <Briefcase className="w-10 h-10 text-slate-300 relative z-10" />
              </div>
            </div>

            {/* Orbiting Tech Nodes */}
            <div className="absolute w-full h-full" style={{ animation: 'spin 20s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-800 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]" style={{ transform: 'rotateX(-65deg)' }}>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-10 h-10 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]" style={{ transform: 'rotateX(-65deg)' }}>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
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