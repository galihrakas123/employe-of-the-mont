import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Star,
  Banknote,
  AlertTriangle,
  ChevronDown,
  ArrowUpRight,
  Filter,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  mockKpiTopCards,
  mockScatterData,
  mockLeaderboardData,
  mockMapMarkers,
  P3dwScatterData,
  getGridCoordinates,
  korwilMasterData,
  KorwilGroupInfo,
} from '@/services/dashboardMockData';
import CustomSelect from '@/components/ui/CustomSelect';
import NineBoxExplanationModal from '@/components/ui/NineBoxExplanationModal';

// Custom Leaflet Marker with Bapenda Design Tokens
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.25;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 16px;
          height: 16px;
          background-color: ${color};
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const BerandaDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedUnit, setSelectedUnit] = useState<P3dwScatterData>(mockScatterData[0]);
  const [hoveredUnit, setHoveredUnit] = useState<P3dwScatterData | null>(null);
  const [filterKlaster, setFilterKlaster] = useState<string>('ALL');
  const [filterKorwil, setFilterKorwil] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllData, setShowAllData] = useState<boolean>(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState<boolean>(false);
  const [selectedBoxModal, setSelectedBoxModal] = useState<number>(9);

  const handleOpenBoxExplanation = (boxNum: number) => {
    setSelectedBoxModal(boxNum);
    setIsExplanationModalOpen(true);
  };

  const handleSelectBranch = (branchName: string) => {
    const match = mockScatterData.find(
      (s) =>
        s.nama.toLowerCase() === branchName.toLowerCase() ||
        s.nama.toLowerCase().includes(branchName.toLowerCase()) ||
        branchName.toLowerCase().includes(s.nama.toLowerCase())
    );
    if (match) {
      setSelectedUnit(match);
      setFilterKorwil(match.korwil || 'ALL');
      setSearchQuery('');
    }
  };

  // Options untuk CustomSelect (Matching Referensi Gambar)
  const klasterOptions = [
    { label: 'Semua Klaster', value: 'ALL' },
    { label: 'Klaster Besar', value: 'Klaster Besar' },
    { label: 'Klaster Sedang', value: 'Klaster Sedang' },
    { label: 'Klaster Kecil', value: 'Klaster Kecil' },
  ];

  const korwilOptions = [
    { label: 'Semua Korwil', value: 'ALL' },
    { label: 'Korwil Bandung Raya', value: 'Korwil Bandung Raya' },
    { label: 'Korwil Purwakarta', value: 'Korwil Purwakarta' },
    { label: 'Korwil Bogor', value: 'Korwil Bogor' },
    { label: 'Korwil Priangan Timur', value: 'Korwil Priangan Timur' },
    { label: 'Korwil Ciayumajakuning', value: 'Korwil Ciayumajakuning' },
  ];

  // Filtered Leaderboard
  const filteredLeaderboard = mockLeaderboardData.filter((item) => {
    const matchKlaster = filterKlaster === 'ALL' || item.klaster === filterKlaster;
    const matchKorwil = filterKorwil === 'ALL' || item.kanwil === filterKorwil;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.namaP3dw.toLowerCase().includes(q) ||
      (item.namaPendek && item.namaPendek.toLowerCase().includes(q)) ||
      (item.kd_wil && item.kd_wil.includes(q));
    return matchKlaster && matchKorwil && matchSearch;
  });

  // Default tampilkan 10 data, dapat di-expand dengan button "Lihat Semua"
  const displayedLeaderboard = showAllData ? filteredLeaderboard : filteredLeaderboard.slice(0, 10);

  // Color mapping untuk Scatter points
  const getPointColor = (kategori: string) => {
    switch (kategori) {
      case 'Sangat Baik':
        return '#00875A'; // Primary Green Bapenda
      case 'Baik':
        return '#0284c7'; // Sky Blue
      case 'Cukup':
        return '#FF8F00'; // Amber Tertiary
      case 'Kurang':
        return '#f97316'; // Orange
      case 'Perlu Pembinaan':
        return '#E53935'; // Error Red
      default:
        return '#00875A';
    }
  };

  // Helper warna cincin halo saat titik dipilih (mengikuti warna kategori titik itu sendiri)
  const getPointRingColor = (kategori: string) => {
    switch (kategori) {
      case 'Sangat Baik':
        return 'rgba(0, 135, 90, 0.4)';
      case 'Baik':
        return 'rgba(2, 132, 199, 0.4)';
      case 'Cukup':
        return 'rgba(255, 143, 0, 0.4)';
      case 'Kurang':
        return 'rgba(249, 115, 22, 0.4)';
      case 'Perlu Pembinaan':
        return 'rgba(229, 57, 53, 0.45)';
      default:
        return 'rgba(0, 135, 90, 0.4)';
    }
  };

  // Helper styling badge status kategori (mengikuti warna status: merah bila Perlu Pembinaan, hijau bila Sangat Baik, dll)
  const getKategoriBadgeStyle = (kategori: string) => {
    switch (kategori) {
      case 'Sangat Baik':
        return 'bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/25';
      case 'Baik':
        return 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/25';
      case 'Cukup':
        return 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/25';
      case 'Kurang':
        return 'bg-[#FFEDD5] text-[#EA580C] border border-[#EA580C]/25';
      case 'Perlu Pembinaan':
        return 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/25';
      default:
        return 'bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/25';
    }
  };

  // Helper warna latar baris tabel berdasarkan Predikat Kinerja (Sesuai Keterangan Warna & Referensi Gambar)
  const getRowBgColor = (grade: string, predikat: string, isSelected: boolean) => {
    if (isSelected) return 'bg-[#E6F4EA] dark:bg-[#00875A]/30 border-l-4 border-l-[#00875A]';
    const g = (grade || '').toUpperCase();
    const p = (predikat || '').toLowerCase();
    // Kinerja Kuat (A)
    if (g === 'A' || p.includes('sangat baik')) {
      return 'bg-[#F0FDF4] hover:bg-[#DCFCE7]/70 dark:bg-[#064E3B]/20 dark:hover:bg-[#064E3B]/35';
    }
    // Sedang (B)
    if (g === 'B' || p.includes('baik')) {
      return 'bg-[#FEFCE8] hover:bg-[#FEF9C3]/70 dark:bg-[#78350F]/20 dark:hover:bg-[#78350F]/35';
    }
    // Kurang (C/D)
    return 'bg-[#FFF1F2] hover:bg-[#FFE4E6]/70 dark:bg-[#881337]/20 dark:hover:bg-[#881337]/35';
  };

  // Helper styling predikat lengkap (Sesuai Referensi Gambar)
  const getPredikatBadgeStyle = (predikat: string) => {
    const p = predikat.toLowerCase();
    if (p.includes('sangat baik') || p === 'a') {
      return 'bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20 dark:bg-[#00875A]/25 dark:text-[#34D399]';
    }
    if (p.includes('baik') || p === 'b') {
      return 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/20 dark:bg-[#0284C7]/25 dark:text-[#38BDF8]';
    }
    if (p.includes('cukup') || p === 'c') {
      return 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20 dark:bg-[#D97706]/25 dark:text-[#FBBF24]';
    }
    return 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20 dark:bg-[#DC2626]/25 dark:text-[#F87171]';
  };

  // Helper warna teks angka nilai pilar A, B, C, D, E (Sesuai Referensi Gambar)
  const getScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-[#00875A] dark:text-[#34D399]';
    if (score >= 75) return 'text-[#EA580C] dark:text-[#FB923C]';
    return 'text-[#DC2626] dark:text-[#F87171]';
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1500px] mx-auto p-6 lg:p-7 pb-10 font-roboto antialiased text-[#212121]">
      {/* 0. PAGE TITLE (Sesuai Dokumen Talent Box KPI Kepala Pusat Cabang Samsat) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-[26px] font-semibold text-[#212121] tracking-tight leading-tight">
            Dashboard Kinerja Strategis
          </h1>
          <p className="text-[12px] text-[#757575] font-normal mt-0.5">
            Sistem Informasi Evaluasi Kinerja Strategis & Pemetaan Potensial P3DW Bapenda Jawa Barat
          </p>
        </div>
      </div>

      {/* 1. TOP KPI CARDS (Agregasi 34 Cabang P3DW Berdasarkan Standar Baku) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Rata-rata Skor Akhir */}
        <div className="bg-[#00875A] rounded-2xl p-5 shadow-sm text-white flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-white/85 uppercase font-roboto">
              RATA-RATA SKOR AKHIR
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <Activity size={16} />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-black text-white leading-none tracking-tight font-roboto">
                {mockKpiTopCards[0].value}
              </span>
              <span className="text-[14px] font-semibold text-white/80">/ 120</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
            <TrendingUp size={14} />
            <span>0,55 Kinerja (Y) + 0,45 Potensi (X)</span>
          </div>
        </div>

        {/* Card 2: Kapus of the Month (Box 9) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              Kapus of the Month
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#00875A] flex items-center justify-center shrink-0">
              <Star size={16} className="fill-[#00875A]" />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight font-roboto">
                {mockKpiTopCards[1].value}
              </span>
              <span className="text-[13px] font-semibold text-[#64748B]">P3DW</span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#00875A]">
            Box 9 (Kinerja ≥ 100 &amp; Potensi ≥ 95)
          </div>
        </div>

        {/* Card 3: Realisasi Pendapatan vs Target */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              Realisasi Pendapatan vs Target
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#00875A] flex items-center justify-center shrink-0">
              <Banknote size={16} />
            </div>
          </div>

          <div className="my-2">
            <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight font-roboto">
              {mockKpiTopCards[2].value}
            </span>
          </div>

          <div className="text-[11px] font-medium text-[#64748B]">
            Rata-rata 34 P3DW s.d. Oktober
          </div>
        </div>

        {/* Card 4: Unit Perlu Perhatian (Box 1) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              UNIT PERLU PERHATIAN
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFEBEE] text-[#E53935] flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-black text-[#E53935] leading-none tracking-tight font-roboto">
                {mockKpiTopCards[3].value}
              </span>
              <span className="text-[13px] font-semibold text-[#E53935]/80">P3DW</span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#E53935]">
            Box 1 (Priority Improvement: Y &lt; 90, X &lt; 85)
          </div>
        </div>
      </section>

      {/* 2. MIDDLE SECTION (Grid 2 Kolom: Matriks Scatter & Peta Sebaran) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
        {/* Kolom Kiri: Matriks Kinerja dan Potensial (ScatterChart) */}
        <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Title & Panduan Button Sesuai yang Ada di Detail */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
                  Matriks Kinerja dan Potensial (9-Box Talent Box)
                </h3>
                <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5 font-normal">
                  Posisi 34 P3DW. Sumbu Y Kinerja = Kemandirian Keuangan (55%, KPI 1–9). Sumbu X Potensi = Pelayanan Publik (45%, KPI 10–18).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBoxExplanation(selectedUnit.boxNumber || 9)}
                className="text-[11px] font-medium text-[#00875A] hover:text-[#006644] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0 py-1 px-2.5 rounded-lg bg-[#E6F4EA]/70 hover:bg-[#E6F4EA] transition"
                title="Lihat penjelasan dan panduan untuk tiap box"
              >
                <HelpCircle size={13} />
                <span>Panduan</span>
              </button>
            </div>

            {/* 9-Box Matrix Grid with Axis Labels & Ticks (Skala Baku: Y: 60..120 [Cutoffs 90, 100], X: 60..120 [Cutoffs 85, 95]) */}
            <div className="flex items-start select-none">
              {/* Y-Axis Label & Ticks */}
              <div className="flex items-center mr-2 shrink-0 self-stretch">
                {/* Vertical Rotated Axis Label */}
                <div className="flex items-center justify-center w-6 mr-1">
                  <span className="text-[11px] font-bold text-[#1E293B] tracking-wider whitespace-nowrap -rotate-90 select-none">
                    SUMBU Y – KINERJA (55%)
                  </span>
                </div>
                {/* Y-Axis Ticks (120, 100, 90, 60) */}
                <div className="relative h-[310px] w-8 text-right pr-1.5 text-[11px] font-medium text-[#64748B] select-none">
                  <span className="absolute right-1.5 top-0 -translate-y-1/2">120</span>
                  <span className="absolute right-1.5 top-1/3 -translate-y-1/2 font-bold text-[#00875A]" title="Batas Kinerja Tinggi (≥ 100)">100</span>
                  <span className="absolute right-1.5 top-2/3 -translate-y-1/2 font-bold text-[#D97706]" title="Batas Kinerja Sedang (90–99.9)">90</span>
                  <span className="absolute right-1.5 bottom-0 translate-y-1/2">60</span>
                </div>
              </div>

              {/* Matrix + X-Axis Container */}
              <div className="flex-1 min-w-0">
                {/* 9-Box Matrix Grid */}
                <div className="w-full h-[310px] relative rounded-lg border border-[#CBD5E1] select-none bg-white shadow-inner">
                  {/* 3x3 Grid Background Boxes */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 rounded-lg overflow-hidden">
                    {/* Row 1 (Top): Box 7, Box 8, Box 9 */}
                    {/* Box 7 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(7)}
                      className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors group"
                      title="Klik untuk panduan Box 7 (Maintain)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1E293B] group-hover:text-[#00875A] transition-colors">Box 7</span>
                        <HelpCircle size={12} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Maintain
                      </span>
                    </div>
                    {/* Box 8 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(8)}
                      className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors group"
                      title="Klik untuk panduan Box 8 (Strategic Contributor)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1E293B] group-hover:text-[#00875A] transition-colors">Box 8</span>
                        <HelpCircle size={12} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Strategic Contributor
                      </span>
                    </div>
                    {/* Box 9 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(9)}
                      className="bg-[#E6F4FF] border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#D8EDFF] transition-colors group"
                      title="Klik untuk panduan Box 9 (Kapus of the Month)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#0066CC]">Box 9</span>
                        <HelpCircle size={12} className="text-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#0284C7] leading-tight mt-0.5 font-semibold">
                        Kapus of the Month 🏆
                      </span>
                    </div>

                    {/* Row 2 (Middle): Box 4, Box 5, Box 6 */}
                    {/* Box 4 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(4)}
                      className="bg-[#FFF0F2] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#FFE4E8] transition-colors group"
                      title="Klik untuk panduan Box 4 (Develop)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#B91C1C]">Box 4</span>
                        <HelpCircle size={12} className="text-[#B91C1C] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#991B1B] leading-tight mt-0.5 font-normal">
                        Develop
                      </span>
                    </div>
                    {/* Box 5 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(5)}
                      className="bg-[#FFFDEB] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#FEF9C3] transition-colors group"
                      title="Klik untuk panduan Box 5 (Core Contributor)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#B45309]">Box 5</span>
                        <HelpCircle size={12} className="text-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#92400E] leading-tight mt-0.5 font-normal">
                        Core Contributor
                      </span>
                    </div>
                    {/* Box 6 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(6)}
                      className="bg-[#ECFDF5] border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#D1FAE5] transition-colors group"
                      title="Klik untuk panduan Box 6 (Growth Potential)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#00875A]">Box 6</span>
                        <HelpCircle size={12} className="text-[#00875A] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#047857] leading-tight mt-0.5 font-normal">
                        Growth Potential
                      </span>
                    </div>

                    {/* Row 3 (Bottom): Box 1, Box 2, Box 3 */}
                    {/* Box 1 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(1)}
                      className="bg-[#FFF0F2] border-r border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#FFE4E8] transition-colors group"
                      title="Klik untuk panduan Box 1 (Priority Improvement)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#B91C1C]">Box 1</span>
                        <HelpCircle size={12} className="text-[#B91C1C] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#991B1B] leading-tight mt-0.5 font-normal">
                        Priority Improvement
                      </span>
                    </div>
                    {/* Box 2 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(2)}
                      className="bg-[#FEF3C7] border-r border-[#E2E8F0] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-[#FDE68A] transition-colors group"
                      title="Klik untuk panduan Box 2 (Monitor)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#B45309]">Box 2</span>
                        <HelpCircle size={12} className="text-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#92400E] leading-tight mt-0.5 font-normal">
                        Monitor
                      </span>
                    </div>
                    {/* Box 3 */}
                    <div
                      onClick={() => handleOpenBoxExplanation(3)}
                      className="bg-[#F8FAFC] p-2.5 flex flex-col justify-start cursor-pointer hover:bg-slate-100/70 transition-colors group"
                      title="Klik untuk panduan Box 3 (Potential Developee)"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1E293B] group-hover:text-[#00875A] transition-colors">Box 3</span>
                        <HelpCircle size={12} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Potential Developee
                      </span>
                    </div>
                  </div>

                  {/* Scatter Points Overlay (100% Sesuai Aturan Koordinat & Batas Potensi/Kinerja) */}
                  {mockScatterData.map((item) => {
                    const { left, top } = getGridCoordinates(item.x, item.y);
                    const isSelected = selectedUnit.id === item.id;
                    const isHovered = hoveredUnit?.id === item.id;
                    const dotColor = getPointColor(item.kategori);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUnit(item)}
                        onMouseEnter={() => setHoveredUnit(item)}
                        onMouseLeave={() => setHoveredUnit(null)}
                        className="absolute cursor-pointer transition-transform duration-150"
                        style={{
                          left,
                          top,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isSelected ? 5 : 2,
                        }}
                        title={`${item.nama} (${item.box})`}
                      >
                        <div
                          className={`rounded-full border-2 border-white transition-all duration-150 ${isSelected
                            ? 'w-4 h-4 scale-125'
                            : isHovered
                              ? 'w-3.5 h-3.5 scale-125'
                              : 'w-3 h-3 hover:scale-125'
                            }`}
                          style={{
                            backgroundColor: dotColor,
                            boxShadow: isSelected
                              ? `0 0 0 4px ${getPointRingColor(item.kategori)}, 0 4px 6px -1px rgba(0, 0, 0, 0.15)`
                              : '0 2px 4px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </div>
                    );
                  })}

                  {/* Floating Tooltip saat Hover Point (Card Putih Premium dengan Indikator Kinerja & Potensi) */}
                  {hoveredUnit && (() => {
                    const { left, top } = getGridCoordinates(hoveredUnit.x, hoveredUnit.y);
                    const leftNum = parseFloat(left);
                    const topNum = parseFloat(top);
                    const isTopHalf = topNum < 45;
                    const isRightHalf = leftNum > 60;

                    return (
                      <div
                        className={`absolute pointer-events-none z-20 bg-white text-[#0F172A] rounded-[14px] p-3 shadow-xl shadow-black/15 border border-[#E2E8F0] font-roboto min-w-[210px] transition-all ${isTopHalf ? 'translate-y-3' : '-translate-y-full -mt-2'
                          } ${isRightHalf ? '-translate-x-[85%]' : leftNum < 35 ? '-translate-x-[15%]' : '-translate-x-1/2'}`}
                        style={{
                          left,
                          top,
                        }}
                      >
                        <div className="font-bold text-[#0F172A] text-[13px] leading-snug">
                          {hoveredUnit.nama}
                        </div>
                        <div className="text-[#64748B] text-[11px] mt-0.5 font-medium flex items-center gap-1">
                          <span>{hoveredUnit.korwil || 'Korwil II'}</span>
                          <span>•</span>
                          <span className="font-bold text-[#00875A]">{hoveredUnit.box}</span>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] grid grid-cols-3 gap-2 text-left">
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Kinerja (Y):</div>
                            <div className="text-[13px] font-bold text-[#00875A] leading-tight">{hoveredUnit.y}</div>
                            <div className="text-[9px] text-[#64748B]">{hoveredUnit.kinerjaLevel}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Potensi (X):</div>
                            <div className="text-[13px] font-bold text-[#0284c7] leading-tight">{hoveredUnit.x}</div>
                            <div className="text-[9px] text-[#64748B]">{hoveredUnit.potensiLevel}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Skor Akhir:</div>
                            <div className="text-[13px] font-bold text-[#D97706] leading-tight">{hoveredUnit.skorTotal.toFixed(1)}</div>
                            <div className="text-[9px] text-[#00875A] font-semibold">{hoveredUnit.kategori}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* X-Axis Ticks (60, 85, 95, 120 sesuai ambang batas dokumen) */}
                <div className="relative w-full h-4 mt-1.5 text-[11px] font-medium text-[#64748B] select-none">
                  <span className="absolute left-0 -translate-x-1/2">60</span>
                  <span className="absolute left-1/3 -translate-x-1/2 font-bold text-[#D97706]" title="Batas Potensi Sedang (85–94.9)">85</span>
                  <span className="absolute left-2/3 -translate-x-1/2 font-bold text-[#00875A]" title="Batas Potensi Tinggi (≥ 95)">95</span>
                  <span className="absolute right-0 translate-x-1/2">120</span>
                </div>

                {/* X-Axis Label */}
                <div className="text-center mt-2">
                  <span className="text-[11px] font-bold text-[#1E293B] tracking-wider select-none">
                    SUMBU X – POTENSI (45%)
                  </span>
                </div>
              </div>
            </div>

            {/* Legend Kategori */}
            <div className="flex items-center justify-center flex-wrap gap-4 text-[11px] text-[#757575] mt-3 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] inline-block shadow-sm" /> Sangat Baik
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block shadow-sm" /> Baik
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8F00] inline-block shadow-sm" /> Cukup
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] inline-block shadow-sm" /> Kurang
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] inline-block shadow-sm" /> Perlu Pembinaan
              </span>
            </div>
          </div>

          {/* Unit Terpilih Card di Bawah Chart (Tanpa Ilustrasi P3DW, Dilengkapi Korwil Badge & Button Lihat Detail, Tanpa Text 'Korwil II •') */}
          <div className="mt-4 p-4 rounded-xl bg-[#FAFAFA] dark:!bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-medium text-[#757575] dark:text-[#94A3B8] flex items-center gap-2">
                <span>Unit Terpilih:</span>
                <span className="text-[#475569] dark:text-[#E2E8F0] font-medium bg-[#F1F5F9] dark:!bg-[#1E293B] px-2.5 py-0.5 rounded-full text-[10px] border border-[#E2E8F0] dark:border-[#334155]">
                  {selectedUnit.korwil || 'Korwil II'}
                </span>
              </div>
              <div className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC] mt-0.5">
                {selectedUnit.nama}
              </div>
              <div className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[#1E293B] dark:text-[#F8FAFC]">{selectedUnit.box}</span>
                <span>•</span>
                <span>Kinerja: <strong className="text-[#212121] dark:text-[#F8FAFC]">{selectedUnit.y}</strong></span>
                <span>•</span>
                <span>Potensi: <strong className="text-[#212121] dark:text-[#F8FAFC]">{selectedUnit.x}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[22px] font-bold text-[#212121] dark:text-[#F8FAFC] leading-none">
                  {selectedUnit.skorTotal.toFixed(1)}
                </div>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${getKategoriBadgeStyle(
                    selectedUnit.kategori
                  )}`}
                >
                  {selectedUnit.kategori}
                </span>
              </div>

              {/* BUTTON LIHAT DETAIL (SESUAI DESAIN SISTEM BUTTON HIJAU) */}
              <button
                type="button"
                onClick={() => {
                  const match = mockLeaderboardData.find((l) => l.namaP3dw === selectedUnit.nama);
                  const targetId = match ? match.id : selectedUnit.id;
                  navigate(`/beranda/detail-analisis?id=${targetId}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#00875A] hover:bg-[#00724C] text-white rounded-[10px] text-[13px] font-medium transition shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Peta Sebaran Kinerja Jawa Barat (Tanpa Badge Jawa Barat) */}
        <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm flex flex-col h-full">
          {/* Header: Title */}
          <div className="mb-3 shrink-0">
            <h3 className="text-[16px] font-semibold text-[#212121]">
              Peta Sebaran Kinerja Jawa Barat
            </h3>
            <p className="text-[12px] text-[#757575] mt-0.5 font-normal">
              Tinjauan lokasi P3DW berdasarkan Skor Total. Seret peta untuk menggeser, arahkan kursor atau klik penanda untuk melihat detail.
            </p>
          </div>

          {/* Map Container - Membesar mengisi ruang hingga dekat ke teks legend bawah */}
          <div className="w-full flex-1 min-h-[420px] rounded-lg overflow-hidden border border-[#CBD5E1] shadow-inner relative z-0">
            <MapContainer
              center={[-6.914744, 107.60981]}
              zoom={8}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mockMapMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={createMarkerIcon(getPointColor(marker.kategori))}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                    click: () => {
                      const match = mockScatterData.find((s) => s.nama === marker.nama);
                      if (match) setSelectedUnit(match);
                    },
                  }}
                >
                  <Popup className="custom-leaflet-popup" autoPan={false} offset={[0, -10]}>
                    <div className="py-0.5 px-0.5 font-roboto min-w-[155px]">
                      <div className="font-bold text-[14px] text-[#1E293B] leading-snug">
                        {marker.nama}
                      </div>
                      <div className="text-[12px] text-[#64748B] mt-1 font-normal">
                        Skor Total: <strong className="font-bold text-[#1E293B]">{Number.isInteger(marker.skor) ? marker.skor : marker.skor.toFixed(1)}</strong> | Predikat: <strong className="font-bold text-[#1E293B]">{marker.predikat}</strong>
                      </div>
                      <div
                        className="text-[11px] mt-1.5 font-bold tracking-wide uppercase"
                        style={{ color: getPointColor(marker.kategori) }}
                      >
                        {marker.kategori}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Map Footer Indicator Legend */}
          <div className="flex items-center justify-center flex-wrap gap-4 text-[11px] text-[#757575] mt-3 font-medium shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] inline-block shadow-sm" /> Sangat Baik (A)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block shadow-sm" /> Baik (B)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF8F00] inline-block shadow-sm" /> Cukup (B-)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] inline-block shadow-sm" /> Perlu Pembinaan (C/D)
            </span>
          </div>
        </div>
      </section>

      {/* 3. LEADERBOARD & KOMPARASI AREA (Sesuai Referensi Gambar) */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm">
        {/* Header: Title, Keterangan Warna, & Filter Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <div>
            <h3 className="text-[18px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
              Leaderboard &amp; Komparasi Area
            </h3>

            {/* Keterangan Warna Sesuai Gambar Referensi (Kinerja Kuat A, Sedang B, Kurang C/D) */}
            <div className="flex items-center gap-3.5 mt-1.5 text-[12px] text-[#616161] dark:text-[#94A3B8] flex-wrap">
              <span className="text-[#424242] dark:text-[#E2E8F0] font-bold">Keterangan Warna:</span>
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-[#CBD5E1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52C41A] inline-block shrink-0" /> Kinerja Kuat (A)
              </span>
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-[#CBD5E1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FADB14] inline-block shrink-0" /> Sedang (B)
              </span>
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-[#CBD5E1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7875] inline-block shrink-0" /> Kurang (C/D)
              </span>
            </div>
          </div>

          {/* Form Controls: Pencarian (Sesuai Gambar Referensi Kedua), Klaster, Kanwil */}
          <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
            {/* Input Pencarian Sesuai Desain Sistem (Gambar Referensi ke-2: Rounded-12px & Tombol Hijau Squircle) */}
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-[#212121] dark:text-[#F8FAFC] mb-1.5 leading-none">
                Pencarian:
              </span>
              <div className="flex items-center w-56 sm:w-64 h-[44px] pl-4 pr-1.5 bg-white dark:bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155] rounded-[12px] shadow-2xs focus-within:border-[#00875A] focus-within:ring-1 focus-within:ring-[#00875A] transition-all">
                <input
                  type="text"
                  placeholder="Pencarian"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[14px] text-[#212121] dark:text-[#F8FAFC] placeholder:text-[#757575] dark:placeholder:text-[#94A3B8]"
                />
                <button
                  type="button"
                  className="w-[36px] h-[36px] rounded-[10px] bg-[#00875A] hover:bg-[#00724C] text-white flex items-center justify-center shrink-0 ml-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                  title="Cari"
                >
                  <Search size={18} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Klaster Select */}
            <CustomSelect
              label="Klaster:"
              value={filterKlaster}
              options={klasterOptions}
              onChange={(val) => setFilterKlaster(val)}
              className="w-36 sm:w-40"
            />

            {/* Korwil Select (Sesuai Permintaan User: Nama Filter 'Korwil' & Opsi 'Semua Korwil') */}
            <CustomSelect
              label="Korwil:"
              value={filterKorwil}
              options={korwilOptions}
              onChange={(val) => setFilterKorwil(val)}
              className="w-44 sm:w-48"
            />
          </div>
        </div>

        {/* Tabel Data (Header Hijau Sesuai Gambar 1 & Style Sebelumnya) */}
        <div className="rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm overflow-hidden bg-white dark:bg-[#1E293B]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-roboto">
              <thead className="bg-[#00875A] text-white text-[12px] font-semibold tracking-wide">
                <tr>
                  <th className="py-3.5 px-3 w-16 text-center border-r border-white/20">
                    PERINGKAT
                  </th>
                  <th className="py-3.5 px-4 text-left border-r border-white/20 min-w-[220px]">
                    NAMA P3DW
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    TOTAL SKOR
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    PREDIKAT
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    A (35%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    B (20%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    C (25%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    D (5%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    E (15%)
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] dark:divide-[#334155] text-[13px]">
                {displayedLeaderboard.length > 0 ? (
                  displayedLeaderboard.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors border-b border-[#E0E0E0]/60 dark:border-[#334155] ${getRowBgColor(
                        row.grade,
                        row.predikat,
                        selectedUnit.nama === row.namaP3dw
                      )}`}
                    >
                      <td className="py-3 px-3 font-bold text-center text-[#1E293B] dark:text-[#F8FAFC] border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        #{row.peringkat}
                      </td>
                      <td className="py-3 px-4 border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <div>
                          <div
                            className="font-bold text-[13px] text-[#1E293B] dark:text-[#F8FAFC] hover:text-[#00875A] cursor-pointer transition-colors leading-snug"
                            onClick={() => handleSelectBranch(row.namaP3dw)}
                          >
                            {row.namaP3dw}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-normal leading-snug mt-0.5">
                            {row.kanwil}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-center text-[#1E293B] dark:text-[#F8FAFC] border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        {row.totalSkor.toFixed(1).replace('.', ',')}
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[12px] font-medium whitespace-nowrap inline-flex items-center gap-1 shadow-2xs ${getPredikatBadgeStyle(
                            row.predikat
                          )}`}
                        >
                          <span>{row.predikat}</span>
                          <span className="opacity-75 text-[11px]">({row.grade || (row.predikat.includes('Sangat') ? 'A' : row.predikat.includes('Baik') ? 'B' : 'C')})</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span className={`font-semibold text-[13px] ${getScoreTextColor(row.scorePendapatan)}`}>
                          {Math.round(row.scorePendapatan)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span className={`font-semibold text-[13px] ${getScoreTextColor(row.scoreKepatuhan)}`}>
                          {Math.round(row.scoreKepatuhan)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span className={`font-semibold text-[13px] ${getScoreTextColor(row.scorePelayanan)}`}>
                          {Math.round(row.scorePelayanan)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span className={`font-semibold text-[13px] ${getScoreTextColor(row.scoreTataKelola)}`}>
                          {Math.round(row.scoreTataKelola)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <span className={`font-semibold text-[13px] ${getScoreTextColor(row.scoreSdm)}`}>
                          {Math.round(row.scoreSdm)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/beranda/detail-analisis?id=${row.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00875A] hover:bg-[#00724C] text-white text-[12px] font-medium transition cursor-pointer shadow-xs active:scale-95"
                        >
                          <span>Detail</span>
                          <ArrowUpRight size={14} className="stroke-[2.5]" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8] text-[13px]">
                      Tidak ada data yang sesuai dengan filter atau pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tombol Lihat Semua (Default 10 Data, Tanpa Pagination Bar Sesuai Permintaan) */}
          {filteredLeaderboard.length > 10 && (
            <div className="flex justify-center p-4 bg-white dark:bg-[#1E293B] border-t border-[#E0E0E0] dark:border-[#334155]">
              <button
                type="button"
                onClick={() => setShowAllData(!showAllData)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-[#00875A] dark:text-[#34D399] bg-white dark:bg-[#1E293B] border border-[#00875A]/30 hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>
                  {showAllData
                    ? 'Tampilkan Lebih Sedikit (10 Data)'
                    : `Lihat Semua (${filteredLeaderboard.length} P3DW)`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showAllData ? 'rotate-180' : ''
                    }`}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL PENJELASAN TIAP BOX (KONDISI, MAKNA, TINDAK LANJUT) */}
      <NineBoxExplanationModal
        isOpen={isExplanationModalOpen}
        onClose={() => setIsExplanationModalOpen(false)}
        initialBoxNumber={selectedBoxModal}
      />
    </div>
  );
};

export default BerandaDashboardPage;
