import { useState } from "react";
import axios from "axios";

export default function NewJobModal({ isOpen, onClose }) {
    const [jobData, setJobData] = useState({
        title: "",
        location: "",
        payRate: "",
        duration: "",
        description: "",
        skills: ""
    });
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
            await axios.post(`${BASE_URL}/api/jobs`, jobData);

            alert("Job Posted Successfully ✅");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error posting job ❌");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            placeholder="e.g. Construction Worker, Electrician, Plumber"
                            value={jobData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Location + Pay */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Job Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                className="input"
                                placeholder="e.g. Surat, Gujarat"
                                value={jobData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Pay Rate (₹) *
                            </label>
                            <input
                                type="number"
                                name="payRate"
                                className="input"
                                placeholder="e.g. 800 (per day) or 15000 (contract)"
                                value={jobData.payRate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Duration *
                        </label>
                        <input
                            type="text"
                            name="duration"
                            className="input"
                            placeholder="e.g. 5 days / 2 weeks / 3 months"
                            value={jobData.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            className="input min-h-32"
                            placeholder="Describe responsibilities, work hours, safety requirements, tools needed..."
                            value={jobData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Required Skills
                        </label>
                        <input
                            type="text"
                            name="skills"
                            className="input"
                            placeholder="e.g. Masonry, Welding, Heavy Lifting, Electrical Wiring"
                            value={jobData.skills}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button type="submit" className="btn btn-secondary flex-1">
                            Post Job
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}