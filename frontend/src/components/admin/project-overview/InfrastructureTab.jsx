import React, { useState, useEffect } from 'react';

const InfrastructureTab = ({ project, isAdmin, isLocked, updateInfrastructure, isLoading }) => {
    const [isInfraModalOpen, setIsInfraModalOpen] = useState(false);
    const [infraForm, setInfraForm] = useState({
        deploymentLinks: '',
        hosting: { backendHosting: '', database: '', domainName: '' }
    });

    useEffect(() => {
        if (project) {
            setInfraForm({
                deploymentLinks: project.deploymentLinks?.join(', ') || '',
                hosting: project.hosting || { backendHosting: '', database: '', domainName: '' }
            });
        }
    }, [project]);

    const handleUpdateInfra = async (e) => {
        e.preventDefault();
        const deploymentLinks = infraForm.deploymentLinks.split(',').map(l => l.trim()).filter(l => l !== '');
        const success = await updateInfrastructure(project._id, {
            deploymentLinks,
            hosting: infraForm.hosting
        });
        if (success) setIsInfraModalOpen(false);
    };

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Infrastructure</h2>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsInfraModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    >
                        Update Infrastructure
                    </button>
                )}
            </div>

            {/* Hosting Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Backend Hosting</p>
                        <p className="text-base font-semibold text-gray-900 capitalize">
                            {project.hosting?.backendHosting || 'Not assigned'}
                        </p>
                    </div>
                </div>
                
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Database</p>
                        <p className="text-base font-semibold text-gray-900 capitalize">
                            {project.hosting?.database || 'Not assigned'}
                        </p>
                    </div>
                </div>
                
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Domain Name</p>
                        <p className="text-base font-semibold text-gray-900">
                            {project.hosting?.domainName || 'Not assigned'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Deployment Links */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Deployment Links</h3>
                {project.deploymentLinks?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {project.deploymentLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                            >
                                <span className="text-sm font-medium text-blue-600 truncate pr-4">{link}</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                        <p className="text-sm text-gray-500">No deployment links available.</p>
                    </div>
                )}
            </div>

            {/* Update Infrastructure Modal */}
            {isInfraModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Update Infrastructure</h3>
                        </div>
                        
                        <form onSubmit={handleUpdateInfra} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Links (comma separated)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="https://app.com, https://staging.app.com"
                                        value={infraForm.deploymentLinks}
                                        onChange={(e) => setInfraForm({ ...infraForm, deploymentLinks: e.target.value })}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Backend Hosting</label>
                                        <input
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="AWS / Vercel / Render"
                                            value={infraForm.hosting.backendHosting}
                                            onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, backendHosting: e.target.value } })}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Database</label>
                                        <input
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="MongoDB / PostgreSQL"
                                            value={infraForm.hosting.database}
                                            onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, database: e.target.value } })}
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                                        <input
                                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="example.com"
                                            value={infraForm.hosting.domainName}
                                            onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, domainName: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setIsInfraModalOpen(false)} 
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfrastructureTab;