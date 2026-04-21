import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function UpdateUserSkill({ skill, onUpdated, onCancel }) {

  const [form, setForm] = useState({
    description: skill.description || "",
    rate: skill.rate || "",
    experience: skill.experience || "",
    serviceMode: skill.serviceMode || "REMOTE"
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
      await authFetch(`/user-skills/update/${skill.userSkillId}`, {
        method: "PUT",
        body: JSON.stringify({
          description: form.description,
          rate: Number(form.rate),
          experience: Number(form.experience),
          serviceMode: form.serviceMode
        })
      });

      setMessage("Skill updated successfully");
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update skill");
    }
  };

  return (
    <div>
      <h3>Update Skill: {skill.skillName}</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="rate"
          type="number"
          placeholder="Rate"
          value={form.rate}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="experience"
          type="number"
          placeholder="Experience (years)"
          value={form.experience}
          onChange={handleChange}
          required
        />
        <br />

        <select
          name="serviceMode"
          value={form.serviceMode}
          onChange={handleChange}
        >
          <option value="REMOTE">REMOTE</option>
          <option value="LOCAL">LOCAL</option>
        </select>
        <br /><br />

        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}