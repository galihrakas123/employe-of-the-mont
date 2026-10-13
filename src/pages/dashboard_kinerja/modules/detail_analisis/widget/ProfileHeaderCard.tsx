import React from 'react';
import { mockDetailProfile } from '@/services/dashboardMockData';

export const ProfileHeaderCard: React.FC = () => {
  const p = mockDetailProfile;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
        DATA DIRI
      </div>

      <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
        {/* Avatar Initials KP */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            flexShrink: 0,
            border: '2px solid #bae6fd',
          }}
        >
          KP
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            {p.namaKepala}
          </h3>
          <p style={{ margin: '2px 0 14px 0', fontSize: '0.82rem', color: '#64748b' }}>
            {p.subKepala}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px 24px',
              fontSize: '0.8rem',
              color: '#334155',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>NIP</span>
              <strong>{p.nip}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Pangkat dan Golongan</span>
              <strong>{p.pangkat}</strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Jabatan</span>
              <strong>{p.jabatan}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Unit Kerja</span>
              <strong>{p.unitKerja}</strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Koordinator Wilayah</span>
              <strong>{p.korwil}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Masa Jabatan di Unit</span>
              <strong>{p.masaJabatan}</strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Pendidikan Terakhir</span>
              <strong>{p.pendidikan}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Sertifikasi Teknis PBB</span>
              <strong>{p.sertifikasi}</strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Jumlah Pegawai di Unit</span>
              <strong>{p.jumlahPegawai}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Kontak</span>
              <strong>{p.kontak}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
