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
      <div className="card p-8 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-slate-800 animate-fade-in">
      <div className="card p-6 sm:p-8 dark:bg-slate-800 border dark:border-slate-700">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
          {/* Profile Photo */}
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover shadow-md shrink-0"
            />
          ) : (
            <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.name?.charAt(0) || "C"}
            </div>
          )}

          <div className="flex-1 flex flex-col items-center md:items-start">

            {/* Name + Verified */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2">
              <h2 className="text-2xl font-bold dark:text-white">
                {user.name || "Contractor"}
              </h2>

              {/* Verified Badge */}
              <span className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </span>
            </div>

            {/* Email */}
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              {user.email}
            </p>

            {/* Company Name */}
            <div className="flex items-center text-secondary-600 dark:text-secondary-400 font-semibold">
              <Briefcase className="w-5 h-5 mr-2" />
              {user.companyName || "Company Name"}
            </div>

          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/contractor/edit-profile")}
            className="btn btn-outline w-full md:w-auto dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-bold mb-4 dark:text-white">Company Information</h3>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Company Type
                </div>
                <div className="font-semibold dark:text-slate-200">
                  {user.companyType || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Years in Business
                </div>
                <div className="font-semibold dark:text-slate-200">
                  {user.yearsInBusiness
                    ? `${user.yearsInBusiness} years`
                    : "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  License Number
                </div>
                <div className="font-semibold dark:text-slate-200">
                  {user.licenseNumber || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Insurance Provider
                </div>
                <div className="font-semibold dark:text-slate-200">
                  {user.insuranceProvider || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Website
                </div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {user.website ? (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
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
            <h3 className="font-bold mb-4 dark:text-white">About Company</h3>
            <p className="text-slate-700 dark:text-slate-300">
              {user.bio || "No company description provided."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}