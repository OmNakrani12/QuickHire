import { Star } from 'lucide-react';

export default function RecentApplications({ applications }) {
    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Applications</h2>
            <div className="space-y-4">
                {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                                {application.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold">{application.name}</div>
                                <div className="text-sm text-slate-600">Applied for: {application.job}</div>
                                <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm font-semibold">{application.rating}</span>
                                    <span className="text-sm text-slate-600 ml-2">
                                        {application.completedJobs} jobs
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="btn btn-outline px-4 py-2">View Profile</button>
                            <button className="btn btn-secondary px-4 py-2">Hire</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
