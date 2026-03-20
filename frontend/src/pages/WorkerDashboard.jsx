import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/worker/Sidebar';
import Header from '../components/worker/Header';
import StatsGrid from '../components/worker/StatsGrid';
import ActiveJobs from '../components/worker/ActiveJobs';
import PendingApplications from '../components/worker/PendingApplications';
import RecentEarnings from '../components/worker/RecentEarnings';
import AvailableJobs from '../components/worker/AvailableJobs';
import ProfileView from '../components/worker/ProfileView';
import ChatWindow from '@/components/worker/Messaging';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Globe, LogOut, Menu, Briefcase } from 'lucide-react';

export default function WorkerDashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    const [workerData, setWorkerData] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchWorkerData = async () => {
            if (!user) return;
            try {
                setIsLoading(true);

                let currentUserId = user.id;
                // Fallback: If localStorage is corrupted or missing ID, fetch it by email
                if (!currentUserId && user.email) {
                    const userRes = await axios.get(`${BASE_URL}/api/users/email/${user.email}`);
                    currentUserId = userRes.data.id;
                    // Update localStorage so it's fixed for next time
                    localStorage.setItem('user', JSON.stringify(userRes.data));
                }

                if (!currentUserId) {
                    throw new Error("User ID is missing and couldn't be fetched.");
                }

                const workerRes = await axios.get(`${BASE_URL}/api/workers/user/${currentUserId}`);
                const worker = workerRes.data;
                setWorkerData(worker);

                const appsRes = await axios.get(`${BASE_URL}/api/jobs/applications/worker/${worker.id}`);
                setApplications(appsRes.data);
            } catch (error) {
                console.error("Error fetching worker data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkerData();
    }, [user, BASE_URL]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleJobComplete = async (jobId) => {
        try {
            await axios.put(`${BASE_URL}/api/jobs/${jobId}/status`, { status: 'COMPLETED' });
            // Refresh data immediately
            if (workerData) {
                const appsRes = await axios.get(`${BASE_URL}/api/jobs/applications/worker/${workerData.id}`);
                setApplications(appsRes.data);
            }
        } catch (error) {
            console.error("Error auto-completing job:", error);
        }
    };

    if (!user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Process real data
    const activeJobsList = applications.filter(app => app.status === 'ACCEPTED' && app.job && app.job.status !== 'COMPLETED');
    const pendingJobsList = applications.filter(app => app.status === 'PENDING' && app.job);
    const completedJobsList = applications.filter(app => app.status === 'ACCEPTED' && app.job && app.job.status === 'COMPLETED');

    const parseDuration = (durationStr) => {
        if (!durationStr) return 24 * 60 * 60 * 1000; // default 1 day
        const str = durationStr.toLowerCase();
        const num = parseFloat(str) || 1;
        if (str.includes('hour')) return num * 60 * 60 * 1000;
        if (str.includes('min')) return num * 60 * 1000;
        if (str.includes('sec')) return Math.max(num * 1000, 10000); // demo minimum 10s
        if (str.includes('day')) return num * 24 * 60 * 60 * 1000;
        if (str.includes('week')) return num * 7 * 24 * 60 * 60 * 1000;
        if (str.includes('month')) return num * 30 * 24 * 60 * 60 * 1000;
        return num * 24 * 60 * 60 * 1000;
    };

    const activeJobs = activeJobsList.map(app => {
        const start = app.acceptedAt ? new Date(app.acceptedAt) : new Date(app.appliedAt || Date.now());
        const durationMs = parseDuration(app.job.duration);
        const contractorName = app.job.contractor?.companyName || app.job.contractor?.user?.name || "Unknown Contractor";
        return {
            id: app.id,
            jobId: app.job.id,
            title: app.job.title,
            contractor: contractorName,
            dueDate: app.job.duration || 'N/A',
            status: app.job.status || 'In Progress',
            startTime: start.getTime(),
            durationMs: durationMs
        };
    });

    const pendingJobs = pendingJobsList.map(app => {
        const contractorName = app.job.contractor?.companyName || app.job.contractor?.user?.name || "Unknown Contractor";
        return {
            id: app.id,
            title: app.job.title,
            contractor: contractorName,
            appliedDate: new Date(app.appliedAt).toLocaleDateString(),
            proposedRate: app.proposedRate,
            duration: app.job.duration || 'N/A'
        };
    });

    const recentEarnings = completedJobsList.map(app => ({
        date: new Date(app.appliedAt).toLocaleDateString(),
        job: app.job.title,
        amount: app.job.payRate || app.proposedRate || 0
    }));

    const totalEarningsAmount = recentEarnings.reduce((sum, item) => sum + item.amount, 0);

    const stats = {
        totalEarnings: totalEarningsAmount,
        activeJobs: activeJobs.length,
        completedJobs: completedJobsList.length,
        rating: workerData?.rating || 4.8, // static default
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            <main className={`lg:ml-72 flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-300 ${activeTab === 'messages' ? 'p-0 overflow-hidden' : 'p-4 lg:p-8 overflow-y-auto'}`}>
                {/* Mobile Header */}
                <div className="lg:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-bold text-lg dark:text-white">QuickHire</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                
                {activeTab !== 'messages' && <Header userName={user.name} />}

                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <StatsGrid stats={stats} />
                        <ActiveJobs jobs={activeJobs} onJobComplete={handleJobComplete} />
                        <PendingApplications applications={pendingJobs} />
                        <RecentEarnings earnings={recentEarnings} />
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <AvailableJobs />
                )}

                {activeTab === 'active' && (
                    <div className="space-y-8 animate-fade-in">
                        <ActiveJobs jobs={activeJobs} onJobComplete={handleJobComplete} />
                        <PendingApplications applications={pendingJobs} />
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
                    <div className="animate-fade-in flex-1 min-h-0 h-full w-full">
                        <ChatWindow theme="worker" />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>

                            <div className="space-y-6">
                                {/* Language Settings */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4 sm:gap-0">
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
                                        className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto ml-0 sm:ml-4"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi (हिंदी)</option>
                                        <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                                    </select>
                                </div>

                                {/* Theme Settings */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 pt-6 sm:pt-0 gap-4 sm:gap-0">
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
                                        className={`w-14 h-7 rounded-full flex items-center transition-colors duration-300 focus:outline-none ml-14 sm:ml-4 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}
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
        </div>
    );
}
