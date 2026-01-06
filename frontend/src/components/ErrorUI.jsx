const ErrorUI = ({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again.",
    onRetry,
    showBackButton = true
}) => {
    const handleGoBack = () => {
        window.history.back();
    };

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
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            {title}
                        </h2>
                    </div>

                    <p className="text-text-secondary mb-8">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {showBackButton && (
                            <button
                                onClick={handleGoBack}
                                className="px-6 py-2.5 border border-border text-text-primary rounded-lg
                                         hover:bg-bg-muted transition-colors duration-200"
                            >
                                Go Back
                            </button>
                        )}
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg
                                         hover:bg-primary-hover transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorUI;
