import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Layout/DashboardLayout';
import MyOrders from '../Components/Consumer/MyOrders';
import PlaceOrder from '../Components/Consumer/PlaceOrder';
import Wallet from '../Components/Consumer/Wallet';
import SearchProviders from '../Components/Consumer/SearchProviders';
import MyTrust from '../Components/Trust/Mytrust';
import PublicTrust from '../Components/Trust/Publictrust';
import Profile from '../Components/User/Profile';
import api from '../api';

export default function ConsumerDashboard() {
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
    { path: '/consumer', label: 'My Orders' },
    { path: '/consumer/place-order', label: 'Place Order' },
    { path: '/consumer/wallet', label: 'Wallet' },
    { path: '/consumer/search', label: 'Search Providers' },
    { path: '/consumer/trust', label: 'My Trust' },
    { path: '/consumer/check-trust', label: 'Check Trust' },
    { path: '/consumer/profile', label: 'Profile' }
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      title="Consumer Dashboard"
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<MyOrders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/search" element={<SearchProviders />} />
        <Route path="/trust" element={<MyTrust />} />
        <Route path="/check-trust" element={<PublicTrust />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}
