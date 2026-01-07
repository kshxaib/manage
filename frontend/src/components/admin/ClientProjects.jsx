import React from 'react';

const ClientProjects = ({ client, projects, onNavigate, onBack }) => {
    if (!client) return null;
    const clientProjects = projects?.filter(p => {
        const pClientId = typeof p.client === 'object' ? p.client?._id : p.client;
        return pClientId === client._id;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6">
                <button 
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Clients
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Client Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{client.clientName}</h1>
                            <p className="text-gray-600 mt-1">{client.businessName}</p>
                        </div>
                        <div className="inline-flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            <button
                                onClick={() => onNavigate('client-personal-info', client._id)}
                                className="px-4 py-2 text-sm font-medium rounded-md transition-all text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                            >
                                Personal Info
                            </button>
                            <button className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 border border-blue-100">
                                Projects
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                                <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clientProjects && clientProjects.length > 0 ? (
                                clientProjects.map(project => (
                                    <tr 
                                        key={project._id} 
                                        className="hover:bg-blue-50/30 transition-colors duration-150 group cursor-pointer"
                                        onClick={() => onNavigate('project-overview', project._id)}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {project.projectName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {project.client?.businessName || client.businessName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                                ₹{project.paymentSnapshot?.totalCost?.toLocaleString() || '0'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigate('project-overview', project._id);
                                                }}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium text-sm rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 transition-all duration-200 border border-blue-100 shadow-sm hover:shadow"
                                            >
                                                View Details
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="max-w-md mx-auto">
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
                                            <p className="text-gray-500 text-sm mb-4">
                                                This client hasn't started any projects with us yet.
                                            </p>
                                            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
                                                Create First Project
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

export default ClientProjects;