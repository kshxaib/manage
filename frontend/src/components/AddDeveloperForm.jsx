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
        toast.success("Random password generated");
    };

    const copyCredentials = () => {
        if (!formData.email || !formData.password) {
            return toast.error("Email and password are required to copy");
        }
        const text = `Developer Credentials\nEmail: ${formData.email}\nPassword: ${formData.password}\nRole: ${formData.role}`;
        navigator.clipboard.writeText(text);
        toast.success("Credentials copied to clipboard");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createDeveloper(formData);
        if (success) {
            // No reset immediately so admin can copy after creation if they forgot
            toast.info("You can copy the credentials now before closing the modal", { duration: 5000 });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-overlay/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">Onboard Developer</h2>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Create a new team member account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-bg-muted border border-border rounded-xl px-4 py-2.5 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                            placeholder="e.g. Alex Rivera"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-bg-muted border border-border rounded-xl px-4 py-2.5 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                            placeholder="alex@by4k.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Initial Password</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="flex-1 bg-bg-muted border border-border rounded-xl px-4 py-2.5 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="px-4 py-2.5 bg-bg-muted border border-border rounded-xl font-black text-accent uppercase text-[10px] tracking-widest hover:bg-border transition-all"
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Specialization Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full bg-bg-muted border border-border rounded-xl px-4 py-2.5 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all appearance-none text-sm"
                        >
                            <option value="FULLSTACK">Fullstack Developer</option>
                            <option value="FRONTEND">Frontend Specialist</option>
                            <option value="BACKEND">Backend Specialist</option>
                            <option value="MOBILE">Mobile Developer</option>
                            <option value="DESIGNER">UI/UX Designer</option>
                        </select>
                    </div>

                    <div className="pt-2 flex flex-col space-y-2">
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={copyCredentials}
                                className="flex-1 py-3 border-2 border-accent text-accent rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-accent/5 transition-all outline-none"
                            >
                                Copy Credentials
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-[2] py-3 bg-text-primary text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDeveloperForm;
