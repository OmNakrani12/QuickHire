import { useState } from "react";
import axios from "axios";

export default function NewJobModal({ isOpen, onClose }) {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [jobData, setJobData] = useState({
        title: "",
        location: "",
        payRate: "",
        duration: "",
        description: "",
        skillsRequired: "",
        requiredWorkers: "",
        status: "OPEN",
        contractor: { id: 1 } // ⚠ Replace with logged-in contractor ID
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setJobData({
            ...jobData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const cid = await localStorage.getItem("cid") || 1; // ⚠ Replace with logged-in contractor ID
            await axios.post(`${BASE_URL}/api/jobs`, {
                ...jobData,
                contractor: {id : cid}, // ⚠ Replace with logged-in contractor ID
                payRate: Number(jobData.payRate),
                requiredWorkers: Number(jobData.requiredWorkers)
            });

            alert("Job Posted Successfully ✅");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error posting job ❌");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform scale-95 animate-[scaleIn_0.2s_ease-out_0.1s_forwards]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Post a New Job</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        ✕
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={jobData.title}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={jobData.location}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                        <input
                            type="number"
                            name="payRate"
                            placeholder="Pay Rate ($/hr or Total)"
                            value={jobData.payRate}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                        <input
                            type="text"
                            name="duration"
                            placeholder="Est. Duration (e.g. 3 days)"
                            value={jobData.duration}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                        <input
                            type="number"
                            name="requiredWorkers"
                            placeholder="Required Workers"
                            value={jobData.requiredWorkers}
                            onChange={handleChange}
                            required
                            className="input w-full"
                        />
                        <input
                            type="text"
                            name="skillsRequired"
                            placeholder="Required Skills (comma separated)"
                            value={jobData.skillsRequired}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <textarea
                        name="description"
                        placeholder="Detailed Job Description"
                        value={jobData.description}
                        onChange={handleChange}
                        required
                        className="input min-h-[120px] w-full resize-none"
                    />

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                        <button type="submit" className="btn btn-secondary flex-1 py-3 text-lg shadow-md shadow-secondary-500/20">
                            Post Job Now
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 flex-1 py-3 text-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}