import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // If we have a different role, or no role but a token, go to /
    // App.jsx will then redirect to the correct dashboard (if role exists) 
    // or stay on /login (if role is missing).
    return <Navigate to="/" replace />;
  }

  return children;
}
