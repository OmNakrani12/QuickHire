import { useState, useEffect, useRef } from "react";
import {
    Bell,
    X,
    Briefcase,
    Users,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    DollarSign,
    ChevronRight,
} from "lucide-react";

/* ── default mock notifications for workers (replaced by real API when ready) ── */
const MOCK = [
    {
        id: 1,
        type: "application",
        title: "Application Accepted",
        body: "Your application for Office Renovation has been accepted!",
        time: "2 min ago",
        read: false,
    },
    {
        id: 2,
        type: "payment",
        title: "Payment Received",
        body: "₹1,200 payment for Flooring Installation has been credited.",
        time: "1 hr ago",
        read: false,
    },
    {
        id: 3,
        type: "message",
        title: "New Message",
        body: 'HomeWorks LLC sent you a message: "Can you start on Monday?"',
        time: "3 hr ago",
        read: false,
    },
    {
        id: 4,
        type: "alert",
        title: "Profile Incomplete",
        body: "Please update your certifications to get matched with more jobs.",
        time: "Yesterday",
        read: true,
    },
    {
        id: 5,
        type: "application",
        title: "Job Match",
        body: "A new Electrician job was posted matching your skills.",
        time: "2 days ago",
        read: true,
    },
];

const TYPE_CONFIG = {
    application: { icon: Briefcase, bg: "bg-primary-100", text: "text-primary-600" },
    hire: { icon: Users, bg: "bg-green-100", text: "text-green-600" },
    message: { icon: MessageSquare, bg: "bg-secondary-100", text: "text-secondary-600" },
    payment: { icon: DollarSign, bg: "bg-emerald-100", text: "text-emerald-600" },
    alert: { icon: AlertCircle, bg: "bg-orange-100", text: "text-orange-500" },
};

export default function NotificationPanel({ onClose }) {
    const [notifications, setNotifications] = useState(MOCK);
    const panelRef = useRef(null);

    const unread = notifications.filter((n) => !n.read).length;

    /* close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const dismiss = (id) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id));

    const markRead = (id) =>
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );

    return (
        /* backdrop */
        <div className="fixed inset-0 z-50" style={{ backdropFilter: "blur(1px)" }}>
            {/* panel — slides in from right */}
            <div
                ref={panelRef}
                className="absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col animate-slide-in-right"
            >
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary-600 to-secondary-600">
                    <div className="flex items-center gap-2 text-white">
                        <Bell className="w-5 h-5" />
                        <h2 className="font-bold text-lg">Notifications</h2>
                        {unread > 0 && (
                            <span className="bg-white/25 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                {unread} new
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── TOOLBAR ── */}
                {unread > 0 && (
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{unread} unread notifications</span>
                        <button
                            onClick={markAllRead}
                            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    </div>
                )}

                {/* ── LIST ── */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="font-semibold text-slate-600 dark:text-slate-400">All caught up!</p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm">No notifications right now.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {notifications.map((n) => {
                                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.alert;
                                const Icon = cfg.icon;
                                return (
                                    <li
                                        key={n.id}
                                        onClick={() => markRead(n.id)}
                                        className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group ${!n.read ? "bg-primary-50/40 dark:bg-primary-900/10" : ""
                                            }`}
                                    >
                                        {/* icon */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                            <Icon className={`w-5 h-5 ${cfg.text}`} />
                                        </div>

                                        {/* content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-semibold leading-tight ${n.read ? "text-slate-700 dark:text-slate-300" : "text-slate-800 dark:text-slate-100"}`}>
                                                    {n.title}
                                                </p>
                                                {!n.read && (
                                                    <span className="w-2 h-2 rounded-full bg-secondary-500 shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                                                {n.body}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                                        </div>

                                        {/* dismiss */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-all shrink-0 mt-0.5"
                                            title="Dismiss"
                                        >
                                            <X className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* ── FOOTER ── */}
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3">
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                        View all notifications
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
