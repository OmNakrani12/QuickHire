import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, Award } from "lucide-react";

export default function ProfileView() {
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
          `${BASE_URL}/api/workers/profile/email/${storedUser.email}`
        );

        if (!response.ok) return;

        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="card p-8 text-center dark:bg-slate-900/80 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

      {/* ================= HEADER ================= */}
      <div className="card p-8 shadow-md rounded-2xl dark:bg-slate-900/80 dark:border-slate-800">
        <div className="flex items-start justify-between">

          <div className="flex items-start space-x-6">
            {/* Profile Image */}
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-white"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-md">
                {user.name?.charAt(0) || "U"}
              </div>
            )}

            <div>
              {/* Name + Verified */}
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold dark:text-white">
                  {user.name}
                </h2>

                <span className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mt-1">{user.email}</p>

              {/* Rating */}
              <div className="flex items-center mt-3">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-semibold text-lg dark:text-slate-200">
                  {user.rating || 4.8}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-2">
                  ({user.completedJobs || 12} completed jobs)
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/worker/edit-profile")}
            className="btn btn-outline"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ================= SKILLS ================= */}
      <div className="card p-8 rounded-2xl shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-5 flex items-center dark:text-white">
          <Award className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-500" />
          Skills
        </h3>

        <div className="flex flex-wrap gap-3">
          {user.skills?.length ? (
            user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium text-sm shadow-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No skills added yet</p>
          )}
        </div>
      </div>

      {/* ================= CERTIFICATIONS ================= */}
      <div className="card p-8 rounded-2xl shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-5 flex items-center dark:text-white">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-500" />
          Certifications
        </h3>

        {user.certifications?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {user.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-md transition dark:border dark:border-slate-700"
              >
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mr-3" />
                <span className="font-medium dark:text-slate-200">{cert}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No certifications added yet</p>
        )}
      </div>
    </div>
  );
}