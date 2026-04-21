import { useEffect, useState } from 'react';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function Wallet() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await api.get('/payment/wallet-balance');
      setBalance(response.data.walletBalance);
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      setMessage('Amount must be positive');
      return;
    }
    setLoading(true);
    try {
      await api.post('/payment/add-funds', { amount: Number(amount) });
      setMessage(`₹${amount} added successfully!`);
      setAmount('');
      loadBalance();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Wallet</h3>
      <div className="card card-gradient">
        <h4 style={{ marginBottom: '16px' }}>Current Balance</h4>
        <div style={{ fontSize: '32px', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '24px' }}>
          ₹{balance !== null ? balance.toFixed(2) : '0.00'}
        </div>
        <button onClick={loadBalance} className="btn-secondary btn-sm">Refresh Balance</button>
      </div>
      <div className="card">
        <h4 style={{ marginBottom: '16px' }}>Add Funds</h4>
        <form onSubmit={handleAddFunds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Funds'}
          </button>
        </form>
        {message && (
          <div className={`message ${message.includes('success') || message.includes('added') ? 'message-success' : 'message-error'} mt-md`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
