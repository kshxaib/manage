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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Clients</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and search your client database</p>
                </div>
                <button
                    onClick={onAddClient}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Client
                </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, business or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <div className="relative">
                        <select
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                        >
                            <option value="" className="text-gray-500">All Countries</option>
                            {countries.map(country => (
                                <option key={country} value={country} className="text-gray-900">{country}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Client / Business</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Country</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Onboarded</th>
                            <th className="px-6 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-36 mb-2 bg-gray-200" />
                                        <Skeleton className="h-3.5 w-28 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-44 mb-2 bg-gray-200" />
                                        <Skeleton className="h-5 w-32 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-7 w-24 rounded bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-28 bg-gray-200" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-9 w-28 ml-auto rounded-lg bg-gray-200" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <tr key={client._id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{client.clientName}</p>
                                                <p className="text-sm text-gray-500">{client.businessName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900">{client.email}</p>
                                        <p className="text-sm text-gray-500">{client.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                            {client.country}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 font-medium">{formatDate(client.onboardedDate)}</div>
                                        <div className="text-xs text-gray-400">Member since</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onNavigate('client-personal-info', client._id)}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium text-sm rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 transition-all duration-200 border border-blue-100 shadow-sm hover:shadow"
                                        >
                                            View Details
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-200 shadow-sm">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {debouncedSearchQuery || countryFilter ? 'No matching clients found' : 'No clients yet'}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {debouncedSearchQuery || countryFilter 
                                                ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                                                : 'Get started by adding your first client to the system.'}
                                        </p>
                                        {debouncedSearchQuery || countryFilter ? (
                                            <button 
                                                onClick={() => { setSearchQuery(''); setCountryFilter(''); }}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Clear filters
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={onAddClient}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                                            >
                                                Add Your First Client
                                            </button>
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