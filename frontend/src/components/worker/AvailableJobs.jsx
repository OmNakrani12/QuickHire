import axios from "axios";
import { Search, MapPin, Clock, Loader2, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import JobApplicationModal from "./JobApplicationModal";

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/jobs`);
        const openJobs = response.data.filter((job) => job.status === "OPEN");
        setJobs(openJobs);
        setFiltered(openJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Live search filter
  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setFiltered(jobs);
    } else {
      const lower = val.toLowerCase();
      setFiltered(
        jobs.filter(
          (job) =>
            job.title?.toLowerCase().includes(lower) ||
            job.location?.toLowerCase().includes(lower) ||
            job.skillsRequired?.toLowerCase().includes(lower)
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 mx-auto animate-spin" />
          <p className="mt-4 text-lg text-slate-600">Loading available jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header card */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-white/20">
          {/* Gradient banner — primary theme */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Find Jobs</h2>
              <p className="text-primary-100 text-sm mt-1">
                {filtered.length} open position{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <SlidersHorizontal className="w-6 h-6 text-white/70" />
          </div>

          {/* Search bar */}
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 flex gap-3 border-b border-slate-100">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search by title, location or skill…"
              className="input flex-1"
            />
            <button className="btn btn-primary">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job cards */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="card p-10 text-center text-slate-500">
              {query ? "No jobs match your search." : "No jobs available right now."}
            </div>
          )}

          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20
                         hover:shadow-xl hover:border-primary-100 transition-all duration-300 overflow-hidden"
            >
              {/* Top: title + pay */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{job.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {job.contractor?.name || "Unknown Contractor"}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    {job.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                        {job.location}
                      </span>
                    )}
                    {job.duration && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-primary-500" />
                        {job.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right ml-4 shrink-0">
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{job.payRate}
                    <span className="text-sm text-slate-400 font-normal">/hr</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
              </div>

              {/* Bottom: skills + apply */}
              <div className="flex items-center justify-between px-6 pb-5 gap-3">
                <div className="flex gap-2 flex-wrap flex-1">
                  {job.skillsRequired
                    ? job.skillsRequired.split(",").map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-full font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))
                    : null}
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="btn btn-primary shrink-0 text-sm px-5 py-2.5"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}