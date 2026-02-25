import { DollarSign, Briefcase, Users, CheckCircle, FileText, Clock } from 'lucide-react';

export default function StatsGrid({ stats }) {
    const cards = [
        {
            icon: <DollarSign className="w-6 h-6 text-white" />,
            value: `$${Number(stats.totalBudgetSpent || 0).toLocaleString()}`,
            label: 'Total Spent',
            bg: 'from-green-500 to-emerald-600',
        },
        {
            icon: <Briefcase className="w-6 h-6 text-white" />,
            value: stats.activeProjects ?? 0,
            label: 'Active Projects',
            bg: 'from-primary-500 to-primary-600',
        },
        {
            icon: <Users className="w-6 h-6 text-white" />,
            value: stats.totalWorkers ?? 0,
            label: 'Workers Hired',
            bg: 'from-secondary-500 to-secondary-600',
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-white" />,
            value: stats.completedProjects ?? 0,
            label: 'Completed Projects',
            bg: 'from-violet-500 to-purple-600',
        },
        {
            icon: <FileText className="w-6 h-6 text-white" />,
            value: stats.totalJobs ?? 0,
            label: 'Job Postings',
            bg: 'from-orange-400 to-orange-500',
        },
        {
            icon: <Clock className="w-6 h-6 text-white" />,
            value: stats.pendingApplications ?? 0,
            label: 'Pending Applications',
            bg: 'from-sky-400 to-cyan-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map(({ icon, value, label, bg }) => (
                <div key={label} className="card p-5 flex flex-col gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-md`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800 leading-tight">{value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
