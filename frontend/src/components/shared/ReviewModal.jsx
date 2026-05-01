import React, { useState } from 'react';
import { Star, X, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReviewModal({ isOpen, onClose, revieweeId, reviewerId, jobId, onSuccess, revieweeName }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = {
                reviewer: { id: reviewerId },
                reviewee: { id: revieweeId },
                jobId: jobId,
                rating: rating,
                comment: comment,
                type: user.role === 'worker' ? 'WORKER_TO_CONTRACTOR' : 'CONTRACTOR_TO_WORKER'
            };
            console.log('Submitting review with payload:', payload);
            await axios.post(`${BASE_URL}/api/reviews`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leave Feedback</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">How was your experience with <span className="font-bold text-primary-600">{revieweeName}</span>?</p>
                        
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${
                                            star <= (hover || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300 dark:text-slate-700'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary-500" />
                            Your Comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input min-h-[120px] py-3 text-base resize-none"
                            placeholder="Tell us more about your experience..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full py-4 btn btn-primary flex items-center justify-center gap-2 text-lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Feedback'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
