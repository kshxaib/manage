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

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Project Resources</h3>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsDocModalOpen(true)}
                        className="px-4 py-2 bg-xp text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-xp/20"
                    >
                        + Add Link
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.documents?.filter(doc => {
                    if (isAdmin) return true;
                    return !['INVOICE', 'COSTING', 'AGREEMENT'].includes(doc.type);
                }).length > 0 ? (
                    project.documents
                        .filter(doc => {
                            if (isAdmin) return true;
                            return !['INVOICE', 'COSTING', 'AGREEMENT'].includes(doc.type);
                        })
                        .map((doc, idx) => (
                            <a
                                key={idx}
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-5 border border-border rounded-2xl flex items-center justify-between hover:bg-bg-muted transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-bg-muted flex items-center justify-center text-text-secondary font-black">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-text-primary uppercase tracking-tight text-sm">{doc.title}</p>
                                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{doc.type}</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))
                ) : (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-3xl">
                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No documents or links added yet.</p>
                    </div>
                )}
            </div>

            {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Add Project Link</h3>
                        <form onSubmit={handleAddDocument} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Link Title</label>
                                <input
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    placeholder="e.g. Figma Design"
                                    value={docForm.title}
                                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Resource Type</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={docForm.type}
                                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                                >
                                    {["FIGMA", "GITHUB", "DRIVE", "AGREEMENT", "COSTING", "INVOICE", "OTHER"].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">URL / Link</label>
                                <input
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    placeholder="https://..."
                                    value={docForm.link}
                                    onChange={(e) => setDocForm({ ...docForm, link: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsDocModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-xp text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-xp/20">
                                    {isLoading ? 'Saving...' : 'Add Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsTab;
