import { Calendar, Clock } from 'lucide-react';

export default function PendingApplications({ applications }) {
    if (!applications || applications.length === 0) {
        return null;
    }

    return (
        <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/40 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-500" />
                </div>
                Pending Applications
            </h2>
            <div className="space-y-5">
                {applications.map((app) => (
                    <div key={app.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 gap-4 relative z-10">
                            <div>
                                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">{app.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs">{app.contractor}</p>
                            </div>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 shrink-0 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                                Pending
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 pt-5 border-t border-slate-200/60 dark:border-slate-700/60 relative z-10">
                            <div className="flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 sm:flex-none">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                Applied: <span className="font-bold text-slate-800 dark:text-slate-200 ml-1">{app.appliedDate}</span>
                            </div>
                            {app.proposedRate && (
                                <div className="flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 sm:flex-none">
                                    Proposed Rate: <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1.5 text-base leading-none">${app.proposedRate}/hr</span>
                                </div>
                            )}
                            <div className="flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 sm:flex-none">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                Est. Duration: <span className="font-bold text-slate-800 dark:text-slate-200 ml-1">{app.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
