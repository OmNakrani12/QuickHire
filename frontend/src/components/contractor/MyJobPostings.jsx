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
  Filter,
  ChevronDown,
  CalendarDays,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Loading from "@/Loading";

export default function MyJobPostings({ onNewJobClick }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const cid = localStorage.getItem("uid");
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
    <div className="space-y-6 animate-fade-in">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text">My Job Postings</h2>
            <p className="text-slate-500 text-sm mt-1">
              {myJobs.length} job{myJobs.length !== 1 ? "s" : ""} posted · {counts.OPEN} open
            </p>
          </div>
          {onNewJobClick && (
            <button onClick={onNewJobClick} className="btn btn-secondary flex items-center gap-2 py-2.5 px-5 text-sm">
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          )}
        </div>
      </div>

      {/* ── FILTERS ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="input pl-9 w-full"
          />
        </div>

        {/* status tabs */}
        <div className="flex gap-2">
          {["ALL", "OPEN", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s
                ? "bg-secondary-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {s === "OPEN" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {s === "CLOSED" && <XCircle className="w-3.5 h-3.5" />}
              {s === "ALL" && <Layers className="w-3.5 h-3.5" />}
              {s}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ml-0.5 ${statusFilter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── EMPTY STATE ───────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-semibold">No jobs found</p>
          <p className="text-slate-400 text-sm mt-1">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search or filter."
              : "Post your first job to get started."}
          </p>
        </div>
      )}

      {/* ── JOB CARDS ─────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={() => setDeleteConfirm(job.id)}
          />
        ))}
      </div>

      {/* ── DELETE CONFIRM ────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Job Posting?</h3>
            <p className="text-slate-500 text-sm mb-6">
              This will permanently remove the job and all its applications.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="btn btn-outline flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={() => deleteJob(deleteConfirm)}
                className="flex-1 py-2.5 text-sm rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── JobCard ────────────────────────────────────────────── */
function JobCard({ job, onDelete }) {
  const isOpen = job.status === "OPEN";
  const statusCfg = isOpen
    ? { badge: "bg-green-100 text-green-700", dot: "bg-green-400", label: "Open" }
    : { badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400", label: "Closed" };
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const skills = job.skillsRequired
    ? job.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex items-stretch">
      {/* accent bar */}
      <div className={`w-1.5 shrink-0 ${isOpen ? "bg-gradient-to-b from-primary-500 to-secondary-500" : "bg-slate-200"}`} />

      <div className="flex-1 flex flex-col">
        {/* ── SECTION 1: header ── */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOpen ? "bg-gradient-to-br from-primary-500 to-secondary-600" : "bg-slate-200"}`}>
            <Briefcase className={`w-5 h-5 ${isOpen ? "text-white" : "text-slate-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{job.title}</h3>
            {postedDate && <p className="text-xs text-slate-400 mt-0.5">Posted {postedDate}</p>}
          </div>
          <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusCfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* ── SECTION 2: description + meta + skills ── */}
        <div className="px-5 pb-4 flex flex-col gap-2.5">
          {job.description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-1">{job.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {job.location && <MetaChip icon={<MapPin className="w-3.5 h-3.5 text-primary-400" />} value={job.location} />}
            {job.payRate && <MetaChip icon={<IndianRupee className="w-3.5 h-3.5 text-green-500" />} value={`₹${Number(job.payRate).toLocaleString()}`} />}
            {job.duration && <MetaChip icon={<Clock className="w-3.5 h-3.5 text-secondary-400" />} value={job.duration} />}
            {job.requiredWorkers && <MetaChip icon={<Users className="w-3.5 h-3.5 text-orange-400" />} value={`${job.requiredWorkers} workers`} />}
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((s, i) => (
                <span key={i} className="bg-primary-50 text-primary-700 border border-primary-100 text-xs px-2.5 py-0.5 rounded-full font-medium">{s}</span>
              ))}
              {skills.length > 4 && <span className="text-xs text-slate-400 self-center">+{skills.length - 4} more</span>}
            </div>
          )}
        </div>

        {/* ── SECTION 3: footer actions ── */}
        <div className="mt-auto px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
          <button className="btn btn-outline py-1.5 px-4 text-sm flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Applications
          </button>
          <button onClick={onDelete}
            className="w-9 h-9 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 flex items-center justify-center transition-all"
            title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MetaChip ───────────────────────────────────────────── */
function MetaChip({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
      <span className="shrink-0">{icon}</span>
      <span className="text-xs text-slate-600 font-medium">{value}</span>
    </div>
  );
}