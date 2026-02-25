import { Star, FileText, Briefcase, Users } from 'lucide-react';

export default function RecentApplications({ applications }) {
    if (!applications || applications.length === 0) {
        return (
            <div className="card p-8 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">No Applications Yet</h2>
                <p className="text-slate-500 text-sm">Worker applications to your jobs will appear here.</p>
            </div>
        );
    }

    const statusBadge = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        ACCEPTED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700',
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-secondary-500" />
                <h2 className="text-xl font-bold">Recent Applications</h2>
            </div>

            <div className="space-y-3">
                {applications.map((application) => {
                    const name = application.name || 'Worker';
                    const initials = name.charAt(0).toUpperCase();
                    const badge = statusBadge[application.status] || statusBadge.PENDING;

                    return (
                        <div key={application.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-all">

                            {/* avatar + info */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-800 truncate">{name}</div>
                                    <div className="text-sm text-slate-500 truncate">
                                        Applied for: <span className="font-medium text-slate-700">{application.job}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                            <span className="font-semibold text-slate-700">
                                                {application.rating !== 'N/A' ? Number(application.rating).toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 text-xs">·</span>
                                        <span className="text-sm text-slate-500">
                                            {application.completedJobs} jobs done
                                        </span>
                                        <span className="text-slate-400 text-xs hidden sm:inline">·</span>
                                        <span className="text-xs text-slate-400 hidden sm:inline">
                                            {application.appliedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* status + action */}
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                <span className={`hidden sm:inline px-2.5 py-1 text-xs font-semibold rounded-full ${badge}`}>
                                    {application.status}
                                </span>
                                <button className="btn btn-secondary py-2 px-3 text-xs flex items-center gap-1">
                                    <Briefcase className="w-3.5 h-3.5" />
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
