import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { RecaptchaVerifier, linkWithPhoneNumber } from 'firebase/auth';
import { Smartphone, RefreshCw, CheckCircle, AlertCircle, Briefcase, KeyRound, ArrowRight } from 'lucide-react';

export default function VerifyPhone() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Load from location state or fallback to localStorage
    const [formData, setFormData] = useState(() => {
        if (location.state?.formData) return location.state.formData;
        const stored = localStorage.getItem('pending_registration');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (formData?.phone) {
            // Ensure phone has a '+' prefix for E.164, otherwise add a default assuming India (+91)
            let formattedPhone = formData.phone.trim();
            if (!formattedPhone.startsWith('+')) {
                // By default assume India prefix if no country code provided, just to be safe.
                // In a production app, use a proper country code selector.
                formattedPhone = '+91' + formattedPhone;
            }
            setPhone(formattedPhone);
        }
    }, [formData]);

    // Check if there is no user or form data
    if (!formData || !auth.currentUser) {
        return <Navigate to="/signup" replace />;
    }

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    // recaptcha solved
                },
                'expired-callback': () => {
                    setError('reCAPTCHA expired. Please try again.');
                }
            });
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number with country code (e.g., +919876543210).');
            return;
        }

        setLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const linkResult = await linkWithPhoneNumber(auth.currentUser, phone, appVerifier);
            setConfirmationResult(linkResult);
            setStep('otp');
            setMessage('OTP sent to your phone! Please enter the 6-digit code below.');
        } catch (err) {
            console.error('Phone link error:', err);
            // reset recaptcha if it fails so they can retry
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
            
            if (err.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number format. Please include the country code (e.g., +91).');
            } else if (err.code === 'auth/credential-already-in-use') {
                setError('This phone number is already linked to another account.');
            } else {
                setError('Failed to send OTP. Ensure billing/phone auth is enabled in Firebase Console.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter the 6-digit OTP code.');
            return;
        }

        setOtpLoading(true);
        setError('');
        try {
            await confirmationResult.confirm(otp);
            // Phone Linked Successfully
            setMessage('Phone verified! Completing your registration...');
            await completeRegistration();
        } catch (err) {
            console.error('OTP confirmation error:', err);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP code. Please try again.');
            } else if (err.code === 'auth/code-expired') {
                setError('The OTP code has expired. Please request a new one.');
                setStep('phone');
            } else {
                setError('Failed to verify OTP. Please try again.');
            }
            setOtpLoading(false);
        }
    };

    const completeRegistration = async () => {
        try {
            // 1. Create User in backend
            const res = await fetch(`${BASE_URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: auth.currentUser.uid,
                    name: formData.name || auth.currentUser.displayName || "New User",
                    email: formData.email,
                    role: formData.role || "worker",
                    phone: phone || formData.phone || "",
                }),
            });
            
            if (!res.ok) throw new Error("Failed to create database user.");
            const dbUser = await res.json();

            // 2. Set user storage
            localStorage.setItem("user", JSON.stringify({
                ...dbUser,
                uid: auth.currentUser.uid,
            }));
            localStorage.setItem("uid", dbUser.id);
            
            // Remove pending registration from localStorage
            localStorage.removeItem('pending_registration');

            // 3. Create Role record
            try {
                const roleRes = await fetch(`${BASE_URL}/api/${formData.role}s`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: { id: dbUser.id } })
                });
                
                if (roleRes.ok) {
                    const roleData = await roleRes.json();
                    if (formData.role === "worker") {
                        localStorage.setItem("wid", roleData.id);
                    } else {
                        localStorage.setItem("cid", roleData.id);
                    }
                }
            } catch (e) {
                console.error("Failed to create role database entry:", e);
            }

            // 4. Navigate to dashboard
            if (formData.role === "worker") {
                navigate("/worker/dashboard", { replace: true });
            } else {
                navigate("/contractor/dashboard", { replace: true });
            }
        } catch (err) {
            console.error('Database registration error:', err);
            setError("Failed to initialize your account profile. Please contact support.");
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
            {/* 3D Decorative Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.15),transparent_60%)]"></div>
                    <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.1),transparent_50%)]"></div>
                </div>

                {/* Professional Minimalist 3D Core Scene for Verification */}
                <div className="relative z-10 w-full flex items-center justify-center p-12">
                   <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center preserve-3d">
                      {/* Outer Orbital Rings */}
                      <div 
                         className="absolute inset-0 rounded-full border border-slate-600/30 border-t-indigo-500/40" 
                         style={{ transform: 'rotateX(60deg) rotateY(-15deg)', animation: 'spin 15s linear infinite reverse' }}
                      ></div>
                      <div 
                         className="absolute inset-8 rounded-full border border-slate-600/20 border-b-emerald-400/40" 
                         style={{ transform: 'rotateX(75deg) rotateY(10deg)', animation: 'spin 10s linear infinite' }}
                      ></div>
                      
                      {/* Central Premium Glass Core */}
                      <div 
                         className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-float-3d z-10"
                      >
                         <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                            <Smartphone className="w-12 h-12 text-indigo-300 relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                         </div>
                      </div>

                      {/* Orbiting Envelope Node */}
                      <div className="absolute w-full h-full" style={{ animation: 'spin 20s linear infinite reverse' }}>
                         <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-800 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]" style={{ transform: 'rotateX(-60deg)' }}>
                            <KeyRound className="w-5 h-5 text-indigo-400 animate-pulse" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-12 text-center w-full px-12 text-slate-400 font-medium z-20">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">2FA Authentication</h2>
                    <p className="text-slate-400">Final step to secure and activate your account.</p>
                </div>
            </div>

            {/* Content Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
                <div className="w-full max-w-md space-y-8 animate-fade-in pb-12 text-center">
                    {/* Logo (Mobile Only) */}
                    <Link to="/" className="lg:hidden flex items-center justify-center space-x-3 mb-10 group">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">QuickHire</span>
                    </Link>

                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-800/50">
                        <Smartphone className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Verify Phone</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Secure your account with an SMS code</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-3 text-left">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3 text-left">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    {/* Hidden div for Firebase reCAPTCHA */}
                    <div id="recaptcha-container"></div>

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6 pt-2 text-left">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number (with Country Code)
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 9876543210"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg tracking-wide"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">Example: +91 for India, +1 for US/Canada.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-4 text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30"
                            >
                                {loading ? (
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Send Security Code
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6 pt-2 text-left">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    6-Digit OTP Code
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-center text-2xl font-mono tracking-[0.5em]"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full py-4 text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
                            >
                                {otpLoading ? (
                                    <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                )}
                                {otpLoading ? 'Verifying...' : 'Complete Registration'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                disabled={otpLoading}
                                className="w-full py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                Use a different phone number
                            </button>
                        </form>
                    )}

                    <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
                        Having trouble?{" "}
                        <button
                            onClick={() => navigate('/login', { replace: true })}
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            Return to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
