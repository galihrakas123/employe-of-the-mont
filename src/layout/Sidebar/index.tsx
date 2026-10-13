import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/beranda', label: 'Dashboard Kinerja', icon: LayoutDashboard },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        borderRight: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Brand Logo */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div
          style={{
            background: '#16a34a',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.4)',
          }}
        >
          <Layers size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            BAPENDA
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
            Jawa Barat
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.08em',
            padding: '8px 12px',
            fontWeight: 700,
          }}
        >
          Menu Evaluasi
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? '#16a34a' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                fontSize: '0.84rem',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid #1e293b' }}>
        <NavLink
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#ef4444',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.08)',
          }}
        >
          <LogOut size={16} />
          <span>Keluar Sistem</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
