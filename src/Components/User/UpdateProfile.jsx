import { useState, useEffect } from "react";
import api from '../../api';

export default function UpdateProfile({ user, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    userType: ""
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, firstName: user.firstName || "", lastName: user.lastName || "" }));
    }
  }, [user]);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send fields that are filled
      const payload = {};
      if (form.firstName) payload.firstName = form.firstName;
      if (form.lastName) payload.lastName = form.lastName;
      if (form.password) payload.password = form.password;
      if (form.userType) payload.userType = form.userType;

      await api.put("/public/user/update", payload);

      setMessage("Profile updated successfully");
      if (onUpdated) onUpdated();

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        password: "",
        userType: ""
      });
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="card">
    <h3>Update Profile</h3>
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
      />
      <br /><br />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
      />
      <br /><br />
      <input
        name="password"
        type="password"
        placeholder="New Password (min 8 characters)"
        value={form.password}
        onChange={handleChange}
      />
      <br /><br />
      <select
        name="userType"
        value={form.userType}
        onChange={handleChange}
      >
        <option value="">Keep Current User Type</option>
        <option value="PROVIDER">PROVIDER</option>
        <option value="CONSUMER">CONSUMER</option>
      </select>
      <br /><br />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" className="btn-primary">Update</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
      </div>
    </form>
    {message && <p className="message message-success mt-md">{message}</p>}
    <p className="text-muted mt-sm"><small>Leave fields empty to keep current values</small></p>
  </div>
  );
}