const AllDevelopers = ({ developers }) => {
    return (
        <div className="bg-bg-card border border-border rounded-lg shadow-sm p-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-primary mb-4">All Developers</h2>
            <p className="text-text-secondary mb-6">Total: {developers?.length || 0} active members in your team.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers?.map((dev) => (
                    <div key={dev._id} className="p-5 border border-border rounded-xl bg-bg-card hover:border-accent/50 transition-all flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                            {dev.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-text-primary">{dev.name}</h3>
                            <p className="text-sm text-text-muted">{dev.role}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${dev.isActive ? 'bg-xp-muted text-xp' : 'bg-danger/10 text-danger'}`}>
                                {dev.isActive ? 'Active' : 'Offline'}
                            </span>
                        </div>
                    </div>
                ))}
                {(!developers || developers.length === 0) && (
                    <div className="col-span-full py-12 text-center text-text-muted italic">
                        No team members found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllDevelopers;
