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
            const cid = await localStorage.getItem("uid") || 1; // ⚠ Replace with logged-in contractor ID
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        value={jobData.title}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={jobData.location}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="number"
                        name="payRate"
                        placeholder="Pay Rate"
                        value={jobData.payRate}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration"
                        value={jobData.duration}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="number"
                        name="requiredWorkers"
                        placeholder="Required Workers"
                        value={jobData.requiredWorkers}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="text"
                        name="skillsRequired"
                        placeholder="Required Skills"
                        value={jobData.skillsRequired}
                        onChange={handleChange}
                        className="input"
                    />

                    <textarea
                        name="description"
                        placeholder="Job Description"
                        value={jobData.description}
                        onChange={handleChange}
                        required
                        className="input min-h-32"
                    />

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