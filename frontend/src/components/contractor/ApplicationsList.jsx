import { Star } from 'lucide-react';

export default function ApplicationsList({ applications }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Worker Applications</h2>

                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="input flex-1"
                    />
                    <select className="input w-48">
                        <option>All Jobs</option>
                        <option>Office Renovation</option>
                        <option>Warehouse Construction</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {applications.map((application) => (
                        <div key={application.id} className="p-6 bg-slate-50 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {application.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{application.name}</h3>
                                        <p className="text-slate-600 mb-2">Applied for: {application.job}</p>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                                <span className="font-semibold">{application.rating}</span>
                                            </div>
                                            <span className="text-slate-600">
                                                {application.completedJobs} completed jobs
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {application.skills.map((skill, index) => (
                                                <span key={index} className="badge badge-info">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2">
                                            Applied on {application.appliedDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button className="btn btn-secondary">Hire Worker</button>
                                    <button className="btn btn-outline">View Profile</button>
                                    <button className="btn btn-outline">Message</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
