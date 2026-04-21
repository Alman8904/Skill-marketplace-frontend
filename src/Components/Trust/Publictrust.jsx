import { useState, useMemo } from "react";
import api from "../../api";

export default function PublicTrust() {
  const [username, setUsername] = useState("");
  const [trust, setTrust] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-detect target user type based on current user's role
  const targetUserType = useMemo(() => {
    const role = localStorage.getItem('role');
    return role === "PROVIDER" ? "consumer" : "provider";
  }, []);

  const loadTrust = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage("Please enter a username");
      return;
    }

    setLoading(true);
    setMessage("");
    setTrust(null);

    try {
      const endpoint = targetUserType === "provider"
        ? `/trust/provider/${encodeURIComponent(username.trim())}`
        : `/trust/consumer/${encodeURIComponent(username.trim())}`;
      const response = await api.get(endpoint);
      const data = response.data;

      // If the backend returns a default object even for non-existent users,
      // we check if it has any actual user data or if it's just a placeholder.
      if (!data || (data.completedJobs === 0 && data.cancelledJobs === 0 && data.refundCount === 0 && data.trustBadge === 'NEW')) {
        if (!data.username && !data.id && !data.userId) {
          throw new Error("User not found or no trust data available");
        }
      }
      setTrust(data);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Failed to load trust score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-md">Check {targetUserType === 'provider' ? 'Provider' : 'Consumer'} Trust</h3>
      <div className="card">
        <form onSubmit={loadTrust} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input
              type="text"
              className="w-100"
              placeholder={`Enter ${targetUserType} username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Searching..." : `Search ${targetUserType === 'provider' ? 'Provider' : 'Consumer'}`}
          </button>
        </form>
      </div>

      {message && <div className="message message-error mt-md">{message}</div>}

      {trust && (
        <div className="card mt-md">
          <div className="trust-badge-container">
            <span className={`trust-badge badge-${trust.trustBadge.toLowerCase()}`}>
              {trust.trustBadge}
            </span>
          </div>

          <div className="trust-stats">
            <h4>Trust Report: {username}</h4>
            <div className="stat-grid mt-sm">
              <div className="stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{trust.completedJobs}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cancelled:</span>
                <span className="stat-value">{trust.cancelledJobs}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Refunds:</span>
                <span className="stat-value">{trust.refundCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate:</span>
                <span className="stat-value">{trust.completionRate?.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="trust-description mt-md p-sm bg-surface rounded">
            <p className="text-secondary italic">
              {trust.trustBadge === "TRUSTED" && "✓ This user has a high completion rate and no recent issues."}
              {trust.trustBadge === "NEUTRAL" && "⚠ This user has a standard track record."}
              {trust.trustBadge === "RISKY" && "‼ Caution: This user has a high cancellation or refund rate."}
              {trust.trustBadge === "NEW" && "ⓘ This is a new user with limited transaction history."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
