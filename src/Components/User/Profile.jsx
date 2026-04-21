import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import UpdateProfile from './UpdateProfile';
import DeleteUser from './DeleteUser';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/public/user/profile');
      setUser(response.data);
    } catch (err) {
      setMessage(err.message || 'Failed to load profile');
    }
  };

  const handleDeleted = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="card">
        <p className="text-muted">{message || 'Loading profile...'}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Profile</h3>
      <div className="card">
        <h4>{user.firstName} {user.lastName}</h4>
        <p className="text-muted">Username: {user.username}</p>
        <p className="text-muted"><span className="status-badge status-accepted">{user.userType}</span></p>
        {!showUpdate && (
          <button onClick={() => setShowUpdate(true)} className="btn-primary btn-sm mt-md">
            Update Profile
          </button>
        )}
      </div>

      {showUpdate && (
        <UpdateProfile
          user={user}
          onUpdated={() => {
            setShowUpdate(false);
            loadProfile();
          }}
          onCancel={() => setShowUpdate(false)}
        />
      )}

      <DeleteUser onDeleted={handleDeleted} />
    </div>
  );
}
