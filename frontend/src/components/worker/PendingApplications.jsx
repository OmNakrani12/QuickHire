import { Calendar, Clock } from 'lucide-react';

export default function PendingApplications({ applications }) {
    if (!applications || applications.length === 0) {
        return null;
    }

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>
            <div className="space-y-4">
                {applications.map((app) => (
                    <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{app.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{app.contractor}</p>
                            </div>
                            <span className="badge badge-warning text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">Pending</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4 mr-1.5 text-primary-500" />
                                Applied: {app.appliedDate}
                            </div>
                            {app.proposedRate && (
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-medium mr-1.5 text-slate-700 dark:text-slate-300">Proposed Rate:</span>
                                    ${app.proposedRate}/hr
                                </div>
                            )}
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
                                Est. Duration: {app.duration}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
