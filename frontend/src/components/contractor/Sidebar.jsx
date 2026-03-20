import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Briefcase,
    Home,
    FileText,
    Users,
    User,
    MessageSquare,
    Settings,
    PlusCircle,
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
                    <div className="p-2.5 bg-secondary-50 dark:bg-secondary-900/30 rounded-xl group-hover:scale-110 group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/50 transition-all">
                        <Briefcase className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">QuickHire</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-scroll p-4 py-6 scrollbar-hide space-y-8">
                <div>
                    <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Menu</p>
                    <nav className="space-y-1.5">
                        <button
                            onClick={() => handleNavigation('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'dashboard'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Home className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('dashboard')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('jobs')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'jobs'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <FileText className={`w-5 h-5 ${activeTab === 'jobs' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('myJobs')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('projects')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'projects'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Briefcase className={`w-5 h-5 ${activeTab === 'projects' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('projects')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('workers')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'workers'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Users className={`w-5 h-5 ${activeTab === 'workers' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('findWorkers')}</span>
                        </button>
                        
                        <button
                            onClick={() => handleNavigation('post-job')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'post-job'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <PlusCircle className={`w-5 h-5 ${activeTab === 'post-job' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('postJob')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('applications')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'applications'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <User className={`w-5 h-5 ${activeTab === 'applications' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('applications')}</span>
                        </button>
                    </nav>
                </div>

                <div>
                    <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Preferences</p>
                    <nav className="space-y-1.5">
                        <button
                            onClick={() => handleNavigation('messages')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'messages'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('messages')}</span>
                        </button>
                        
                        <button
                            onClick={() => handleNavigation('profile')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'profile'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('profile')}</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('settings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'settings'
                                ? 'bg-secondary-600 text-white shadow-md shadow-secondary-500/20'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-secondary-500 transition-colors'}`} />
                            <span className="font-semibold">{t('settings')}</span>
                        </button>
                    </nav>
                </div>
            </div>
        </aside>
        </>
    );
}
