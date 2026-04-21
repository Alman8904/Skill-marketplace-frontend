import { useState } from 'react';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function UpdateUserSkill({ skill, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    description: skill.description || '',
    rate: skill.rate || '',
    experience: skill.experience || '',
    serviceMode: skill.serviceMode || 'REMOTE'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/user-skills/update/${skill.userSkillId}`, {
        description: form.description,
        rate: Number(form.rate),
        experience: Number(form.experience),
        serviceMode: form.serviceMode
      });
      setMessage('Skill updated successfully');
      if (onUpdated) onUpdated();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h3>Update Skill: {skill.skillName}</h3>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            name="rate"
            type="number"
            placeholder="Rate (₹/hr)"
            value={form.rate}
            onChange={handleChange}
            required
          />
          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
            required
          />
          <select name="serviceMode" value={form.serviceMode} onChange={handleChange}>
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">Update</button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
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
