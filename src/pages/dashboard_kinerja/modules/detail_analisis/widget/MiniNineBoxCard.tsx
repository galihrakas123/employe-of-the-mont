import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import NineBoxExplanationModal from '@/components/ui/NineBoxExplanationModal';
import { getGridCoordinates } from '@/services/dashboardMockData';

interface MiniNineBoxCardProps {
  boxNumber?: number;
  boxTitle?: string;
  kinerja?: number;
  potensi?: number;
  unitName?: string;
}

export const MiniNineBoxCard: React.FC<MiniNineBoxCardProps> = ({
  boxNumber = 9,
  boxTitle = 'Box 9 (Kapus of the Month)',
  kinerja = 108.5,
  potensi = 105.2,
  unitName = 'Unit Kerja',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Koordinat presisi titik tunggal sesuai sumbu X & Y
  const dotCoords = getGridCoordinates(potensi, kinerja);

  return (
    <>
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-5 font-roboto">
        {/* Header Card */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h4 className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
              Matriks Kinerja dan Potensial
            </h4>
            <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
              Posisi {unitName} pada sembilan kuadran evaluasi kinerja
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-medium text-[#00875A] hover:text-[#006644] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
            title="Lihat penjelasan dan panduan untuk tiap box"
          >
            <HelpCircle size={13} />
            <span>Panduan</span>
          </button>
        </div>

        {/* Matriks 9-Box dengan Sumbu X dan Sumbu Y Sesuai Referensi Gambar & Warna Dashboard */}
        <div className="flex flex-col">
          {/* Baris Utama: Sumbu Y Label + Sumbu Y Ticks + Grid 3x3 */}
          <div className="flex items-stretch gap-1.5">
            {/* Label Sumbu Y (Vertikal dari bawah ke atas) */}
            <div className="flex items-center justify-center shrink-0 w-5">
              <span
                className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] tracking-wider uppercase whitespace-nowrap select-none"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                SUMBU Y – KINERJA (55%)
              </span>
            </div>

            {/* Nilai Tick Sumbu Y (120, 100, 90, 60) Aligned ke Grid Lines */}
            <div className="relative shrink-0 w-7 h-[250px] select-none text-[11px] font-bold pr-1 text-right">
              {/* 120 (Top) */}
              <span className="absolute top-0 right-1 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]">
                120
              </span>
              {/* 100 (Batas Kuadran Atas - Hijau) */}
              <span className="absolute top-[33.33%] right-1 -translate-y-1/2 text-[#00875A] dark:text-[#34D399]">
                100
              </span>
              {/* 90 (Batas Kuadran Tengah - Oranye) */}
              <span className="absolute top-[66.67%] right-1 -translate-y-1/2 text-[#FF8F00] dark:text-[#FBBF24]">
                90
              </span>
              {/* 60 (Bottom) */}
              <span className="absolute top-[100%] right-1 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]">
                60
              </span>
            </div>

            {/* Container Grid 3x3 Sembilan Kuadran (Warna 100% Selaras dengan Dashboard) */}
            <div className="relative flex-1 h-[250px] border border-[#CBD5E1] dark:border-[#475569] rounded-xl overflow-hidden grid grid-cols-3 grid-rows-3 bg-white shadow-xs select-none">
              {/* ROW 1: Box 7, Box 8, Box 9 */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <span className="text-[11px] font-bold text-[#1E293B]">Box 7</span>
                <span className="text-[9.5px] text-[#64748B] leading-none mt-0.5 truncate">Maintain</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <span className="text-[11px] font-bold text-[#1E293B]">Box 8</span>
                <span className="text-[9.5px] text-[#64748B] leading-none mt-0.5 truncate">Strategic Contributor</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#E6F4FF] border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#D8EDFF] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#0066CC]">Box 9</span>
                <span className="text-[9.5px] text-[#0284C7] leading-none mt-0.5 font-semibold truncate">
                  Kapus of the Month 🏆
                </span>
              </div>

              {/* ROW 2: Box 4, Box 5, Box 6 */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FFF0F2] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#FFE4E8] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#B91C1C]">Box 4</span>
                <span className="text-[9.5px] text-[#991B1B] leading-none mt-0.5 truncate">Develop</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FFFDEB] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#FEF9C3] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#B45309]">Box 5</span>
                <span className="text-[9.5px] text-[#92400E] leading-none mt-0.5 truncate">Core Contributor</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ECFDF5] border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#D1FAE5] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#00875A]">Box 6</span>
                <span className="text-[9.5px] text-[#047857] leading-none mt-0.5 truncate">Growth Potential</span>
              </div>

              {/* ROW 3: Box 1, Box 2, Box 3 */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FFF0F2] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#FFE4E8] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#B91C1C]">Box 1</span>
                <span className="text-[9.5px] text-[#991B1B] leading-none mt-0.5 truncate">Priority Improvement</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FEF3C7] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start cursor-pointer hover:bg-[#FDE68A] transition-colors"
              >
                <span className="text-[11px] font-bold text-[#B45309]">Box 2</span>
                <span className="text-[9.5px] text-[#92400E] leading-none mt-0.5 truncate">Monitor</span>
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="bg-[#F8FAFC] p-2 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <span className="text-[11px] font-bold text-[#1E293B]">Box 3</span>
                <span className="text-[9.5px] text-[#64748B] leading-none mt-0.5 truncate">Potential Developee</span>
              </div>

              {/* TITIK TUNGGAL (Satu Titik Sesuai Permintaan User dengan Efek Halo Ring) */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-700 ease-out"
                style={{ left: dotCoords.left, top: dotCoords.top }}
                title={`${unitName}: Potensi ${potensi.toFixed(1)}, Kinerja ${kinerja.toFixed(1)}`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Halo Ring */}
                  <div className="w-8 h-8 rounded-full bg-[#00875A]/25 animate-ping absolute" />
                  {/* Middle Translucent Ring */}
                  <div className="w-7 h-7 rounded-full bg-[#00875A]/30 border border-[#00875A]/50 flex items-center justify-center shadow-md">
                    {/* Inner Solid Dot */}
                    <div className="w-4 h-4 rounded-full bg-[#00875A] border-2 border-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nilai Tick Sumbu X (60, 85, 95, 120) Aligned ke Grid Vertical Lines */}
          <div className="flex items-start pl-[34px] mt-1 select-none text-[11px] font-bold">
            <div className="relative flex-1 h-5">
              {/* 60 (Left Edge) */}
              <span className="absolute left-0 -translate-x-1/2 text-[#64748B] dark:text-[#94A3B8]">
                60
              </span>
              {/* 85 (Batas Kuadran Kiri - Oranye) */}
              <span className="absolute left-[33.33%] -translate-x-1/2 text-[#FF8F00] dark:text-[#FBBF24]">
                85
              </span>
              {/* 95 (Batas Kuadran Kanan - Hijau) */}
              <span className="absolute left-[66.67%] -translate-x-1/2 text-[#00875A] dark:text-[#34D399]">
                95
              </span>
              {/* 120 (Right Edge) */}
              <span className="absolute left-[100%] -translate-x-1/2 text-[#64748B] dark:text-[#94A3B8]">
                120
              </span>
            </div>
          </div>

          {/* Label Sumbu X (Horisontal di Bagian Bawah) */}
          <div className="text-center pl-[34px] mt-2 select-none">
            <span className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] tracking-wider uppercase">
              SUMBU X – POTENSI (45%)
            </span>
          </div>
        </div>

        {/* Tombol Info Posisi Unit Kuadran */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20 hover:bg-[#D4EDDA] transition cursor-pointer shadow-2xs"
            title="Klik untuk panduan lengkap kuadran ini"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] shrink-0" />
            <span>Posisi Unit: {boxTitle}</span>
          </button>
        </div>
      </div>

      <NineBoxExplanationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBoxNumber={boxNumber}
      />
    </>
  );
};

export default MiniNineBoxCard;
