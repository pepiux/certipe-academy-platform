
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    // While checking authentication status, show loading indicator
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  // If no user or (admin required and user is not admin), redirect to login
  if (!user || (requireAdmin && (!profile || !profile.is_admin))) {
    return <Navigate to="/" replace />;
  }

  // Authentication successful, render the protected component
  return children;
};
