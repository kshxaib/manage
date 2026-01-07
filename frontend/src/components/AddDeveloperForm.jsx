import { useState } from 'react';
import { useDeveloperStore } from '../stores/useDeveloperStore';

const AddDeveloperForm = ({ isOpen, onClose }) => {
    const { createDeveloper, isLoading } = useDeveloperStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FULLSTACK'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, password: pass }));
    };

    const copyCredentials = () => {
        if (!formData.email || !formData.password) {
            return;
        }
        const text = `Developer Credentials\nEmail: ${formData.email}\nPassword: ${formData.password}\nRole: ${formData.role}`;
        navigator.clipboard.writeText(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createDeveloper(formData);
        if (success) {
            onClose();
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'FULLSTACK'
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
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
                        <p className="text-sm text-gray-500 mt-1">Create a new developer account</p>
                    </div>
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="John Smith"
                            />
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter or generate password"
                                />
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                <option value="FULLSTACK">Fullstack Developer</option>
                                <option value="FRONTEND">Frontend Developer</option>
                                <option value="BACKEND">Backend Developer</option>
                                <option value="MOBILE">Mobile Developer</option>
                                <option value="DESIGNER">UI/UX Designer</option>
                            </select>
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
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDeveloperForm;