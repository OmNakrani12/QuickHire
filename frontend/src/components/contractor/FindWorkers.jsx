import { useState, useEffect } from "react";
import axios from "axios";
import {
    Search,
    Filter,
    Star,
    MapPin,
    Briefcase,
    Award,
    MessageSquare,
    ChevronDown,
    X,
    Users,
    Eye,
} from "lucide-react";
import Loading from "@/Loading";
import WorkerProfileModal from "./WorkerProfileModal";

const SKILL_OPTIONS = [
    "Construction",
    "Carpentry",
    "Plumbing",
    "Electrical",
    "Welding",
    "Painting",
    "Heavy Equipment",
    "Flooring",
    "Masonry",
    "HVAC",
];

export default function FindWorkers() {
    const [workers, setWorkers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [minRating, setMinRating] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchWorkers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, selectedSkill, minRating, workers]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/workers`);
            setWorkers(res.data);
        } catch (err) {
            console.error("Failed to fetch workers:", err);
        } finally {
            setLoading(false);
        }
    };

    const parseSkills = (skillsData) => {
        if (!skillsData) return [];
        if (Array.isArray(skillsData)) return skillsData;
        if (typeof skillsData === 'string') {
            try {
                const parsed = JSON.parse(skillsData);
                return Array.isArray(parsed) ? parsed : [skillsData];
            } catch {
                return skillsData.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        return [];
    };

    const applyFilters = () => {
        // Ensure workers is iterable before spreading
        if (!Array.isArray(workers)) {
            setFiltered([]);
            return;
        }

        let result = [...workers];

        if (search.trim()) {
            const q = search.toLowerCase();
            const safeIncludes = (val, query) => (val ? String(val).toLowerCase().includes(query) : false);

            result = result.filter((w) => {
                const skillsArr = parseSkills(w?.skills);
                const nameMatch = safeIncludes(w?.user?.name, q);
                const locMatch = safeIncludes(w?.user?.location, q);
                const availMatch = safeIncludes(w?.availability, q);
                const skillMatch = skillsArr.some((s) => safeIncludes(typeof s === 'object' ? (s.name || s.title || '') : s, q));

                return nameMatch || locMatch || availMatch || skillMatch;
            });
        }

        if (selectedSkill) {
            const q = selectedSkill.toLowerCase();
            const safeIncludes = (val, query) => (val ? String(val).toLowerCase().includes(query) : false);

            result = result.filter((w) => {
                const skillsArr = parseSkills(w?.skills);
                return skillsArr.some((s) => safeIncludes(typeof s === 'object' ? (s.name || s.title || '') : s, q));
            });
        }

        if (minRating) {
            result = result.filter((w) => (w?.rating ?? 0) >= Number(minRating));
        }

        setFiltered(result);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedSkill("");
        setMinRating("");
    };

    const hasFilters = search || selectedSkill || minRating;

    if (loading) return <Loading text="Finding workers..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">Find Workers</h2>
                        <p className="text-slate-500 mt-1">
                            Browse and connect with skilled workers for your projects
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 bg-secondary-50 text-secondary-700 px-4 py-2 rounded-full text-sm font-medium border border-secondary-200">
                            <Users className="w-4 h-4" />
                            {filtered.length} Workers Found
                        </span>
                        <button
                            onClick={() => setShowFilters((p) => !p)}
                            className={`btn flex items-center gap-2 py-2 px-4 text-sm ${showFilters
                                ? "btn-secondary"
                                : "border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, skill, or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-12 pr-4"
                    />
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Skill
                            </label>
                            <select
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                                className="input"
                            >
                                <option value="">All Skills</option>
                                {SKILL_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Minimum Rating
                            </label>
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                                className="input"
                            >
                                <option value="">Any Rating</option>
                                <option value="3">3+ Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="4.5">4.5+ Stars</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-outline flex items-center gap-2 w-full justify-center py-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Worker Cards */}
            {filtered.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-1">
                        No Workers Found
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((worker) => (
                        <WorkerCard key={worker.id} worker={worker} onViewProfile={setSelectedWorker} />
                    ))}
                </div>
            )}

            {/* Worker Profile Modal */}
            {selectedWorker && (
                <WorkerProfileModal
                    worker={selectedWorker}
                    onClose={() => setSelectedWorker(null)}
                    onHire={() => setSelectedWorker(null)}
                    onMessage={() => setSelectedWorker(null)}
                />
            )}
        </div>
    );
}

function WorkerCard({ worker, onViewProfile }) {
    if (!worker) return null;

    const name = worker.user?.name || "Worker";
    const initials = name ? String(name).charAt(0).toUpperCase() : "W";

    // Parse skills properly, whether array, JSON string, or comma-separated
    let skills = [];
    if (Array.isArray(worker.skills)) {
        skills = worker.skills;
    } else if (typeof worker.skills === 'string') {
        try {
            const parsed = JSON.parse(worker.skills);
            skills = Array.isArray(parsed) ? parsed : [worker.skills];
        } catch {
            skills = worker.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    const rating = worker.rating ?? null;
    const experience = worker.experience ?? 0;
    // Display user's location if available, otherwise fallback to worker availability
    const displayLocation = worker.user?.location || worker.availability || "Location not set";

    return (
        <div className="card p-6 flex flex-col gap-4 hover:shadow-2xl transition-all duration-300">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
                {worker.profilePhoto ? (
                    <img
                        src={worker.profilePhoto}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover shadow"
                    />
                ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
                        {initials}
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {displayLocation}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-sm">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {rating !== null ? Number(rating).toFixed(1) : "N/A"}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Rating</div>
                </div>
                <div className="bg-slate-50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 font-bold text-sm text-secondary-700">
                        <Briefcase className="w-4 h-4" />
                        {experience}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Jobs Done</div>
                </div>
                <div className="bg-slate-50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 font-bold text-sm text-primary-700">
                        <Award className="w-4 h-4" />
                        {skills.length}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Skills</div>
                </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 4).map((skill, i) => {
                        const skillName = typeof skill === 'object' ? (skill.name || skill.title || JSON.stringify(skill)) : skill;
                        return (
                            <span
                                key={i}
                                className="bg-secondary-50 text-secondary-700 border border-secondary-200 text-xs px-2.5 py-1 rounded-full"
                            >
                                {String(skillName)}
                            </span>
                        );
                    })}
                    {skills.length > 4 && (
                        <span className="text-xs text-slate-400 px-2.5 py-1">
                            +{skills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                <button
                    onClick={() => onViewProfile && onViewProfile(worker)}
                    className="btn btn-secondary flex-1 py-2 text-sm flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View Profile
                </button>
                <button className="btn btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                </button>
            </div>
        </div>
    );
}
