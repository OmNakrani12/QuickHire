import { useState, useEffect } from "react";
import axios from "axios";
import {
    Briefcase,
    Plus,
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    Clock,
    Pause,
    X,
    Edit2,
    Trash2,
    MapPin,
    BarChart2,
    FolderOpen,
} from "lucide-react";
import Loading from "@/Loading";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const STATUS_TABS = [
    { key: "all", label: "All Projects", icon: FolderOpen },
    { key: "active", label: "Active", icon: TrendingUp },
    { key: "paused", label: "Paused", icon: Pause },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
];

const EMPTY_FORM = {
    name: "", description: "", location: "", status: "active",
    workers: "", progress: 0, budget: "", spent: "", deadline: "", skills: "",
};

/* ─── helpers ────────────────────────────────────────────── */
function toSkillArray(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return String(raw).split(",").map((s) => s.trim()).filter(Boolean);
}

function toSkillString(arr) {
    if (!arr) return "";
    if (Array.isArray(arr)) return arr.join(", ");
    return String(arr);
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [saving, setSaving] = useState(false);

    const contractorId = localStorage.getItem("cid");

    /* ── fetch ────────────────────────────────────────────── */
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const url = contractorId
                ? `${BASE_URL}/api/projects/contractor/${contractorId}`
                : `${BASE_URL}/api/projects`;
            const res = await axios.get(url);
            setProjects(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    /* ── derived ──────────────────────────────────────────── */
    const displayed = activeTab === "all"
        ? projects
        : projects.filter((p) => p.status === activeTab);

    const stats = {
        total: projects.length,
        active: projects.filter((p) => p.status === "active").length,
        paused: projects.filter((p) => p.status === "paused").length,
        completed: projects.filter((p) => p.status === "completed").length,
        totalBudget: projects.reduce((s, p) => s + Number(p.budget || 0), 0),
        totalSpent: projects.reduce((s, p) => s + Number(p.spent || 0), 0),
    };

    /* ── modal helpers ────────────────────────────────────── */
    const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (p) => {
        setEditing(p);
        setForm({ ...p, skills: toSkillString(p.skills), workers: p.workers ?? "", budget: p.budget ?? "", spent: p.spent ?? "" });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            workers: Number(form.workers) || 0,
            progress: Number(form.progress) || 0,
            budget: Number(form.budget) || 0,
            spent: Number(form.spent) || 0,
            skills: form.skills,           // send as comma-string; entity stores it that way
            contractor: contractorId ? { id: Number(contractorId) } : null,
        };
        try {
            if (editingProject) {
                await axios.put(`${BASE_URL}/api/projects/${editingProject.id}`, payload);
            } else {
                await axios.post(`${BASE_URL}/api/projects`, payload);
            }
            await fetchProjects();
            setShowModal(false);
        } catch (err) {
            console.error("Error saving project:", err);
            alert("Failed to save project. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Failed to delete project.");
        } finally {
            setDeleteConfirm(null);
        }
    };

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    if (loading) return <Loading text="Loading projects..." />;

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── PAGE HEADER ──────────────────────────────── */}
            <div className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">Projects</h2>
                        <p className="text-slate-500 mt-1">Manage all your construction projects</p>
                    </div>
                    <button onClick={openCreate} className="btn btn-secondary flex items-center gap-2 py-2.5 px-5 text-sm">
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            </div>

            {/* ── STATS STRIP ──────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<FolderOpen className="w-5 h-5 text-primary-500" />} label="Total" value={stats.total} />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} label="Active" value={stats.active} />
                <StatCard icon={<Pause className="w-5 h-5 text-yellow-500" />} label="Paused" value={stats.paused} />
                <StatCard icon={<CheckCircle2 className="w-5 h-5 text-secondary-600" />} label="Completed" value={stats.completed} />
            </div>

            {/* Overall budget bar */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-primary-500" />
                    <span className="font-semibold text-slate-700">Overall Budget</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                    <span className="text-sm text-slate-500">
                        ${stats.totalSpent.toLocaleString()} spent of ${stats.totalBudget.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                        {stats.totalBudget > 0 ? Math.round((stats.totalSpent / stats.totalBudget) * 100) : 0}%
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 transition-all duration-700"
                        style={{ width: `${stats.totalBudget > 0 ? Math.min(100, Math.round((stats.totalSpent / stats.totalBudget) * 100)) : 0}%` }}
                    />
                </div>
            </div>

            {/* ── STATUS TABS ──────────────────────────────── */}
            <div className="flex gap-2 flex-wrap">
                {STATUS_TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key
                                ? "bg-secondary-600 text-white shadow-md"
                                : "bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                            {key === "all" ? projects.length : projects.filter((p) => p.status === key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── PROJECT CARDS ─────────────────────────────── */}
            {displayed.length === 0 ? (
                <div className="card p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No projects found</p>
                    <p className="text-slate-400 text-sm mt-1">Click "New Project" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {displayed.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={() => openEdit(project)}
                            onDelete={() => setDeleteConfirm(project.id)}
                        />
                    ))}
                </div>
            )}

            {/* ── CREATE / EDIT MODAL ───────────────────────── */}
            {showModal && (
                <ProjectModal
                    form={form}
                    onChange={onChange}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    isEdit={!!editingProject}
                    saving={saving}
                />
            )}

            {/* ── DELETE CONFIRM ────────────────────────────── */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm text-center">
                        <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Project?</h3>
                        <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)}
                                className="btn btn-outline flex-1 py-2.5 text-sm">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2.5 text-sm rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Premium ProjectCard ────────────────────────────────────────── */
