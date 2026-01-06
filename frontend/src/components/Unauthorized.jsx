import { useNavigate } from 'react-router-dom';

const Unauthorized = ({ message = "You don't have permission to access this page" }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-bg-card border border-border rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger/10 mb-4">
                            <svg
                                className="w-10 h-10 text-danger"
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
                        <h1 className="text-6xl font-bold text-text-primary mb-2">403</h1>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">
                            Access Denied
                        </h2>
                    </div>

                    <p className="text-text-secondary mb-8">
                        {message}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 border border-border text-text-primary rounded-lg
                                     hover:bg-bg-muted transition-colors duration-200"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg
                                     hover:bg-primary-hover transition-colors duration-200"
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
