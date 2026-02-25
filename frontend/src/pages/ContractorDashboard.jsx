import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/contractor/Sidebar';
import Header from '../components/contractor/Header';
import StatsGrid from '../components/contractor/StatsGrid';
import ActiveProjects from '../components/contractor/ActiveProjects';
import RecentApplications from '../components/contractor/RecentApplications';
import MyJobPostings from '../components/contractor/MyJobPostings';
import ApplicationsList from '../components/contractor/ApplicationsList';
import NewJobModal from '../components/contractor/NewJobModal';
import ProfileView from '../components/contractor/ProfileView';
import Messaging from '../components/contractor/Messaging';
import FindWorkers from '../components/contractor/FindWorkers';
import PostJob from '../components/contractor/PostJob';
import Projects from '../components/contractor/Projects';
import Loading from '../Loading';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContractorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNewJobModal, setShowNewJobModal] = useState(false);

    // ── real dashboard data ──
    const [stats, setStats] = useState({
        totalBudgetSpent: 0,
        activeProjects: 0,
        totalWorkers: 0,
        completedProjects: 0,
        totalJobs: 0,
        pendingApplications: 0,
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // ── fetch all dashboard data when user is ready ──
    useEffect(() => {
        if (!user) return;
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        const contractorId = localStorage.getItem('uid');
        if (!contractorId) return;

        setDashboardLoading(true);
        try {
            const [projectsRes, applicationsRes, jobsRes] = await Promise.allSettled([
                axios.get(`${BASE_URL}/api/projects/contractor/${contractorId}`),
                axios.get(`${BASE_URL}/api/jobs/applications/contractor/${contractorId}`),
                axios.get(`${BASE_URL}/api/jobs/contractor/${contractorId}`),
            ]);

            // ── projects ──
            const projects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value.data)
                ? projectsRes.value.data : [];

            const activeProjects = projects.filter(p => p.status === 'active').length;
            const completedProjects = projects.filter(p => p.status === 'completed').length;
            const totalBudgetSpent = projects.reduce((s, p) => s + Number(p.spent || 0), 0);

            // recent 2 projects (active first)
            const sorted = [...projects].sort((a, b) => {
                if (a.status === 'active' && b.status !== 'active') return -1;
                if (b.status === 'active' && a.status !== 'active') return 1;
                return 0;
            });
            setRecentProjects(sorted.slice(0, 3));

            // ── applications ──
            const apps = applicationsRes.status === 'fulfilled' && Array.isArray(applicationsRes.value.data)
                ? applicationsRes.value.data : [];

            const pendingApplications = apps.filter(a => a.status === 'PENDING').length;

            // unique workers across all applications
            const workerIds = new Set(apps.map(a => a.worker?.id).filter(Boolean));

            // format recent 3 apps for the dashboard widget
            const formattedApps = apps.slice(0, 3).map(app => ({
                id: app.id,
                name: app.worker?.user?.name || 'Worker',
                job: app.job?.title || '—',
                rating: app.worker?.rating ?? 'N/A',
                completedJobs: app.worker?.experience ?? 0,
                skills: app.job?.skillsRequired ? app.job.skillsRequired.split(',').map(s => s.trim()) : [],
                appliedDate: app.appliedAt ? app.appliedAt.split('T')[0] : '—',
                status: app.status,
                worker: app.worker,
            }));
            setRecentApplications(formattedApps);

            // ── jobs ──
            const jobs = jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data)
                ? jobsRes.value.data : [];

            setStats({
                totalBudgetSpent,
                activeProjects,
                completedProjects,
                totalWorkers: workerIds.size,
                totalJobs: jobs.length,
                pendingApplications,
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setDashboardLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('uid');
        navigate('/');
    };

    if (!user) return null;

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

                {/* ── DASHBOARD OVERVIEW ── */}
                {activeTab === 'dashboard' && (
                    dashboardLoading ? (
                        <Loading text="Loading dashboard..." />
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <StatsGrid stats={stats} />
                            <ActiveProjects projects={recentProjects} />
                            <RecentApplications applications={recentApplications} />
                        </div>
                    )
                )}

                {activeTab === 'jobs' && <MyJobPostings />}

                {activeTab === 'applications' && <ApplicationsList />}

                {activeTab === 'profile' && <ProfileView user={user} stats={stats} />}

                {activeTab === 'projects' && (
                    <div className="animate-fade-in">
                        <Projects />
                    </div>
                )}

                {activeTab === 'workers' && (
                    <div className="animate-fade-in">
                        <FindWorkers />
                    </div>
                )}

                {activeTab === 'post-job' && (
                    <div className="animate-fade-in">
                        <PostJob />
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="animate-fade-in">
                        <Messaging />
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