function ProjectCard({ project, onEdit, onDelete }) {
    const statusMeta = {
        active: { label: "Active", dot: "bg-green-500", box: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20" },
        paused: { label: "Paused", dot: "bg-yellow-500", box: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20" },
        completed: { label: "Completed", dot: "bg-secondary-500", box: "bg-secondary-50 dark:bg-secondary-500/10 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-500/20" },
    };
    const { label, dot, box } = statusMeta[project.status] || statusMeta.active;
    const skills = toSkillArray(project.skills);
    const budgetPct = project.budget > 0 ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0;
    const deadlineStr = project.deadline
        ? new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "No Deadline";

    return (
        <div className="group relative bg-white dark:bg-slate-900/80 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-primary-500/30 dark:hover:border-primary-500/50 transition-all duration-300 flex flex-col backdrop-blur-sm">
            
            {/* Top Accent Gradient Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.status === 'active' ? 'from-green-400 to-emerald-600' : project.status === 'completed' ? 'from-secondary-400 to-indigo-600' : 'from-yellow-400 to-orange-500'}`} />

            <div className="p-6 flex flex-col h-full gap-5">
                
                {/* Header Section */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${box}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse-slow`}></span>
                                {label}
                            </span>
                            {project.location && (
                                <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-medium truncate max-w-[200px]">
                                    <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{project.location}</span>
                                </span>
                            )}
                        </div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-xl truncate tracking-tight">
                            {project.name}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                {project.description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {project.description}
                    </p>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 group-hover:border-primary-100 dark:group-hover:border-primary-800/30">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workers</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{project.workers || 0} Assigned</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 group-hover:border-indigo-100 dark:group-hover:border-indigo-800/30">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{deadlineStr}</p>
                        </div>
                    </div>
                </div>

                {/* Progress & Budget Tracking */}
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Completion</span>
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{project.progress ?? 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${project.progress ?? 0}%` }} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Budget Usage</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span className={budgetPct >= 90 ? "text-red-500 dark:text-red-400" : ""}>${Number(project.spent || 0).toLocaleString()}</span> / ${Number(project.budget || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${budgetPct >= 90 ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`} style={{ width: `${budgetPct}%` }} />
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Footer: Skills & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        {skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-md truncate max-w-[80px]">
                                {s}
                            </span>
                        ))}
                        {skills.length > 3 && (
                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold rounded-md">
                                +{skills.length - 3}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={onEdit} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 rounded-xl transition-all" title="Edit Project">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-xl transition-all" title="Delete Project">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

/* ─── ProjectModal ───────────────────────────────────────── */
function ProjectModal({ form, onChange, onSave, onClose, isEdit, saving }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-primary-600 to-secondary-600">
                    <div className="flex items-center gap-2 text-white">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-bold text-lg">{isEdit ? "Edit Project" : "New Project"}</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* form */}
                <form onSubmit={onSave} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Project Name *</label>
                            <input name="name" value={form.name} onChange={onChange} required
                                placeholder="e.g. Downtown Office Complex" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Location</label>
                            <input name="location" value={form.location} onChange={onChange}
                                placeholder="City, State" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</label>
                            <select name="status" value={form.status} onChange={onChange} className="input">
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Workers</label>
                            <input type="number" min="0" name="workers" value={form.workers} onChange={onChange}
                                placeholder="0" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Deadline *</label>
                            <input type="date" name="deadline" value={form.deadline ?? ""} onChange={onChange} required className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Budget ($) *</label>
                            <input type="number" min="0" name="budget" value={form.budget} onChange={onChange} required
                                placeholder="50000" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Spent ($)</label>
                            <input type="number" min="0" name="spent" value={form.spent} onChange={onChange}
                                placeholder="0" className="input" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Progress: {form.progress}%
                            </label>
                            <input type="range" min="0" max="100" name="progress" value={form.progress} onChange={onChange}
                                className="w-full accent-secondary-600" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Skills (comma-separated)</label>
                            <input name="skills" value={form.skills} onChange={onChange}
                                placeholder="e.g. Construction, Plumbing, Electrical" className="input" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={onChange} rows={3}
                                placeholder="Brief project description..." className="input resize-none" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="btn btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-outline flex-1 py-2.5 text-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Tiny helpers ───────────────────────────────────────── */
function StatCard({ icon, label, value }) {
    return (
        <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    );
}

function MetaBox({ icon, value, label }) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl py-2.5 px-2 text-center border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-center gap-1 mb-0.5">{icon}</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </div>
    );
}
