import React from 'react';
import { Lightbulb } from 'lucide-react';

export const InsightBannerCard: React.FC = () => {
  return (
    <div
      style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d97706',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <Lightbulb size={16} />
      </div>

      <div>
        <strong style={{ fontSize: '0.84rem', color: '#92400e', display: 'block', marginBottom: '2px' }}>
          Insight Sistem
        </strong>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#b45309', lineHeight: 1.5 }}>
          Cabang ini sangat unggul dalam Realisasi Pendapatan (Area A: 88%). Namun indikator sub-aspek operasional
          E (SDM &amp; Koordinasi) berada di angka kritis (45%). Perlu pendampingan pada manajemen kepala cabang.
        </p>
      </div>
    </div>
  );
};

export default InsightBannerCard;
