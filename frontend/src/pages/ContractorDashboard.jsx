import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Home,
    PlusCircle,
    Users,
    User,
    Bell,
    LogOut,
    DollarSign,
    Clock,
    CheckCircle,
    TrendingUp,
    Star,
    MapPin,
    Calendar,
    MessageSquare,
    Settings,
    FileText,
    Search,
    Edit,
    Trash2,
} from 'lucide-react';

export default function ContractorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNewJobModal, setShowNewJobModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    // Mock data
    const stats = {
        totalSpent: 125000,
        activeProjects: 5,
        totalWorkers: 48,
        completedProjects: 89,
    };

    const myJobs = [
        {
            id: 1,
            title: 'Office Renovation',
            location: 'Manhattan, NY',
            pay: '$25/hour',
            applicants: 12,
            hired: 3,
            status: 'Active',
            posted: '3 days ago',
        },
        {
            id: 2,
            title: 'Warehouse Construction',
            location: 'Brooklyn, NY',
            pay: '$30/hour',
            applicants: 8,
            hired: 5,
            status: 'Active',
            posted: '1 week ago',
        },
        {
            id: 3,
            title: 'Residential Plumbing',
            location: 'Queens, NY',
            pay: '$28/hour',
            applicants: 15,
            hired: 0,
            status: 'Open',
            posted: '2 days ago',
        },
    ];

    const activeProjects = [
        {
            id: 1,
            name: 'Downtown Office Complex',
            workers: 12,
            progress: 75,
            budget: 50000,
            spent: 37500,
            deadline: 'Mar 15, 2026',
        },
        {
            id: 2,
            name: 'Residential Tower',
            workers: 20,
            progress: 45,
            budget: 120000,
            spent: 54000,
            deadline: 'Apr 30, 2026',
        },
    ];

    const workerApplications = [
        {
            id: 1,
            name: 'John Smith',
            job: 'Office Renovation',
            rating: 4.9,
            completedJobs: 156,
            skills: ['Construction', 'Carpentry'],
            appliedDate: 'Jan 29, 2026',
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            job: 'Residential Plumbing',
            rating: 4.7,
            completedJobs: 98,
            skills: ['Plumbing', 'Repair'],
            appliedDate: 'Jan 30, 2026',
        },
        {
            id: 3,
            name: 'Mike Davis',
            job: 'Warehouse Construction',
            rating: 4.8,
            completedJobs: 203,
            skills: ['Construction', 'Heavy Equipment'],
            appliedDate: 'Jan 28, 2026',
        },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 fixed h-full">
                <div className="p-6">
                    <Link to="/" className="flex items-center space-x-2 mb-8">
                        <Briefcase className="w-8 h-8 text-secondary-600" />
                        <span className="text-xl font-bold gradient-text">QuickHire</span>
                    </Link>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'jobs'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">My Jobs</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'projects'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Projects</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('workers')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'workers'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Find Workers</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'applications'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Applications</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">Messages</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
                                ? 'bg-secondary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </button>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-8"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}!</h1>
                        <p className="text-slate-600">Manage your projects and workforce</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowNewJobModal(true)}
                            className="btn btn-secondary flex items-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Post New Job
                        </button>
                        <button className="relative p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                            <Bell className="w-6 h-6 text-slate-700" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-10 h-10 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">
                                    ${stats.totalSpent.toLocaleString()}
                                </div>
                                <div className="text-slate-600">Total Investment</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <Briefcase className="w-10 h-10 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeProjects}</div>
                                <div className="text-slate-600">Active Projects</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-10 h-10 text-purple-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalWorkers}</div>
                                <div className="text-slate-600">Total Workers</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <CheckCircle className="w-10 h-10 text-orange-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completedProjects}</div>
                                <div className="text-slate-600">Completed Projects</div>
                            </div>
                        </div>

                        {/* Active Projects */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6">Active Projects</h2>
                            <div className="space-y-4">
                                {activeProjects.map((project) => (
                                    <div key={project.id} className="p-6 bg-slate-50 rounded-lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                    <span className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {project.workers} workers
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        Due: {project.deadline}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-slate-600 mb-1">Budget</div>
                                                <div className="font-bold text-lg">
                                                    ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-600">Progress</span>
                                                <span className="font-semibold">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-secondary-600 to-secondary-700 h-2 rounded-full transition-all"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6">Recent Applications</h2>
                            <div className="space-y-4">
                                {workerApplications.slice(0, 3).map((application) => (
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
                    </div>
                )}

                {/* My Jobs View */}
                {activeTab === 'jobs' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">My Job Postings</h2>
                                <button
                                    onClick={() => setShowNewJobModal(true)}
                                    className="btn btn-secondary"
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Post New Job
                                </button>
                            </div>

                            <div className="space-y-4">
                                {myJobs.map((job) => (
                                    <div key={job.id} className="p-6 bg-slate-50 rounded-lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                    <span className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        {job.pay}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        Posted {job.posted}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`badge ${job.status === 'Active' ? 'badge-success' : 'badge-info'
                                                        }`}
                                                >
                                                    {job.status}
                                                </span>
                                                <button className="p-2 hover:bg-slate-200 rounded-lg transition-all">
                                                    <Edit className="w-5 h-5 text-slate-600" />
                                                </button>
                                                <button className="p-2 hover:bg-red-100 rounded-lg transition-all">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-6">
                                                <div>
                                                    <div className="text-2xl font-bold text-primary-600">{job.applicants}</div>
                                                    <div className="text-sm text-slate-600">Applicants</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-600">{job.hired}</div>
                                                    <div className="text-sm text-slate-600">Hired</div>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary">View Applications</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Applications View */}
                {activeTab === 'applications' && (
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
                                {workerApplications.map((application) => (
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
                )}
            </main>

            {/* New Job Modal */}
            {showNewJobModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Job Title</label>
                                <input type="text" className="input" placeholder="e.g., Construction Worker Needed" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Location</label>
                                    <input type="text" className="input" placeholder="City, State" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Pay Rate</label>
                                    <input type="text" className="input" placeholder="$25/hour" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Duration</label>
                                <input type="text" className="input" placeholder="e.g., 2 weeks" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Description</label>
                                <textarea className="input min-h-32" placeholder="Describe the job requirements..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Required Skills</label>
                                <input type="text" className="input" placeholder="e.g., Construction, Heavy Lifting" />
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button type="submit" className="btn btn-secondary flex-1">
                                    Post Job
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewJobModal(false)}
                                    className="btn btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
