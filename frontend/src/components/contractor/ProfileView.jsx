import { useNavigate } from 'react-router-dom';
import { Star, Award, CheckCircle, Briefcase } from 'lucide-react';

export default function ContractorProfileView({ user, stats }) {
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="card p-8">
                    <p className="text-slate-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="card p-8">
                <div className="flex items-start space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{user.name || 'Contractor'}</h2>
                        <p className="text-slate-600 mb-4">{user.email || 'No email'}</p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Briefcase className="w-5 h-5 text-secondary-600 mr-1" />
                                <span className="font-semibold">{stats.activeProjects} Active Projects</span>
                            </div>
                            <span className="badge badge-success">
                                <Award className="w-4 h-4 mr-1" />
                                Verified Contractor
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/contractor/edit-profile')}
                        className="btn btn-outline"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold mb-4">Company Information</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-slate-600">Company Type</div>
                                <div className="font-semibold">General Contractor</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Years in Business</div>
                                <div className="font-semibold">15+ years</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-600">Total Workers Hired</div>
                                <div className="font-semibold">{stats.totalWorkers}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Project Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span>{stats.completedProjects} Projects Completed</span>
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                                <span>{stats.activeProjects} Active Projects</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                <span>4.9 Average Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
