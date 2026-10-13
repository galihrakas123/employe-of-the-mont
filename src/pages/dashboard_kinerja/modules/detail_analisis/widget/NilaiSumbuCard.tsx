import React from 'react';

export const NilaiSumbuCard: React.FC = () => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '18px',
      }}
    >
      <h4 style={{ margin: '0 0 14px 0', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
        Nilai Sumbu
      </h4>

      {/* Sumbu Y: Kinerja (hasil, 45 poin) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7' }}>
            Kinerja (sumbu Y) - hasil, 45 poin
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            84,7
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#475569', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Realisasi penerimaan (30)</span>
            <strong>87,2</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SKM (10)</span>
            <strong>81,0</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Google Review (5)</span>
            <strong>72,6</strong>
          </div>
        </div>
      </div>

      {/* Sumbu X: Potensial (pendorong, 55 poin) */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>
            Potensial (sumbu X) - pendorong, 55 poin
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            82,1
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#475569', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Disiplin &amp; KTR/Absensi (SDM) (20)</span>
            <strong>75,1</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pengaduan (Outlet Samsat Jabar) (10)</span>
            <strong>86,0</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sertifikasi PBB-P2 (10)</span>
            <strong style={{ color: '#10b981' }}>100,0</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Evaluasi internal aplikasi BKD (10)</span>
            <strong>85,6</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>K3 &amp; higienitas (5)</span>
            <strong>79,4</strong>
          </div>
        </div>
      </div>

      <p style={{ margin: '14px 0 0 0', fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.4 }}>
        Skala sumbu adalah total integrasi komponen terbobot skala 0 - 100. Hasil penggolongan skor pendorong mencari rekomendasi apa yang perlu diprioritaskan.
      </p>
    </div>
  );
};

export default NilaiSumbuCard;
