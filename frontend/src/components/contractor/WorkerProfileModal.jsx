import { useEffect } from "react";
import {
    X,
    Star,
    MapPin,
    Briefcase,
    MessageSquare,
    Mail,
    Phone,
    Award
} from "lucide-react";

export default function WorkerProfileModal({ worker, onClose, onHire, onMessage }) {
    if (!worker) return null;

    const name = worker.user?.name || "Worker";
    const location = worker.user?.location || "Location not set";
    const email = worker.user?.email;
    const phone = worker.user?.phone;
    const rating = worker.rating ?? 0;
    const experience = worker.experience ?? 0;
    const skills = Array.isArray(worker.skills) ? worker.skills : [];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-modal">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Worker Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-secondary-100 transition"
                    >
                        <X className="w-5 h-5 text-secondary-500" />
                    </button>
                </div>

                <div className="grid md:grid-cols-3">

                    {/* LEFT PROFILE PANEL */}
                    <div className="bg-secondary-50 p-6 border-r flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg">
                            {name.charAt(0)}
                        </div>

                        <h3 className="mt-4 text-xl font-bold">{name}</h3>
                        <p className="text-black-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {location}
                        </p>

                        <div className="flex items-center gap-1 mt-3 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="font-semibold">{rating}</span>
                        </div>

                        <div className="mt-4 text-sm text-black-600">
                            <Briefcase className="w-4 h-4 inline mr-1" />
                            {experience} Jobs Completed
                        </div>

                        <div className="mt-6 w-full space-y-2">
                            <button
                                onClick={() => onHire?.(worker)}
                                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-2 rounded-lg font-medium transition"
                            >
                                Hire Worker
                            </button>

                            <button
                                onClick={() => onMessage?.(worker)}
                                className="w-full border border-secondary-300 py-2 rounded-lg hover:bg-secondary-100 transition flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Message
                            </button>
                        </div>
                    </div>

                    {/* RIGHT DETAILS PANEL */}
                    <div className="col-span-2 p-6 space-y-6">

                        {/* Contact Info */}
                        {(email || phone) && (
                            <div>
                                <h4 className="font-semibold text-black-700 mb-3">
                                    Contact Information
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {email && (
                                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg">
                                            <Mail className="w-4 h-4 text-secondary-500" />
                                            <span className="text-sm">{email}</span>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg">
                                            <Phone className="w-4 h-4 text-secondary-500" />
                                            <span className="text-sm">{phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-black-700 mb-3">
                                    Skills & Expertise
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-secondary-50 text-secondary-600 text-sm rounded-full font-medium"
                                        >
                                            {typeof skill === "object"
                                                ? skill.name
                                                : skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bio */}
                        {worker.bio && (
                            <div>
                                <h4 className="font-semibold text-secondary-700 mb-2">
                                    About Worker
                                </h4>
                                <p className="text-secondary-600 text-sm leading-relaxed">
                                    {worker.bio}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}