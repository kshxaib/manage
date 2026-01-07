import Skeleton from './ui/Skeleton';

const DeveloperProjects = ({ projects, onNavigate, isLoading }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">Projects assigned to you</p>
                </div>
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">
                        {isLoading ? '...' : `${projects?.length || 0} Projects`}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-lg bg-gray-200" />
                                            <div>
                                                <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                                                <Skeleton className="h-3 w-24 bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-7 w-24 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-9 w-28 ml-auto rounded-lg bg-gray-200" />
                                    </td>
                                </tr>
                            ))
                        ) : projects?.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project._id} className="hover:bg-blue-50/30 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-base font-semibold text-blue-700">
                                                    {project.projectName?.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {project.projectName}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">{project.projectType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onNavigate('project-overview', project._id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                        >
                                            View Details
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Assigned</h3>
                                        <p className="text-gray-500 text-sm">You don't have any projects assigned to you yet.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Status styling helper function
const getStatusStyle = (status) => {
    switch(status) {
        case 'LIVE':
            return 'bg-green-50 text-green-700 border border-green-100';
        case 'DEVELOPMENT':
            return 'bg-blue-50 text-blue-700 border border-blue-100';
        case 'PLANNING':
            return 'bg-purple-50 text-purple-700 border border-purple-100';
        case 'REVIEW':
            return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
        case 'ON_HOLD':
            return 'bg-orange-50 text-orange-700 border border-orange-100';
        case 'CANCELLED':
            return 'bg-red-50 text-red-700 border border-red-100';
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
};

export default DeveloperProjects;