import React from 'react';
import { DollarSign, Briefcase, Users, CheckCircle, FileText, Clock } from 'lucide-react';

export default function StatsGrid({ stats }) {
    const cards = [
        {
            icon: DollarSign,
            value: `$${Number(stats.totalBudgetSpent || 0).toLocaleString()}`,
            label: 'Total Spent',
            gradient: 'from-emerald-400 to-emerald-600',
            iconColor: 'text-emerald-500',
            bgGlow: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        },
        {
            icon: Briefcase,
            value: stats.activeProjects ?? 0,
            label: 'Active Projects',
            gradient: 'from-blue-400 to-blue-600',
            iconColor: 'text-blue-500',
            bgGlow: 'bg-blue-500/10 dark:bg-blue-500/20',
        },
        {
            icon: Users,
            value: stats.totalWorkers ?? 0,
            label: 'Workers Hired',
            gradient: 'from-indigo-400 to-indigo-600',
            iconColor: 'text-indigo-500',
            bgGlow: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        },
        {
            icon: CheckCircle,
            value: stats.completedProjects ?? 0,
            label: 'Completed Projects',
            gradient: 'from-purple-400 to-purple-600',
            iconColor: 'text-purple-500',
            bgGlow: 'bg-purple-500/10 dark:bg-purple-500/20',
        },
        {
            icon: FileText,
            value: stats.totalJobs ?? 0,
            label: 'Job Postings',
            gradient: 'from-rose-400 to-rose-600',
            iconColor: 'text-rose-500',
            bgGlow: 'bg-rose-500/10 dark:bg-rose-500/20',
        },
        {
            icon: Clock,
            value: stats.pendingApplications ?? 0,
            label: 'Pending Apps',
            gradient: 'from-amber-400 to-amber-600',
            iconColor: 'text-amber-500',
            bgGlow: 'bg-amber-500/10 dark:bg-amber-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div 
                        key={index} 
                        className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[140px] hover:-translate-y-1 cursor-default"
                    >
                        {/* Top Gradient Line */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient} opacity-80`}></div>
                        
                        {/* Decorative Background Blur */}
                        <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${card.gradient.split(' ')[0].replace('from-', 'bg-')} opacity-10 dark:opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className="flex items-start justify-between relative z-10 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgGlow} transition-colors duration-300 group-hover:bg-opacity-20 dark:group-hover:bg-opacity-30`}>
                                <Icon className={`w-6 h-6 ${card.iconColor}`} />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                                {card.value}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {card.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
