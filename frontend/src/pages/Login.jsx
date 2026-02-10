import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const navigate = useNavigate();

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

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: formData.role,
        })
      );

      // Redirect by role
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <Briefcase className="w-10 h-10 text-primary-600" />
          <span className="text-3xl font-bold gradient-text">QuickHire</span>
        </Link>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Login to your account
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Login as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "worker" })
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === "worker"
                      ? "border-primary-600 bg-primary-50"
                      : "border-slate-200 hover:border-primary-300"
                  }`}
                >
                  Worker
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "contractor" })
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === "contractor"
                      ? "border-secondary-600 bg-secondary-50"
                      : "border-slate-200 hover:border-secondary-300"
                  }`}
                >
                  Contractor
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input pl-11"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 font-semibold hover:underline"
            >
              Sign up
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