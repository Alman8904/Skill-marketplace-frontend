import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import UpdateUserSkill from "./UpdateUserSkill";

export default function MySkills() {

  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = async () => {
    try {
      const data = await authFetch("/user-skills/all-userSkills");
      setSkills(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load skills");
    }
  };

  const handleDeactivate = async (userSkillId) => {
    if (!confirm("Deactivate this skill?")) return;

    try {
      await authFetch(`/user-skills/deactivate/${userSkillId}`, {
        method: "DELETE"
      });
      setMessage("Skill deactivated");
      loadMySkills();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to deactivate skill");
    }
  };

  if (editingSkill) {
    return (
      <UpdateUserSkill
        skill={editingSkill}
        onUpdated={() => {
          setEditingSkill(null);
          loadMySkills();
        }}
        onCancel={() => setEditingSkill(null)}
      />
    );
  }

  if (!skills.length) {
    return <p>{message || "No skills assigned yet"}</p>;
  }

  return (
    <div>
      <h3>My Skills</h3>

      {skills.map((s) => (
        <div key={s.userSkillId}>
          <b>{s.skillName}</b><br />
          Description: {s.description}<br />
          Rate: ${s.rate}/hr<br />
          Experience: {s.experience} years<br />
          Mode: {s.serviceMode}<br />

          <button onClick={() => setEditingSkill(s)}>Edit</button>
          <button onClick={() => handleDeactivate(s.userSkillId)}>Deactivate</button>
          <hr />
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
}