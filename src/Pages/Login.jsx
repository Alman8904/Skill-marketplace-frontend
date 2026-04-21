import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';
import { extractRoleFromToken } from '../utils/jwtDecoder';
import ThemeToggle from '../Components/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/login', form, {
        responseType: 'text'  // Backend may return plain JWT or JSON string
      });

      // Backend may return: plain text JWT, or JSON string like {"token":"..."}
      let token = response.data;
      if (typeof token === 'string') {
        const parsed = (() => { try { return JSON.parse(token); } catch { return null; } })();
        if (parsed && typeof parsed === 'object') {
          token = parsed.token || parsed.jwt || parsed.accessToken || parsed.access_token;
        }
      }
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid login response: no token received');
      }
      localStorage.setItem('token', token);

      // Try to extract role from JWT token first
      let role = extractRoleFromToken(token);
      
      // If role not in token, try to fetch from profile endpoint
      if (!role) {
        try {
          const profileRes = await api.get('/public/user/profile');
          const profile = profileRes.data;
          role = profile?.userType || profile?.role || 'CONSUMER';
        } catch (err) {
          // If profile fetch fails, default to CONSUMER
          console.warn('Could not fetch user profile, defaulting to CONSUMER');
          role = 'CONSUMER';
        }
      }

      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'PROVIDER') {
        navigate('/provider');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/consumer');
      }
    } catch (err) {
      setMessage(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <div className="auth-card">
        <h1 className="auth-title">Skill Marketplace</h1>
        <h2 className="text-center">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && (
          <p className={`message ${message.includes('success') ? 'message-success' : 'message-error'} mt-md`}>
            {message}
          </p>
        )}
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
