import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Home,
    Search,
    FileText,
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
    Award,
    Wallet,
} from 'lucide-react';

export default function WorkerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

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
        totalEarnings: 45250,
        activeJobs: 3,
        completedJobs: 127,
        rating: 4.8,
    };

    const availableJobs = [
        {
            id: 1,
            title: 'Construction Worker Needed',
            contractor: 'BuildCo Inc.',
            location: 'New York, NY',
            pay: '$25/hour',
            duration: '2 weeks',
            posted: '2 hours ago',
            skills: ['Construction', 'Heavy Lifting'],
        },
        {
            id: 2,
            title: 'Electrician for Residential Project',
            contractor: 'HomeWorks LLC',
            location: 'Brooklyn, NY',
            pay: '$35/hour',
            duration: '1 week',
            posted: '5 hours ago',
            skills: ['Electrical', 'Wiring'],
        },
        {
            id: 3,
            title: 'Plumbing Assistant',
            contractor: 'Quick Fix Solutions',
            location: 'Queens, NY',
            pay: '$22/hour',
            duration: '3 days',
            posted: '1 day ago',
            skills: ['Plumbing', 'Tools'],
        },
    ];

    const activeJobs = [
        {
            id: 1,
            title: 'Office Renovation',
            contractor: 'Modern Spaces',
            progress: 65,
            dueDate: 'Feb 15, 2026',
            status: 'In Progress',
        },
        {
            id: 2,
            title: 'Warehouse Setup',
            contractor: 'LogiCorp',
            progress: 30,
            dueDate: 'Feb 20, 2026',
            status: 'In Progress',
        },
    ];

    const recentEarnings = [
        { date: 'Jan 28, 2026', job: 'Kitchen Remodel', amount: 850 },
        { date: 'Jan 25, 2026', job: 'Bathroom Renovation', amount: 650 },
        { date: 'Jan 20, 2026', job: 'Flooring Installation', amount: 1200 },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 fixed h-full">
                <div className="p-6">
                    <Link to="/" className="flex items-center space-x-2 mb-8">
                        <Briefcase className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold gradient-text">QuickHire</span>
                    </Link>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'jobs'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Search className="w-5 h-5" />
                            <span className="font-medium">Find Jobs</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('active')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'active'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Active Jobs</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('earnings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'earnings'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <Wallet className="w-5 h-5" />
                            <span className="font-medium">Earnings</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">Messages</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
                                ? 'bg-primary-600 text-white shadow-lg'
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
                        <p className="text-slate-600">Here's what's happening with your work</p>
                    </div>
                    <button className="relative p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                        <Bell className="w-6 h-6 text-slate-700" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </header>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-10 h-10 text-green-600" />
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">
                                    ${stats.totalEarnings.toLocaleString()}
                                </div>
                                <div className="text-slate-600">Total Earnings</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <Clock className="w-10 h-10 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeJobs}</div>
                                <div className="text-slate-600">Active Jobs</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <CheckCircle className="w-10 h-10 text-purple-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completedJobs}</div>
                                <div className="text-slate-600">Completed Jobs</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-4">
                                    <Star className="w-10 h-10 text-yellow-600" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.rating}</div>
                                <div className="text-slate-600">Average Rating</div>
                            </div>
                        </div>

                        {/* Active Jobs */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6">Active Jobs</h2>
                            <div className="space-y-4">
                                {activeJobs.map((job) => (
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

                        {/* Recent Earnings */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6">Recent Earnings</h2>
                            <div className="space-y-3">
                                {recentEarnings.map((earning, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold">{earning.job}</div>
                                            <div className="text-sm text-slate-600">{earning.date}</div>
                                        </div>
                                        <div className="text-xl font-bold text-green-600">+${earning.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Find Jobs View */}
                {activeTab === 'jobs' && (
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
                                {availableJobs.map((job) => (
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
                )}

                {/* Profile View */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="card p-8">
                            <div className="flex items-start space-x-6 mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                                    <p className="text-slate-600 mb-4">{user.email}</p>
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
                )}
            </main>
        </div>
    );
}
