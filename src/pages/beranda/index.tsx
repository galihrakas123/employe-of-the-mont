import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Star,
  Banknote,
  AlertTriangle,
  ChevronDown,
  Building2,
  ArrowUpRight,
  Filter,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  TrendingUp,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  mockKpiTopCards,
  mockScatterData,
  mockLeaderboardData,
  mockMapMarkers,
  P3dwScatterData,
} from '@/services/dashboardMockData';
import CustomSelect from '@/components/ui/CustomSelect';
import SearchBar from '@/components/ui/SearchBar';

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
  const [filterKanwil, setFilterKanwil] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Options untuk CustomSelect (Matching Referensi Gambar)
  const klasterOptions = [
    { label: 'Semua Klaster', value: 'ALL' },
    { label: 'Klaster Kuat', value: 'Kuat' },
    { label: 'Klaster Sedang', value: 'Sedang' },
    { label: 'Klaster Kurang', value: 'Kurang' },
  ];

  const kanwilOptions = [
    { label: 'Semua Kanwil', value: 'ALL' },
    { label: 'Korwil I', value: 'Korwil I' },
    { label: 'Korwil II', value: 'Korwil II' },
    { label: 'Korwil III', value: 'Korwil III' },
    { label: 'Korwil V', value: 'Korwil V' },
  ];

  // Filtered Leaderboard
  const filteredLeaderboard = mockLeaderboardData.filter((item) => {
    const matchKlaster = filterKlaster === 'ALL' || item.klaster === filterKlaster;
    const matchKanwil = filterKanwil === 'ALL' || item.kanwil === filterKanwil;
    const matchSearch = item.namaP3dw.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKlaster && matchKanwil && matchSearch;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLeaderboard.length / itemsPerPage));
  const paginatedLeaderboard = filteredLeaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Helper warna teks angka kolom A, B, C, D, E (sesuai color tokens)
  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-[#00875A] font-medium';
    if (score >= 70) return 'text-[#FF8F00] font-medium';
    return 'text-[#E53935] font-medium';
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1500px] mx-auto p-6 lg:p-7 pb-10 font-roboto antialiased text-[#212121]">
      {/* 0. PAGE TITLE (Matching Gambar Kedua Skin: "Dashboard  Kinerja Strategis") */}
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

      {/* 1. TOP KPI CARDS (Matching Gambar Referensi Persis) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total / Rata-rata Skor KPI (Solid Green Highlight Card) */}
        <div className="bg-[#00875A] rounded-2xl p-5 shadow-sm text-white flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          {/* Top Row: Label & Circular Icon Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-white/85 uppercase font-roboto">
              RATA-RATA SKOR KPI
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <Activity size={16} />
            </div>
          </div>

          {/* Middle Row: Big Bold White Number */}
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-black text-white leading-none tracking-tight font-roboto">
                78.5
              </span>
              <span className="text-[14px] font-semibold text-white/80">/ 100</span>
            </div>
          </div>

          {/* Bottom Row: Subtitle with Trend Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
            <TrendingUp size={14} />
            <span>Gabungan 5 Area (A–E)</span>
          </div>
        </div>

        {/* Card 2: Sukses Terkirim / Cabang Bintang Utama (White Card + Green Subtitle) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          {/* Top Row: Label & Mint Green Icon Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              Kapus of the Month
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#00875A] flex items-center justify-center shrink-0">
              <Star size={16} className="fill-[#00875A]" />
            </div>
          </div>

          {/* Middle Row: Big Bold Navy Number */}
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight font-roboto">
                8
              </span>
              <span className="text-[13px] font-semibold text-[#64748B]">P3DW</span>
            </div>
          </div>

          {/* Bottom Row: Green Status Text */}
          <div className="text-[11px] font-semibold text-[#00875A]">
            Kinerja optimal di Kuadran Box 9
          </div>
        </div>

        {/* Card 3: Realisasi PKB (White Card + Neutral Subtitle) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          {/* Top Row: Label & Mint Green Icon Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              Realisasi PKB terhadap target
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#00875A] flex items-center justify-center shrink-0">
              <Banknote size={16} />
            </div>
          </div>

          {/* Middle Row: Big Bold Navy Number */}
          <div className="my-2">
            <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight font-roboto">
              96,2%
            </span>
          </div>

          {/* Bottom Row: Subtitle Text */}
          <div className="text-[11px] font-medium text-[#64748B]">
            Rata-rata capaian 34 P3DW s.d. Oktober
          </div>
        </div>

        {/* Card 4: Retur / Unit Perlu Perhatian (White Card + Red Bold Stat & Red Subtitle) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          {/* Top Row: Label & Red Icon Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              UNIT PERLU PERHATIAN
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFEBEE] text-[#E53935] flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
          </div>

          {/* Middle Row: Big Bold Red Number */}
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-black text-[#E53935] leading-none tracking-tight font-roboto">
                4
              </span>
              <span className="text-[13px] font-semibold text-[#E53935]/80">P3DW</span>
            </div>
          </div>

          {/* Bottom Row: Red Warning Subtitle */}
          <div className="text-[11px] font-semibold text-[#E53935]">
            Berada di Box 1 (Priority Improvement)
          </div>
        </div>
      </section>

      {/* 2. MIDDLE SECTION (Grid 2 Kolom: Matriks Scatter & Peta Sebaran) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
        {/* Kolom Kiri: Matriks Kinerja dan Potensial (ScatterChart) */}
        <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Title (Tanpa Box Dropdown 9 Kuadran) */}
            <div className="mb-4">
              <h3 className="text-[16px] font-semibold text-[#212121]">
                Matriks Kinerja dan Potensial
              </h3>
              <p className="text-[12px] text-[#757575] mt-0.5 font-normal">
                Posisi 34 P3DW. Kinerja = Kemandirian Keuangan Daerah (55%, KPI 1–9). Potensi = Kualitas Pelayanan Publik (45%, KPI 10–18). Pilih titik untuk melihat unit.
              </p>
            </div>

            {/* 9-Box Matrix Grid with Axis Labels & Ticks */}
            <div className="flex items-start select-none">
              {/* Y-Axis Label & Ticks */}
              <div className="flex items-center mr-2 shrink-0 self-stretch">
                {/* Vertical Rotated Axis Label */}
                <div className="flex items-center justify-center w-6 mr-1">
                  <span className="text-[11px] font-bold text-[#1E293B] tracking-wider whitespace-nowrap -rotate-90 select-none">
                    KINERJA (KEMANDIRIAN KEUANGAN)
                  </span>
                </div>
                {/* Y-Axis Ticks (100, 80, 60, 40) */}
                <div className="relative h-[310px] w-7 text-right pr-1.5 text-[11px] font-medium text-[#64748B] select-none">
                  <span className="absolute right-1.5 top-0 -translate-y-1/2">100</span>
                  <span className="absolute right-1.5 top-1/3 -translate-y-1/2">80</span>
                  <span className="absolute right-1.5 top-2/3 -translate-y-1/2">60</span>
                  <span className="absolute right-1.5 bottom-0 translate-y-1/2">40</span>
                </div>
              </div>

              {/* Matrix + X-Axis Container */}
              <div className="flex-1 min-w-0">
                {/* 9-Box Matrix Grid (Warna Box & Dot Sesuai Gambar Referensi Kedua) */}
                <div className="w-full h-[310px] relative rounded-lg border border-[#E2E8F0] select-none bg-white shadow-inner">
                  {/* 3x3 Grid Background Boxes Sesuai Gambar Referensi Kedua */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 rounded-lg overflow-hidden">
                    {/* Row 1 (Top): Box 7, Box 8, Box 9 */}
                    {/* Box 7 */}
                    <div className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#1E293B]">Box 7</span>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Hasil tinggi, pendorong rapuh
                      </span>
                    </div>
                    {/* Box 8 */}
                    <div className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#1E293B]">Box 8</span>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Hasil unggul
                      </span>
                    </div>
                    {/* Box 9 */}
                    <div className="bg-[#E6F4FF] border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#0066CC]">Box 9</span>
                      <span className="text-[10px] text-[#0284C7] leading-tight mt-0.5 font-normal">
                        Unggul penuh
                      </span>
                    </div>

                    {/* Row 2 (Middle): Box 4, Box 5, Box 6 */}
                    {/* Box 4 */}
                    <div className="bg-[#FFF0F2] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#B91C1C]">Box 4</span>
                      <span className="text-[10px] text-[#991B1B] leading-tight mt-0.5 font-normal">
                        Pendorong lemah
                      </span>
                    </div>
                    {/* Box 5 */}
                    <div className="bg-[#FFFDEB] border-r border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#B45309]">Box 5</span>
                      <span className="text-[10px] text-[#92400E] leading-tight mt-0.5 font-normal">
                        Inti
                      </span>
                    </div>
                    {/* Box 6 */}
                    <div className="bg-[#ECFDF5] border-b border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#00875A]">Box 6</span>
                      <span className="text-[10px] text-[#047857] leading-tight mt-0.5 font-normal">
                        Pendorong kuat
                      </span>
                    </div>

                    {/* Row 3 (Bottom): Box 1, Box 2, Box 3 */}
                    {/* Box 1 */}
                    <div className="bg-[#FFF0F2] border-r border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#B91C1C]">Box 1</span>
                      <span className="text-[10px] text-[#991B1B] leading-tight mt-0.5 font-normal">
                        Perlu pembinaan
                      </span>
                    </div>
                    {/* Box 2 */}
                    <div className="bg-[#FEF3C7] border-r border-[#E2E8F0] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#B45309]">Box 2</span>
                      <span className="text-[10px] text-[#92400E] leading-tight mt-0.5 font-normal">
                        Hasil tertinggal
                      </span>
                    </div>
                    {/* Box 3 */}
                    <div className="bg-[#F8FAFC] p-2.5 flex flex-col justify-start">
                      <span className="text-[12px] font-bold text-[#1E293B]">Box 3</span>
                      <span className="text-[10px] text-[#64748B] leading-tight mt-0.5 font-normal">
                        Pendorong kuat, hasil belum terlihat
                      </span>
                    </div>
                  </div>

                  {/* Scatter Points Overlay (Matching Gambar Pertama dengan Titik Terpilih Sesuai Gambar Kedua) */}
                  {mockScatterData.map((item) => {
                    const posX = `${Math.min(94, Math.max(6, ((item.x - 40) / 60) * 100))}%`;
                    const posY = `${Math.min(94, Math.max(6, (1 - (item.y - 40) / 60) * 100))}%`;
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
                          left: posX,
                          top: posY,
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

                  {/* Floating Tooltip saat Hover Point (Card Putih Premium & Anti-Clipping) */}
                  {hoveredUnit && (() => {
                    const rawX = ((hoveredUnit.x - 40) / 60) * 100;
                    const rawY = (1 - (hoveredUnit.y - 40) / 60) * 100;
                    const isTopHalf = rawY < 45;
                    const isRightHalf = rawX > 60;

                    return (
                      <div
                        className={`absolute pointer-events-none z-10 bg-white text-[#0F172A] rounded-[14px] p-3 shadow-xl shadow-black/15 border border-[#E2E8F0] font-roboto min-w-[185px] transition-all ${isTopHalf ? 'translate-y-3' : '-translate-y-full -mt-2'
                          } ${isRightHalf ? '-translate-x-[85%]' : rawX < 35 ? '-translate-x-[15%]' : '-translate-x-1/2'}`}
                        style={{
                          left: `${Math.min(94, Math.max(6, rawX))}%`,
                          top: `${Math.min(94, Math.max(6, rawY))}%`,
                        }}
                      >
                        <div className="font-bold text-[#0F172A] text-[13px] leading-snug">
                          {hoveredUnit.nama}
                        </div>
                        <div className="text-[#64748B] text-[11px] mt-0.5 font-normal">
                          {hoveredUnit.korwil || 'Korwil II'} • {hoveredUnit.box}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] grid grid-cols-3 gap-2 text-left">
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Kinerja:</div>
                            <div className="text-[13px] font-bold text-[#00875A] leading-tight">{hoveredUnit.y}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Potensi:</div>
                            <div className="text-[13px] font-bold text-[#0284c7] leading-tight">{hoveredUnit.x}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B]">Skor:</div>
                            <div className="text-[13px] font-bold text-[#D97706] leading-tight">{hoveredUnit.skorTotal.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* X-Axis Ticks (40, 60, 80, 100) */}
                <div className="relative w-full h-4 mt-1.5 text-[11px] font-medium text-[#64748B] select-none">
                  <span className="absolute left-0 -translate-x-1/2">40</span>
                  <span className="absolute left-1/3 -translate-x-1/2">60</span>
                  <span className="absolute left-2/3 -translate-x-1/2">80</span>
                  <span className="absolute right-0 translate-x-1/2">100</span>
                </div>

                {/* X-Axis Label */}
                <div className="text-center mt-2">
                  <span className="text-[11px] font-bold text-[#1E293B] tracking-wider select-none">
                    POTENSI (KUALITAS PELAYANAN PUBLIK)
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
              <div className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
                {selectedUnit.box} • Kinerja: <strong className="text-[#212121] dark:text-[#F8FAFC]">{selectedUnit.y}</strong> • Potensi: <strong className="text-[#212121] dark:text-[#F8FAFC]">{selectedUnit.x}</strong>
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

      {/* 3. BOTTOM SECTION: Leaderboard & Komparasi Area (Header Tabel Gambar 3 + Button & Pagination Gambar 4 + InputField Gambar 5) */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm">
        {/* Table Controls (Menggunakan InputField Design Gambar 5) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <div>
            <h3 className="text-[18px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
              Leaderboard & Komparasi Area
            </h3>
            {/* Keterangan Warna */}
            <div className="flex items-center gap-3 mt-1 text-[12px] text-[#757575] dark:text-[#94A3B8]">
              <span className="font-medium text-[#424242] dark:text-[#CBD5E1]">Keterangan Warna:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00875A]" /> Kinerja Kuat (A)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF8F00]" /> Sedang (B)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E53935]" /> Kurang (C/D)
              </span>
            </div>
          </div>

          {/* Form InputFields & CustomSelect Dropdowns (Sesuai Desain Sistem: h-[44px], rounded-[12px], Roboto 14px) */}
          <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
            {/* Search InputField */}
            <div className="relative flex-1 sm:w-64">
              <span className="text-[14px] font-medium text-[#212121] dark:text-[#F8FAFC] mb-1.5 block leading-none font-roboto">
                Pencarian:
              </span>
              <SearchBar
                placeholder="Pencarian"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>

            {/* Filter Klaster CustomSelect */}
            <CustomSelect
              label="Klaster:"
              value={filterKlaster}
              options={klasterOptions}
              onChange={(val) => {
                setFilterKlaster(val);
                setCurrentPage(1);
              }}
              className="w-44"
            />

            {/* Filter Kanwil CustomSelect */}
            <CustomSelect
              label="Kanwil:"
              value={filterKanwil}
              options={kanwilOptions}
              onChange={(val) => {
                setFilterKanwil(val);
                setCurrentPage(1);
              }}
              className="w-44"
            />
          </div>
        </div>

        {/* TABEL DENGAN HEADER HIJAU & PAGINATION TERPADU (SESUAI GAMBAR REFERENSI) */}
        <div className="rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm overflow-hidden bg-white dark:bg-[#1E293B]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-roboto">
              {/* Header Tabel: Solid Green #00875A dengan Divider Garis Putih Vertikal */}
              <thead className="bg-[#00875A] text-white text-[12px] font-medium tracking-wide">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center border-r border-white/20">
                    PERINGKAT
                  </th>
                  <th className="py-3.5 px-4 border-r border-white/20 min-w-[200px]">
                    NAMA P3DW
                  </th>
                  <th className="py-3.5 px-4 text-center border-r border-white/20">
                    TOTAL SKOR
                  </th>
                  <th className="py-3.5 px-4 text-center border-r border-white/20">
                    PREDIKAT
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    A (40%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    B (20%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    C (20%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    D (10%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20">
                    E (10%)
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] dark:divide-[#334155] bg-white dark:bg-[#1E293B] text-[13px]">
                {paginatedLeaderboard.length > 0 ? (
                  paginatedLeaderboard.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#334155]/30 transition-colors border-b border-[#E0E0E0] dark:border-[#334155] last:border-b-0">
                      <td className="py-3.5 px-4 font-semibold text-center text-[#212121] dark:text-[#F8FAFC] border-r border-[#E0E0E0] dark:border-[#334155]">
                        #{row.peringkat}
                      </td>
                      <td className="py-3.5 px-4 border-r border-[#E0E0E0] dark:border-[#334155]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#E6F4EA] dark:bg-[#00875A]/25 text-[#00875A] dark:text-[#34D399] flex items-center justify-center font-bold text-[10px] shrink-0">
                            <Building2 size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-[#212121] dark:text-[#F8FAFC]">{row.namaP3dw}</div>
                            <div className="text-[11px] text-[#757575] dark:text-[#94A3B8]">{row.kanwil}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-center text-[#212121] dark:text-[#F8FAFC] border-r border-[#E0E0E0] dark:border-[#334155]">
                        {row.totalSkor.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-center border-r border-[#E0E0E0] dark:border-[#334155]">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] ${row.predikat === 'A'
                            ? 'bg-[#E6F4EA] dark:bg-[#00875A]/20 text-[#00875A] dark:text-[#34D399]'
                            : row.predikat === 'B'
                              ? 'bg-[#E3F2FD] dark:bg-[#0284C7]/20 text-[#0D47A1] dark:text-[#38BDF8]'
                              : row.predikat === 'C'
                                ? 'bg-[#FFF8E1] dark:bg-[#D97706]/20 text-[#FF8F00] dark:text-[#FBBF24]'
                                : 'bg-[#FFEBEE] dark:bg-[#DC2626]/20 text-[#E53935] dark:text-[#F87171]'
                            }`}
                        >
                          {row.predikat}
                        </span>
                      </td>
                      <td className={`py-3.5 px-3 text-center border-r border-[#E0E0E0] dark:border-[#334155] ${getScoreTextColor(row.scoreA)}`}>
                        {row.scoreA}
                      </td>
                      <td className={`py-3.5 px-3 text-center border-r border-[#E0E0E0] dark:border-[#334155] ${getScoreTextColor(row.scoreB)}`}>
                        {row.scoreB}
                      </td>
                      <td className={`py-3.5 px-3 text-center border-r border-[#E0E0E0] dark:border-[#334155] ${getScoreTextColor(row.scoreC)}`}>
                        {row.scoreC}
                      </td>
                      <td className={`py-3.5 px-3 text-center border-r border-[#E0E0E0] dark:border-[#334155] ${getScoreTextColor(row.scoreD)}`}>
                        {row.scoreD}
                      </td>
                      <td className={`py-3.5 px-3 text-center border-r border-[#E0E0E0] dark:border-[#334155] ${getScoreTextColor(row.scoreE)}`}>
                        {row.scoreE}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {/* BUTTON DETAIL DENGAN WARNA BG SOLID HIJAU (SESUAI REQUEST USER) */}
                        <button
                          type="button"
                          onClick={() => navigate(`/beranda/detail-analisis?id=${row.id}`)}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-[#00875A] hover:bg-[#00724C] text-white px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>Detail</span>
                          <ArrowUpRight size={13} className="stroke-[2.5]" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-[#757575] dark:text-[#94A3B8] text-[13px]">
                      Tidak ada data yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer Row (Merged dengan Tabel Sesuai Gambar Referensi Pertama) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-[#F8FAFC] dark:!bg-[#1E293B] border-t border-[#E0E0E0] dark:border-[#334155] text-[12px] text-[#475569] dark:text-[#94A3B8] font-roboto select-none">
            {/* Kiri: Tampilkan [ 10 ⌄ ] Item | dari total 12 */}
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <div className="relative inline-flex items-center">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white dark:!bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] hover:border-[#00875A] dark:hover:border-[#00875A] rounded-lg px-2.5 py-1 pr-6 text-[12px] font-medium text-[#1E293B] dark:text-[#F8FAFC] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00875A] transition shadow-xs"
                >
                  <option value={5} className="dark:bg-[#0F172A] dark:text-[#F8FAFC]">5</option>
                  <option value={10} className="dark:bg-[#0F172A] dark:text-[#F8FAFC]">10</option>
                  <option value={20} className="dark:bg-[#0F172A] dark:text-[#F8FAFC]">20</option>
                  <option value={50} className="dark:bg-[#0F172A] dark:text-[#F8FAFC]">50</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#00875A]"
                />
              </div>
              <span>Item</span>
              <span className="text-[#CBD5E1] dark:text-[#475569] mx-1">|</span>
              <span>
                dari total <strong className="font-bold text-[#1E293B] dark:text-[#F8FAFC]">{filteredLeaderboard.length}</strong>
              </span>
            </div>

            {/* Kanan: Halaman [ 1 ⌄ ] dari 2  [ < | > ] */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span>Halaman</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="appearance-none bg-white dark:!bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] hover:border-[#00875A] dark:hover:border-[#00875A] rounded-lg px-2.5 py-1 pr-6 text-[12px] font-medium text-[#1E293B] dark:text-[#F8FAFC] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00875A] transition shadow-xs"
                  >
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <option key={idx + 1} value={idx + 1} className="dark:bg-[#0F172A] dark:text-[#F8FAFC]">
                        {idx + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#00875A]"
                  />
                </div>
                <span>
                  dari <strong className="font-bold text-[#1E293B] dark:text-[#F8FAFC]">{totalPages}</strong>
                </span>
              </div>

              {/* Navigation Arrows Button Pill [ < | > ] */}
              <div className="flex items-center border border-[#CBD5E1] dark:border-[#334155] rounded-lg overflow-hidden bg-white dark:!bg-[#0F172A] shadow-xs">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 px-2.5 hover:bg-[#F1F5F9] dark:hover:!bg-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed border-r border-[#CBD5E1] dark:border-[#334155] transition flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 px-2.5 hover:bg-[#F1F5F9] dark:hover:!bg-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-[#00875A] dark:text-[#34D399] hover:text-[#006644] dark:hover:text-[#10B981]"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BerandaDashboardPage;
