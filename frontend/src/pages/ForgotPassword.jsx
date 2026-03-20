import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
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
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(244,63,94,0.15),transparent_60%)]"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.1),transparent_50%)]"></div>
        </div>

        {/* Professional Minimalist 3D Core Scene */}
        <div className="relative z-10 w-full flex items-center justify-center p-12">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center preserve-3d">
            {/* Outer Orbital Rings */}
            <div
              className="absolute inset-0 rounded-full border border-slate-600/30 border-l-rose-500/40 border-r-amber-500/40"
              style={{ transform: 'rotateX(65deg) rotateY(-15deg)', animation: 'spin 20s linear infinite' }}
            ></div>
            <div
              className="absolute inset-8 rounded-full border border-slate-600/20 border-t-rose-400/30"
              style={{ transform: 'rotateX(75deg) rotateY(15deg)', animation: 'spin 15s linear infinite reverse' }}
            ></div>

            {/* Central Premium Glass Core */}
            <div
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-rose-600 via-rose-500 to-amber-400 p-[1px] shadow-[0_0_60px_rgba(244,63,94,0.3)] animate-float-3d z-10"
            >
              <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-amber-500/10"></div>
                <KeyRound className="w-10 h-10 text-rose-300 relative z-10" />
              </div>
            </div>

            {/* Orbiting Tech Nodes */}
            <div className="absolute w-full h-full" style={{ animation: 'spin 25s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-800 border border-rose-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]" style={{ transform: 'rotateX(-65deg)' }}>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 text-center w-full px-12 text-slate-400 font-medium z-20">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Secure Reset</h2>
          <p className="text-slate-400">Regain access to your QuickHire account.</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-md space-y-8 animate-fade-in pb-12 w-full max-w-sm">
          
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Reset Password</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">Check your email</h3>
              <p className="text-emerald-600 dark:text-emerald-400 mb-6">
                We've sent password reset instructions to <span className="font-semibold text-emerald-700 dark:text-emerald-200">{email}</span>.
              </p>
              <Link to="/login" className="btn btn-primary w-full inline-flex justify-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-12 py-3.5 text-base w-full group-focus-within:border-rose-500 group-focus-within:ring-rose-500/20"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn py-4 text-lg mt-4 flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 border border-rose-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

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
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "An error occurred. Please try again.";
  }
}
