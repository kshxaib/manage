const Loader = ({ fullScreen = true, message = "Loading..." }) => {
    if (fullScreen) {
        return (
            <div className="min-h-screen bg-bg-app flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-text-secondary">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
