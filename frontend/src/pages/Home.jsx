import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, Clock, Award } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-bold gradient-text">QuickHire</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-6xl font-bold mb-6 leading-tight">
                            Connect <span className="gradient-text">Workers</span> with{' '}
                            <span className="gradient-text">Contractors</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                            QuickHire is your all-in-one platform for labour work management.
                            Find skilled workers or discover new opportunities with ease.
                        </p>
                        <div className="flex items-center justify-center space-x-6">
                            <Link to="/signup?role=worker" className="btn btn-primary text-lg px-8 py-4">
                                I'm a Worker
                            </Link>
                            <Link to="/signup?role=contractor" className="btn btn-secondary text-lg px-8 py-4">
                                I'm a Contractor
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
                        <div className="stat-card text-center">
                            <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
                            <div className="text-slate-600">Active Workers</div>
                        </div>
                        <div className="stat-card text-center">
                            <div className="text-4xl font-bold text-primary-600 mb-2">5,000+</div>
                            <div className="text-slate-600">Contractors</div>
                        </div>
                        <div className="stat-card text-center">
                            <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
                            <div className="text-slate-600">Jobs Completed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white/40">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Why Choose <span className="gradient-text">QuickHire</span>?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Easy Matching</h3>
                            <p className="text-slate-600">
                                Our smart algorithm connects the right workers with the right jobs instantly.
                            </p>
                        </div>

                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Secure Payments</h3>
                            <p className="text-slate-600">
                                Safe and secure payment processing with transparent invoicing.
                            </p>
                        </div>

                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Real-time Updates</h3>
                            <p className="text-slate-600">
                                Stay informed with instant notifications and live job tracking.
                            </p>
                        </div>

                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Rating System</h3>
                            <p className="text-slate-600">
                                Build your reputation with verified reviews and ratings.
                            </p>
                        </div>

                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Growth Tracking</h3>
                            <p className="text-slate-600">
                                Monitor your earnings, jobs, and performance with detailed analytics.
                            </p>
                        </div>

                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Job Management</h3>
                            <p className="text-slate-600">
                                Complete project lifecycle management from posting to completion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="card-glass p-12 text-center">
                        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl text-slate-600 mb-8">
                            Join thousands of workers and contractors already using QuickHire
                        </p>
                        <Link to="/signup" className="btn btn-primary text-lg px-10 py-4">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Briefcase className="w-6 h-6" />
                        <span className="text-xl font-bold">QuickHire</span>
                    </div>
                    <p className="text-slate-400">
                        © 2026 QuickHire. All rights reserved. Connecting workers with opportunities.
                    </p>
                </div>
            </footer>
        </div>
    );
}
