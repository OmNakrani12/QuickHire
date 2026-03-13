import { Calendar, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function ActiveJobs({ jobs, onJobComplete }) {
    const [now, setNow] = useState(Date.now());
    const completingRef = useRef(new Set());

    useEffect(() => {
        // Update timer every second
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        jobs.forEach(job => {
            const elapsed = now - job.startTime;
            if (elapsed >= job.durationMs && job.status !== 'COMPLETED') {
                if (onJobComplete && !completingRef.current.has(job.jobId)) {
                    completingRef.current.add(job.jobId);
                    onJobComplete(job.jobId);
                }
            }
        });
    }, [now, jobs, onJobComplete]);

    const formatTimeRemaining = (elapsedMs, durationMs) => {
        const remainingMs = Math.max(0, durationMs - elapsedMs);
        if (remainingMs === 0) return "Time's up!";

        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            const rHours = hours % 24;
            return `${days}d ${rHours}h ${minutes}m ${seconds}s remaining`;
        }
        
        return `${hours}h ${minutes}m ${seconds}s remaining`;
    };

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 truncate dark:text-white">Active Jobs</h2>
            <div className="space-y-4">
                {jobs.map((job) => {
                    const elapsed = now - job.startTime;
                    const progress = Math.min(100, Math.max(0, (elapsed / job.durationMs) * 100));
                    const timeRemaining = formatTimeRemaining(elapsed, job.durationMs);

                    return (
                        <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:border dark:border-slate-800">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{job.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{job.contractor}</p>
                                </div>
                                <span className="badge badge-info">{job.status}</span>
                            </div>
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-primary-500" />
                                        {timeRemaining}
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4 mr-1" />
                                Expected Duration: {job.dueDate}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
