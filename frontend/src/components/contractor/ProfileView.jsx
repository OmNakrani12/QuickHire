import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Award, CheckCircle, Briefcase } from "lucide-react";

export default function ContractorProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/contractors/profile/email/${storedUser.email}`
        );

        if (!response.ok) {
          console.error("Failed to fetch contractor profile");
          return;
        }

        const data = await response.json();
        setUser(data);

        // Keep localStorage synced
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error loading contractor profile:", error);
      }
    };

    loadProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="card p-8">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="card p-8">
            <div className="flex items-start space-x-6 mb-8">

            {/* Profile Photo */}
            {user.profilePhoto ? (
                <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow-md"
                />
            ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {user.name?.charAt(0) || "C"}
                </div>
            )}

            <div className="flex-1">

                {/* Name + Verified */}
                <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold">
                        {user.name || "Contractor"}
                    </h2>

                    {/* Verified Badge */}
                    <span className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                    </span>
                </div>

                {/* Email */}
                <p className="text-slate-600 mb-3">
                    {user.email}
                </p>

                {/* Company Name */}
                <div className="flex items-center text-secondary-600 font-semibold">
                    <Briefcase className="w-5 h-5 mr-2" />
                    {user.companyName || "Company Name"}
                </div>

            </div>

            {/* Edit Button */}
            <button
                onClick={() => navigate("/contractor/edit-profile")}
                className="btn btn-outline"
            >
                Edit Profile
            </button>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-bold mb-4">Company Information</h3>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-600">
                  Company Type
                </div>
                <div className="font-semibold">
                  {user.companyType || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600">
                  Years in Business
                </div>
                <div className="font-semibold">
                  {user.yearsInBusiness
                    ? `${user.yearsInBusiness} years`
                    : "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600">
                  License Number
                </div>
                <div className="font-semibold">
                  {user.licenseNumber || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600">
                  Insurance Provider
                </div>
                <div className="font-semibold">
                  {user.insuranceProvider || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600">
                  Website
                </div>
                <div className="font-semibold text-blue-600">
                  {user.website ? (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="font-bold mb-4">About Company</h3>
            <p className="text-slate-700">
              {user.bio || "No company description provided."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}