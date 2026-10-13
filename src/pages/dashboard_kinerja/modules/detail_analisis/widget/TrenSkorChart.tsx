import React from 'react';

export const TrenSkorChart: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        Tren Skor Total (Triwulan)
      </div>

      <svg viewBox="0 0 240 160" style={{ width: '100%', height: '160px' }}>
        {/* Y Axis ticks & horizontal grid lines */}
        <text x="20" y="24" fontSize="6.5" fill="#94a3b8" textAnchor="end">100</text>
        <line x1="26" y1="22" x2="230" y2="22" stroke="#f1f5f9" />

        <text x="20" y="44" fontSize="6.5" fill="#94a3b8" textAnchor="end">95</text>
        <line x1="26" y1="42" x2="230" y2="42" stroke="#f1f5f9" />

        <text x="20" y="64" fontSize="6.5" fill="#94a3b8" textAnchor="end">90</text>
        <line x1="26" y1="62" x2="230" y2="62" stroke="#f1f5f9" />

        <text x="20" y="84" fontSize="6.5" fill="#94a3b8" textAnchor="end">85</text>
        <line x1="26" y1="82" x2="230" y2="82" stroke="#f1f5f9" />

        <text x="20" y="104" fontSize="6.5" fill="#94a3b8" textAnchor="end">80</text>
        <line x1="26" y1="102" x2="230" y2="102" stroke="#f1f5f9" />

        <text x="20" y="124" fontSize="6.5" fill="#94a3b8" textAnchor="end">75</text>
        <line x1="26" y1="122" x2="230" y2="122" stroke="#f1f5f9" />

        {/* Shaded Area under curve */}
        <polygon
          points="35,92 72,95 110,99 150,103 190,105 220,108 220,140 35,140"
          fill="rgba(245, 158, 11, 0.12)"
        />

        {/* Trend line */}
        <polyline
          points="35,92 72,95 110,99 150,103 190,105 220,108"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />

        {/* Data points */}
        <circle cx="35" cy="92" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="72" cy="95" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="110" cy="99" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="150" cy="103" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="190" cy="105" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="220" cy="108" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

        {/* X Axis Labels */}
        <text x="35" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Mei</text>
        <text x="72" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Jun</text>
        <text x="110" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Jul</text>
        <text x="150" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Ags</text>
        <text x="190" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Sep</text>
        <text x="220" y="152" fontSize="7" fill="#94a3b8" textAnchor="middle">Okt</text>
      </svg>
    </div>
  );
};

export default TrenSkorChart;
