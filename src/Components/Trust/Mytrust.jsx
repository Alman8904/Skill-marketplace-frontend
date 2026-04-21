import { useEffect, useState } from "react";
import api from "../../api";

export default function MyTrust() {
  const [trust, setTrust] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrust();
  }, []);

  const loadTrust = async () => {
    try {
      const response = await api.get("/trust/me");
      setTrust(response.data);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Failed to load trust score");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading trust score...</p>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  if (!trust) {
    return <p>No trust data available</p>;
  }

  return (
    <div>
      <h3>My Trust Score</h3>
      <div className="card dashboard-widget">
        <p><strong>Badge:</strong> <span className={`status-badge status-${(trust.trustBadge || '').toLowerCase()}`}>{trust.trustBadge}</span></p>
      </div>

      {trust.jobsAsProvider > 0 && (
        <div className="card mt-md">
          <h4>As Provider</h4>
          <p>Total Jobs: {trust.jobsAsProvider}</p>
          <p>Completed: {trust.completedAsProvider}</p>
          <p>
            Completion Rate:{" "}
            {trust.providerCompletionRate?.toFixed(1)}%
          </p>
        </div>
      )}

      {trust.jobsAsConsumer > 0 && (
        <div className="card mt-md">
          <h4>As Consumer</h4>
          <p>Total Orders Placed: {trust.jobsAsConsumer}</p>
          <p>Refunds Requested: {trust.refundsAsConsumer}</p>
          <p>
            Refund Rate:{" "}
            {trust.consumerRefundRate?.toFixed(1)}%
          </p>
        </div>
      )}

      {trust.jobsAsProvider === 0 &&
        trust.jobsAsConsumer === 0 && (
          <div className="card mt-md">
            <p>
              New user. Start completing orders to build your trust score.
            </p>
          </div>
        )}

      <div className="card mt-md">
        <p><strong>Trust Badge Guide:</strong></p>
        <ul>
          <li><strong>TRUSTED:</strong> 80%+ completion, no refunds</li>
          <li><strong>NEUTRAL:</strong> 50%+ completion rate</li>
          <li><strong>RISKY:</strong> Below 50% completion</li>
          <li><strong>NEW:</strong> No completed orders yet</li>
        </ul>
      </div>
    </div>
  );
}
