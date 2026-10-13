import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import useDetailAnalisisController from '../controller/useDetailAnalisisController';
import ProfileHeaderCard from '../widget/ProfileHeaderCard';
import RadarKomposisiChart from '../widget/RadarKomposisiChart';
import TrenSkorChart from '../widget/TrenSkorChart';
import InsightBannerCard from '../widget/InsightBannerCard';
import FocusAreaCard from '../widget/FocusAreaCard';
import MiniNineBoxCard from '../widget/MiniNineBoxCard';
import NilaiSumbuCard from '../widget/NilaiSumbuCard';
import TrenPenilaianTable from '../widget/TrenPenilaianTable';
import { mockDetailProfile } from '@/services/dashboardMockData';

export const DetailAnalisisView: React.FC = () => {
  const { handleBack } = useDetailAnalisisController();
  const p = mockDetailProfile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title Bar matching Screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '14px 20px',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155',
          }}
          title="Kembali ke Dashboard"
        >
          <ArrowLeft size={16} />
        </button>

        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bookmark size={18} />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {p.title}
          </h2>
          <div style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
            {p.subtitle}
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2/3 and Right 1/3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <ProfileHeaderCard />

          {/* Two Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <RadarKomposisiChart />
            <TrenSkorChart />
          </div>

          <InsightBannerCard />
          <FocusAreaCard />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <MiniNineBoxCard />
          <NilaiSumbuCard />
        </div>
      </div>

      {/* Bottom Table */}
      <TrenPenilaianTable />
    </div>
  );
};

export default DetailAnalisisView;
