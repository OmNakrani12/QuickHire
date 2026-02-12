export default function NewJobModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Job Title</label>
                        <input type="text" className="input" placeholder="e.g., Construction Worker Needed" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input type="text" className="input" placeholder="City, State" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Pay Rate</label>
                            <input type="text" className="input" placeholder="$25/hour" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Duration</label>
                        <input type="text" className="input" placeholder="e.g., 2 weeks" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea className="input min-h-32" placeholder="Describe the job requirements..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Required Skills</label>
                        <input type="text" className="input" placeholder="e.g., Construction, Heavy Lifting" />
                    </div>
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
