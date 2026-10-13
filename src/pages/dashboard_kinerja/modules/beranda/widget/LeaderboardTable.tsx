import React from 'react';
import { NineBoxItem } from '@/services/dashboardMockData';

interface LeaderboardTableProps {
  data: NineBoxItem[];
  filterKlaster: string;
  onFilterKlasterChange: (val: string) => void;
  filterKorwil: string;
  onFilterKorwilChange: (val: string) => void;
  onDetailClick: (item: NineBoxItem) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  filterKlaster,
  onFilterKlasterChange,
  filterKorwil,
  onFilterKorwilChange,
  onDetailClick,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '20px',
      }}
    >
      {/* Title & Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            Leaderboard & Komparasi Area
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ fontWeight: 600 }}>Keterangan Warna:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Klaster Hijau
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Klaster Sedang
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Klaster Kritis
            </span>
          </div>
        </div>

        {/* Right Dropdown Filters */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Filter Klaster:</span>
            <select
              value={filterKlaster}
              onChange={(e) => onFilterKlasterChange(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.75rem',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">Semua Klaster</option>
              <option value="Hijau">Klaster Hijau</option>
              <option value="Sedang">Klaster Sedang</option>
              <option value="Kritis">Klaster Kritis</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Filter Korwil:</span>
            <select
              value={filterKorwil}
              onChange={(e) => onFilterKorwilChange(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.75rem',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">Semua Korwil</option>
              <option value="Korwil I">Korwil I</option>
              <option value="Korwil II">Korwil II</option>
              <option value="Korwil III">Korwil III</option>
              <option value="Korwil V">Korwil V</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '10px 14px', width: '70px' }}>PERINGKAT</th>
              <th style={{ padding: '10px 14px' }}>NAMA P3DW</th>
              <th style={{ padding: '10px 14px' }}>TOTAL SKOR</th>
              <th style={{ padding: '10px 14px' }}>PREDIKAT</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>A (40%)</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>B (20%)</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>C (20%)</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>D (10%)</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>E (10%)</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s',
                }}
                className="table-row-hover"
              >
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                  #{idx + 1}
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                  {row.unit}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color:
                        row.klaster === 'Hijau'
                          ? '#10b981'
                          : row.klaster === 'Sedang'
                          ? '#0284c7'
                          : '#ef4444',
                    }}
                  >
                    {row.skorTotal.toFixed(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      background:
                        row.predikat === 'A'
                          ? '#dcfce7'
                          : row.predikat === 'B'
                          ? '#e0f2fe'
                          : row.predikat === 'C'
                          ? '#fef3c7'
                          : '#fee2e2',
                      color:
                        row.predikat === 'A'
                          ? '#15803d'
                          : row.predikat === 'B'
                          ? '#0369a1'
                          : row.predikat === 'C'
                          ? '#b45309'
                          : '#dc2626',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {row.predikat}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{row.scoreA}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{row.scoreB}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{row.scoreC}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{row.scoreD}</td>
                <td
                  style={{
                    padding: '12px 14px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: row.scoreE < 50 ? '#ef4444' : '#0f172a',
                  }}
                >
                  {row.scoreE}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDetailClick(row)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#0f172a',
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
