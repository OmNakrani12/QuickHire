import { Link } from 'react-router-dom';
import {
    Briefcase,
    Home,
    Search,
    FileText,
    User,
    MessageSquare,
    Settings,
    LogOut,
    Wallet,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 fixed h-full">
            <div className="p-6">
                <Link to="/" className="flex items-center space-x-2 mb-8">
                    <Briefcase className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-bold gradient-text">QuickHire</span>
                </Link>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'jobs'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Find Jobs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('active')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'active'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Active Jobs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'earnings'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">Earnings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Messages</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-8"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
