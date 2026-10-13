import React from 'react';
import { MapPin, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { mockMapLocations } from '@/services/dashboardMockData';

interface WestJavaMapProps {
  onLocationClick?: (name: string, score: number) => void;
}

export const WestJavaMap: React.FC<WestJavaMapProps> = ({ onLocationClick }) => {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Peta Sebaran Kinerja Jawa Barat
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
              Tinjauan visual lokasi P3DW berdasarkan skor Kesehatan Unit
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <ZoomIn size={14} />
            </button>
            <button
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>

        {/* Map Canvas matching screenshot */}
        <div
          style={{
            position: 'relative',
            height: '280px',
            background: '#e0f2fe',
            borderRadius: '10px',
            border: '1px solid #bae6fd',
            overflow: 'hidden',
            backgroundImage: 'radial-gradient(#bae6fd 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
          }}
        >
          {/* SVG Silhouette representation of West Java land */}
          <svg
            viewBox="0 0 400 240"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.85,
            }}
          >
            <path
              d="M 20,110 Q 70,50 160,70 T 320,80 Q 370,100 380,150 Q 340,210 240,200 Q 150,225 60,180 Z"
              fill="#c7d2fe"
              stroke="#818cf8"
              strokeWidth="2"
            />
          </svg>

          {/* City / Unit Pin Badges from Screenshot */}
          {mockMapLocations.map((loc) => {
            const pinColors: Record<string, string> = {
              'Sangat Baik': '#1d4ed8',
              'Baik': '#0284c7',
              'Cukup': '#d97706',
              'Kurang': '#ea580c',
              'Perlu Pembinaan': '#dc2626',
            };
            const color = pinColors[loc.status] || '#0284c7';

            return (
              <div
                key={loc.id}
                style={{
                  position: 'absolute',
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => onLocationClick?.(loc.name, loc.score)}
              >
                <div
                  style={{
                    background: color,
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    border: '2px solid #ffffff',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    background: 'rgba(255, 255, 255, 0.88)',
                    padding: '0 4px',
                    borderRadius: '3px',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {loc.name}
                </span>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            Google Map data @2026
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: '#64748b',
        }}
      >
        <span>📍 34 P3DW Tersebar di Jawa Barat</span>
        <span>Monitoring Realtime</span>
      </div>
    </div>
  );
};

export default WestJavaMap;
