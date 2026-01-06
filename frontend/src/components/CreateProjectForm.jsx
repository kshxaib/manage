import { useState, useEffect } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useClientStore } from '../stores/useClientStore';
import { toast } from 'sonner';

const CreateProjectForm = ({ isOpen, onClose }) => {
    const { createProject, isLoading } = useProjectStore();
    const { clients, fetchClients } = useClientStore();

    const [formData, setFormData] = useState({
        projectName: '',
        client: '',
        projectType: 'WEBSITE',
        techStack: '',
        startDate: '',
        expectedEndDate: '',
        projectDescription: '',
        totalCost: '',
        amountPaid: ''
    });

    useEffect(() => {
        if (isOpen && clients.length === 0) {
            fetchClients();
        }
    }, [isOpen, clients.length, fetchClients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.projectName || !formData.client || !formData.projectType || !formData.techStack || !formData.startDate || !formData.totalCost) {
            toast.error('Please fill all required fields');
            return;
        }

        const success = await createProject({
            ...formData,
            totalCost: Number(formData.totalCost),
            amountPaid: formData.amountPaid ? Number(formData.amountPaid) : 0
        });

        if (success) {
            setFormData({
                projectName: '',
                client: '',
                projectType: 'WEBSITE',
                techStack: '',
                startDate: '',
                expectedEndDate: '',
                projectDescription: '',
                totalCost: '',
                amountPaid: ''
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-300">
            <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-bg-card z-10">
                    <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Create New Project</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-2 hover:bg-bg-muted rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Project Name *</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                placeholder="e.g. E-commerce Platform"
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Select Client *</label>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none appearance-none transition-all font-medium"
                                required
                            >
                                <option value="">Choose a client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.clientName} ({client.businessName})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Project Type *</label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none appearance-none transition-all font-medium"
                                required
                            >
                                <option value="WEBSITE">Website</option>
                                <option value="APP">Mobile App</option>
                                <option value="BOTH">Website + App</option>
                            </select>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tech Stack *</label>
                            <input
                                type="text"
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, MongoDB"
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Expected End Date</label>
                            <input
                                type="date"
                                name="expectedEndDate"
                                value={formData.expectedEndDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Budget (₹) *</label>
                            <input
                                type="number"
                                name="totalCost"
                                value={formData.totalCost}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Amount Paid (₹)</label>
                            <input
                                type="number"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Project Description</label>
                            <textarea
                                name="projectDescription"
                                value={formData.projectDescription}
                                onChange={handleChange}
                                placeholder="Details about the project scope, features, etc."
                                rows="4"
                                className="w-full px-4 py-3 bg-bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4 sticky bottom-0 bg-bg-card pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-border text-text-primary font-bold rounded-xl hover:bg-bg-muted transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating Project...</span>
                                </>
                            ) : (
                                <span>Launch Project</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectForm;
