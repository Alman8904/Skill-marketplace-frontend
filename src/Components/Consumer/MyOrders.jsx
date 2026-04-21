import { useEffect, useState } from 'react';
import api from '../../api';
import AuthorizePayment from '../Payment/AuthorizePayment';
import { getErrorMessage } from '../../utils/errorHandler';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [authorizingOrderId, setAuthorizingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [approvingOrderId, setApprovingOrderId] = useState(null);
  const [refundingOrderId, setRefundingOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data || []);
      setMessage('');
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    setCancellingOrderId(orderId);
    try {
      await api.post(`/orders/cancel?orderId=${orderId}`);
      setMessage('Order cancelled');
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleRefund = async (orderId) => {
    if (!confirm('Refund this order? Funds will be returned to your wallet.')) return;
    setRefundingOrderId(orderId);
    try {
      await api.post(`/payment/refund?orderId=${orderId}`);
      setMessage('Refund processed');
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setRefundingOrderId(null);
    }
  };

  const handleApprove = async (orderId) => {
    if (!confirm('Approve delivery and release payment?')) return;
    setApprovingOrderId(orderId);
    try {
      await api.post(`/orders/approve-delivery?orderId=${orderId}`);
      setMessage('Delivery approved, payment released');
      loadOrders();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setApprovingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace('_', '-')}`;
  };

  if (orders.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">{message || 'No orders yet'}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>My Orders</h3>
      {message && (
        <div className={`message ${message.includes('success') || message.includes('approved') ? 'message-success' : 'message-error'}`}>
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
            <p><strong>Provider:</strong> {order.providerName}</p>
            <p><strong>Skill:</strong> {order.skillName}</p>
            <p><strong>Price:</strong> ₹{order.agreedPrice}</p>
            <p><strong>Description:</strong> {order.description}</p>
            {order.deliveryNotes && <p><strong>Delivery Notes:</strong> {order.deliveryNotes}</p>}
            {order.status === 'COMPLETED' && order.deliveryUrl && (
              <p><strong>Delivery URL:</strong> <a href={order.deliveryUrl} target="_blank" rel="noopener noreferrer">{order.deliveryUrl}</a></p>
            )}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {order.status === 'PENDING' && (
                <>
                  {authorizingOrderId === order.orderId ? (
                    <AuthorizePayment
                      orderId={order.orderId}
                      amount={order.agreedPrice}
                      onAuthorized={() => {
                        setAuthorizingOrderId(null);
                        loadOrders();
                      }}
                    />
                  ) : (
                    <>
                      <button onClick={() => setAuthorizingOrderId(order.orderId)} className="btn-primary">
                        Authorize Payment
                      </button>
                      {(order.paymentStatus === 'AUTHORIZED' || order.mockPaymentStatus === 'AUTHORIZED') && (
                        <button onClick={() => handleRefund(order.orderId)} disabled={refundingOrderId === order.orderId} className="btn-secondary">
                          {refundingOrderId === order.orderId ? 'Refunding...' : 'Refund'}
                        </button>
                      )}
                      <button onClick={() => handleCancel(order.orderId)} disabled={cancellingOrderId === order.orderId} className="btn-danger">
                        {cancellingOrderId === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    </>
                  )}
                </>
              )}
              {order.status === 'ACCEPTED' && <p className="text-muted">Provider accepted. Work will start soon...</p>}
              {order.status === 'IN_PROGRESS' && <p className="text-muted">Provider is working on your order...</p>}
              {order.status === 'DELIVERED' && (
                <button onClick={() => handleApprove(order.orderId)} disabled={approvingOrderId === order.orderId} className="btn-success">
                  {approvingOrderId === order.orderId ? 'Approving...' : 'Approve & Release Payment'}
                </button>
              )}
              {order.status === 'COMPLETED' && <p className="text-success">Order completed. Payment released to provider.</p>}
              {order.status === 'CANCELLED' && <p className="text-muted">Order cancelled.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
