import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const PaymentsTab = ({ project, isAdmin, isLocked, recordPayment, updateClosureNotes, isLoading }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ amountPaid: '' });
    const [localClosureNotes, setLocalClosureNotes] = useState(project?.closureNotes || '');

    useEffect(() => {
        setLocalClosureNotes(project?.closureNotes || '');
    }, [project]);

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentForm.amountPaid);
        if (isNaN(amount) || amount <= 0) return toast.error("Enter a valid amount");

        const remaining = project.paymentSnapshot.totalCost - project.paymentSnapshot.amountPaid;
        if (amount > remaining) {
            return toast.error(`Amount exceeds the outstanding balance (₹${remaining.toLocaleString()})`);
        }

        const success = await recordPayment(project._id, amount);
        if (success) {
            setIsPaymentModalOpen(false);
            setPaymentForm({ amountPaid: '' });
        }
    };

    const handleUpdateClosureNotes = async () => {
        if (!localClosureNotes) return toast.error("Notes cannot be empty");
        const success = await updateClosureNotes(project._id, localClosureNotes);
        if (success) {
            toast.success("Closure notes updated");
        }
    };

    const paymentProgress = project.paymentSnapshot
        ? (project.paymentSnapshot.amountPaid / project.paymentSnapshot.totalCost) * 100
        : 0;

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Financial Summary</h3>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="px-4 py-2 bg-achievement text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-achievement/20"
                    >
                        Record Payment
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="p-8 bg-bg-muted/50 rounded-3xl border border-border flex flex-col justify-center">
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2 text-center">Collection Status</p>
                    <div className="text-center">
                        <span className="text-5xl font-black text-xp leading-none">{paymentProgress.toFixed(0)}%</span>
                        <div className="w-full bg-border h-4 rounded-full mt-6 overflow-hidden max-w-[200px] mx-auto">
                            <div className="h-full bg-gradient-to-r from-xp to-achievement shadow-lg" style={{ width: `${paymentProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-achievement/5 rounded-3xl border border-achievement/20 flex flex-col justify-between">
                        <p className="text-[10px] text-achievement font-black uppercase tracking-widest mb-4">Total Budget</p>
                        <p className="text-3xl font-black text-text-primary text-left">₹{project.paymentSnapshot?.totalCost?.toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-focus/5 rounded-3xl border border-focus/20 flex flex-col justify-between">
                        <p className="text-[10px] text-focus font-black uppercase tracking-widest mb-4">Amount Collected</p>
                        <p className="text-3xl font-black text-text-primary text-left">₹{project.paymentSnapshot?.amountPaid?.toLocaleString()}</p>
                    </div>
                    <div className="col-span-full p-8 bg-danger/5 rounded-3xl border border-danger/20 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-center sm:text-left mb-4 sm:mb-0">
                            <p className="text-[10px] text-danger font-black uppercase tracking-widest mb-1">Outstanding Balance</p>
                            <p className="text-4xl font-black text-danger leading-none">₹{(project.paymentSnapshot?.totalCost - project.paymentSnapshot?.amountPaid).toLocaleString()}</p>
                        </div>
                        <span className="px-4 py-2 bg-danger/10 text-danger rounded-xl text-[10px] font-black uppercase tracking-widest border border-danger/20 animate-pulse">Pending Action</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-10">
                {isLocked ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center space-x-3 text-text-primary px-1">
                            <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                            <h4 className="text-sm font-black uppercase tracking-widest">Project Closure & Notes</h4>
                        </div>
                        <div className="bg-bg-muted/30 p-8 rounded-3xl border border-border">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Final Project Summary / internal Notes</label>
                            <textarea
                                rows={6}
                                className="w-full bg-white border border-border rounded-2xl px-6 py-4 font-medium text-text-secondary outline-none focus:ring-2 focus:ring-accent transition-all resize-none leading-relaxed text-sm shadow-inner"
                                placeholder="Document final delivery details, any issues encountered, or reason for cancellation..."
                                value={localClosureNotes}
                                onChange={(e) => setLocalClosureNotes(e.target.value)}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleUpdateClosureNotes}
                                    className="px-8 py-3 bg-text-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg"
                                >
                                    Update Closure Notes
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4 p-4 bg-focus/5 border border-focus/20 rounded-2xl">
                            <svg className="w-5 h-5 text-focus mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight leading-relaxed text-left">
                                Closure notes are used for internal record keeping. Since the project is **LOCKED**, payment and status fields are preserved as they were at the time of locking.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 bg-bg-muted/20 border-2 border-dashed border-border rounded-[40px] text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-white border border-border flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-black text-text-primary mb-2 uppercase tracking-tight">Active Phase</h4>
                        <p className="text-xs text-text-muted font-medium leading-relaxed mb-8 px-4">This project is currently active. You can record payments and manage team members. Once everything is finalized, lock the project to enable the official closure documentation.</p>
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-bg-muted rounded-full border border-border">
                            <div className="w-2 h-2 rounded-full bg-achievement animate-pulse"></div>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Awaiting Project Lock</span>
                        </div>
                    </div>
                )}
            </div>

            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Record New Payment</h3>
                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₹</span>
                                    <input
                                        type="number"
                                        className="w-full bg-bg-muted border border-border rounded-xl pl-10 pr-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-achievement transition-all"
                                        placeholder="0.00"
                                        value={paymentForm.amountPaid}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-achievement/5 border border-achievement/20 rounded-xl">
                                <p className="text-[10px] font-black text-achievement uppercase mb-1">Outstanding</p>
                                <p className="text-sm font-bold text-text-primary">₹{(project.paymentSnapshot?.totalCost - project.paymentSnapshot?.amountPaid).toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-achievement text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-achievement/20">
                                    {isLoading ? 'Recording...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsTab;
