import { Users, Calendar, MapPin, TrendingUp, FolderOpen } from 'lucide-react';

export default function ActiveProjects({ projects }) {
    if (!projects || projects.length === 0) {
        return (
            <div className="card p-8 text-center">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">No Active Projects</h2>
                <p className="text-slate-500 text-sm">Your active projects will appear here.</p>
            </div>
        );
    }

    const statusBadge = {
        active: 'bg-green-100 text-green-700',
        paused: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-secondary-100 text-secondary-700',
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold">Recent Projects</h2>
            </div>

            <div className="space-y-4">
                {projects.map((project) => {
                    const badge = statusBadge[project.status] || statusBadge.active;
                    const deadlineStr = project.deadline
                        ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—';

                    return (
                        <div key={project.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-base truncate">{project.name}</h3>
                                    {project.location && (
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                                            <MapPin className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                                            {project.location}
                                        </div>
                                    )}
                                </div>
                                <span className={`shrink-0 ml-3 px-2.5 py-0.5 text-xs font-semibold rounded-full ${badge}`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* meta row */}
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-primary-400" />
                                    {project.workers ?? 0} workers
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                                    {deadlineStr}
                                </span>
                            </div>

                            {/* budget */}
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                <span>Budget</span>
                                <span className="font-medium text-slate-600">
                                    ${Number(project.spent || 0).toLocaleString()} / ${Number(project.budget || 0).toLocaleString()}
                                </span>
                            </div>

                            {/* progress */}
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                <span>Progress</span>
                                <span className="font-semibold text-slate-700">{project.progress ?? 0}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-secondary-600 to-secondary-700 h-2 rounded-full transition-all duration-500"
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
