import { useState } from 'react';
import { PlusCircle, Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Header({ userName, onNewJobClick }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-6 mt-2 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl pt-6 -mt-8 px-2 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {t('welcomeBack')}, <span className="text-secondary-600 dark:text-secondary-400">{userName}</span>!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('headerSubtitleContractor')}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0">
                    <button
                        onClick={onNewJobClick}
                        className="btn btn-secondary flex items-center gap-2 py-2.5 px-6 shadow-md shadow-secondary-500/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="font-semibold">{t('postNewJob')}</span>
                    </button>

                    {/* notification bell */}
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
                    </button>
                </div>
            </header>

            {/* notification panel */}
            {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
        </>
    );
}
