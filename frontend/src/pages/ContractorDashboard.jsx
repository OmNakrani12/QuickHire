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
import Projects from '../components/contractor/Projects';
import FindWorkers from '../components/contractor/FindWorkers';
import ProfileView from '../components/contractor/ProfileView';
import PostJob from '../components/contractor/PostJob';
import Messaging from '../components/contractor/Messaging';
import Loading from '../Loading';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Globe, LogOut } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ContractorDashboard() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('dashboard_tab');
        if (savedTab) {
            localStorage.removeItem('dashboard_tab');
            return savedTab;
        }
        return 'dashboard';
    });
    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [messagingContact, setMessagingContact] = useState(null);

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

            <main className={` ml-72 flex-1 max-w-[1600px] mx-auto w-full ${activeTab === 'messages' ? 'h-screen p-0 flex flex-col overflow-hidden' : 'p-8'}`}>
                {activeTab !== 'messages' && (
                    <Header
                        userName={user.name}
                        onNewJobClick={() => setShowNewJobModal(true)}
                    />
                )}

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

                {activeTab === 'jobs' && (
                    <MyJobPostings
                        onNavigateToMessages={(contactInfo) => {
                            setMessagingContact(contactInfo);
                            setActiveTab('messages');
                        }}
                    />
                )}

                {activeTab === 'applications' && (
                    <ApplicationsList
                        onNavigateToMessages={(contactInfo) => {
                            setMessagingContact(contactInfo);
                            setActiveTab('messages');
                        }}
                    />
                )}

                {activeTab === 'profile' && <ProfileView user={user} stats={stats} />}

                {activeTab === 'projects' && (
                    <div className="animate-fade-in">
                        <Projects />
                    </div>
                )}

                {activeTab === 'workers' && (
                    <div className="animate-fade-in">
                        <FindWorkers
                            onNavigateToMessages={(contactInfo) => {
                                setMessagingContact(contactInfo);
                                setActiveTab('messages');
                            }}
                        />
                    </div>
                )}

                {activeTab === 'post-job' && (
                    <div className="animate-fade-in">
                        <PostJob />
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="animate-fade-in flex-1 min-h-0 h-full w-full">
                        <Messaging
                            otherUserId={messagingContact?.id}
                            otherUserName={messagingContact?.name}
                        />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>

                            <div className="space-y-6">
                                {/* Language Settings */}
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200 text-lg">{t('language')}</h3>
                                            <p className="text-sm text-slate-500 dark:text-gray-400">{t('languageDesc')}</p>
                                        </div>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi (हिंदी)</option>
                                        <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                                    </select>
                                </div>

                                {/* Theme Settings */}
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 dark:text-gray-200 text-lg">{t('appearance')}</h3>
                                            <p className="text-sm text-slate-500 dark:text-gray-400">{t('themeDesc')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className={`w-14 h-7 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 mx-1 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                {/* Logout Button */}
                                <div className="mt-8 pt-6">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-100 dark:border-red-900/30 transition-all shadow-sm hover:shadow"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-semibold">{t('logout') || 'Logout'}</span>
                                    </button>
                                </div>
                            </div>
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
