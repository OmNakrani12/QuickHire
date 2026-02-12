import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/worker/Sidebar';
import Header from '../components/worker/Header';
import StatsGrid from '../components/worker/StatsGrid';
import ActiveJobs from '../components/worker/ActiveJobs';
import RecentEarnings from '../components/worker/RecentEarnings';
import AvailableJobs from '../components/worker/AvailableJobs';
import ProfileView from '../components/worker/ProfileView';

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
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />

            <main className="ml-64 flex-1 p-8">
                <Header userName={user.name} />

                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <StatsGrid stats={stats} />
                        <ActiveJobs jobs={activeJobs} />
                        <RecentEarnings earnings={recentEarnings} />
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <AvailableJobs jobs={availableJobs} />
                )}

                {activeTab === 'active' && (
                    <div className="space-y-8 animate-fade-in">
                        <ActiveJobs jobs={activeJobs} />
                    </div>
                )}

                {activeTab === 'earnings' && (
                    <div className="space-y-8 animate-fade-in">
                        <RecentEarnings earnings={recentEarnings} />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <ProfileView user={user} stats={stats} />
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
        </div>
    );
}
