import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

export default function Sidebar({ items, onItemClick, onLogout, user }) {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">Skill Marketplace</span>
      </div>

      {user && (
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <span className="sidebar-user-name">
            {user.firstName} {user.lastName}
          </span>
        </div>
      )}

      <div className="sidebar-nav">
        {items.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/consumer' && item.path !== '/provider' && location.pathname.startsWith(item.path + '/'));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onItemClick}
            >
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-theme-toggle">
          <ThemeToggle />
        </div>
        <button className="sidebar-item logout-link" onClick={onLogout}>
          <span className="sidebar-item-label">Log out</span>
        </button>
      </div>
    </nav>
  );
}
