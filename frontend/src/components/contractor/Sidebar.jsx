import { Link } from 'react-router-dom';
import {
    Briefcase,
    Home,
    FileText,
    Users,
    User,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 fixed h-full">
            <div className="p-6">
                <Link to="/" className="flex items-center space-x-2 mb-8">
                    <Briefcase className="w-8 h-8 text-secondary-600" />
                    <span className="text-xl font-bold gradient-text">QuickHire</span>
                </Link>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'jobs'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">My Jobs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'projects'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Projects</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('workers')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'workers'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Find Workers</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'applications'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Applications</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages'
                            ? 'bg-secondary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Messages</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
                            ? 'bg-secondary-600 text-white shadow-lg'
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
