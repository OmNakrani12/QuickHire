import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationPanel from './NotificationPanel';

export default function Header({ userName }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { t } = useLanguage();
    return (
        <>
            <header className="flex items-center justify-between mb-6 mt-3 pb-6 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl pt-6 -mt-8 px-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {t('welcomeBack')}, <span className="text-primary-600 dark:text-primary-400">{userName}</span>!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('headerSubtitleWorker')}</p>
                </div>
                <button 
                    onClick={() => setShowNotifications(true)}
                    className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:shadow-md transition-all hover:-translate-y-0.5 group"
                >
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                </button>
            </header>

            {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
        </>
    );
}
