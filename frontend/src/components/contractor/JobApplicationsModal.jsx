import { Star, X, MapPin, Briefcase, Mail, Phone, Calendar, Search, Filter, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/Loading';
import WorkerProfileModal from './WorkerProfileModal';

export default function JobApplicationsModal({ JobId, onClose, onNavigateToMessages }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const cid = JSON.parse(localStorage.getItem("wid"));
                const res = await axios.get(`${BASE_URL}/api/jobs/applications/contractor/${cid}`);

                // Filter specifically for this JobId if provided
                const jobApps = res.data.filter(app => Number(app.job.id) === Number(JobId));

                const formatted = jobApps.map(app => ({
                    id: app.id,
                    worker: app.worker,
                    coverNote: app.coverNote,
                    jobId: app.job.id,
                    job: app.job.title,
                    rating: 4.5, // placeholder
                    completedJobs: app.worker.experience || 0,
                    skills: app.job.skillsRequired
                        ? (Array.isArray(app.job.skillsRequired) ? app.job.skillsRequired : app.job.skillsRequired.split(",")).map(s => s.trim())
                        : [],
                    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'Recently',
                }));

                setApplications(formatted);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };
        if (JobId) {
            fetchApplications();
        }
    }, [JobId, BASE_URL]);

    const handleHire = async (e, appId) => {
        e.stopPropagation();
        try {
            await axios.put(`${BASE_URL}/api/jobs/applications/${appId}/status`, { status: "ACCEPTED" });
            setApplications(prev => prev.filter(app => app.id !== appId));
            alert("Worker hired successfully!");
        } catch (err) {
            console.error("Failed to hire worker:", err);
            alert("Failed to hire worker.");
        }
    };

    const filteredApplications = applications.filter(app =>
        app.worker.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div
            className="bg-slate-50 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Review Applications</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {loading
                            ? "Loading candidates..."
                            : `${applications.length} candidate${applications.length !== 1 ? 's' : ''} applied for this role.`}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                {/* Search Bar */}
                {applications.length > 0 && (
                    <div className="relative mb-6 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-full bg-white shadow-sm border-slate-200"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loading text="Loading candidates..." />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {applications.length === 0 ? "No applications yet" : "No matches found"}
                        </h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                            {applications.length === 0
                                ? "Applications for this job will appear here once workers start applying."
                                : "No candidates match your current search criteria."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredApplications.map((app) => (
                            <div key={app.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                {/* LEFT: Avatar & Basic Info */}
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                                        {app.worker?.user?.name ? app.worker.user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-slate-800 truncate">
                                                {app.worker?.user?.name || 'Unknown Worker'}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100 shrink-0">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                                                <span className="text-xs font-semibold text-yellow-700">{app.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1 shrink-0">
                                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                                {app.completedJobs} Yrs Exp.
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                                            <span className="flex items-center gap-1 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                Applied {app.appliedDate}
                                            </span>
                                        </div>
                                        {app.skills && app.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                {app.skills.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {app.skills.length > 4 && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                                        +{app.skills.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* MIDDLE: Cover Note (Optional/Truncated) */}
                                {app.coverNote && (
                                    <div className="hidden md:block flex-1 border-l border-slate-100 pl-5 min-w-0">
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed italic">
                                            "{app.coverNote}"
                                        </p>
                                    </div>
                                )}
                                {!app.coverNote && (
                                    <div className="hidden md:block flex-1 border-l border-slate-100 pl-5">
                                        <p className="text-xs text-slate-400 italic">No cover note provided.</p>
                                    </div>
                                )}

                                {/* RIGHT: Actions */}
                                <div className="flex sm:flex-col gap-2 w-full sm:w-36 shrink-0 mt-3 sm:mt-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedWorker(app.worker);
                                        }}
                                        className="flex-1 sm:flex-none bg-white border-2 border-primary-100 text-primary-600 hover:bg-primary-50 hover:border-primary-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-all text-center flex items-center justify-center gap-1.5"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onNavigateToMessages) {
                                                onNavigateToMessages({
                                                    id: app.worker.user.id,
                                                    name: app.worker.user.name
                                                });
                                            }
                                        }}
                                        className="flex-1 sm:flex-none bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold py-1.5 px-3 rounded-lg text-xs transition-all text-center flex items-center justify-center gap-1.5"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 shrink-0" /> Message
                                    </button>
                                    <button
                                        onClick={(e) => handleHire(e, app.id)}
                                        className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs shadow-sm transition-all text-center"
                                    >
                                        Hire
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Worker Profile Modal Support */}
            {selectedWorker && (
                <div className="fixed inset-0 z-[60] h-screen flex items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-hidden p-4">
                    <WorkerProfileModal
                        worker={selectedWorker}
                        onClose={() => setSelectedWorker(null)}
                    />
                </div>
            )}
        </div>
    );
}
