import React from 'react';

export const RadarKomposisiChart: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', alignSelf: 'flex-start', marginBottom: '8px' }}>
        Komposisi 5 Area (Radar)
      </div>

      <svg viewBox="0 0 240 200" style={{ width: '100%', maxHeight: '180px' }}>
        {/* Pentagon web lines */}
        <polygon points="120,25 195,75 168,160 72,160 45,75" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="120,50 170,85 152,142 88,142 70,85" fill="none" stroke="#f1f5f9" strokeWidth="1" />
        <polygon points="120,75 145,95 136,124 104,124 95,95" fill="none" stroke="#f8fafc" strokeWidth="1" />

        {/* Web center spoke lines */}
        <line x1="120" y1="100" x2="120" y2="25" stroke="#cbd5e1" strokeDasharray="2" />
        <line x1="120" y1="100" x2="195" y2="75" stroke="#cbd5e1" strokeDasharray="2" />
        <line x1="120" y1="100" x2="168" y2="160" stroke="#cbd5e1" strokeDasharray="2" />
        <line x1="120" y1="100" x2="72" y2="160" stroke="#cbd5e1" strokeDasharray="2" />
        <line x1="120" y1="100" x2="45" y2="75" stroke="#cbd5e1" strokeDasharray="2" />

        {/* Provinsi benchmark (grey dashed) */}
        <polygon
          points="120,40 175,80 155,145 85,145 65,80"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="3"
        />

        {/* Skor Area (Yellow filled polygon) */}
        <polygon
          points="120,32 180,82 145,150 92,130 58,82"
          fill="rgba(245, 158, 11, 0.25)"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <circle cx="120" cy="32" r="3" fill="#f59e0b" />
        <circle cx="180" cy="82" r="3" fill="#f59e0b" />
        <circle cx="145" cy="150" r="3" fill="#f59e0b" />
        <circle cx="92" cy="130" r="3" fill="#f59e0b" />
        <circle cx="58" cy="82" r="3" fill="#f59e0b" />

        {/* Axis Labels */}
        <text x="120" y="16" textAnchor="middle" fontSize="7.5" fill="#475569" fontWeight="700">A. Pendapatan (40%)</text>
        <text x="202" y="78" textAnchor="start" fontSize="7.5" fill="#475569" fontWeight="700">B. Kepatuhan (20%)</text>
        <text x="175" y="172" textAnchor="middle" fontSize="7.5" fill="#475569" fontWeight="700">C. Pelayanan (20%)</text>
        <text x="65" y="172" textAnchor="middle" fontSize="7.5" fill="#475569" fontWeight="700">D. Tata Kelola (10%)</text>
        <text x="38" y="78" textAnchor="end" fontSize="7.5" fill="#ef4444" fontWeight="700">E. SDM (10%)</text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '2px' }} /> Skor Area
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', border: '1px dashed #94a3b8', borderRadius: '2px' }} /> Rata-rata Provinsi
        </span>
      </div>
    </div>
  );
};

export default RadarKomposisiChart;
