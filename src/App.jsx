import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ConsumerDashboard from './Pages/ConsumerDashboard';
import ProviderDashboard from './Pages/ProviderDashboard';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

const getAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { role, isAuthenticated: !!(token && role) };
};

const RedirectHandler = () => {
  const { role, isAuthenticated } = getAuth();
  if (isAuthenticated) {
    if (role === 'PROVIDER') {
      return <Navigate to="/provider" replace />;
    } else if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/consumer" replace />;
    }
  }
  return <Navigate to="/login" replace />;
};

// Temporary Admin Dashboard - can be replaced with actual admin panel
const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          (() => {
            const { role, isAuthenticated } = getAuth();
            if (isAuthenticated) {
              if (role === 'PROVIDER') {
                return <Navigate to="/provider" replace />;
              } else if (role === 'ADMIN') {
                return <Navigate to="/admin" replace />;
              } else {
                return <Navigate to="/consumer" replace />;
              }
            }
            return <Login />;
          })()
        }
      />
      <Route
        path="/register"
        element={
          (() => {
            const { role, isAuthenticated } = getAuth();
            if (isAuthenticated) {
              if (role === 'PROVIDER') {
                return <Navigate to="/provider" replace />;
              } else if (role === 'ADMIN') {
                return <Navigate to="/admin" replace />;
              } else {
                return <Navigate to="/consumer" replace />;
              }
            }
            return <Register />;
          })()
        }
      />
      <Route
        path="/consumer/*"
        element={
          <ProtectedRoute requiredRole="CONSUMER">
            <ConsumerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/*"
        element={
          <ProtectedRoute requiredRole="PROVIDER">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
