import { useState } from "react";
import api from "../../api";

export default function DeleteUser({ onDeleted }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    setLoading(true);
    try {
      await api.delete("/public/user/delete");
      setMessage("Account deleted");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      if (onDeleted) onDeleted();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="card">
    <h3 className="text-error">Delete Account</h3>
    <p className="text-warning">This action cannot be undone!</p>
    <button onClick={handleDelete} className="btn-danger" disabled={loading}>
      {loading ? 'Deleting...' : 'Delete My Account'}
    </button>
    {message && <p className="message message-error mt-md">{message}</p>}
  </div>
  );
}