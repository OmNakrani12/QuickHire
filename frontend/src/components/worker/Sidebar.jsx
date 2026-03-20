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

export default function Sidebar({ activeTab, setActiveTab, handleLogout, isOpen, setIsOpen }) {
    const { t } = useLanguage();

    const handleNavigation = (tab) => {
        setActiveTab(tab);
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside className={`w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 fixed inset-y-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
                <Link to="/" onClick={() => setIsOpen && setIsOpen(false)} className="flex items-center space-x-3 group">
                    <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl group-hover:scale-110 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-all">
                        <Briefcase className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">QuickHire</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-4 py-6 custom-scrollbar space-y-8">
                <div>
                    <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Menu</p>
                    <nav className="space-y-1.5">
                        <button
                            onClick={() => handleNavigation('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'dashboard'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Home className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('dashboard')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('jobs')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'jobs'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Search className={`w-5 h-5 ${activeTab === 'jobs' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('findJobs')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('active')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'active'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <FileText className={`w-5 h-5 ${activeTab === 'active' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('activeJobs')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('earnings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'earnings'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Wallet className={`w-5 h-5 ${activeTab === 'earnings' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('earnings')}</span>
                        </button>
                    </nav>
                </div>

                <div>
                    <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Preferences</p>
                    <nav className="space-y-1.5">
                        <button
                            onClick={() => handleNavigation('messages')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'messages'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('messages')}</span>
                        </button>
                        
                        <button
                            onClick={() => handleNavigation('profile')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'profile'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('profile')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('settings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'settings'
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('settings')}</span>
                        </button>
                    </nav>
                </div>
            </div>
        </aside>
        </>
    );
}
