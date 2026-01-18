import { FiSearch, FiFilter, FiEdit, FiEye } from "react-icons/fi";
import { BsFolderFill, BsCheckCircleFill, BsPeopleFill } from "react-icons/bs";
import { IoMdCheckmarkCircle } from "react-icons/io";

export default function ContractorHome() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside className="w-64 bg-white border-r shadow-sm p-6">
        <h2 className="text-2xl font-bold text-indigo-600">Quick Hire</h2>
        <p className="text-sm text-gray-500 mb-8">Contractor Portal</p>

        <nav className="space-y-2">
          <SidebarLink text="Dashboard" active />
          <SidebarLink text="My Profile" />
          <SidebarLink text="My Jobs" />
          <SidebarLink text="Messages" />
          <SidebarLink text="History" />
          <SidebarLink text="Notifications" />
          <SidebarLink text="Settings" />
        </nav>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-8">

        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your work posts and connections</p>
          </div>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            + Add Work
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Posts" value="4" icon={<BsFolderFill className="text-blue-600" />} />
          <StatCard title="Active Works" value="4" icon={<BsCheckCircleFill className="text-green-600" />} />
          <StatCard title="Applications" value="23" icon={<BsPeopleFill className="text-purple-600" />} />
          <StatCard title="Completed" value="12" icon={<IoMdCheckmarkCircle className="text-orange-500" />} />
        </div>

        {/* SEARCH + CATEGORY FILTER */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow mb-8">

          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 bg-gray-100 px-4 py-2 rounded-lg">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by work name, client name, or category..."
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* Filter Icon */}
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            <FiFilter />
          </button>

          {/* Category Dropdown */}
          <select className="border p-2 rounded-lg">
            <option>All Categories</option>
            <option>Painting</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Construction</option>
          </select>
        </div>

        {/* RECENT WORK POSTS */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Recent Work Posts</h2>
          <p className="text-gray-500 text-sm">4 posts</p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* ------------ CARD 1 ------------ */}
          <WorkCard
            title="Kitchen Sink Repair"
            category="Plumbing"
            posted="2 hours ago"
            name="Robert Johnson"
            address="12A, 456 Oak Avenue, Greenwood Apartments"
            contact="+1 (555) 123-4567"
            date="Jan 15, 2026"
            budget="$300 - $500"
          />

          {/* ------------ CARD 2 ------------ */}
          <WorkCard
            title="Living Room Painting"
            category="Painting"
            posted="1 day ago"
            name="Sarah Williams"
            address="58, 789 Maple Street"
            contact="+1 (555) 987-6543"
            date="Jan 20, 2026"
            budget="$800 - $1200"
          />

        </div>
      </main>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SidebarLink({ text, active }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 ${
        active ? "bg-indigo-50 text-indigo-600 font-semibold" : ""
      }`}
    >
      {text}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg text-xl">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function WorkCard({ title, category, posted, name, address, contact, date, budget }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{category}</span>
      </div>

      <p className="text-gray-500 text-xs my-1">{posted}</p>
      <p className="text-gray-700 font-medium">{name}</p>

      <div className="mt-4 space-y-1 text-gray-600 text-sm">
        <p><b>Address:</b> {address}</p>
        <p><b>Contact:</b> {contact}</p>
        <p><b>Work Date:</b> {date}</p>
        <p><b>Budget:</b> {budget}</p>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <FiEye /> View Details
        </button>
        <button className="flex items-center gap-1 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
          <FiEdit /> Edit
        </button>
      </div>
    </div>
  );
}
