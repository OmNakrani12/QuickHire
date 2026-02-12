import { Users, Calendar } from 'lucide-react';

export default function ActiveProjects({ projects }) {
    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Active Projects</h2>
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="p-6 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {project.workers} workers
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Due: {project.deadline}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-600 mb-1">Budget</div>
                                <div className="font-bold text-lg">
                                    ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-semibold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-secondary-600 to-secondary-700 h-2 rounded-full transition-all"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
