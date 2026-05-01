import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, Award } from "lucide-react";
import { MessageSquare } from "lucide-react";
import Loading from "@/Loading";

export default function ProfileView() {
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
          `${BASE_URL}/api/workers/profile/email/${storedUser.email}`
        );

        if (!response.ok) return;

        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        const uid = localStorage.getItem("uid");
        // Fetch reviews
        const reviewsRes = await fetch(`${BASE_URL}/api/reviews/user/${uid}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
          
          if (reviewsData.length > 0) {
            const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
            setAvgRating((sum / reviewsData.length).toFixed(1));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, [navigate, BASE_URL]);

  if (!user) {
    return <Loading/>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

      {/* ================= HEADER ================= */}
      <div className="card p-6 sm:p-8 shadow-md rounded-2xl dark:bg-slate-900/80 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
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

            <div className="flex flex-col items-center sm:items-start">
              {/* Name + Verified */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
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
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-1" />
                <span className="font-bold text-xl dark:text-slate-200">
                  {avgRating || "0.0"}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-2">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/worker/edit-profile")}
            className="btn btn-outline w-full md:w-auto"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
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
              <div className="grid gap-4">
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

        {/* ================= REVIEWS SECTION ================= */}
        <div className="card p-8 rounded-2xl shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-6 flex items-center dark:text-white">
              <Star className="w-5 h-5 mr-2 text-amber-500" />
              Recent Feedback
            </h3>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                          {review.reviewer?.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white text-sm">{review.reviewer?.name}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                      "{review.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to leave feedback!</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}