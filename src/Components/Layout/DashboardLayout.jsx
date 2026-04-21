import { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';

export default function DashboardLayout({ sidebarItems, children, title, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : '';

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} aria-hidden="true" />
      )}
      <div className={`sidebar-wrap ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar items={sidebarItems} onLogout={onLogout} onItemClick={() => setSidebarOpen(false)} user={user} />
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
              Menu
            </button>
            <div className="header-greeting">
              <h1 className="greeting-text">HELLO, {userName.toUpperCase()}!</h1>
              <p className="greeting-subtitle">{title}</p>
            </div>
          </div>

        </header>

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
