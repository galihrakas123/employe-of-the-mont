import React from 'react';
import { Calendar, Bell, ChevronDown, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header
      style={{
        height: '68px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Brand Title matching Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: '#16a34a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
          }}
        >
          <Layers size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Dashboard Kinerja Strategis
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
            BAPENDA PROVINSI JAWA BARAT
          </div>
        </div>
      </div>

      {/* Right Controls matching Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Periode Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '0.78rem',
            color: '#334155',
            fontWeight: 500,
          }}
        >
          <Calendar size={14} color="#64748b" />
          <span>Periode: <strong>Oktober 2026</strong></span>
        </div>

        {/* Notification Bell */}
        <button
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            position: 'relative',
          }}
          title="Notifikasi"
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ef4444',
            }}
          />
        </button>

        {/* HR Admin SDM Profile Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#e0e7ff',
              color: '#4338ca',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            HR
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
            Admin SDM
          </span>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
};

export default Header;
