import { Users, Calendar, MapPin, TrendingUp, FolderOpen } from 'lucide-react';

export default function ActiveProjects({ projects }) {
    if (!projects || projects.length === 0) {
        return (
            <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                    <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-md"></div>
                    <FolderOpen className="w-12 h-12 text-slate-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">No Active Projects</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your active projects will appear here.</p>
            </div>
        );
    }

    const statusBadge = {
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-sm',
        paused: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 shadow-sm',
        completed: 'bg-secondary-100 text-secondary-700 border border-secondary-200 dark:bg-secondary-500/10 dark:text-secondary-400 dark:border-secondary-500/20 shadow-sm',
    };

    return (
        <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/40 rounded-2xl shadow-sm border border-primary-100 dark:border-primary-800">
                    <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Projects</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => {
                    const badge = statusBadge[project.status] || statusBadge.active;
                    const deadlineStr = project.deadline
                        ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—';

                    return (
                        <div key={project.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                            
                            <div className="flex items-start justify-between mb-5 relative z-10">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl truncate tracking-tight group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors">{project.name}</h3>
                                    {project.location && (
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium text-sm mt-1.5">
                                            <MapPin className="w-4 h-4 text-secondary-500 dark:text-secondary-400 shrink-0" />
                                            <span className="truncate">{project.location}</span>
                                        </div>
                                    )}
                                </div>
                                <span className={`shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full ${badge}`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* meta row */}
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300 mb-5 relative z-10">
                                <span className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-semibold">
                                    <Users className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                                    {project.workers ?? 0} workers
                                </span>
                                <span className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-semibold">
                                    <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    {deadlineStr}
                                </span>
                            </div>

                            {/* budget */}
                            <div className="flex items-center justify-between text-sm mb-2 relative z-10">
                                <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">Budget</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    ${Number(project.spent || 0).toLocaleString()} <span className="text-slate-400 font-medium mx-1">/</span> ${Number(project.budget || 0).toLocaleString()}
                                </span>
                            </div>

                            {/* progress */}
                            <div className="flex items-center justify-between text-sm mb-2 mt-4 relative z-10">
                                <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">Progress</span>
                                <span className="font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded shadow-sm">{project.progress ?? 0}%</span>
                            </div>
                            <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-3 relative z-10 shadow-inner p-0.5 overflow-hidden flex">
                                <div
                                    className="bg-gradient-to-r from-secondary-500 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                                    style={{ width: `${project.progress ?? 0}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
