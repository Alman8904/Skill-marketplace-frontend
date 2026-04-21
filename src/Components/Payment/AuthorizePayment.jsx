import { useState } from 'react';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function AuthorizePayment({ orderId, amount, onAuthorized }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const handleAuthorize = async () => {
    if (!confirm(`Authorize payment of ₹${amount}? This will lock funds in your wallet.`)) {
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/payment/authorize', {
        orderId: orderId,
        amount: amount
      });
      setMessage(`Payment authorized! Remaining balance: ₹${response.data.walletBalance}`);
      setAuthorized(true);
      setTimeout(() => {
        if (onAuthorized) onAuthorized();
      }, 1500);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (authorized) {
    return (
      <div className="card card-gradient">
        <h4>Payment Authorized!</h4>
        <p>{message}</p>
        <p className="text-muted"><small>Redirecting you back...</small></p>
      </div>
    );
  }

  return (
    <div className="card">
      <h4>Authorization Required</h4>
      <p>Amount: <strong>₹{amount}</strong></p>
      <p className="text-muted">This will lock funds in escrow until work is delivered.</p>
      <p className="text-muted"><small>Provider cannot accept order until you authorize payment.</small></p>
      <button onClick={handleAuthorize} disabled={loading} className="btn-primary">
        {loading ? 'Authorizing...' : 'Authorize Payment'}
      </button>
      {message && !authorized && (
        <div className="message message-error mt-md">{message}</div>
      )}
    </div>
  );
}
