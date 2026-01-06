import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
