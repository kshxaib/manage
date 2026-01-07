import { useNavigate } from 'react-router-dom';

const Unauthorized = ({ message = "You don't have permission to access this page" }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Access Denied
                        </h2>
                    </div>

                    <p className="text-gray-600 mb-8">
                        {message}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;