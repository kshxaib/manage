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
    
    const outstandingBalance = project.paymentSnapshot?.totalCost - project.paymentSnapshot?.amountPaid;

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
                {!isLocked && isAdmin && (
                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    >
                        Record Payment
                    </button>
                )}
            </div>
{/* Payment Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <p className="text-xl font-bold text-gray-900">
                ₹{project.paymentSnapshot?.totalCost?.toLocaleString()}
            </p>
        </div>
    </div>
    
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Amount Collected</p>
            <p className="text-xl font-bold text-gray-900">
                ₹{project.paymentSnapshot?.amountPaid?.toLocaleString()}
            </p>
        </div>
    </div>
    
    <div className="p-5 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-100 rounded-xl">
        <div className="space-y-1">
            <p className="text-sm font-medium text-red-600">Outstanding Balance</p>
            <p className="text-xl font-bold text-gray-900">
                ₹{outstandingBalance.toLocaleString()}
            </p>
        </div>
    </div>
</div>
            {/* Closure Notes Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                {isLocked ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-gray-900">Project Closure Notes</h3>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Final Summary & Internal Notes
                                </label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Document final delivery details, lessons learned, or reason for cancellation..."
                                    value={localClosureNotes}
                                    onChange={(e) => setLocalClosureNotes(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdateClosureNotes}
                                    disabled={isLoading}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                >
                                    Update Closure Notes
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-600">
                                Closure notes are used for internal record keeping. Since the project is <strong>LOCKED</strong>, payment and status fields are preserved as they were at the time of locking.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-xl text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Project Phase</h3>
                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                            This project is currently active. You can record payments and manage team members. 
                            Once everything is finalized, lock the project to enable the official closure documentation.
                        </p>
                    </div>
                )}
            </div>

            {/* Record Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
                        </div>
                        
                        <form onSubmit={handleRecordPayment} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="0.00"
                                            value={paymentForm.amountPaid}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                                        />
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-blue-700">Outstanding Balance</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{outstandingBalance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPaymentModalOpen(false)} 
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                                >
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