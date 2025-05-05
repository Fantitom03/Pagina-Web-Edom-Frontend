import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { can } from '../utils/auth';

export default function PrivateRoute({ children, requiredPermission }) {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" replace />;
    if (requiredPermission && !can(user, requiredPermission)) {
        return <Navigate to="/items" replace />;
    }
    
    return children;
}