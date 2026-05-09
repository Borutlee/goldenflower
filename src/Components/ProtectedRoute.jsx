import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // لو لسه بيجيب بيانات اليوزر استنى
    if (loading) return null;

    // لو مش logged in وديه على Auth
    if (!user) return <Navigate to="/Auth" replace />;

    // لو logged in وريه الصفحة
    return children;
}