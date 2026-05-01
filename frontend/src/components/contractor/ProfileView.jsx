import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Award, CheckCircle, Briefcase } from "lucide-react";
import Loading from "@/Loading";

export default function ContractorProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

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

        // Fetch reviews
        const reviewsRes = await fetch(`${BASE_URL}/api/reviews/user/${data.user.id}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
          
          if (reviewsData.length > 0) {
            const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
            setAvgRating((sum / reviewsData.length).toFixed(1));
          }
        }
      } catch (error) {
        console.error("Error loading contractor profile:", error);
      }
    };

    loadProfile();
  }, [navigate, BASE_URL]);

  if (!user) {
    return <Loading/>
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

            {/* Rating */}
            <div className="flex items-center mb-3">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-bold text-lg dark:text-slate-200">
                {avgRating || "0.0"}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-2">
                ({reviews.length} reviews)
              </span>
            </div>

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

      {/* Reviews Section */}
      <div className="card p-6 sm:p-8 dark:bg-slate-800 border dark:border-slate-700">
        <h3 className="text-xl font-bold mb-6 flex items-center dark:text-white">
          <Star className="w-5 h-5 mr-2 text-amber-500" />
          User Reviews
        </h3>

        <div className="grid gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
                      {review.reviewer?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{review.reviewer?.name}</div>
                      <div className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic italic">
                  "{review.comment}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
              <Award className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No reviews yet for this contractor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}