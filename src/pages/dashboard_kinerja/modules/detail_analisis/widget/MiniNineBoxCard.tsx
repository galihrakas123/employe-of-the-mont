import React from 'react';

export const MiniNineBoxCard: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '18px',
      }}
    >
      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
        Matriks Kinerja dan Potensial
      </h4>
      <p style={{ margin: '2px 0 12px 0', fontSize: '0.72rem', color: '#64748b' }}>
        Posisi unit pada sembilan kotak evaluasi kinerja P3DW
      </p>

      {/* Mini 9-Box Grid with Box 9 dot selected */}
      <div
        style={{
          position: 'relative',
          height: '190px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          background: '#ffffff',
        }}
      >
        <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#475569' }}>Box 7</span>
        </div>
        <div style={{ background: '#f1f5f9', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#475569' }}>Box 8</span>
        </div>
        <div style={{ background: '#e0f2fe', borderBottom: '1px solid #e2e8f0', padding: '4px', position: 'relative' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0369a1' }}>Box 9</span>
          {/* Active Highlight Marker Circle with Dot */}
          <div
            style={{
              position: 'absolute',
              right: '16px',
              bottom: '12px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#1d4ed8',
              border: '3px solid #ffffff',
              boxShadow: '0 0 0 4px rgba(29, 78, 216, 0.35)',
            }}
          />
        </div>

        <div style={{ background: '#fef2f2', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#991b1b' }}>Box 4</span>
        </div>
        <div style={{ background: '#fffbeb', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#92400e' }}>Box 5</span>
        </div>
        <div style={{ background: '#f0fdf4', borderBottom: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#166534' }}>Box 6</span>
        </div>

        <div style={{ background: '#fee2e2', borderRight: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#b91c1c' }}>Box 1</span>
        </div>
        <div style={{ background: '#fef3c7', borderRight: '1px solid #e2e8f0', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#b45309' }}>Box 2</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '4px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#475569' }}>Box 3</span>
        </div>
      </div>

      <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
        ● Posisi Saat Ini: Box 9 (Bintang Utama)
      </div>
    </div>
  );
};

export default MiniNineBoxCard;
