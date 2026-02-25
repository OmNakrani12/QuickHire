import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/Loading';
import WorkerProfileModal from './WorkerProfileModal';

export default function ApplicationsList() {
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
                const formatted = res.data.map(app => ({
                    id: app.id,
                    worker: app.worker, // replace if you have worker name
                    job: app.job.title,
                    rating: 4.5, // placeholder if not in DB
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
            finally{
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);
    if(loading){
        return (
            <div className='flex items-center justify-center'>
                <Loading text="Fetching applications"/>
            </div>
        )
    }
    return (
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
                    {applications.map((application) => (
                        <div key={application.id} className="p-6 bg-slate-50 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {application.worker.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{application.worker.user.name}</h3>
                                        <p className="text-slate-600 mb-2">Applied for: {application.job}</p>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                                <span className="font-semibold">{application.rating}</span>
                                            </div>
                                            <span className="text-slate-600">
                                                {application.completedJobs} completed jobs
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {application.skills.map((skill, index) => (
                                                <span key={index} className="badge badge-info">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2">
                                            Applied on {application.appliedDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button className="btn btn-secondary">Hire Worker</button>
                                    <button className="btn btn-outline" onClick={() => setSelectedWorker(application.worker)}>View Profile</button>
                                    <button className="btn btn-outline">Message</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {selectedWorker && (
                        <WorkerProfileModal
                            worker={selectedWorker}
                            onClose={() => setSelectedWorker(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
