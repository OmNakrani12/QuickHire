import { Calendar } from 'lucide-react';

export default function ActiveJobs({ jobs }) {
    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Active Jobs</h2>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{job.title}</h3>
                                <p className="text-slate-600">{job.contractor}</p>
                            </div>
                            <span className="badge badge-info">{job.status}</span>
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-semibold">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all"
                                    style={{ width: `${job.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {job.dueDate}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
