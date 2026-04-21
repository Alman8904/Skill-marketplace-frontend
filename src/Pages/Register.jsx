import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';
import ThemeToggle from '../Components/ThemeToggle';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'CONSUMER'
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
      await api.post('/auth/create', form);
      setMessage('User created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        <h2 className="text-center">Create Account</h2>
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
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            required
          >
            <option value="CONSUMER">Consumer</option>
            <option value="PROVIDER">Provider</option>
          </select>
          <button type="submit" className="btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        {message && (
          <p className={`message ${message.includes('success') ? 'message-success' : 'message-error'} mt-md`}>
            {message}
          </p>
        )}
        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
