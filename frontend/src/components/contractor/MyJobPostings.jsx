import axios from 'axios';
import { PlusCircle, MapPin, DollarSign, Clock, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MyJobPostings({ onNewJobClick }) {
    const [jobs, setJobs] = useState([]);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchData = async() => {
            const data = await axios.get(`${BASE_URL}/api/jobs`)
                .then((response) => {
                    setJobs(response.data);
                    console.log("Fetched jobs:", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching jobs:", error);
                });
        }
        fetchData();
    },[]);
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">My Job Postings</h2>
                    <button
                        onClick={onNewJobClick}
                        className="btn btn-secondary"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Post New Job
                    </button>
                </div>

                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="p-6 bg-slate-50 rounded-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            {job.payRate}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* <span
                                        className={`badge ${job.status === 'Active' ? 'badge-success' : 'badge-info'
                                            }`}
                                    >
                                        {job.status}
                                    </span>
                                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-all">
                                        <Edit className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <button className="p-2 hover:bg-red-100 rounded-lg transition-all">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button> */}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                {/* <div className="flex space-x-6">
                                    <div>
                                        <div className="text-2xl font-bold text-primary-600">{job.applicants}</div>
                                        <div className="text-sm text-slate-600">Applicants</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{job.hired}</div>
                                        <div className="text-sm text-slate-600">Hired</div>
                                    </div>
                                </div> */}
                                <button className="btn btn-primary">View Applications</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
