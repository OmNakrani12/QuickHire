import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/contractor/Sidebar';
import {
    User, Mail, Phone, MapPin, Briefcase, Camera, Save, X, Building2, Calendar
} from 'lucide-react';

export default function ContractorEditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', location: '', bio: '', companyName: '', companyType: 'General Contractor', yearsInBusiness: '', licenseNumber: '', insuranceProvider: '', website: '',
    });

    const fetchProfile = async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/api/contractors/profile/email/${email}`);
            if (!response.ok) return;
            const data = await response.json();
            setUser(data);
            if (data.profilePhoto) setPhotoPreview(data.profilePhoto);

            setFormData({
                name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', bio: data.bio || '', companyName: data.companyName || '', companyType: data.companyType || 'General Contractor', yearsInBusiness: data.yearsInBusiness ?? '', licenseNumber: data.licenseNumber || '', insuranceProvider: data.insuranceProvider || '', website: data.website || '',
            });
        } catch (error) {
            console.error("Error fetching contractor profile:", error);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.profilePhoto) setPhotoPreview(parsedUser.profilePhoto);
            fetchProfile(parsedUser.email);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "yearsInBusiness" ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch(`${BASE_URL}/api/contractors/profile/${formData.email}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, yearsInBusiness: formData.yearsInBusiness === '' ? null : formData.yearsInBusiness, profilePhoto: photoPreview }),
            });
            const updatedUser = { ...user, ...formData, profilePhoto: photoPreview || user.profilePhoto };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsSaving(false);
            navigate('/contractor/dashboard');
        } catch (error) {
            console.error('Error saving contractor profile:', error);
            setIsSaving(false);
            alert('Failed to save profile');
        }
    };

    const handleCancel = () => navigate('/contractor/dashboard');

    const handleSidebarNav = (tab) => {
        localStorage.setItem('dashboard_tab', tab);
        navigate('/contractor/dashboard');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
            <Sidebar activeTab="profile" setActiveTab={handleSidebarNav} handleLogout={() => { localStorage.removeItem('user'); navigate('/'); }} />
            
            <main className="ml-72 flex-1 overflow-y-auto pb-16">
                {/* Cover Banner */}
                <div className="h-64 w-full bg-gradient-to-r from-secondary-600 via-blue-600 to-cyan-700 relative shadow-sm">
                    {/* Floating Save Actions */}
                    <div className="absolute top-6 right-8 flex gap-4 animate-fade-in">
                        <button onClick={handleCancel} className="btn bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="btn bg-white text-secondary-700 hover:bg-slate-50 shadow-lg flex items-center">
                            {isSaving ? <div className="w-5 h-5 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
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
                                        <div className="w-40 h-40 bg-gradient-to-br from-secondary-600 to-blue-700 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-[6px] border-white dark:border-slate-800">
                                            {formData.name.charAt(0) || 'C'}
                                        </div>
                                  )}
                                  <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                  <button type="button" onClick={() => document.getElementById('photo-upload').click()} className="absolute bottom-2 right-2 p-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 border-4 border-white dark:border-slate-800">
                                      <Camera className="w-5 h-5" />
                                  </button>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 text-center">{formData.companyName || formData.name || 'Your Company'}</h2>
                              <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 text-center">{formData.location || 'Company Location'}</p>


                         </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="flex-1 space-y-6">
                         
                         {/* Personal Information */}
                         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 animate-fade-in delay-75">
                             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                 <div className="p-2.5 bg-secondary-50 dark:bg-secondary-900/30 rounded-xl">
                                     <User className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Admin Information</h3>
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
                                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" className="input w-full resize-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="Tell workers about your company and what makes you a great employer..." />
                                </div>
                             </div>
                         </div>

                         {/* Company Information */}
                         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 animate-fade-in delay-100">
                             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                 <div className="p-2.5 bg-secondary-50 dark:bg-secondary-900/30 rounded-xl">
                                     <Building2 className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Company Information</h3>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="ABC Construction Inc." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company Type</label>
                                    <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                                        <option value="General Contractor">General Contractor</option>
                                        <option value="Subcontractor">Subcontractor</option>
                                        <option value="Construction Company">Construction Company</option>
                                        <option value="Property Management">Property Management</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Years in Business</label>
                                    <div className="relative w-full">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleInputChange} onWheel={(e) => e.target.blur()} className="input w-full pl-11 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="15" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">License Number</label>
                                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="LIC-123456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Insurance Provider</label>
                                    <input type="text" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="ABC Insurance Co." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Website</label>
                                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="input w-full dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" placeholder="https://www.example.com" />
                                </div>
                             </div>
                         </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
