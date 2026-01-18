import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-12 border border-gray-200">

        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Select Your Purpose
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div
            className="
              bg-gray-100 p-8 rounded-2xl border border-gray-200
              cursor-pointer transition-transform duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-200
            "
          >
            <div className="text-5xl mb-4">👷‍♂️</div>

            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              I am a Worker
            </h3>

            <p className="text-gray-600 mb-6">
              Browse nearby jobs, get daily wage work, and connect 
              with verified employers easily.
            </p>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition" onClick={() => navigate("/worker")}>
              Continue as Worker
            </button>
          </div>

          <div
            className="
              bg-gray-100 p-8 rounded-2xl border border-gray-200
              cursor-pointer transition-transform duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-200
            "
          >
            <div className="text-5xl mb-4">🏢</div>

            <h3 className="text-2xl font-semibold mb-3 text-gray-900">
              I am an Employer
            </h3>

            <p className="text-gray-600 mb-6">
              Post jobs, hire skilled labour, track attendance, and 
              manage payments securely.
            </p>

            <button className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition" onClick={() => navigate("/contractor")}>
              Continue as Employer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
