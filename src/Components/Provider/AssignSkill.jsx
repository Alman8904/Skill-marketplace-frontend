import { useEffect, useState } from 'react';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function AssignSkill({ onUpdated, onCancel }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    skillId: '',
    description: '',
    rate: '',
    experience: '',
    serviceMode: 'REMOTE'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await api.get('/admin/skills');
      setSkills(response.data.content || response.data);
    } catch (err) {
      setMessage(getErrorMessage(err));
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
      await api.post('/user-skills/assign', payload);
      setMessage('Skill assigned successfully!');
      if (onUpdated) onUpdated();
      setForm({
        skillId: '',
        description: '',
        rate: '',
        experience: '',
        serviceMode: 'REMOTE'
      });
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h3>Assign Skill</h3>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <select name="skillId" value={form.skillId} onChange={handleChange} required>
            <option value="">Select Skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.skillName}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="rate"
            type="number"
            placeholder="Rate (₹/hr)"
            value={form.rate}
            onChange={handleChange}
          />
          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
          />
          <select name="serviceMode" value={form.serviceMode} onChange={handleChange}>
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">Assign Skill</button>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && (
          <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'} mt-md`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
