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

    const contractorId = localStorage.getItem("uid");

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

/* ─── ProjectCard ────────────────────────────────────────── */
function ProjectCard({ project, onEdit, onDelete }) {
    const statusMeta = {
        active: { label: "Active", cls: "bg-green-100 text-green-700" },
        paused: { label: "Paused", cls: "bg-yellow-100 text-yellow-700" },
        completed: { label: "Completed", cls: "bg-secondary-100 text-secondary-700" },
    };
    const { label, cls } = statusMeta[project.status] || statusMeta.active;
    const skills = toSkillArray(project.skills);
    const budgetPct = project.budget > 0 ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0;
    const deadlineStr = project.deadline
        ? new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—";

    return (
        <div className="card p-6 flex flex-col gap-4">
            {/* header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{project.name}</h3>
                    {project.location && (
                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-400" />
                            {project.location}
                        </div>
                    )}
                </div>
                <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full ${cls}`}>{label}</span>
            </div>

            {project.description && (
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
            )}

            {/* meta */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <MetaBox icon={<Users className="w-4 h-4 text-primary-500" />} value={project.workers ?? 0} label="Workers" />
                <MetaBox icon={<Calendar className="w-4 h-4 text-secondary-500" />} value={deadlineStr} label="Deadline" />
                <MetaBox icon={<BarChart2 className="w-4 h-4 text-green-600" />} value={`${project.progress ?? 0}%`} label="Progress" />
            </div>

            {/* progress bar */}
            <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Project Progress</span><span>{project.progress ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-secondary-600 to-secondary-700 transition-all duration-500"
                        style={{ width: `${project.progress ?? 0}%` }} />
                </div>
            </div>

            {/* budget */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Budget
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                        ${Number(project.spent || 0).toLocaleString()} / ${Number(project.budget || 0).toLocaleString()}
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${budgetPct >= 90 ? "bg-red-400" : "bg-gradient-to-r from-primary-500 to-primary-600"}`}
                        style={{ width: `${budgetPct}%` }} />
                </div>
            </div>

            {/* skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, i) => (
                        <span key={i} className="bg-primary-50 text-primary-700 border border-primary-100 text-xs px-2.5 py-0.5 rounded-full">{s}</span>
                    ))}
                </div>
            )}

            {/* actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 mt-auto">
                <button onClick={onEdit}
                    className="btn btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={onDelete}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2 text-sm rounded-lg font-semibold border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
            </div>
        </div>
    );
}

/* ─── ProjectModal ───────────────────────────────────────── */
function ProjectModal({ form, onChange, onSave, onClose, isEdit, saving }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary-600 to-secondary-600">
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
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Project Name *</label>
                            <input name="name" value={form.name} onChange={onChange} required
                                placeholder="e.g. Downtown Office Complex" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                            <input name="location" value={form.location} onChange={onChange}
                                placeholder="City, State" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                            <select name="status" value={form.status} onChange={onChange} className="input">
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Workers</label>
                            <input type="number" min="0" name="workers" value={form.workers} onChange={onChange}
                                placeholder="0" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Deadline *</label>
                            <input type="date" name="deadline" value={form.deadline ?? ""} onChange={onChange} required className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Budget ($) *</label>
                            <input type="number" min="0" name="budget" value={form.budget} onChange={onChange} required
                                placeholder="50000" className="input" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Spent ($)</label>
                            <input type="number" min="0" name="spent" value={form.spent} onChange={onChange}
                                placeholder="0" className="input" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Progress: {form.progress}%
                            </label>
                            <input type="range" min="0" max="100" name="progress" value={form.progress} onChange={onChange}
                                className="w-full accent-secondary-600" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Skills (comma-separated)</label>
                            <input name="skills" value={form.skills} onChange={onChange}
                                placeholder="e.g. Construction, Plumbing, Electrical" className="input" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
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
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    );
}

function MetaBox({ icon, value, label }) {
    return (
        <div className="bg-slate-50 rounded-xl py-2.5 px-2 text-center border border-slate-100">
            <div className="flex items-center justify-center gap-1 mb-0.5">{icon}</div>
            <div className="text-sm font-bold text-slate-700">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </div>
    );
}
