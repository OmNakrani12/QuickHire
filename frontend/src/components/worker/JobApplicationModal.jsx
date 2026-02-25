import { useState } from "react";
import axios from "axios";
import {
    X,
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    FileText,
    Calendar,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

export default function JobApplicationModal({ job, onClose }) {
    const [form, setForm] = useState({
        coverNote: "",
        proposedRate: job?.payRate ?? "",
        availableFrom: "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState("");

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.coverNote.trim()) {
            setErrorMsg("Please add a cover note.");
            setStatus("error");
            return;
        }
        if (!form.availableFrom) {
            setErrorMsg("Please pick your available start date.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const uid = JSON.parse(localStorage.getItem("uid"));
            await axios.post(`${BASE_URL}/api/jobs/${job.id}/apply`, {
                workerId: uid,
                coverNote: form.coverNote,
                proposedRate: Number(form.proposedRate),
                availableFrom: form.availableFrom,
            });
            setStatus("success");
        } catch (err) {
            console.error("Application error:", err);
            setErrorMsg(
                err?.response?.data?.message ||
                "Failed to submit application. Please try again."
            );
            setStatus("error");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                style={{ animation: "modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
                {/* Gradient header — uses primary-600 (sky blue) */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Apply for Job
                        </h2>
                        <p className="text-primary-100 text-sm mt-1 line-clamp-1 font-medium">
                            {job?.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors mt-0.5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Job meta chips */}
                <div className="flex flex-wrap gap-3 px-6 py-4 bg-primary-50 border-b border-primary-100">
                    {job?.location && (
                        <span className="flex items-center text-xs text-primary-700 bg-white border border-primary-200 px-3 py-1 rounded-full shadow-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1" /> {job.location}
                        </span>
                    )}
                    {job?.duration && (
                        <span className="flex items-center text-xs text-primary-700 bg-white border border-primary-200 px-3 py-1 rounded-full shadow-sm">
                            <Clock className="w-3.5 h-3.5 mr-1" /> {job.duration}
                        </span>
                    )}
                    {job?.payRate && (
                        <span className="flex items-center text-xs text-primary-700 bg-white border border-primary-200 px-3 py-1 rounded-full shadow-sm font-semibold">
                            <DollarSign className="w-3.5 h-3.5 mr-1" /> ₹{job.payRate} listed
                        </span>
                    )}
                </div>

                {/* Success state */}
                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-9 h-9 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Application Sent!</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Your application for{" "}
                            <span className="font-semibold text-slate-700">{job?.title}</span> has
                            been submitted. The contractor will review it shortly.
                        </p>
                        <button onClick={onClose} className="btn btn-primary">
                            Back to Jobs
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Error banner */}
                        {status === "error" && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Cover Note */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-primary-500" />
                                Cover Note
                            </label>
                            <textarea
                                name="coverNote"
                                rows={4}
                                value={form.coverNote}
                                onChange={handleChange}
                                placeholder="Introduce yourself and explain why you're a great fit for this job..."
                                className="input resize-none"
                            />
                        </div>

                        {/* Proposed Rate */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-primary-500" />
                                Your Proposed Rate (₹/hr)
                            </label>
                            <input
                                type="number"
                                name="proposedRate"
                                value={form.proposedRate}
                                onChange={handleChange}
                                min={0}
                                placeholder="e.g. 500"
                                className="input"
                            />
                        </div>

                        {/* Available From */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-primary-500" />
                                Available From
                            </label>
                            <input
                                type="date"
                                name="availableFrom"
                                value={form.availableFrom}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="input"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-outline flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
