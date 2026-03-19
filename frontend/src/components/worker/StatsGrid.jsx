import { DollarSign, Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';

export default function StatsGrid({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    icon: <DollarSign className="w-7 h-7 text-white" />,
                    value: `$${stats.totalEarnings?.toLocaleString() || '0'}`,
                    label: 'Total Earnings',
                    bg: 'from-emerald-500 to-green-600',
                    trend: <TrendingUp className="w-5 h-5 text-emerald-500" />
                },
                {
                    icon: <Clock className="w-7 h-7 text-white" />,
                    value: stats.activeJobs || 0,
                    label: 'Active Jobs',
                    bg: 'from-blue-500 to-indigo-600'
                },
                {
                    icon: <CheckCircle className="w-7 h-7 text-white" />,
                    value: stats.completedJobs || 0,
                    label: 'Completed Jobs',
                    bg: 'from-purple-500 to-fuchsia-600'
                },
                {
                    icon: <Star className="w-7 h-7 text-white" />,
                    value: stats.rating || '0.0',
                    label: 'Average Rating',
                    bg: 'from-amber-400 to-orange-500'
                }
            ].map((stat, idx) => (
                <div key={idx} className="card p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-none`}>
                            {stat.icon}
                        </div>
                        {stat.trend && stat.trend}
                    </div>
                    
                    <div className="relative z-10">
                        <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                            {stat.value}
                        </div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {stat.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
