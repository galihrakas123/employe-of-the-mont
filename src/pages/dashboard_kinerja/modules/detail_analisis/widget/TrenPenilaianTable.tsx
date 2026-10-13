import React from 'react';
import { mockTrenPenilaianData } from '@/services/dashboardMockData';

export const TrenPenilaianTable: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
          Tren Penilaian
        </h3>
        <p style={{ margin: '3px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
          Rincian evaluasi secara menyeluruh dari 5 dimensi manajemen - evaluasi Q3
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '10px 14px' }}>Komponen dan Indikator</th>
              <th style={{ padding: '10px 14px', width: '90px' }}>Bobot</th>
              <th style={{ padding: '10px 14px', width: '120px' }}>Capaian</th>
              <th style={{ padding: '10px 14px', width: '100px' }}>Skor</th>
              <th style={{ padding: '10px 14px', width: '100px' }}>Poin</th>
            </tr>
          </thead>
          <tbody>
            {mockTrenPenilaianData.map((row) => {
              if (row.isTotal) {
                return (
                  <tr
                    key={row.id}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 800,
                    }}
                  >
                    <td style={{ padding: '10px 14px' }}>{row.komponen}</td>
                    <td style={{ padding: '10px 14px' }}>{row.bobot}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        {row.capaian}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{row.skor}</td>
                    <td style={{ padding: '10px 14px' }}>{row.poin}</td>
                  </tr>
                );
              }

              const paddingLeft = `${14 + row.level * 18}px`;
              const isHeaderLevel = row.level === 1;

              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: isHeaderLevel ? '#f8fafc' : '#ffffff',
                    fontWeight: isHeaderLevel ? 700 : 500,
                    color: isHeaderLevel ? '#0f172a' : '#334155',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: `9px 14px 9px ${paddingLeft}` }}>
                    {row.komponen}
                    {row.target && (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '6px' }}>
                        ({row.target})
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '9px 14px', color: '#64748b' }}>{row.bobot}</td>
                  <td style={{ padding: '9px 14px' }}>
                    <span
                      style={{
                        background: isHeaderLevel ? '#e0f2fe' : '#f1f5f9',
                        color: isHeaderLevel ? '#0369a1' : '#334155',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                      }}
                    >
                      {row.capaian}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', fontWeight: 600 }}>{row.skor}</td>
                  <td style={{ padding: '9px 14px', fontWeight: 600 }}>{row.poin}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrenPenilaianTable;
