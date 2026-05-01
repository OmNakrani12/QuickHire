import { Star, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/Loading';
import WorkerProfileModal from './WorkerProfileModal';
import ReviewModal from '../shared/ReviewModal';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from "lucide-react";

export default function ApplicationsList({ JobId, onNavigateToMessages }) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [showAccepted, setShowAccepted] = useState(false);
    const [reviewingApp, setReviewingApp] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const cid = JSON.parse(localStorage.getItem("cid"));

                const res = await axios.get(
                    `${BASE_URL}/api/jobs/applications/contractor/${cid}`
                );
                
                const formatted = res.data.map(app => ({
                    id: app.id,
                    worker: app.worker,
                    coverNote: app.coverNote,
                    jobId: app.job.id,
                    job: app.job.title,
                    status: app.status,
                    rating: 0, // Will fetch ratings in WorkerProfileModal or ProfileView
                    completedJobs: app.worker.experience,
                    skills: app.job.skillsRequired
                        ? app.job.skillsRequired.split(",")
                        : [],
                    appliedDate: app.appliedAt?.split("T")[0],
                }));
                setApplications(formatted);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [JobId, BASE_URL]);

    const handleHire = async (appId) => {
        try {
            await axios.put(`${BASE_URL}/api/jobs/applications/${appId}/status`, { status: "ACCEPTED" });
            setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: "ACCEPTED" } : app));
            alert("Worker hired successfully!");
        } catch (err) {
            console.error("Failed to hire worker:", err);
            alert("Failed to hire worker.");
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center'>
                <Loading text="Fetching applications" />
            </div>
        )
    }

    const ApplicationCard = ({ application, handleHire, setSelectedWorker, isHire}) => {
        return (
            <div className="p-6 bg-white dark:bg-slate-800 border rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                    {/* LEFT SECTION */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 w-full text-center sm:text-left">

                        {/* Avatar */}
                        <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {application.worker.user.name.charAt(0)}
                        </div>

                        {/* Worker Info */}
                        <div className="flex-1">

                            {/* Name */}
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                {application.worker.user.name}
                            </h3>

                            {/* Job */}
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                Applied for <span className="font-medium">{application.job}</span>
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                                {application.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Cover Note */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 text-left">
                                <span className="font-medium text-slate-700 dark:text-slate-200 block sm:inline">
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
                    <div className="flex flex-col sm:flex-col gap-2 w-full sm:w-40 shrink-0">

                        <button 
                            className={`btn ${isHire ? 'btn-outline border-green-500 text-green-500 ' : 'btn-secondary'} w-full`}
                            onClick={() => !isHire && handleHire(application.id)}
                            disabled={isHire}
                        >
                            {isHire ? "Hired" : "Hire Worker"}
                        </button>

                        {isHire && (
                            <button
                                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                                onClick={() => setReviewingApp(application)}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Rate Worker
                            </button>
                        )}

                        <button
                            className="btn btn-outline w-full"
                            onClick={() => setSelectedWorker({ ...application.worker, _appId: application.id })}
                        >
                            View Profile
                        </button>

                        <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                                if (onNavigateToMessages) {
                                    onNavigateToMessages({
                                        id: application.worker.user.id,
                                        name: application.worker.user.name
                                    });
                                } else {
                                    navigate(`/contractor/messages/${application.worker.id}`);
                                }
                            }}
                        >
                            Message
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="card p-6">
                    <h2 className="text-2xl font-bold mb-6">Worker Applications</h2>

                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="input flex-1 w-full"
                        />
                        <select className="input w-full sm:w-48">
                            <option>All Jobs</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {applications.filter(app => (app.status !== "ACCEPTED") && (Number(app.jobId) === Number(JobId) || !JobId) ).map((application) => (
                            <div key={application.id} className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm hover:shadow-md transition">
                                <ApplicationCard application={application} handleHire={handleHire} setSelectedWorker={setSelectedWorker} isHire={false}/>
                            </div>
                        ))}
                    </div>

                    <div
                        className="flex items-center gap-2 cursor-pointer p-4 select-none mt-8 border-t border-slate-100 dark:border-slate-800"
                        onClick={() => setShowAccepted(prev => !prev)}
                    >
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Accepted Applications ({applications.filter(a => a.status === 'ACCEPTED').length})</span>
                        {showAccepted ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </div>

                    <div className="space-y-4">
                        {showAccepted && applications.filter(app => (app.status === "ACCEPTED") && (Number(app.jobId) === Number(JobId) || !JobId) ).map((application) => (
                            <div key={application.id} className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm hover:shadow-md transition">
                                <ApplicationCard application={application} handleHire={handleHire} setSelectedWorker={setSelectedWorker} isHire={true}/>
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
                        onHire={(worker) => {
                            if (worker._appId) {
                                handleHire(worker._appId);
                                setSelectedWorker(null);
                            }
                        }}
                        onMessage={(worker) => {
                            setSelectedWorker(null);
                            if (onNavigateToMessages) {
                                onNavigateToMessages({ id: worker.user.id, name: worker.user.name });
                            }
                        }}
                    />
                </div>
            )}

            {reviewingApp && (
                <ReviewModal
                    isOpen={!!reviewingApp}
                    onClose={() => setReviewingApp(null)}
                    revieweeId={reviewingApp.worker.user.id}
                    reviewerId={JSON.parse(localStorage.getItem('uid'))}
                    jobId={reviewingApp.jobId}
                    revieweeName={reviewingApp.worker.user.name}
                    onSuccess={() => alert('Worker rated successfully!')}
                />
            )}
        </>
    );
}

