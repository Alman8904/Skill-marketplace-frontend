import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function PlaceOrder({ onOrderPlaced }) {
  const navigate = useNavigate();
  const [prefillData, setPrefillData] = useState(null);
  const [form, setForm] = useState({
    description: '',
    estimatedHours: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const prefill = localStorage.getItem('prefillOrder');
    if (prefill) {
      try {
        const data = JSON.parse(prefill);
        setPrefillData(data);
      } catch (err) {
        console.error("Failed to parse prefill info", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prefillData) return;

    try {
      if (!prefillData.providerId || !prefillData.skillId) {
        console.error("Missing IDs in prefillData:", prefillData);
        throw new Error(`Missing IDs: Provider=${prefillData.providerId}, Skill=${prefillData.skillId}. Data: ${JSON.stringify(prefillData)}`);
      }

      await api.post('/orders/place', {
        providerId: Number(prefillData.providerId),
        skillId: Number(prefillData.skillId),
        description: form.description,
        estimatedHours: Number(form.estimatedHours)
      });
      setMessage('Order placed successfully!');
      localStorage.removeItem('prefillOrder');
      if (onOrderPlaced) onOrderPlaced();
      setTimeout(() => navigate('/consumer'), 1500);
    } catch (err) {
      setMessage(err.message.includes('Missing IDs') ? err.message : getErrorMessage(err));
    }
  };

  if (!prefillData) {
    return (
      <div className="card text-center">
        <h3>Place Order</h3>
        <p className="text-muted mt-md">Please select a provider from the search results first.</p>
        <Link to="/consumer/search" className="btn-primary mt-md" style={{ display: 'inline-block' }}>
          Search Providers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3>Place Order</h3>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label><strong>Provider:</strong></label>
            <p className="mt-xs">{prefillData.providerName}</p>
          </div>
          <div className="form-group">
            <label><strong>Skill:</strong></label>
            <p className="mt-xs">{prefillData.skillName}</p>
          </div>

          <textarea
            name="description"
            placeholder="Tell the provider what you need..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
          <input
            name="estimatedHours"
            type="number"
            placeholder="Estimated hours for the task"
            value={form.estimatedHours}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Confirm & Place Order</button>
          <Link to="/consumer/search" className="btn-secondary text-center">Cancel</Link>
        </form>
        {message && (
          <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'} mt-md`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
