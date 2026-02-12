import { Search, MapPin, Clock } from 'lucide-react';

export default function AvailableJobs({ jobs }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>

                {/* Search and Filters */}
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="input flex-1"
                    />
                    <button className="btn btn-primary">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="p-6 bg-slate-50 rounded-lg hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <p className="text-slate-600 mb-2">{job.contractor}</p>
                                    <div className="flex items-center text-sm text-slate-600 space-x-4">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {job.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-600 mb-2">{job.pay}</div>
                                    <div className="text-sm text-slate-600">{job.posted}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span key={index} className="badge badge-info">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button className="btn btn-primary">Apply Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
