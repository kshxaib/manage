const Loader = ({ fullScreen = true, message = "Loading..." }) => {
    if (fullScreen) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Loader;