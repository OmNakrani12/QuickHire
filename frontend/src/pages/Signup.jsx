import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Loader2, Phone } from "lucide-react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'worker',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    const handleGoogleSignup = async () => {
        try {
            setLoading(true);

            const result = await signInWithPopup(auth, googleProvider);
            const googleUser = result.user;

            const userPayload = {
                name: googleUser.displayName,
                email: googleUser.email,
                phone: googleUser.phoneNumber || "",
                role: "worker",
            };

            let backendUser = null;

            const res = await fetch(
                `${BASE_URL}/api/users/email/${googleUser.email}`
            );

            if (res.status === 404) {
                // 🔹 user not found → create
                const createRes = await fetch(
                    `${BASE_URL}/api/users`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userPayload),
                    }
                );

                if (!createRes.ok) {
                    throw new Error("Failed to create user");
                }
                backendUser = await createRes.json();

                // Create role record immediately
                await fetch(`${BASE_URL}/api/workers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: { id: backendUser.id } })
                });
            }
            else if (res.ok) {
                const text = await res.text();

                if (!text) {
                    // backend returned empty body → treat as new user
                    const createRes = await fetch(
                        `${BASE_URL}/api/users`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userPayload),
                        }
                    );

                    backendUser = await createRes.json();

                    // Create role record immediately
                    await fetch(`${BASE_URL}/api/workers`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user: { id: backendUser.id } })
                    });
                } else {
                    backendUser = JSON.parse(text);
                }
            }
            else {
                throw new Error("Failed to fetch user");
            }

            // 🛡️ HARD SAFETY CHECK
            if (!backendUser || !backendUser.id) {
                throw new Error("Invalid user data from backend");
            }

            localStorage.setItem("user", JSON.stringify(backendUser));
            navigate("/worker/dashboard");

        } catch (error) {
            console.error("Google signup error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }
        if (formData.phone.length > 10) {
            alert("Phone number should not exceed 10 digits");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            console.log("Firebase user created:", user);

            // Send Firebase Email Verification Link
            await sendEmailVerification(user);
            
            // Store registration details temporarily in localStorage
            localStorage.setItem('pending_registration', JSON.stringify(formData));

            // Redirect to verify-email
            navigate("/verify-email", { state: { formData } });

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
            {/* 3D Decorative Panel */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.15),transparent_60%)]"></div>
                    <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.1),transparent_50%)]"></div>
                </div>

                {/* Professional Minimalist 3D Core Scene */}
                <div className="relative z-10 w-full flex items-center justify-center p-12">
                   <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center preserve-3d">
                      {/* Outer Orbital Rings */}
                      <div 
                         className="absolute inset-0 rounded-full border border-slate-600/30 border-l-emerald-500/40 border-r-indigo-500/40" 
                         style={{ transform: 'rotateX(65deg) rotateY(-15deg)', animation: 'spin 15s linear infinite reverse' }}
                      ></div>
                      <div 
                         className="absolute inset-8 rounded-full border border-slate-600/20 border-t-emerald-400/30" 
                         style={{ transform: 'rotateX(75deg) rotateY(15deg)', animation: 'spin 10s linear infinite' }}
                      ></div>
                      
                      {/* Central Premium Glass Core */}
                      <div 
                         className="relative w-36 h-36 rounded-full bg-gradient-to-bl from-emerald-500 via-emerald-400 to-indigo-500 p-[1px] shadow-[0_0_60px_rgba(16,185,129,0.3)] animate-float-3d z-10"
                      >
                         <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 to-indigo-500/10"></div>
                            <User className="w-10 h-10 text-slate-300 relative z-10" />
                         </div>
                      </div>

                      {/* Orbiting Tech Nodes */}
                      <div className="absolute w-full h-full" style={{ animation: 'spin 20s linear infinite reverse' }}>
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]" style={{ transform: 'rotateX(-65deg)' }}>
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                         </div>
                         <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-10 h-10 rounded-lg bg-slate-800 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]" style={{ transform: 'rotateX(-65deg)' }}>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-12 text-center w-full px-12 text-slate-400 font-medium z-20">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Join QuickHire</h2>
                    <p className="text-slate-400">Unlock a world of professional labor opportunities.</p>
                </div>
            </div>

            {/* Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
                <div className="w-full max-w-md space-y-8 animate-fade-in pb-12">
                    {/* Logo (Mobile Only) */}
                    <Link to="/" className="lg:hidden flex items-center space-x-3 mb-10 group">
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">QuickHire</span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Join QuickHire today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">I am a:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData.role === 'worker'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-300 dark:hover:border-primary-700'
                                        }`}
                                >
                                    <User className={`w-6 h-6 mx-auto mb-2 ${formData.role === 'worker' ? 'text-primary-600' : 'text-slate-400'}`} />
                                    <div>Worker</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'contractor' })}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData.role === 'contractor'
                                        ? 'border-secondary-600 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 shadow-md shadow-secondary-500/10'
                                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-secondary-300 dark:hover:border-secondary-700'
                                        }`}
                                >
                                    <Briefcase className={`w-6 h-6 mx-auto mb-2 ${formData.role === 'contractor' ? 'text-secondary-600' : 'text-slate-400'}`} />
                                    <div>Contractor</div>
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input pl-12 py-3.5 text-base"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input pl-12 py-3.5 text-base"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="tel"
                                    minLength={10}
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input pl-12 py-3.5 text-base"
                                    placeholder="1234567890"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input pl-12 py-3.5 text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="input pl-12 py-3.5 text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 text-lg mt-4 btn flex items-center justify-center ${formData.role === 'contractor' ? 'btn-secondary' : 'btn-primary'}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                            Log In
                        </Link>
                    </p>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
                        <span className="px-4 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">OR</span>
                        <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-800 rounded-xl py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    >
                        <FcGoogle className="w-6 h-6" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
