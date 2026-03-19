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
        <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary-500" /> Active Jobs
            </h2>
            <div className="space-y-4">
                {jobs.map((job) => {
                    const elapsed = now - job.startTime;
                    const progress = Math.min(100, Math.max(0, (elapsed / job.durationMs) * 100));
                    const timeRemaining = formatTimeRemaining(elapsed, job.durationMs);

                    return (
                        <div key={job.id} className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 gap-3 relative z-10">
                                <div>
                                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">{job.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs">{job.contractor}</p>
                                </div>
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 shrink-0 border border-sky-200 dark:border-sky-500/20 shadow-sm">{job.status}</span>
                            </div>
                            
                            <div className="mb-5 relative z-10">
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-primary-700 dark:text-primary-400 font-bold flex items-center gap-2 bg-primary-100 dark:bg-primary-500/10 px-4 py-2 rounded-xl border border-primary-200 dark:border-primary-500/20 shadow-sm">
                                        <Clock className="w-4 h-4 animate-pulse-slow" />
                                        {timeRemaining}
                                    </span>
                                    <span className="font-black text-slate-700 dark:text-slate-300 flex items-center justify-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-3 overflow-hidden shadow-inner flex p-0.5">
                                    <div
                                        className="bg-gradient-to-r from-primary-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-linear relative overflow-hidden shadow-sm shadow-primary-500/50"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 max-w-max shadow-sm relative z-10">
                                <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
                                Expected Duration: <span className="text-slate-800 dark:text-slate-200 ml-1.5 font-bold">{job.dueDate}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
