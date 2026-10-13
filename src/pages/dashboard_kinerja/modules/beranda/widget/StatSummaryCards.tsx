import React from 'react';
import { Award, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockDashboardMetrics } from '@/services/dashboardMockData';

export const StatSummaryCards: React.FC = () => {
  const m = mockDashboardMetrics;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
      }}
    >
      {/* Card 1: Rata-rata Skor KPI */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Rata-rata Skor KPI
          </span>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
            }}
          >
            <TrendingUp size={16} />
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {m.rataRataKpi} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            {m.rataRataSub}
          </div>
        </div>
      </div>

      {/* Card 2: Cabang Bintang Utama */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Cabang Bintang Utama
          </span>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
            }}
          >
            <Star size={16} fill="#8b5cf6" />
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {m.cabangBintang} <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#64748b' }}>P3DW</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '6px', fontWeight: 500 }}>
            {m.cabangBintangSub}
          </div>
        </div>
      </div>

      {/* Card 3: Realisasi PKU terhadap target */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Realisasi PKU terhadap target
          </span>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            Rp
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {m.realisasiPku}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            {m.realisasiPkuSub}
          </div>
        </div>
      </div>

      {/* Card 4: Unit perlu perhatian (Red bordered alert) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #fca5a5',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Unit perlu perhatian
          </span>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <AlertTriangle size={16} />
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#dc2626', lineHeight: 1.1 }}>
            {m.unitPerhatian} <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#dc2626' }}>P3DW</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '6px', fontWeight: 600 }}>
            {m.unitPerhatianSub}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatSummaryCards;
