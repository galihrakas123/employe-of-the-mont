import React from 'react';
import { ArrowLeft, Building2, Award, History } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { PERIODE_BERJALAN, PERIODE_LIST } from '@/services/periodeData';
import useDetailAnalisisController from '../controller/useDetailAnalisisController';
import ProfileHeaderCard from '../widget/ProfileHeaderCard';
import RadarKomposisiChart from '../widget/RadarKomposisiChart';
import TrenSkorChart from '../widget/TrenSkorChart';
import InsightBannerCard from '../widget/InsightBannerCard';
import FocusAreaCard from '../widget/FocusAreaCard';
import MiniNineBoxCard from '../widget/MiniNineBoxCard';
import NilaiSumbuCard from '../widget/NilaiSumbuCard';
import TrenAreaChart from '../widget/TrenAreaChart';
import TrenPenilaianTable from '../widget/TrenPenilaianTable';
import RiwayatBoxCard from '../widget/RiwayatBoxCard';

const periodeOptions = [...PERIODE_LIST].reverse().map((p) => ({ label: p.label, value: p.key }));

export const DetailAnalisisView: React.FC = () => {
  const { handleBack, unitData, scatterData, getKategoriBadgeStyle, periode, isPeriodeBerjalan, evaluasi, setPeriode } =
    useDetailAnalisisController();

  return (
    <div className="font-roboto pb-12 antialiased">
      {/* Top Header Bar - Full-bleed nempel bagian atas & samping (Gambar Referensi Kedua) */}
      <div className="w-full bg-white border-b border-[#E0E0E0] sticky top-16 z-30 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-7 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  <Award size={12} /> Peringkat #{evaluasi.peringkat}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[12px] text-[#64748B]">
                <span>{unitData.kanwil}</span>
                <span>•</span>
                <span>Klaster: <strong className="text-[#334155]">{unitData.klaster}</strong></span>
                <span>•</span>
                <span>Kuadran: <strong className="text-[#334155]">{evaluasi.boxLabel}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Side: Skor & Status Badges */}
          <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto justify-between md:justify-end border-[#F1F5F9]">
            {/* Pilih periode penilaian yang ingin ditinjau */}
            <div className="min-w-0">
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">Periode Penilaian</div>
              <CustomSelect
                compact
                placeholder="Periode penilaian"
                value={periode.key}
                options={periodeOptions}
                onChange={setPeriode}
                className="w-44"
              />
            </div>

            <div className="text-left md:text-right">
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider">
                Skor Total Akhir
              </div>
              <div className="flex items-baseline gap-1 md:justify-end">
                <span className="text-[24px] font-black text-[#212121] leading-none">
                  {evaluasi.total.toFixed(1)}
                </span>
                <span className="text-[12px] font-bold text-[#64748B]">
                  / 120
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${getKategoriBadgeStyle(
                  evaluasi.kategori
                )}`}
              >
                {evaluasi.kategori}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content - Selebar area konten */}
      <div className="w-full p-4 sm:p-6 lg:p-7 space-y-6">
        {!isPeriodeBerjalan && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] dark:bg-[#D97706]/10 dark:border-[#D97706]/30 text-[13px] text-[#92400E] dark:text-[#FBBF24]">
            <span className="flex items-center gap-2">
              <History size={16} className="shrink-0" />
              Menampilkan penilaian periode <b>{periode.label}</b>. Skor, peringkat, posisi box, dan rincian KPI mengikuti bulan ini.
            </span>
            <button
              type="button"
              onClick={() => setPeriode(PERIODE_BERJALAN.key)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white dark:bg-[#1E293B] border border-[#FDE68A] dark:border-[#D97706]/40 hover:bg-[#FEF3C7] transition cursor-pointer"
            >
              Kembali ke {PERIODE_BERJALAN.label}
            </button>
          </div>
        )}

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
                  pendapatan: evaluasi.pendapatan,
                  kepatuhan: evaluasi.kepatuhan,
                  pelayanan: evaluasi.pelayanan,
                  tataKelola: evaluasi.tataKelola,
                  sdm: evaluasi.sdm,
                }}
              />
              <TrenSkorChart unitId={unitData.id} periodeKey={periode.key} />
            </div>

            {/* 3. SectionMessage: Banner Insight & Rekomendasi Dinamis */}
            <InsightBannerCard
              unitName={unitData.namaP3dw}
              totalSkor={evaluasi.total}
              kategori={evaluasi.kategori}
              scorePendapatan={evaluasi.pendapatan}
              scoreA={evaluasi.pendapatan}
              scoreE={evaluasi.sdm}
            />

            {/* 4. Target OKR & Area Fokus (Menyesuaikan capaian nilai unit kerja) */}
            <FocusAreaCard scoreSDM={evaluasi.sdm} bobot={15} />

            {/* 5. Tabel Rincian Evaluasi & Tren Penilaian (Sejajar lebarnya dengan card di atasnya) */}
            <TrenPenilaianTable totalSkor={evaluasi.total} />
          </div>

          {/* Right Column (1 Col) - Sticky saat scroll */}
          <div className="lg:col-span-1 space-y-6">
            {/* Matriks Kinerja dan Potensial (Mini 9-Box dengan Sumbu X & Y) */}
            <MiniNineBoxCard
              key={`matriks-${periode.key}`}
              boxNumber={evaluasi.boxNumber}
              boxTitle={evaluasi.boxLabel}
              kinerja={evaluasi.y}
              potensi={evaluasi.x}
              unitName={unitData.namaP3dw}
              unitId={scatterData.id}
              periodeKey={periode.key}
            />

            {/* Riwayat posisi box per bulan (klik bulan untuk meninjau periode itu) */}
            <RiwayatBoxCard unitId={scatterData.id} periodeKey={periode.key} onSelectPeriode={setPeriode} />

            {/* Nilai Sumbu Evaluasi */}
            <NilaiSumbuCard
              kinerja={evaluasi.y}
              potensi={evaluasi.x}
              pendapatan={evaluasi.pendapatan}
              kepatuhan={evaluasi.kepatuhan}
              pelayanan={evaluasi.pelayanan}
              tataKelola={evaluasi.tataKelola}
              sdm={evaluasi.sdm}
            />

            {/* Tren Kinerja per Area (rentang bulan bisa diatur) */}
            <TrenAreaChart key={`tren-area-${periode.key}`} unitId={scatterData.id} periodeKey={periode.key} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAnalisisView;
