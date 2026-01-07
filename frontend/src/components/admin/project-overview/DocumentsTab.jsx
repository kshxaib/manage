import React, { useState } from 'react';
import { toast } from 'sonner';

const DocumentsTab = ({ project, isAdmin, isLocked, addDocument, isLoading }) => {
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [docForm, setDocForm] = useState({ type: 'DRIVE', title: '', link: '' });

    const handleAddDocument = async (e) => {
        e.preventDefault();
        if (!docForm.title || !docForm.link) return toast.error("Fill all link details");
        const success = await addDocument(project._id, docForm);
        if (success) {
            setIsDocModalOpen(false);
            setDocForm({ type: 'DRIVE', title: '', link: '' });
        }
    };

    const filteredDocuments = project.documents?.filter(doc => {
        if (isAdmin) return true;
        return !['INVOICE', 'COSTING', 'AGREEMENT'].includes(doc.type);
    });

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Project Resources</h2>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsDocModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    >
                        + Add Resource
                    </button>
                )}
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Resource</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredDocuments?.length > 0 ? (
                            filteredDocuments.map((doc, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{doc.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDocTypeStyle(doc.type)}`}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={doc.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Open Link
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
                                        <p className="text-gray-500 text-sm mb-4">Add design files, documentation, or other project resources.</p>
                                        {!isLocked && isAdmin && (
                                            <button
                                                onClick={() => setIsDocModalOpen(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                            >
                                                + Add First Resource
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Resource Modal */}
            {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add Resource</h3>
                        </div>
                        
                        <form onSubmit={handleAddDocument} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g. Figma Design File"
                                        value={docForm.title}
                                        onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={docForm.type}
                                        onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                                    >
                                        {["FIGMA", "GITHUB", "DRIVE", "AGREEMENT", "COSTING", "INVOICE", "OTHER"].map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL / Link</label>
                                    <input
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="https://..."
                                        value={docForm.link}
                                        onChange={(e) => setDocForm({ ...docForm, link: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDocModalOpen(false)} 
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Add Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const getDocTypeStyle = (type) => {
    switch(type) {
        case 'FIGMA':
            return 'bg-purple-50 text-purple-700 border border-purple-100';
        case 'GITHUB':
            return 'bg-gray-50 text-gray-700 border border-gray-100';
        case 'DRIVE':
            return 'bg-blue-50 text-blue-700 border border-blue-100';
        case 'AGREEMENT':
            return 'bg-green-50 text-green-700 border border-green-100';
        case 'INVOICE':
        case 'COSTING':
            return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
};

export default DocumentsTab;