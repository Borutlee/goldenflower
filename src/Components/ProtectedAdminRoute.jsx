import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/Auth" replace />;

    if (user?.user_metadata?.role !== 'admin') return <Navigate to="/" replace />;

    return children;
}