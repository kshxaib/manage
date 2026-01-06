const ClientInfo = ({ client, onNavigate, onBack }) => {
    if (!client) return null;

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-right duration-300">
            <div className="bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border bg-gray-50/50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-2 text-xs text-text-muted mb-4 cursor-pointer hover:text-text-primary uppercase tracking-widest font-bold" onClick={onBack}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            <span>Clients</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">
                            {client.clientName}
                        </h1>
                        <p className="text-xl text-text-secondary mt-1 font-medium">{client.businessName}</p>
                    </div>
                    <div className="flex bg-bg-muted p-1 rounded-lg">
                        <button className="px-5 py-2 text-sm font-bold rounded-md bg-white shadow-sm text-text-primary">
                            Info
                        </button>
                        <button
                            onClick={() => onNavigate('client-projects-list', client._id)}
                            className="px-5 py-2 text-sm font-bold rounded-md transition-all text-text-secondary hover:text-text-primary"
                        >
                            Projects
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Contact Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-bg-muted/50 border border-border/50">
                                <p className="text-xs text-text-muted font-bold uppercase mb-1">Email</p>
                                <p className="font-bold text-text-primary truncate">{client.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-muted/50 border border-border/50">
                                <p className="text-xs text-text-muted font-bold uppercase mb-1">Phone</p>
                                <p className="font-bold text-text-primary">{client.phone}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-muted/50 border border-border/50">
                                <p className="text-xs text-text-muted font-bold uppercase mb-1">WhatsApp</p>
                                <p className="font-bold text-text-primary">{client.whatsapp || 'Not shared'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-bg-muted/50 border border-border/50">
                                <p className="text-xs text-text-muted font-bold uppercase mb-1">Location</p>
                                <p className="font-bold text-text-primary underline decoration-accent/30">{client.country}</p>
                            </div>
                        </div>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Onboarding Info</h3>
                        <div className="p-5 rounded-2xl bg-achievement-muted/30 border border-achievement/20 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-achievement/10 flex items-center justify-center text-achievement">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-achievement uppercase">Member since</p>
                                    <p className="text-lg font-extrabold text-text-primary">
                                        {new Date(client.onboardedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-text-muted font-bold uppercase">Managed By</p>
                                <p className="font-bold text-text-primary italic">By4K Admin</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ClientInfo;
