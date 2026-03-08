import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/Loading';
import WorkerProfileModal from './WorkerProfileModal';

export default function ApplicationsList({JobId}) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const uid = JSON.parse(localStorage.getItem("uid"));
                
                const res = await axios.get(
                    `${BASE_URL}/api/jobs/applications/contractor/${uid}`
                );// Set worker profile from the first application (or null if no applications)
                console.log("Raw applications data:", res.data);
                const formatted = res.data.map(app => ({
                    id: app.id,
                    worker: app.worker,
                    coverNote: app.coverNote,
                    jobId: app.job.id, // replace if you have worker name
                    job: app.job.title,
                    rating: 4.5, // placeholder if not in DB
                    completedJobs: app.worker.experience,
                    skills: app.job.skillsRequired
                    ? app.job.skillsRequired.split(",")
                    : [],
                    appliedDate: app.appliedAt?.split("T")[0],
                }));
                console.log("Fetched applications:", formatted);
                setApplications(formatted);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            }
            finally{
                setLoading(false);
            }
        };
        fetchApplications();
    }, [JobId]);
    if(loading){
        return (
            <div className='flex items-center justify-center'>
                <Loading text="Fetching applications"/>
            </div>
        )
    }
    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="card p-6">
                    <h2 className="text-2xl font-bold mb-6">Worker Applications</h2>

                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="input flex-1"
                        />
                        <select className="input w-48">
                            <option>All Jobs</option>
                            <option>Office Renovation</option>
                            <option>Warehouse Construction</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {applications.filter(app => Number(app.jobId) === Number(JobId) || !JobId).map((application) => (
                            <div key={application.id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-6">

                                    {/* LEFT SECTION */}
                                    <div className="flex items-start gap-4 flex-1">

                                        {/* Avatar */}
                                        <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {application.worker.user.name.charAt(0)}
                                        </div>

                                        {/* Worker Info */}
                                        <div className="flex-1">

                                            {/* Name */}
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                {application.worker.user.name}
                                            </h3>

                                            {/* Job */}
                                            <p className="text-sm text-slate-500 mb-2">
                                                Applied for <span className="font-medium">{application.job}</span>
                                            </p>

                                            {/* Rating + Experience */}
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="w-4 h-4 mr-1" />
                                                    <span className="font-medium text-slate-700">
                                                        {application.rating}
                                                    </span>
                                                </div>

                                                <span className="text-sm text-slate-500">
                                                    {application.completedJobs} yrs experience
                                                </span>
                                            </div>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {application.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Cover Note */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                                                <span className="font-medium text-slate-700">
                                                    Cover Note:
                                                </span>{" "}
                                                {application.coverNote || "No cover note provided"}
                                            </div>

                                            {/* Date */}
                                            <p className="text-xs text-slate-400 mt-2">
                                                Applied on {application.appliedDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION BUTTONS */}
                                    <div className="flex flex-col gap-2 w-40">

                                        <button className="btn btn-secondary w-full">
                                            Hire Worker
                                        </button>

                                        <button
                                            className="btn btn-outline w-full"
                                            onClick={() => setSelectedWorker(application.worker)}
                                        >
                                            View Profile
                                        </button>

                                        <button className="btn btn-outline w-full">
                                            Message
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedWorker && (
                <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/25 backdrop-blur-sm">
                    <WorkerProfileModal
                        worker={selectedWorker}
                        onClose={() => setSelectedWorker(null)}
                        />
                </div>
            )}
        </>
    );
}
