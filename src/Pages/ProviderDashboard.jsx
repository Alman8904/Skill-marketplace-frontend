import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Layout/DashboardLayout';
import ReceivedOrders from '../Components/Provider/ReceivedOrders';
import MySkills from '../Components/Provider/MySkills';
import AssignSkill from '../Components/Provider/AssignSkill';
import MyTrust from '../Components/Trust/Mytrust';
import Profile from '../Components/User/Profile';
import PublicTrust from '../Components/Trust/Publictrust';
import api from '../api';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/public/user/profile');
      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const sidebarItems = [
    { path: '/provider', label: 'Received Orders' },
    { path: '/provider/my-skills', label: 'My Skills' },
    { path: '/provider/assign-skill', label: 'Assign Skill' },
    { path: '/provider/trust', label: 'My Trust' },
    { path: '/provider/check-trust', label: 'Check Trust' },
    { path: '/provider/profile', label: 'Profile' }
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      title="Provider Dashboard"
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<ReceivedOrders />} />
        <Route path="/my-skills" element={<MySkills />} />
        <Route path="/assign-skill" element={<AssignSkill onUpdated={() => navigate('/provider/my-skills')} onCancel={() => navigate('/provider/my-skills')} />} />
        <Route path="/trust" element={<MyTrust />} />
        <Route path="/check-trust" element={<PublicTrust />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}
