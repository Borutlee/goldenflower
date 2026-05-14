import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/Auth" replace />;

    return children;
}