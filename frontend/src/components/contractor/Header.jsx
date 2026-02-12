import { PlusCircle, Bell } from 'lucide-react';

export default function Header({ userName, onNewJobClick }) {
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, {userName}!</h1>
                <p className="text-slate-600">Manage your projects and workforce</p>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onNewJobClick}
                    className="btn btn-secondary flex items-center"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Post New Job
                </button>
                <button className="relative p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                    <Bell className="w-6 h-6 text-slate-700" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
