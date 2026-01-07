import { formatDate } from '../../utils/dateUtils';

const ClientInfo = ({ client, onNavigate, onBack }) => {
    if (!client) return null;

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <button
                                onClick={onBack}
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors mb-2 group"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Clients
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {client.clientName}
                                </h1>
                                <p className="text-lg text-gray-600 mt-1">{client.businessName}</p>
                            </div>
                        </div>
                        <div className="inline-flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            <button className="px-5 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 border border-blue-100">
                                Personal Info
                            </button>
                            <button
                                onClick={() => onNavigate('client-projects-list', client._id)}
                                className="px-5 py-2 text-sm font-semibold rounded-md transition-all text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                            >
                                View Projects
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="p-6 md:p-8 space-y-8">
                    {/* Contact Details Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                                        <p className="font-medium text-gray-900 truncate">{client.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                                        <p className="font-medium text-gray-900">{client.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">WhatsApp</p>
                                        <p className="font-medium text-gray-900">{client.whatsapp || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{client.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Onboarded:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {formatDate(client.onboardedDate)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientInfo;