import { useEffect, useState } from 'react';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function ReceivedOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [deliveringOrderId, setDeliveringOrderId] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryNotes: '',
    deliveryUrl: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/received-orders');
      setOrders(response.data || []);
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleAccept = async (orderId) => {
    if (!deadline) {
      alert('Please enter deadline');
      return;
    }
    try {
      await api.post(`/orders/accept?orderId=${orderId}&deadline=${deadline}`);
      setMessage('Order accepted');
      setAcceptingOrderId(null);
      setDeadline('');
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleStartWork = async (orderId) => {
    try {
      await api.post(`/orders/start-work?orderId=${orderId}`);
      setMessage('Work started');
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleDeliver = async (orderId) => {
    if (!deliveryForm.deliveryNotes && !deliveryForm.deliveryUrl) {
      alert('Provide delivery notes or URL');
      return;
    }
    try {
      await api.post('/orders/deliver-work', {
        orderId: orderId,
        deliveryNotes: deliveryForm.deliveryNotes,
        deliveryUrl: deliveryForm.deliveryUrl
      });
      setMessage('Work delivered');
      setDeliveringOrderId(null);
      setDeliveryForm({ deliveryNotes: '', deliveryUrl: '' });
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace('_', '-')}`;
  };

  if (orders.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">{message || 'No orders received yet'}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Received Orders</h3>
      {message && (
        <div className={`message ${message.includes('success') || message.includes('accepted') || message.includes('started') || message.includes('delivered') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      <div className="order-grid">
        {orders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h4>Order #{order.orderId}</h4>
              <span className={getStatusClass(order.status)}>{order.status}</span>
            </div>
            <p><strong>Consumer:</strong> {order.consumerName}</p>
            <p><strong>Skill:</strong> {order.skillName}</p>
            <p><strong>Price:</strong> ₹{order.agreedPrice}</p>
            <p><strong>Description:</strong> {order.description}</p>
            {order.deadline && <p><strong>Deadline:</strong> {new Date(order.deadline).toLocaleString()}</p>}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {order.status === 'PENDING' && (
                <>
                  {acceptingOrderId === order.orderId ? (
                    <div className="card" style={{ width: '100%', marginTop: '8px' }}>
                      <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleAccept(order.orderId)} className="btn-success">
                          Confirm Accept
                        </button>
                        <button onClick={() => setAcceptingOrderId(null)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setAcceptingOrderId(order.orderId)} className="btn-primary">
                      Accept Order
                    </button>
                  )}
                </>
              )}
              {order.status === 'ACCEPTED' && (
                <button onClick={() => handleStartWork(order.orderId)} className="btn-success">
                  Start Work
                </button>
              )}
              {order.status === 'IN_PROGRESS' && (
                <>
                  {deliveringOrderId === order.orderId ? (
                    <div className="card" style={{ width: '100%', marginTop: '8px' }}>
                      <textarea
                        placeholder="Delivery notes"
                        value={deliveryForm.deliveryNotes}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })}
                        rows={3}
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        placeholder="Delivery URL (https://...)"
                        value={deliveryForm.deliveryUrl}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryUrl: e.target.value })}
                        style={{ marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleDeliver(order.orderId)} className="btn-success">
                          Submit Delivery
                        </button>
                        <button onClick={() => setDeliveringOrderId(null)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setDeliveringOrderId(order.orderId)} className="btn-success">
                      Deliver Work
                    </button>
                  )}
                </>
              )}
              {order.status === 'DELIVERED' && (
                <p className="text-muted">Waiting for consumer to approve delivery</p>
              )}
              {order.status === 'COMPLETED' && (
                <p className="text-success">Order completed</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
