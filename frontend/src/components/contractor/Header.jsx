import { useState } from 'react';
import { PlusCircle, Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Header({ userName, onNewJobClick }) {
    const [showNotifications, setShowNotifications] = useState(false);

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <>
            <header className="flex items-center justify-between mb-8 gap-4">
                <div>
                    <p className="text-sm text-slate-400 font-medium mb-0.5">{greeting} 👋</p>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Welcome back, <span className="gradient-text">{userName}</span>!
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">Here's what's happening with your projects today.</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={onNewJobClick}
                        className="btn btn-secondary flex items-center gap-2 py-2.5 px-5 text-sm"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Post New Job
                    </button>

                    {/* notification bell */}
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-white/40 flex items-center justify-center hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Bell className="w-5 h-5 text-slate-600" />
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
