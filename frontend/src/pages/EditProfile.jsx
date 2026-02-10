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
    Plus,
    Trash2,
    DollarSign,
    Clock,
    FileText,
} from 'lucide-react';

export default function EditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        hourlyRate: '',
        experience: '',
        availability: 'full-time',
        skills: [],
        certifications: [],
    });

    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Initialize photo preview if user has a saved photo
            if (parsedUser.profilePhoto) {
                setPhotoPreview(parsedUser.profilePhoto);
            }

            // Initialize form with existing user data
            setFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                location: parsedUser.location || '',
                bio: parsedUser.bio || '',
                hourlyRate: parsedUser.hourlyRate || '',
                experience: parsedUser.experience || '',
                availability: parsedUser.availability || 'full-time',
                skills: parsedUser.skills || ['Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting'],
                certifications: parsedUser.certifications || ['OSHA Safety Certified', 'Licensed Electrician'],
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Debug: Monitor photoPreview changes
    useEffect(() => {
        console.log('📸 photoPreview state changed:', photoPreview ? 'Image loaded' : 'No image');
        if (photoPreview) {
            console.log('Preview data length:', photoPreview.length);
        }
    }, [photoPreview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        console.log('=== Photo Upload Started ===');
        console.log('File selected:', file);
        console.log('File name:', file?.name);
        console.log('File type:', file?.type);
        console.log('File size:', file?.size);

        if (file && file.type.startsWith('image/')) {
            setProfilePhoto(file);
            console.log('✓ Valid image file, creating preview...');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('✓ FileReader completed');
                console.log('Result length:', reader.result?.length);
                console.log('Result preview:', reader.result?.substring(0, 50) + '...');
                setPhotoPreview(reader.result);
                console.log('✓ Photo preview state updated');
            };
            reader.onerror = (error) => {
                console.error('✗ Error reading file:', error);
            };
            reader.onprogress = (e) => {
                console.log('Reading progress:', Math.round((e.loaded / e.total) * 100) + '%');
            };
            reader.readAsDataURL(file);
        } else {
            console.log('✗ Invalid file type or no file selected');
            if (file) {
                console.log('File type was:', file.type);
            }
        }
        console.log('=== Photo Upload Handler Complete ===');
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleAddCertification = () => {
        if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
            setFormData(prev => ({
                ...prev,
                certifications: [...prev.certifications, newCertification.trim()]
            }));
            setNewCertification('');
        }
    };

    const handleRemoveCertification = (certToRemove) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(cert => cert !== certToRemove)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            const updatedUser = {
                ...user,
                ...formData,
                profilePhoto: photoPreview || user.profilePhoto
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsSaving(false);
            navigate('/worker/dashboard');
        }, 1000);
    };

    const handleCancel = () => {
        navigate('/worker/dashboard');
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
                            <p className="text-slate-600">Update your professional information</p>
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
                                <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                    {formData.name.charAt(0)}
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
                                <Camera className="w-5 h-5 text-primary-600" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Profile Photo</h3>
                            <p className="text-slate-600 mb-3">Upload a professional photo to help contractors recognize you</p>
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
                        <User className="w-6 h-6 mr-2 text-primary-600" />
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
                                placeholder="Tell contractors about your experience and what makes you a great worker..."
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="card p-8 mb-6 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
                        Professional Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Hourly Rate
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleInputChange}
                                    className="input pl-11"
                                    placeholder="25"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Years of Experience
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="input pl-11"
                                    placeholder="5"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Availability
                            </label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                className="input"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="weekends">Weekends Only</option>
                                <option value="flexible">Flexible</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="card p-8 mb-6 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-primary-600" />
                        Skills
                    </h2>
                    <div className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                className="input flex-1"
                                placeholder="Add a skill (e.g., Welding, Carpentry)"
                            />
                            <button
                                onClick={handleAddSkill}
                                className="btn btn-primary"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="badge badge-info flex items-center gap-2 px-4 py-2 text-base"
                            >
                                {skill}
                                <button
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications Section */}
                <div className="card p-8 mb-6 animate-slide-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-primary-600" />
                        Certifications
                    </h2>
                    <div className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCertification}
                                onChange={(e) => setNewCertification(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCertification()}
                                className="input flex-1"
                                placeholder="Add a certification (e.g., OSHA Safety Certified)"
                            />
                            <button
                                onClick={handleAddCertification}
                                className="btn btn-primary"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {formData.certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <Award className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="font-medium">{cert}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveCertification(cert)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        ))}
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
