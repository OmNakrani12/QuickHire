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
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {cards.map(({ icon, value, label, bg }) => (
                <div key={label} className="card p-5 sm:p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${bg} opacity-[0.08] dark:opacity-[0.15] rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
                    
                    <div className="relative z-10 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-none`}>
                            {icon}
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-1">
                            {value}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                            {label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
