import { DollarSign, Briefcase, Users, CheckCircle } from 'lucide-react';

export default function StatsGrid({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                    ${stats.totalSpent.toLocaleString()}
                </div>
                <div className="text-slate-600">Total Investment</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeProjects}</div>
                <div className="text-slate-600">Active Projects</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <Users className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalWorkers}</div>
                <div className="text-slate-600">Total Workers</div>
            </div>

            <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-10 h-10 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.completedProjects}</div>
                <div className="text-slate-600">Completed Projects</div>
            </div>
        </div>
    );
}
