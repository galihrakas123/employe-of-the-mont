import React from 'react';
import { ArrowLeft, Building2, Award } from 'lucide-react';
import useDetailAnalisisController from '../controller/useDetailAnalisisController';
import ProfileHeaderCard from '../widget/ProfileHeaderCard';
import RadarKomposisiChart from '../widget/RadarKomposisiChart';
import TrenSkorChart from '../widget/TrenSkorChart';
import InsightBannerCard from '../widget/InsightBannerCard';
import FocusAreaCard from '../widget/FocusAreaCard';
import MiniNineBoxCard from '../widget/MiniNineBoxCard';
import NilaiSumbuCard from '../widget/NilaiSumbuCard';
import TrenPenilaianTable from '../widget/TrenPenilaianTable';

export const DetailAnalisisView: React.FC = () => {
  const { handleBack, unitData, scatterData, getKategoriBadgeStyle } = useDetailAnalisisController();

  return (
    <div className="font-roboto pb-12 antialiased">
      {/* Top Header Bar - Full-bleed nempel bagian atas & samping (Gambar Referensi Kedua) */}
      <div className="w-full bg-white border-b border-[#E0E0E0] sticky top-16 z-30 shadow-xs">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-7 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Side: Back Button & Unit Title */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-lg bg-[#F5F5F5] hover:bg-[#E0E0E0] border border-[#CBD5E1] text-[#212121] flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
              title="Kembali ke Dashboard Beranda"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="w-9 h-9 rounded-lg bg-[#E6F4EA] border border-[#00875A]/20 text-[#00875A] flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] sm:text-[19px] font-bold text-[#212121] leading-tight">
                  Detail Analisis: {unitData.namaP3dw}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20 px-2.5 py-0.5 rounded-full">
                  <Award size={12} /> Peringkat #{unitData.peringkat}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[12px] text-[#64748B]">
                <span>{unitData.kanwil}</span>
                <span>•</span>
                <span>Klaster: <strong className="text-[#334155]">{unitData.klaster}</strong></span>
                <span>•</span>
                <span>Kuadran: <strong className="text-[#334155]">{scatterData.box}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Side: Skor & Status Badges */}
          <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto justify-between md:justify-end border-[#F1F5F9]">
            <div className="text-left md:text-right">
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider">
                Skor Total Akhir
              </div>
              <div className="flex items-baseline gap-1 md:justify-end">
                <span className="text-[24px] font-black text-[#212121] leading-none">
                  {unitData.totalSkor.toFixed(1)}
                </span>
                <span className="text-[12px] font-bold text-[#64748B]">
                  / 100
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${getKategoriBadgeStyle(
                  scatterData.kategori
                )}`}
              >
                {scatterData.kategori}
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">
                Predikat: <strong className="text-[#00875A]">{unitData.predikat}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content - Terpusat dengan Padding Konten Standar max-w-[1500px] */}
      <div className="max-w-[1500px] mx-auto p-6 lg:p-7 space-y-6">
        {/* Main Grid: Left 2/3 & Right 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Profile Header Card */}
            <ProfileHeaderCard unitData={unitData} />

            {/* 2. Dua Grafik Visual: Radar Komposisi & Tren Skor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RadarKomposisiChart
                scores={{
                  a: unitData.scoreA,
                  b: unitData.scoreB,
                  c: unitData.scoreC,
                  d: unitData.scoreD,
                  e: unitData.scoreE,
                }}
              />
              <TrenSkorChart currentScore={unitData.totalSkor} />
            </div>

            {/* 3. SectionMessage: Banner Insight & Rekomendasi Dinamis */}
            <InsightBannerCard
              unitName={unitData.namaP3dw}
              totalSkor={unitData.totalSkor}
              kategori={scatterData.kategori}
              scoreA={unitData.scoreA}
              scoreE={unitData.scoreE}
            />

            {/* 4. Target OKR & Area Fokus (Menyesuaikan capaian nilai unit kerja) */}
            <FocusAreaCard scoreSDM={unitData.scoreE} bobot={10} />

            {/* 5. Tabel Rincian Evaluasi & Tren Penilaian (Sejajar lebarnya dengan card di atasnya) */}
            <TrenPenilaianTable totalSkor={unitData.totalSkor} />
          </div>

          {/* Right Column (1 Col) - Sticky saat scroll */}
          <div className="lg:col-span-1 space-y-6 sticky top-[152px]">
            {/* Matriks Kinerja dan Potensial (Mini 9-Box) */}
            <MiniNineBoxCard
              boxNumber={scatterData.boxNumber}
              boxTitle={scatterData.box}
            />

            {/* Nilai Sumbu Evaluasi */}
            <NilaiSumbuCard
              kinerja={scatterData.y}
              potensi={scatterData.x}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAnalisisView;
