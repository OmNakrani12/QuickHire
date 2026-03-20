import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/worker/Sidebar';
import {
    User, Mail, Phone, MapPin, Briefcase, Award, Camera, Save, X, Plus, Trash2, DollarSign, Clock, FileText, Menu
} from 'lucide-react';

export default function EditProfile() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', location: '', bio: '', hourlyRate: '', experience: '', availability: 'full-time', skills: [], certifications: [],
    });

    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState('');

    const fetchProfile = async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/api/workers/profile/email/${email}`);
            if (!response.ok) return;
            const text = await response.text();
            if (!text) return;
            const data = JSON.parse(text);

            setUser(data);
            if (data.profilePhoto) setPhotoPreview(data.profilePhoto);

            setFormData(prev => ({
                ...prev,
                name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', bio: data.bio || '', hourlyRate: data.hourlyRate ?? '', experience: data.experience ?? '', availability: data.availability || 'full-time', skills: data.skills || prev.skills, certifications: data.certifications || prev.certifications,
            }));
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.profilePhoto) setPhotoPreview(parsedUser.profilePhoto);

            setFormData({
                name: parsedUser.name || '', email: parsedUser.email || '', phone: parsedUser.phone || '', location: parsedUser.location || '', bio: parsedUser.bio || '', hourlyRate: parsedUser.hourlyRate ?? '', experience: parsedUser.experience ?? '', availability: parsedUser.availability || 'full-time', skills: parsedUser.skills || ['Construction', 'Plumbing', 'Electrical'], certifications: parsedUser.certifications || ['OSHA Safety Certified'],
            });
            fetchProfile(parsedUser.email);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "experience" || name === "hourlyRate" ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    };

    const handleAddCertification = () => {
        if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
            setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCertification.trim()] }));
            setNewCertification('');
        }
    };

    const handleRemoveCertification = (certToRemove) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== certToRemove) }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await fetch(`${BASE_URL}/api/workers/profile/${formData.email}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, hourlyRate: formData.hourlyRate === '' ? null : formData.hourlyRate, experience: formData.experience === '' ? null : formData.experience, profilePhoto: photoPreview }),
        });
        setTimeout(() => {
            const updatedUser = { ...user, ...formData, profilePhoto: photoPreview || user.profilePhoto };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsSaving(false);
            navigate('/worker/dashboard');
        }, 1000);
    };

    const handleCancel = () => navigate('/worker/dashboard');

    const handleSidebarNav = (tab) => {
        localStorage.setItem('dashboard_tab', tab);
        navigate('/worker/dashboard');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
            <Sidebar activeTab="profile" setActiveTab={handleSidebarNav} handleLogout={() => { localStorage.removeItem('user'); navigate('/'); }} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            <main className="lg:ml-72 flex-1 min-w-0 overflow-x-hidden overflow-y-auto pb-16">
                {/* Mobile Header */}
                <div className="lg:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-bold text-lg dark:text-white">QuickHire</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Cover Banner */}
                <div className="h-64 w-full bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 relative shadow-sm">
                    {/* Floating Save Actions */}
                    <div className="absolute top-6 right-8 flex gap-4 animate-fade-in">
                        <button onClick={handleCancel} className="btn bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="btn bg-white text-primary-700 hover:bg-slate-50 shadow-lg flex items-center">
                            {isSaving ? <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-8 -mt-24 flex flex-col xl:flex-row gap-8 relative z-10">

                    {/* Left Column: Avatar & Summary */}
                    <div className="w-full xl:w-[350px] shrink-0">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 flex flex-col items-center animate-fade-in transition-all">
                            <div className="relative -mt-20 mb-4 group">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="w-40 h-40 rounded-full object-cover shadow-2xl border-[6px] border-white dark:border-slate-800 bg-white" />
                                ) : (
                                    <div className="w-40 h-40 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-[6px] border-white dark:border-slate-800">
                                        {formData.name.charAt(0)}
                                    </div>
                                )}
                                <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                <button type="button" onClick={() => document.getElementById('photo-upload').click()} className="absolute bottom-2 right-2 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 border-4 border-white dark:border-slate-800">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formData.name || 'Your Name'}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 text-center">{formData.location || 'Your Location'}</p>


                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="flex-1 space-y-6">

                        {/* Personal Information */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 animate-fade-in delay-75">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                    <div className="relative w-full">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                                    <div className="relative w-full">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                    <div className="relative w-full">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="New York, NY" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 w-full">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" className="input w-full resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="Tell contractors about your experience and what makes you a great worker..." />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 animate-fade-in delay-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                                    <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Professional Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hourly Rate</label>
                                    <div className="relative w-full">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} onWheel={(e) => e.target.blur()} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="25" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Years of Experience</label>
                                    <div className="relative w-full">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} onWheel={(e) => e.target.blur()} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="5" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 w-full">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Availability</label>
                                    <select name="availability" value={formData.availability} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="weekends">Weekends Only</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Skills & Certifications Side-by-Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-150">
                            {/* Skills */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 flex flex-col w-full">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                    <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                                        <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Skills</h3>
                                </div>
                                <div className="flex gap-2 mb-4 w-full">
                                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} className="input flex-1 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="Add a skill" />
                                    <button onClick={handleAddSkill} className="btn btn-primary px-4"><Plus className="w-5 h-5" /></button>
                                </div>
                                <div className="flex flex-wrap gap-2 flex-1 items-start w-full">
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg flex items-center gap-2 border border-primary-100 dark:border-primary-800/50">
                                            {skill}
                                            <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 flex flex-col w-full">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                    <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Certifications</h3>
                                </div>
                                <div className="flex gap-2 mb-4 w-full">
                                    <input type="text" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()} className="input flex-1 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="Add certification" />
                                    <button onClick={handleAddCertification} className="btn btn-primary px-4"><Plus className="w-5 h-5" /></button>
                                </div>
                                <div className="space-y-2 flex-1 w-full">
                                    {formData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <span className="text-sm font-medium dark:text-slate-200 text-slate-700 truncate">{cert}</span>
                                            <button onClick={() => handleRemoveCertification(cert)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
