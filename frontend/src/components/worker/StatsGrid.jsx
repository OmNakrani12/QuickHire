import { DollarSign, Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';

export default function StatsGrid({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-10 h-10 text-green-600" />
                    <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                    ${stats.totalEarnings.toLocaleString()}
                </div>
                <div className="text-slate-600">Total Earnings</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeJobs}</div>
                <div className="text-slate-600">Active Jobs</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completedJobs}</div>
                <div className="text-slate-600">Completed Jobs</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <Star className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.rating}</div>
                <div className="text-slate-600">Average Rating</div>
            </div>
        </div>
    );
}
