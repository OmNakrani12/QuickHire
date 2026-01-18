export default function WorkerHome() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Top Header */}
      <header className="bg-indigo-600 rounded-b-3xl text-white py-6 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Hi, Ramesh 👋</h2>
            <p className="text-indigo-100 text-sm">Ready for today's work?</p>
          </div>
          <img src="https://i.pravatar.cc/55" className="w-12 h-12 rounded-full border-2 border-white shadow"/>
        </div>
      </header>

      {/* Earnings + Attendance */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-4">
        
        {/* Earnings */}
        <div className="bg-white p-5 rounded-2xl shadow-md text-center">
          <h3 className="text-2xl font-bold text-indigo-600">₹1,850</h3>
          <p className="text-gray-600 text-sm">This Week Earnings</p>
        </div>

        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-md text-center">
          <h3 className="text-2xl font-bold text-green-600">92%</h3>
          <p className="text-gray-600 text-sm">Attendance</p>
        </div>

      </section>

      {/* Quick Actions */}
      <section className="px-6 mt-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Actions</h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition cursor-pointer">
            <div className="text-3xl">🔍</div>
            <p className="font-medium text-gray-700 mt-2">Find Jobs</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition cursor-pointer">
            <div className="text-3xl">📝</div>
            <p className="font-medium text-gray-700 mt-2">My Jobs</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition cursor-pointer">
            <div className="text-3xl">💰</div>
            <p className="font-medium text-gray-700 mt-2">Payments</p>
          </div>
        </div>
      </section>

      {/* Ongoing Job */}
      <section className="px-6 mt-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Today's Work</h3>

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h4 className="text-xl font-bold">Construction Helper</h4>
          <p className="text-gray-600 text-sm">Shree Heights, Patel Nagar</p>

          <div className="flex justify-between items-center mt-4">
            <p className="text-indigo-600 font-medium">8:00 AM – 5:00 PM</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Check-In</button>
          </div>
        </div>
      </section>

      {/* Recommended Jobs */}
      <section className="px-6 mt-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Recommended Jobs</h3>

        <div className="space-y-4">
          {[ 
            {role:"Painter", pay:"₹900/day", dist:"1.2 km", place:"Sai Apartment"},
            {role:"Plumber Helper", pay:"₹750/day", dist:"1.8 km", place:"City Complex"},
            {role:"Warehouse Loader", pay:"₹850/day", dist:"3.1 km", place:"Logi Park"},
          ].map((job,index)=>(
            <div key={index} className="bg-white p-5 rounded-2xl shadow hover:shadow-md cursor-pointer transition">
              <div className="flex justify-between">
                <h4 className="text-lg font-bold">{job.role}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.dist}</span>
              </div>
              <p className="text-gray-600">{job.pay}</p>
              <p className="text-gray-500 text-sm">{job.place}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl py-3 flex justify-around">
        <div className="text-center text-indigo-600">
          <div className="text-2xl">🏠</div>
          <p className="text-xs">Home</p>
        </div>
        <div className="text-center">
          <div className="text-2xl">🧰</div>
          <p className="text-xs">Jobs</p>
        </div>
        <div className="text-center">
          <div className="text-2xl">👤</div>
          <p className="text-xs">Profile</p>
        </div>
      </nav>
    </div>
  );
}
