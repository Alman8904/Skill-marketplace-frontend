import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import UpdateUserSkill from './UpdateUserSkill';
import { getErrorMessage } from '../../utils/errorHandler';

export default function MySkills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    loadMySkills();
  }, []);

  const loadMySkills = async () => {
    try {
      const response = await api.get('/user-skills/all-userSkills');
      setSkills(response.data || []);
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleDeactivate = async (userSkillId) => {
    if (!confirm('Deactivate this skill?')) return;
    try {
      await api.delete(`/user-skills/deactivate/${userSkillId}`);
      setMessage('Skill deactivated');
      loadMySkills();
    } catch (err) {
      setMessage(getErrorMessage(err));
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>My Skills</h3>
        <button onClick={() => navigate('/provider/assign-skill')} className="btn-primary">
          + Assign New Skill
        </button>
      </div>
      {message && (
        <div className={`message ${message.includes('success') || message.includes('deactivated') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      {skills.length === 0 ? (
        <div className="card">
          <p className="text-muted">No skills assigned yet</p>
        </div>
      ) : (
        <div className="provider-grid">
          {skills.map((s) => (
            <div key={s.userSkillId} className="provider-card">
              <h4>{s.skillName}</h4>
              <p><strong>Description:</strong> {s.description}</p>
              <p><strong>Rate:</strong> ₹{s.rate}/hr</p>
              <p><strong>Experience:</strong> {s.experience} years</p>
              <p><strong>Mode:</strong> {s.serviceMode}</p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingSkill(s)} className="btn-primary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDeactivate(s.userSkillId)} className="btn-danger btn-sm">
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
