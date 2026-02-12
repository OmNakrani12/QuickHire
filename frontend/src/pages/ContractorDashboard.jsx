import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/contractor/Sidebar';
import Header from '../components/contractor/Header';
import StatsGrid from '../components/contractor/StatsGrid';
import ActiveProjects from '../components/contractor/ActiveProjects';
import RecentApplications from '../components/contractor/RecentApplications';
import MyJobPostings from '../components/contractor/MyJobPostings';
import ApplicationsList from '../components/contractor/ApplicationsList';
import NewJobModal from '../components/contractor/NewJobModal';
import ProfileView from '../components/contractor/ProfileView';

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
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />

            <main className="ml-64 flex-1 p-8">
                <Header
                    userName={user.name}
                    onNewJobClick={() => setShowNewJobModal(true)}
                />

                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <StatsGrid stats={stats} />
                        <ActiveProjects projects={activeProjects} />
                        <RecentApplications applications={workerApplications} />
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <MyJobPostings
                        jobs={myJobs}
                        onNewJobClick={() => setShowNewJobModal(true)}
                    />
                )}

                {activeTab === 'applications' && (
                    <ApplicationsList applications={workerApplications} />
                )}

                {activeTab === 'profile' && (
                    <ProfileView user={user} stats={stats} />
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4">Projects</h2>
                            <p className="text-slate-600">Project management view coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'workers' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4">Find Workers</h2>
                            <p className="text-slate-600">Worker search view coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4">Messages</h2>
                            <p className="text-slate-600">Messaging view coming soon...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4">Settings</h2>
                            <p className="text-slate-600">Settings view coming soon...</p>
                        </div>
                    </div>
                )}
            </main>

            <NewJobModal
                isOpen={showNewJobModal}
                onClose={() => setShowNewJobModal(false)}
            />
        </div>
    );
}
