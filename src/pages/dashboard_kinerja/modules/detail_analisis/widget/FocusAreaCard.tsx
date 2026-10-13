import React from 'react';

export const FocusAreaCard: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '18px 20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
          Fokus: Area E (SDM &amp; Koordinasi)
        </h4>
        <span
          style={{
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #fca5a5',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          Defisit 10% | Skor: 45
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#475569' }}>
            <span>Rencana Pembinaan Coaching Manajerial</span>
            <span>30%</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', background: '#dc2626' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#475569' }}>
            <span>Progress OKR Inovasi (Target Q4)</span>
            <span>60%</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: '#f59e0b' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusAreaCard;
