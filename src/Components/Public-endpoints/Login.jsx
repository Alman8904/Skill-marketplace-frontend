import { useState } from "react";
import { buildUrl } from "../../config/api";

export default function Login({ onLoginSuccess }) {

  const [form, setForm] = useState({
    username: "",
    password: ""
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
      const res = await fetch(buildUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login failed");
      }

      const token = await res.text();
      localStorage.setItem("token", token);

      setMessage("Login successful");
      onLoginSuccess();
    } catch (err) {
      setMessage(err.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />
      <br /><br />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br /><br />
      <button type="submit" className="btn-primary">Login</button>
    </form>
    {message && <p className="message message-error mt-md">{message}</p>}
  </div>
  );
}