import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
