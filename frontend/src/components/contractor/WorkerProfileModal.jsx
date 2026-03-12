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
    const certifications = Array.isArray(worker.certifications) ? worker.certifications : [];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-modal dark:bg-slate-900 border dark:border-slate-800">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Worker Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                    </button>
                </div>

                <div className="grid md:grid-cols-3">

                    {/* LEFT PROFILE PANEL */}
                    <div className="bg-secondary-50 dark:bg-slate-800/50 p-6 border-r dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg">
                            {name.charAt(0)}
                        </div>

                        <h3 className="mt-4 text-xl font-bold dark:text-white">{name}</h3>
                        <p className="text-slate-500 flex items-center gap-1 mt-1 dark:text-slate-400">
                            <MapPin className="w-4 h-4" />
                            {location}
                        </p>

                        <div className="flex items-center gap-1 mt-3 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="font-semibold">{rating}</span>
                        </div>

                        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
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
                                className="w-full border border-secondary-300 dark:border-slate-600 dark:text-slate-300 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
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
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">
                                    Contact Information
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {email && (
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                            <Mail className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                                            <span className="text-sm dark:text-slate-300">{email}</span>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                            <Phone className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                                            <span className="text-sm dark:text-slate-300">{phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">
                                    Skills & Expertise
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-secondary-50 dark:bg-slate-800 text-secondary-600 dark:text-secondary-400 text-sm rounded-full font-medium"
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
                        {worker.user?.bio && (
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                                    About Worker
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {worker.user.bio}
                                </p>
                            </div>
                        )}
                        {/* Certifications */}
                        {certifications.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">
                                    Certifications & Licenses
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {certifications.map((cert, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-secondary-50 dark:bg-slate-800 text-secondary-600 dark:text-secondary-400 text-sm rounded-full font-medium"
                                        >
                                            {typeof cert === "object"
                                                ? cert.name
                                                : cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}