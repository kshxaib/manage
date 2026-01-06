import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import Unauthorized from './Unauthorized';

const AdminRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== 'ADMIN') {
        return <Unauthorized message="Only administrators can access this page" />;
    }

    return children;
};

export default AdminRoute;
