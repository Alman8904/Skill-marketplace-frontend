import { useState } from "react";
import { buildUrl } from "../../config/api";

export default function CreateUser() {

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "CONSUMER"
  });

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
      const res = await fetch(buildUrl("/auth/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed");
      }

      setMessage("User created successfully! Please login.");
      setForm({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        userType: "CONSUMER"
      });
    } catch (err) {
      setMessage(err.message || "Failed to create user");
      console.error(err);
    }
  };

  return (
    <div>
    <h2>Create Account</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <br /><br />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <br /><br />
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
      />
      <br /><br />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
      />
      <br /><br />
      <select
        name="userType"
        value={form.userType}
        onChange={handleChange}
      >
        <option value="CONSUMER">Consumer</option>
        <option value="PROVIDER">Provider</option>
      </select>
      <br /><br />
      <button type="submit" className="btn-primary">Create Account</button>
    </form>
    {message && (
      <p className={message.includes('success') ? 'message message-success mt-md' : 'message message-error mt-md'}>
        {message}
      </p>
    )}
  </div>
  );
}