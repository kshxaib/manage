import React, { useState, useMemo, useEffect } from 'react';
import Skeleton from '../ui/Skeleton';
import { formatDate } from '../../utils/dateUtils';

const AllClients = ({ clients, onNavigate, onAddClient, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    // Debounce search query logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400); 

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Extract unique countries for filter dropdown 
    const countries = useMemo(() => {
        if (!clients) return [];
        const uniqueCountries = [...new Set(clients.map(c => c.country))].filter(Boolean).sort();
        return uniqueCountries;
    }, [clients]);

    // Apply frontend filtering using debounced value
    const filteredClients = useMemo(() => {
        if (!clients) return [];
        return clients.filter(client => {
            const matchesSearch =
                client.clientName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                client.businessName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                client.email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

            const matchesCountry = countryFilter === '' || client.country === countryFilter;

            return matchesSearch && matchesCountry;
        });
    }, [clients, debouncedSearchQuery, countryFilter]);


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

            {/* Filter Bar */}
            <div className="p-4 bg-white border-b border-border flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, business or email..."
                        className="w-full pl-10 pr-4 py-2 bg-bg-muted border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full px-4 py-2 bg-bg-muted border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                    >
                        <option value="">All Countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
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
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-40 mb-2" />
                                        <Skeleton className="h-4 w-28" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-20 rounded" />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        <Skeleton className="h-4 w-24" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-8 w-24 ml-auto rounded-lg" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
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
                                        {formatDate(client.onboardedDate)}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto">
                                        <div className="w-16 h-16 bg-bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">
                                            {debouncedSearchQuery || countryFilter ? 'No matching clients found.' : 'No clients found.'}
                                        </p>
                                        {debouncedSearchQuery || countryFilter ? (
                                            <p className="mt-4 text-xs font-medium text-text-muted">Adjust your filters to see more results</p>
                                        ) : (
                                            <button onClick={onAddClient} className="mt-4 text-xs font-black text-primary uppercase hover:underline">Add your first client</button>
                                        )}
                                    </div>
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
