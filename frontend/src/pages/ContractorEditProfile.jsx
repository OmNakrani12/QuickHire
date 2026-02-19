import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Award,
    Camera,
    Save,
    X,
    Building2,
    Calendar,
    Users,
} from 'lucide-react';

export default function ContractorEditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        companyName: '',
        companyType: 'General Contractor',
        yearsInBusiness: '',
        licenseNumber: '',
        insuranceProvider: '',
        website: '',
    });

    // =========================
    // FETCH CONTRACTOR PROFILE
    // =========================
    const fetchProfile = async (email) => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/contractors/profile/email/${email}`
            );

            if (!response.ok) {
                console.error("HTTP error:", response.status);
                return;
            }

            const data = await response.json();
            setUser(data);

            if (data.profilePhoto) {
                setPhotoPreview(data.profilePhoto);
            }

            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                bio: data.bio || '',
                companyName: data.companyName || '',
                companyType: data.companyType || 'General Contractor',
                yearsInBusiness: data.yearsInBusiness ?? '',
                licenseNumber: data.licenseNumber || '',
                insuranceProvider: data.insuranceProvider || '',
                website: data.website || '',
            });

        } catch (error) {
            console.error("Error fetching contractor profile:", error);
        }
    };

    // =========================
    // LOAD USER
    // =========================
    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            if (parsedUser.profilePhoto) {
                setPhotoPreview(parsedUser.profilePhoto);
            }

            fetchProfile(parsedUser.email);

        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        console.log('📸 photoPreview state changed:', photoPreview ? 'Image loaded' : 'No image');
    }, [photoPreview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "yearsInBusiness"
                ? (value === '' ? '' : Number(value))
                : value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // =========================
    // SAVE CONTRACTOR PROFILE
    // =========================
    const handleSave = async () => {
        setIsSaving(true);

        try {
            await fetch(
                `${BASE_URL}/api/contractors/profile/${formData.email}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        yearsInBusiness:
                            formData.yearsInBusiness === ''
                                ? null
                                : formData.yearsInBusiness,
                        profilePhoto: photoPreview,
                    }),
                }
            );

            const updatedUser = {
                ...user,
                ...formData,
                profilePhoto: photoPreview || user.profilePhoto
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsSaving(false);
            navigate('/contractor/dashboard');

        } catch (error) {
            console.error('Error saving contractor profile:', error);
            setIsSaving(false);
            alert('Failed to save profile');
        }
    };

    const handleCancel = () => {
        navigate('/contractor/dashboard');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-slide-down">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">Edit Profile</h1>
                            <p className="text-slate-600">Update your company information</p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <X className="w-6 h-6 text-slate-700" />
                        </button>
                    </div>
                </div>

                {/* Profile Photo Section */}
                <div className="card p-8 mb-6 animate-scale-in">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                    {formData.name.charAt(0) || 'C'}
                                </div>
                            )}
                            <input
                                type="file"
                                id="photo-upload"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('photo-upload').click()}
                                className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-4 border-white"
                            >
                                <Camera className="w-5 h-5 text-secondary-600" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Company Logo</h3>
                            <p className="text-slate-600 mb-3">Upload your company logo or profile photo</p>
                            <button
                                type="button"
                                onClick={() => document.getElementById('photo-upload').click()}
                                className="btn btn-outline text-sm"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Change Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="card p-8 mb-6 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <User className="w-6 h-6 mr-2 text-secondary-600" />
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input pl-11"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="input pl-11"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="input pl-11"
                                    placeholder="New York, NY"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="4"
                                className="input resize-none"
                                placeholder="Tell workers about your company and what makes you a great employer..."
                            />
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="card p-8 mb-6 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Building2 className="w-6 h-6 mr-2 text-secondary-600" />
                        Company Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="ABC Construction Inc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Company Type
                            </label>
                            <select
                                name="companyType"
                                value={formData.companyType}
                                onChange={handleInputChange}
                                className="input"
                            >
                                <option value="General Contractor">General Contractor</option>
                                <option value="Subcontractor">Subcontractor</option>
                                <option value="Construction Company">Construction Company</option>
                                <option value="Property Management">Property Management</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Years in Business
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="yearsInBusiness"
                                    value={formData.yearsInBusiness}
                                    onChange={handleInputChange}
                                    onWheel={(e) => e.target.blur()}
                                    className="input pl-11"
                                    placeholder="15"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                License Number
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="LIC-123456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Insurance Provider
                            </label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                value={formData.insuranceProvider}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="ABC Insurance Co."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end animate-slide-up">
                    <button
                        onClick={handleCancel}
                        className="btn btn-outline"
                    >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
