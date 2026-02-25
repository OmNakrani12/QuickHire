import { useState, useEffect } from "react";
import axios from "axios";
import {
    PlusCircle,
    MapPin,
    IndianRupee,
    Clock,
    Users,
    Tag,
    FileText,
    CheckCircle,
    AlertCircle,
    Trash2,
    Briefcase,
} from "lucide-react";
import Loading from "@/Loading";

const INITIAL_FORM = {
    title: "",
    location: "",
    payRate: "",
    duration: "",
    requiredWorkers: "",
    skillsRequired: "",
    description: "",
    status: "OPEN",
};

export default function PostJob() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', msg }
    const [myJobs, setMyJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const cid = localStorage.getItem("uid");

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            setLoadingJobs(true);
            const res = await axios.get(`${BASE_URL}/api/jobs`);
            const mine = res.data.filter((j) => j.contractor?.id === Number(cid));
            setMyJobs(mine.slice(0, 5)); // Show last 5
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        } finally {
            setLoadingJobs(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await axios.post(`${BASE_URL}/api/jobs`, {
                ...form,
                contractor: { id: Number(cid) },
                payRate: Number(form.payRate),
                requiredWorkers: Number(form.requiredWorkers),
            });
            showToast("success", "Job posted successfully! 🎉");
            setForm(INITIAL_FORM);
            fetchMyJobs();
        } catch (err) {
            console.error(err);
            showToast("error", "Failed to post job. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/jobs/${id}`);
            fetchMyJobs();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-500"
                        }`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl flex items-center justify-center shadow">
                        <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">Post a New Job</h2>
                        <p className="text-slate-500 text-sm">
                            Fill in the details below to publish a new job listing
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* === Job Form === */}
                <div className="xl:col-span-2 card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Job Title */}
                        <FormField
                            label="Job Title"
                            icon={<Briefcase className="w-4 h-4 text-slate-400" />}
                        >
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Electrician for Office Rewiring"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </FormField>

                        {/* Location */}
                        <FormField
                            label="Location"
                            icon={<MapPin className="w-4 h-4 text-slate-400" />}
                        >
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Mumbai, Maharashtra"
                                value={form.location}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </FormField>

                        {/* Pay Rate + Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Pay Rate (₹/day)"
                                icon={<IndianRupee className="w-4 h-4 text-slate-400" />}
                            >
                                <input
                                    type="number"
                                    name="payRate"
                                    placeholder="e.g. 1200"
                                    value={form.payRate}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="input"
                                />
                            </FormField>

                            <FormField
                                label="Duration"
                                icon={<Clock className="w-4 h-4 text-slate-400" />}
                            >
                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="e.g. 2 weeks"
                                    value={form.duration}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </FormField>
                        </div>

                        {/* Workers + Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Workers Needed"
                                icon={<Users className="w-4 h-4 text-slate-400" />}
                            >
                                <input
                                    type="number"
                                    name="requiredWorkers"
                                    placeholder="e.g. 5"
                                    value={form.requiredWorkers}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="input"
                                />
                            </FormField>

                            <FormField label="Job Status">
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </FormField>
                        </div>

                        {/* Skills Required */}
                        <FormField
                            label="Skills Required"
                            icon={<Tag className="w-4 h-4 text-slate-400" />}
                            hint="Comma-separated, e.g. Welding, Plumbing, Carpentry"
                        >
                            <input
                                type="text"
                                name="skillsRequired"
                                placeholder="e.g. Construction, Electrical, Heavy Lifting"
                                value={form.skillsRequired}
                                onChange={handleChange}
                                className="input"
                            />
                        </FormField>

                        {/* Description */}
                        <FormField
                            label="Job Description"
                            icon={<FileText className="w-4 h-4 text-slate-400" />}
                        >
                            <textarea
                                name="description"
                                placeholder="Describe the job responsibilities, requirements, and any other important details..."
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="input resize-none"
                            />
                        </FormField>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5" />
                                        Post Job
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(INITIAL_FORM)}
                                className="btn btn-outline px-6"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* === Recent Postings Panel === */}
                <div className="card p-6 flex flex-col gap-4 h-fit">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-secondary-600" />
                        My Recent Postings
                    </h3>

                    {loadingJobs ? (
                        <div className="flex justify-center py-6">
                            <Loading text="Loading jobs..." />
                        </div>
                    ) : myJobs.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <Briefcase className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                            No jobs posted yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary-200 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm truncate">
                                                {job.title}
                                            </p>
                                            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                                                <MapPin className="w-3 h-3" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <IndianRupee className="w-3 h-3" />₹{job.payRate}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === "OPEN"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-slate-200 text-slate-600"
                                                        }`}
                                                >
                                                    {job.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 mt-1"
                                            title="Delete job"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* Reusable labeled form field wrapper */
function FormField({ label, icon, hint, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                {icon}
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
    );
}
