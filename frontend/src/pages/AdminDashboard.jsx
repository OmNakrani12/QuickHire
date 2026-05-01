import { useState, useEffect } from "react";
import { 
  Users, Briefcase, Trash2, Ban, ShieldAlert, Loader2, 
  Search, CheckCircle2, ArrowLeft, TrendingUp, 
  UserX, LayoutDashboard, Settings, LogOut,
  MapPin, DollarSign, Calendar
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  const [adminView, setAdminView] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Protect route & Set view
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    const view = localStorage.getItem("adminView") || "worker";
    setAdminView(view);
    setActiveTab(view === "worker" ? "workers" : "contractors");
  }, [navigate]);

  useEffect(() => {
    if (adminView) {
      fetchData();
    }
  }, [adminView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (adminView === "worker") {
        const usersRes = await axios.get(`${BASE_URL}/api/users`);
        setUsers(usersRes.data.filter(u => u.role === "worker"));
      } else {
        const [usersRes, jobsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users`),
          axios.get(`${BASE_URL}/api/jobs`)
        ]);
        setUsers(usersRes.data.filter(u => u.role === "contractor"));
        setJobs(jobsRes.data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, currentStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/users/${userId}/ban`);
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
    } catch (err) {
      console.error("Error toggling ban status:", err);
      alert("Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      
      if (adminView === "contractor") {
        const jobsRes = await axios.get(`${BASE_URL}/api/jobs`);
        setJobs(jobsRes.data);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to permanently delete this job?")) {
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/api/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: activeTab === 'jobs' ? jobs.length : users.length,
    banned: users.filter(u => u.isBanned).length,
    active: activeTab === 'jobs' ? jobs.filter(j => j.status === 'OPEN').length : users.filter(u => !u.isBanned).length
  };

  if (!adminView) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-blue-600/10 blur-[110px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 flex-shrink-0 z-20 flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40"></div>
              <div className="relative p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">QuickHire</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{adminView} Admin</p>
            </div>
          </div>
          
          <nav className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Menu</div>
            
            {adminView === "worker" && (
              <SidebarLink 
                active={activeTab === "workers"} 
                onClick={() => setActiveTab("workers")}
                icon={<Users className="w-5 h-5" />}
                label="Workers"
              />
            )}

            {adminView === "contractor" && (
              <>
                <SidebarLink 
                  active={activeTab === "contractors"} 
                  onClick={() => setActiveTab("contractors")}
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Contractors"
                />
                <SidebarLink 
                  active={activeTab === "jobs"} 
                  onClick={() => setActiveTab("jobs")}
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Active Jobs"
                />
              </>
            )}

            <div className="pt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">System</div>
            <SidebarLink 
              active={false}
              onClick={() => {}}
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              disabled
            />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick={() => {
              localStorage.clear();
              Cookies.remove("auth_token");
              navigate("/login");
            }}
            className="w-full group flex items-center justify-between px-4 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl transition-all duration-300 border border-red-500/10 hover:border-red-500/20"
          >
            <span className="font-semibold">Logout</span>
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                Manage {activeTab}
              </h2>
              <div className="flex items-center text-slate-400 space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
                <span className="text-slate-600">/</span>
                <span className="text-sm font-semibold text-indigo-400 capitalize">{activeTab}</span>
              </div>
            </div>

            <div className="relative w-full lg:w-96 group animate-in fade-in slide-in-from-right duration-700">
              <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in zoom-in duration-700">
            <StatsCard 
              label={`Total ${activeTab}`} 
              value={stats.total} 
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              color="indigo"
            />
            <StatsCard 
              label={activeTab === 'jobs' ? "Open Jobs" : "Active Users"} 
              value={stats.active} 
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              color="emerald"
            />
            <StatsCard 
              label="Moderated" 
              value={stats.banned} 
              icon={<UserX className="w-6 h-6 text-rose-400" />}
              color="rose"
            />
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-400 rounded-2xl flex items-center shadow-lg animate-in slide-in-from-top duration-500">
              <ShieldAlert className="w-5 h-5 mr-3" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Content Area */}
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Data</p>
              </div>
            ) : (
              <div className="bg-slate-800/30 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5">
                        {activeTab === 'jobs' ? (
                          <>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Job Information</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Details</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Moderation</th>
                          </>
                        ) : (
                          <>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Account Status</th>
                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(activeTab === 'jobs' ? filteredJobs : filteredUsers).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center space-y-3 opacity-40">
                              <Search className="w-10 h-10" />
                              <p className="text-slate-300 font-medium tracking-wide">No {activeTab} found matching your criteria</p>
                            </div>
                          </td>
                        </tr>
                      ) : activeTab === 'jobs' ? (
                        filteredJobs.map((job, idx) => (
                          <tr key={job.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title || "Untitled Position"}</span>
                                <span className="text-sm text-slate-500 font-medium">{job.contractor?.companyName || "Private Contractor"}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col space-y-1.5">
                                <div className="flex items-center text-sm text-slate-400">
                                  <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-500/60" />
                                  {job.location}
                                </div>
                                <div className="flex items-center text-sm text-emerald-400/80 font-bold">
                                  <DollarSign className="w-3.5 h-3.5 mr-2" />
                                  {job.payRate}/hr
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                job.status === 'OPEN' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-rose-500/20"
                                title="Remove Listing"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        filteredUsers.map((user, idx) => (
                          <tr key={user.id} className={`group hover:bg-white/[0.02] transition-all duration-300 ${user.isBanned ? 'opacity-60 bg-slate-900/40' : ''}`}>
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-indigo-500/20 blur rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
                                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-indigo-400 font-black text-lg border border-white/5 shadow-lg">
                                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">
                                    {user.name || "Anonymous User"}
                                  </span>
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: #{user.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col space-y-1.5">
                                <div className="text-sm text-slate-300 font-medium">{user.email}</div>
                                <div className="text-xs text-slate-500">{user.phone || "No phone listed"}</div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              {user.isBanned ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  <Ban className="w-3 h-3 mr-1.5" />
                                  Suspended
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleToggleBan(user.id, user.isBanned)}
                                  className={`p-3 rounded-2xl transition-all duration-300 border ${
                                    user.isBanned 
                                      ? "text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/20" 
                                      : "text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10 hover:border-amber-500/20"
                                  }`}
                                  title={user.isBanned ? "Lift Suspension" : "Suspend User"}
                                >
                                  <Ban className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-rose-500/20"
                                  title="Purge Profile"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-left { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-in-from-top { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-left { animation-name: slide-in-from-left; }
        .slide-in-from-right { animation-name: slide-in-from-right; }
        .slide-in-from-bottom { animation-name: slide-in-from-bottom; }
        .slide-in-from-top { animation-name: slide-in-from-top; }
        .zoom-in { animation-name: zoom-in; }
      `}} />
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label, disabled = false }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
        active 
          ? "bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)] border border-indigo-500/20" 
          : disabled 
            ? "opacity-30 grayscale cursor-not-allowed" 
            : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"></div>}
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-sm font-bold tracking-wide ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{label}</span>
    </button>
  );
}

function StatsCard({ label, value, icon, color }) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    rose: "from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400"
  };

  return (
    <div className={`relative group p-6 rounded-[2rem] bg-gradient-to-br ${colors[color]} border backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-xl`}>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</span>
          <span className="text-3xl font-black text-white tracking-tight">{value}</span>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}
