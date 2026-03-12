import { useState } from 'react';
import { PlusCircle, Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Header({ userName, onNewJobClick }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <header className="flex items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">
                        {t('welcomeBack')}, <span className="gradient-text">{userName}</span>!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{t('headerSubtitleContractor')}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={onNewJobClick}
                        className="btn btn-secondary flex items-center gap-2 py-2.5 px-5 text-sm"
                    >
                        <PlusCircle className="w-4 h-4" />
                        {t('postNewJob')}
                    </button>

                    {/* notification bell */}
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-500 rounded-full ring-2 ring-white" />
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
