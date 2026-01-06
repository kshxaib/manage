const AllClients = ({ clients, onNavigate, onAddClient }) => {
    return (
        <div className="bg-bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                <h2 className="text-2xl font-bold text-text-primary">All Clients</h2>
                <button
                    onClick={onAddClient}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    + Add New Client
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-border">
                            <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Client / Business</th>
                            <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Contact</th>
                            <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Country</th>
                            <th className="px-6 py-4 text-sm font-semibold text-text-secondary">Onboarded</th>
                            <th className="px-6 py-4 text-sm font-semibold text-text-secondary text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {clients?.map((client) => (
                            <tr key={client._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-text-primary">{client.clientName}</p>
                                    <p className="text-sm text-text-muted">{client.businessName}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-text-primary">{client.email}</p>
                                    <p className="text-sm text-text-muted">{client.phone}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm px-2 py-1 bg-bg-muted rounded text-text-secondary font-medium uppercase tracking-wider">
                                        {client.country}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary">
                                    {new Date(client.onboardedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onNavigate('client-personal-info', client._id)}
                                        className="text-accent hover:text-accent-hover font-medium px-3 py-1 bg-accent/5 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!clients || clients.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-text-muted italic">
                                    No clients found. Start by adding one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllClients;
