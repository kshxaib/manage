import { useState } from 'react';
import { useClientStore } from '../stores/useClientStore';

const AddClientForm = ({ isOpen, onClose }) => {
    const { createClient, isLoading } = useClientStore();
    const [formData, setFormData] = useState({
        clientName: '',
        businessName: '',
        email: '',
        phone: '',
        whatsapp: '',
        country: '',
        onboardedDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createClient(formData);
        if (success) {
            onClose();
            setFormData({
                clientName: '',
                businessName: '',
                email: '',
                phone: '',
                whatsapp: '',
                country: '',
                onboardedDate: new Date().toISOString().split('T')[0]
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Add New Client</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Acme Corp"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (Optional)</label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="United States"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Onboarded Date</label>
                                <input
                                    type="date"
                                    name="onboardedDate"
                                    value={formData.onboardedDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
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
                            {isLoading ? 'Creating...' : 'Add Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientForm;