import { useNavigate } from 'react-router-dom';
import { Star, Award, CheckCircle } from 'lucide-react';

export default function ProfileView({ user, stats }) {
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
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{user.name || 'User'}</h2>
                        <p className="text-slate-600 mb-4">{user.email || 'No email'}</p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                <span className="font-semibold">{stats.rating}</span>
                                <span className="text-slate-600 ml-1">({stats.completedJobs} reviews)</span>
                            </div>
                            <span className="badge badge-success">
                                <Award className="w-4 h-4 mr-1" />
                                Top Rated
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/worker/edit-profile')}
                        className="btn btn-outline"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'].map((skill) => (
                                <span key={skill} className="badge badge-info">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Certifications</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span>OSHA Safety Certified</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span>Licensed Electrician</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
