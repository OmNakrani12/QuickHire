import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import ReviewModal from '../shared/ReviewModal';

export default function RecentEarnings({ earnings }) {
    const [selectedJob, setSelectedJob] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("Earnings data in RecentEarnings component:", earnings);
    return (
        <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" /> Recent Earnings
            </h2>
            <div className="space-y-4">
                {earnings.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 dark:text-slate-400">No earnings yet.</p>
                    </div>
                ) : (
                    earnings.map((earning, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center shrink-0">
                                    <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">{earning.job}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{earning.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{earning.contractorName}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                <div className="text-2xl font-black text-green-600 dark:text-green-400">+${earning.amount}</div>
                                <button 
                                    onClick={() => setSelectedJob(earning)}
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all shadow-sm group"
                                    title="Leave Feedback"
                                >
                                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedJob && (
                <ReviewModal
                    isOpen={!!selectedJob}
                    onClose={() => setSelectedJob(null)}
                    revieweeId={selectedJob.contractorId}
                    reviewerId={JSON.parse(localStorage.getItem('uid'))}
                    jobId={selectedJob.jobId}
                    revieweeName={selectedJob.contractorName}
                    onSuccess={() => {
                        // Optionally refresh data or show success toast
                        alert('Review submitted successfully!');
                    }}
                />
            )}
        </div>
    );
}

