import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    const colors = {
        danger: "bg-danger text-white hover:bg-danger-hover shadow-danger/20",
        primary: "bg-primary text-white hover:bg-primary-hover shadow-primary/20",
        accent: "bg-accent text-white hover:bg-accent-hover shadow-accent/20"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-overlay/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>
            <div className="relative bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in duration-200">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${type === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                        {type === 'danger' ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">{title}</h3>
                    <p className="text-sm text-text-muted mt-2 font-medium">{message}</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all ${colors[type] || colors.primary}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
