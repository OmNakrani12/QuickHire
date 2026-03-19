import { Star, FileText, Briefcase, Users } from 'lucide-react';

export default function RecentApplications({ applications }) {
    if (!applications || applications.length === 0) {
        return (
            <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                    <div className="absolute inset-0 bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-md"></div>
                    <Users className="w-12 h-12 text-slate-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">No Applications Yet</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Worker applications to your jobs will appear here.</p>
            </div>
        );
    }

    const statusBadge = {
        PENDING: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 shadow-sm',
        ACCEPTED: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-sm',
        REJECTED: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 shadow-sm',
    };

    return (
        <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary-50 dark:bg-secondary-900/40 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-800">
                    <FileText className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Applications</h2>
            </div>

            <div className="space-y-4">
                {applications.map((application) => {
                    const name = application.name || 'Worker';
                    const initials = name.charAt(0).toUpperCase();
                    const badge = statusBadge[application.status] || statusBadge.PENDING;

                    return (
                        <div key={application.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden gap-4">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

                            {/* avatar + info */}
                            <div className="flex items-center gap-5 flex-1 min-w-0 relative z-10 w-full">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-primary-500/30 dark:shadow-none">
                                    {initials}
                                </div>
                                <div className="min-w-0 flex-1 pr-4">
                                    <div className="font-extrabold text-lg text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">{name}</div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Applied for: <span className="font-bold text-slate-700 dark:text-slate-300">{application.job}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2.5">
                                        <div className="flex items-center gap-1.5 text-sm bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                {application.rating !== 'N/A' ? Number(application.rating).toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{application.completedJobs}</span> jobs done
                                        </span>
                                        <span className="text-slate-300 dark:text-slate-600 hidden sm:inline px-1">•</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {application.appliedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* status + action */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0 relative z-10 w-full sm:w-auto mt-2 sm:mt-0 justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-slate-700">
                                <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-widest ${badge}`}>
                                    {application.status}
                                </span>
                                <button className="btn btn-primary py-2.5 px-6 text-sm flex items-center gap-2 group/btn shadow-md shadow-primary-500/20">
                                    <Briefcase className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    Hire
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
