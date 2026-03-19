import axios from "axios";
import { useEffect, useState } from "react";
import {
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Trash2,
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  AlertCircle,
  BarChart,
  UserCheck
} from "lucide-react";
import Loading from "@/Loading";
import JobApplicationsModal from "./JobApplicationsModal";

export default function MyJobPostings({ onNewJobClick, onNavigateToMessages }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const cid = localStorage.getItem("cid");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  /* ── derived ── */
  const myJobs = jobs.filter((j) => j.contractor?.id === Number(cid));
  const filtered = myJobs.filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: myJobs.length,
    OPEN: myJobs.filter((j) => j.status === "OPEN").length,
    CLOSED: myJobs.filter((j) => j.status === "CLOSED").length,
  };

  if (loading) return <Loading text="Fetching your jobs..." />;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 h-screen p-4 flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
          onClick={() => setSelectedJob(null)}
        >
          <JobApplicationsModal
            JobId={selectedJob}
            onClose={() => setSelectedJob(null)}
            onNavigateToMessages={onNavigateToMessages}
          />
        </div>
      )}

      {/* ── HEADER & ANALYTICS DASHBOARD ─────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-r from-secondary-600 to-indigo-700 rounded-3xl p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tranglate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight tracking-tight">Manage Your Postings</h2>
            <p className="text-secondary-100 text-sm font-medium">Create jobs, review applicants, and build your ultimate team seamlessly.</p>
          </div>
          <div className="mt-8">
            {onNewJobClick && (
              <button onClick={onNewJobClick} className="bg-white text-secondary-700 hover:bg-slate-50 transition-colors shadow-xl font-bold rounded-xl flex items-center gap-2 py-3 px-6 text-sm">
                <Plus className="w-5 h-5" />
                Post New Opportunity
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 shrink-0 xl:w-72">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2 font-medium text-sm">
              <BarChart className="w-4 h-4 text-green-500" /> Active Postings
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{counts.OPEN}</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2 font-medium text-sm">
              <Layers className="w-4 h-4 text-secondary-500" /> Total Postings
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{counts.ALL}</h3>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-2 font-medium text-sm">
              <UserCheck className="w-4 h-4 text-orange-500" /> Filled Roles
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{counts.CLOSED}</h3>
          </div>
        </div>
      </div>

      {/* ── FILTERS ───────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* status tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl w-full sm:w-auto">
          {["ALL", "OPEN", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${statusFilter === s
                ? "bg-white text-secondary-600 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
            >
              {s === "OPEN" && <CheckCircle2 className="w-4 h-4 hidden sm:block" />}
              {s === "CLOSED" && <XCircle className="w-4 h-4 hidden sm:block" />}
              {s === "ALL" && <Layers className="w-4 h-4 hidden sm:block" />}
              {s}
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusFilter === s ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="input w-full pl-11 bg-slate-50 border-transparent focus:bg-white dark:bg-slate-900 focus:dark:bg-slate-800 rounded-xl"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card p-20 text-center dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-xl text-slate-800 dark:text-white font-bold mb-2">No active postings match your criteria</p>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== "ALL"
              ? "Try tweaking your search terms or clearing your filters to find what you're looking for."
              : "You haven't posted any jobs yet. Create your first listing to start hiring amazing talent."}
          </p>
        </div>
      )}

      {/* ── GRID LAYOUT ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={() => setDeleteConfirm(job.id)}
            onViewApplications={() => setSelectedJob(job.id)}
          />
        ))}
      </div>

      {/* ── DELETE MODAL ──────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}>
          <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-100 animate-modalIn">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100 dark:border-red-800/50">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Delete Posting?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Are you absolutely sure you want to delete this job posting? This action cannot be undone and will erase all current applications.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="btn btn-outline flex-1 py-3 text-sm font-bold rounded-xl bg-white dark:bg-slate-800">
                Cancel
              </button>
              <button onClick={() => deleteJob(deleteConfirm)}
                className="flex-1 py-3 text-sm font-bold rounded-xl bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg text-white transition-all transform hover:-translate-y-0.5">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onDelete, onViewApplications }) {
  const isOpen = job.status === "OPEN";
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-secondary-300 dark:hover:border-secondary-500 transition-all duration-300 flex flex-col group relative overflow-hidden">

      {/* Top Header */}
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start">
        <div className={`p-3.5 rounded-2xl ${isOpen ? 'bg-secondary-50 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400 shadow-sm border border-secondary-100 dark:border-secondary-800/50' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'} `}>
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end gap-3 z-10">
          <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full border ${isOpen ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
            {job.status}
          </span>
          <button onClick={onDelete} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 dark:bg-slate-700/50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800/50" title="Delete Job">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col pt-4">
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors leading-snug">
          {job.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
          <MapPin className="w-4 h-4 shrink-0" /> {job.location || 'Remote'}
        </p>

        <div className="grid grid-cols-2 gap-y-5 gap-x-4 mt-auto">
          <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pay Rate</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-green-500" /> {job.payRate ? job.payRate.toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Type</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" /> {job.duration || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Vacancies</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-500" /> {job.requiredWorkers ? `${job.requiredWorkers} Workers Needed` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 rounded-b-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-0 left-0 right-0 z-20">
        <button
          onClick={onViewApplications}
          className="w-full btn btn-secondary flex justify-center items-center gap-2 py-3 shadow-md hover:shadow-lg font-bold rounded-xl"
        >
          <Users className="w-4 h-4" /> Review Applications
        </button>
      </div>

      {/* Background visual padding layer so text doesn't hide under hover button */}
      <div className="h-4 group-hover:h-20 transition-all duration-300"></div>

    </div>
  )
}