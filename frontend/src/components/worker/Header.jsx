import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationPanel from './NotificationPanel';

export default function Header({ userName }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { t } = useLanguage();
    return (
        <>
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1 dark:text-white">{t('welcomeBack')}, <span className="gradient-text">{userName}</span>!</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('headerSubtitleWorker')}</p>
                </div>
                <button 
                    onClick={() => setShowNotifications(true)}
                    className="relative p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:bg-slate-700/80 transition-all"
                >
                    <Bell className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </header>

            {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
        </>
    );
}
