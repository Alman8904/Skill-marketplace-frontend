import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function AssignSkill({ onUpdated }) {

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    skillId: "",
    description: "",
    rate: "",
    experience: "",
    serviceMode: "REMOTE"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await authFetch("/admin/skills");
      setSkills(data.content || data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load skills");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        skills: [
          {
            skillId: Number(form.skillId),
            description: form.description,
            rate: Number(form.rate),
            experience: Number(form.experience),
            serviceMode: form.serviceMode
          }
        ]
      };

      await authFetch("/user-skills/assign", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setMessage("Skill assigned successfully!");
      if (onUpdated) onUpdated();

      setForm({
        skillId: "",
        description: "",
        rate: "",
        experience: "",
        serviceMode: "REMOTE"
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to assign skill");
    }
  };

  return (
    <div>
      <h3>Assign Skill</h3>

      <form onSubmit={handleSubmit}>
        <select
          name="skillId"
          value={form.skillId}
          onChange={handleChange}
          required
        >
          <option value="">Select Skill</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.skillName}
            </option>
          ))}
        </select>
        <br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        <input
          name="rate"
          type="number"
          placeholder="Rate"
          value={form.rate}
          onChange={handleChange}
        />
        <br />

        <input
          name="experience"
          type="number"
          placeholder="Experience (years)"
          value={form.experience}
          onChange={handleChange}
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

        <button type="submit">Assign Skill</button>
      </form>

      <p>{message}</p>
    </div>
  );
}