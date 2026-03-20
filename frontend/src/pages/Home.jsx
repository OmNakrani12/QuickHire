import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-primary-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2.5 bg-primary-50 dark:bg-primary-900/40 rounded-xl group-hover:scale-110 transition-transform">
                                <Briefcase className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">QuickHire</span>
                        </Link>
                        <div className="flex items-center space-x-3 sm:space-x-6">
                            <Link to="/login" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
                                Log In
                            </Link>
                            <Link to="/signup" className="btn btn-primary px-4 sm:px-6 py-2 sm:py-2.5 shadow-md shadow-primary-500/20 text-sm sm:text-base">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Over 10,000 active jobs available right now</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-slate-900 dark:text-white">
                            The Professional <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
                                Labor Network
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto font-medium">
                            QuickHire connects highly vetted workers with top-tier contractors. 
                            Experience seamless matching, secure payments, and professional growth.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            <Link to="/signup?role=worker" className="w-full sm:w-auto btn btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/30 flex items-center justify-center group">
                                Find Work
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/signup?role=contractor" className="w-full sm:w-auto btn bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-lg px-8 py-4 shadow-md flex items-center justify-center">
                                Hire Talent
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-24 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {[
                            { value: '10k+', label: 'Active Workers' },
                            { value: '5k+', label: 'Contractors' },
                            { value: '50k+', label: 'Jobs Completed' },
                            { value: '4.9/5', label: 'Average Rating' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 mb-2">{stat.value}</div>
                                <div className="text-slate-600 dark:text-slate-400 font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-white dark:bg-slate-900 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                            Why Choose <span className="text-primary-600 dark:text-primary-400">QuickHire</span>?
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                            We've built a platform that prioritizes reliability, security, and ease of use for both workers and contractors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Users, color: 'from-blue-500 to-indigo-600', title: 'Smart Matching', desc: 'Our algorithm instantly connects the right workers with the specific requirements of every job.' },
                            { icon: Shield, color: 'from-emerald-500 to-teal-600', title: 'Secure Platform', desc: 'Enterprise-grade security for your data, payments, and personal information at all times.' },
                            { icon: Clock, color: 'from-orange-500 to-amber-600', title: 'Real-time Updates', desc: 'Stay in the loop with instant mobile notifications for job applications, messages, and status changes.' },
                            { icon: Award, color: 'from-rose-500 to-pink-600', title: 'Verified Ratings', desc: 'Build and trust a professional reputation system based entirely on completed job reviews.' },
                            { icon: TrendingUp, color: 'from-purple-500 to-fuchsia-600', title: 'Analytics Dashboard', desc: 'Monitor your earnings, project success rates, and performance trends with detailed insights.' },
                            { icon: Briefcase, color: 'from-cyan-500 to-blue-600', title: 'End-to-End Tools', desc: 'Manage the entire project lifecycle seamlessly—from initial posting to final completion and payment.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="group bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                                Streamlined for <br/> Maximum Efficiency
                            </h2>
                            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 font-medium">
                                We eliminated the friction. Getting hired or finding talent has never been this simple and transparent.
                            </p>
                            
                            <ul className="space-y-6">
                                {[
                                    'Create a customized professional profile in minutes.',
                                    'Browse highly relevant local jobs or search for specific skills.',
                                    'Apply with one click or invite workers directly.',
                                    'Communicate securely through our built-in messaging system.',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-500 mr-4 shrink-0 mt-0.5" />
                                        <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl transform rotate-3"></div>
                            <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                                {/* Abstract representation of dashboard */}
                                <div className="w-full h-full p-6 flex flex-col gap-4 opacity-50 dark:opacity-40">
                                    <div className="w-full h-8 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0"></div>
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-1/4 h-full bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0"></div>
                                        <div className="w-3/4 h-full flex flex-col gap-4">
                                            <div className="h-1/3 w-full bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                            <div className="h-2/3 w-full bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px]">
                                    <Briefcase className="w-24 h-24 text-primary-600/50 dark:text-primary-400/50 drop-shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.3),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Elevate Your Work?</h2>
                    <p className="text-xl text-primary-100 mb-10 font-medium">
                        Join the fastest-growing network of construction and labor professionals today.
                    </p>
                    <Link to="/signup" className="inline-flex items-center btn bg-white text-primary-900 hover:bg-slate-50 text-lg px-10 py-4 shadow-xl shadow-black/20 font-bold group">
                        Let's Get Started
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-12 border-b border-slate-800">
                        <div className="flex items-center space-x-3 mb-6 md:mb-0">
                            <Briefcase className="w-8 h-8 text-primary-500" />
                            <span className="text-2xl font-black text-white tracking-tight">QuickHire</span>
                        </div>
                        <div className="flex space-x-8">
                            <Link to="/" className="hover:text-white transition-colors font-medium">Home</Link>
                            <Link to="/login" className="hover:text-white transition-colors font-medium">Login</Link>
                            <Link to="/signup" className="hover:text-white transition-colors font-medium">Sign Up</Link>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between text-sm font-medium">
                        <p>© {new Date().getFullYear()} QuickHire Platform. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
