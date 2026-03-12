import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Briefcase,
    Home,
    Search,
    FileText,
    User,
    MessageSquare,
    Settings,
    Wallet,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
    const { t } = useLanguage();
    return (
        <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 fixed h-full z-10 transition-colors duration-300">
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
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">{t('dashboard')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'jobs'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">{t('findJobs')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('active')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'active'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">{t('activeJobs')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'earnings'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">{t('earnings')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{t('messages')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{t('profile')}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">{t('settings')}</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
}
