import axios from "axios";
import { useEffect, useState } from "react";
import {
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Trash2,
  Briefcase
} from "lucide-react";

export default function MyJobPostings() {
  const [jobs, setJobs] = useState([]);
  const cid = localStorage.getItem("uid");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            My Job Postings
          </h2>
          <p className="text-slate-500 mt-1">
            Manage and track your active job listings
          </p>
        </div>
      </div>

      {jobs.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500">
          No job postings available.
        </div>
      )}

      <div className="space-y-6">
        {jobs.filter(job => job.contractor?.id === Number(cid)).map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">

              {/* Left Section */}
              <div className="flex-1 pr-6">

                {/* Title + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-semibold text-slate-800">
                      {job.title}
                    </h3>
                  </div>

                  <span
                    className={`px-4 py-1 text-xs font-medium rounded-full ${
                      job.status === "OPEN"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-slate-500" />
                    ₹{job.payRate}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {job.duration}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    {job.requiredWorkers} Workers
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 text-slate-700 text-sm leading-relaxed">
                  {job.description}
                </div>

                {/* Skills */}
                {job.skillsRequired && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.skillsRequired.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-50 text-primary-700 px-3 py-1 text-xs rounded-full border border-primary-200"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end justify-between ml-8">
                <div className="text-xs text-slate-400">
                  Posted{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="mt-8 flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}