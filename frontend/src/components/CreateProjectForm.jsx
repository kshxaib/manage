import { useState, useEffect } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useClientStore } from '../stores/useClientStore';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                placeholder="e.g. E-commerce Platform"
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                <select
                                    name="client"
                                    value={formData.client}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                                <select
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                >
                                    <option value="WEBSITE">Website</option>
                                    <option value="APP">Mobile App</option>
                                    <option value="BOTH">Website + App</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                            <input
                                type="text"
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, MongoDB"
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                                <input
                                    type="date"
                                    name="expectedEndDate"
                                    value={formData.expectedEndDate}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (₹)</label>
                                <input
                                    type="number"
                                    name="totalCost"
                                    value={formData.totalCost}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid (₹)</label>
                                <input
                                    type="number"
                                    name="amountPaid"
                                    value={formData.amountPaid}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                            <textarea
                                name="projectDescription"
                                value={formData.projectDescription}
                                onChange={handleChange}
                                placeholder="Details about the project scope, features, etc."
                                rows="4"
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectForm;