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
    return <Navigate to={role === 'PROVIDER' ? '/provider' : '/consumer'} replace />;
  }
  return <Navigate to="/login" replace />;
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
              return <Navigate to={role === 'PROVIDER' ? '/provider' : '/consumer'} replace />;
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
              return <Navigate to={role === 'PROVIDER' ? '/provider' : '/consumer'} replace />;
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
      <Route path="/" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
