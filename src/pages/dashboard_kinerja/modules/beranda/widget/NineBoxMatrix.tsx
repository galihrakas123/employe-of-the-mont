import React from 'react';
import { NineBoxItem } from '@/services/dashboardMockData';

interface NineBoxMatrixProps {
  data: NineBoxItem[];
  selectedItem: NineBoxItem;
  onSelectItem: (item: NineBoxItem) => void;
  onDetailClick: (item: NineBoxItem) => void;
}

export const NineBoxMatrix: React.FC<NineBoxMatrixProps> = ({
  data,
  selectedItem,
  onSelectItem,
  onDetailClick,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
          Matriks Kinerja dan Potensial
        </h3>
        <p style={{ margin: '4px 0 14px 0', fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
          Posisi 34 P3DW: Kinerja (komponen bobot 45 poin) vs Potensial (komponen faktor pendorong 55 poin) P3DW Bapenda Jawa Barat
        </p>

        {/* 9-Box Grid Container */}
        <div style={{ position: 'relative' }}>
          {/* Y Axis Label */}
          <div
            style={{
              position: 'absolute',
              left: '-28px',
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            KINERJA (HASIL) ↑
          </div>

          <div
            style={{
              position: 'relative',
              height: '280px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              background: '#ffffff',
            }}
          >
            {/* Box 7 (Top Left) */}
            <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#334155' }}>Box 7</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Maintain</div>
            </div>

            {/* Box 8 (Top Center) */}
            <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#334155' }}>Box 8</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Strategic Contributor</div>
            </div>

            {/* Box 9 (Top Right - Kapus of the Month) */}
            <div style={{ background: '#e0f2fe', borderBottom: '1px solid #e2e8f0', padding: '6px 8px', position: 'relative' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0369a1' }}>Box 9</div>
              <div style={{ fontSize: '0.6rem', color: '#0284c7', fontWeight: 600 }}>Kapus of the Month ⭐</div>
            </div>

            {/* Box 4 (Middle Left) */}
            <div style={{ background: '#fef2f2', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#991b1b' }}>Box 4</div>
              <div style={{ fontSize: '0.6rem', color: '#dc2626' }}>Develop</div>
            </div>

            {/* Box 5 (Middle Center - Core Contributor) */}
            <div style={{ background: '#fffbeb', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#92400e' }}>Box 5</div>
              <div style={{ fontSize: '0.6rem', color: '#b45309' }}>Core Contributor</div>
            </div>

            {/* Box 6 (Middle Right) */}
            <div style={{ background: '#f0fdf4', borderBottom: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#166534' }}>Box 6</div>
              <div style={{ fontSize: '0.6rem', color: '#15803d' }}>Growth Potential</div>
            </div>

            {/* Box 1 (Bottom Left) */}
            <div style={{ background: '#fee2e2', borderRight: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b91c1c' }}>Box 1</div>
              <div style={{ fontSize: '0.6rem', color: '#ef4444' }}>Priority Improvement</div>
            </div>

            {/* Box 2 (Bottom Center) */}
            <div style={{ background: '#fef3c7', borderRight: '1px solid #e2e8f0', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b45309' }}>Box 2</div>
              <div style={{ fontSize: '0.6rem', color: '#d97706' }}>Monitor</div>
            </div>

            {/* Box 3 (Bottom Right) */}
            <div style={{ background: '#f8fafc', padding: '6px 8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Box 3</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Potential Developee</div>
            </div>

            {/* Scatter points rendered inside grid */}
            {data.map((item) => {
              // Convert 40 - 100 range to 0% - 100%
              const posX = `${Math.min(96, Math.max(4, ((item.potensial - 40) / 60) * 100))}%`;
              const posY = `${Math.min(96, Math.max(4, (1 - (item.kinerja - 40) / 60) * 100))}%`;
              const isSelected = selectedItem.id === item.id;

              const dotColors: Record<string, string> = {
                'Sangat Baik': '#1d4ed8', // Dark Blue
                'Baik': '#0284c7', // Light Blue
                'Cukup': '#d97706', // Amber/Yellow
                'Kurang': '#ea580c', // Orange
                'Perlu Pembinaan': '#dc2626', // Red
              };
              const color = dotColors[item.kategori] || '#0284c7';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  title={`${item.unit} - Kinerja: ${item.kinerja}, Potensial: ${item.potensial}`}
                  style={{
                    position: 'absolute',
                    left: posX,
                    top: posY,
                    transform: 'translate(-50%, -50%)',
                    width: isSelected ? '18px' : '11px',
                    height: isSelected ? '18px' : '11px',
                    borderRadius: '50%',
                    background: color,
                    border: isSelected ? '3px solid #ffffff' : '1.5px solid #ffffff',
                    boxShadow: isSelected
                      ? `0 0 0 4px ${color}66, 0 4px 8px rgba(0,0,0,0.3)`
                      : '0 1px 3px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 20 : 10,
                    transition: 'all 0.2s',
                  }}
                />
              );
            })}
          </div>

          {/* X Axis Label */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#64748b',
              marginTop: '6px',
              letterSpacing: '0.04em',
            }}
          >
            POTENSIAL (FAKTOR PENDORONG) →
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.68rem',
            color: '#475569',
            marginTop: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1d4ed8' }} /> Sangat Baik
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} /> Baik
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} /> Cukup
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} /> Kurang
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} /> Perlu Pembinaan
          </span>
        </div>
      </div>

      {/* Selected Unit Highlight Box at Bottom */}
      <div
        style={{
          marginTop: '14px',
          padding: '12px 16px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Unit terpilih - Kuadran {selectedItem.box}</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{selectedItem.unit}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {selectedItem.boxLabel} • Kinerja: {selectedItem.kinerja} • Potensial: {selectedItem.potensial}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedItem.skorTotal.toString().replace('.', ',')}
            </div>
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}
            >
              {selectedItem.kategori}
            </span>
          </div>

          <button
            onClick={() => onDetailClick(selectedItem)}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Lihat detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default NineBoxMatrix;
