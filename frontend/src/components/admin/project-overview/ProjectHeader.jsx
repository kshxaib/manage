import React from 'react';

const ProjectHeader = ({ project, isAdmin, isLocked, isLoading, onBack, toggleProjectLock, activeTab, setActiveTab, tabs }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Back Navigation */}
            <div className="px-6 pt-6">
                <button 
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Projects
                </button>
            </div>

            {/* Project Title and Info */}
            <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {project.projectName}
                            </h1>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                                {project.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">{project.client?.clientName}</span>
                            {project.client?.businessName && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span>{project.client.businessName}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => toggleProjectLock(project._id)}
                            disabled={isLoading}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isLocked
                                    ? 'bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 hover:from-red-100 hover:text-red-700 border border-red-200'
                                    : 'bg-gradient-to-r from-green-50 to-green-50/50 text-green-600 hover:from-green-100 hover:text-green-700 border border-green-200'
                                }`}
                        >
                            {isLocked ? (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Locked</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0z" />
                                    </svg>
                                    <span>Unlocked</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="mt-8">
                    <div className="flex space-x-1 border-b border-gray-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${activeTab === tab.id
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                    </svg>
                                    <span>{tab.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
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

export default ProjectHeader;