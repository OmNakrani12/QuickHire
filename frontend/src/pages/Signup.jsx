import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            console.log("User created:", user);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    uid: user.uid,
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    phone: formData.phone,
                })
            );

            if (formData.role === "worker") {
                navigate("/worker/dashboard");
            } else {
                navigate("/contractor/dashboard");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
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
                <div className="card p-8 animate-scale-in">
                    <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                    <p className="text-slate-600 text-center mb-8">Join QuickHire today</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold mb-3">I am a:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'worker'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-slate-200 hover:border-primary-300'
                                        }`}
                                >
                                    <User className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                                    <div className="font-semibold">Worker</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'contractor' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'contractor'
                                        ? 'border-secondary-600 bg-secondary-50'
                                        : 'border-slate-200 hover:border-secondary-300'
                                        }`}
                                >
                                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-secondary-600" />
                                    <div className="font-semibold">Contractor</div>
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input pl-11"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input pl-11"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="input pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
