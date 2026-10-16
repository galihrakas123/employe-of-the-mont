import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Star,
  Banknote,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  TrendingUp,
  HelpCircle,
  X,
} from 'lucide-react';
import { mockLeaderboardData, P3dwLeaderboardData, P3dwScatterData } from '@/services/dashboardMockData';
import { PERIODE_BERJALAN, PERIODE_LIST, getEvaluasiSemua, getPeriode } from '@/services/periodeData';
import CustomSelect from '@/components/ui/CustomSelect';
import NineBoxExplanationModal from '@/components/ui/NineBoxExplanationModal';
import TalentBoxMatrix, { MatrixLegend } from '@/components/charts/TalentBoxMatrix';
import { NINE_BOX_DETAILS } from '@/constants/nineBoxData';

const periodeOptions = [...PERIODE_LIST].reverse().map((p) => ({ label: p.label, value: p.key }));

export const BerandaDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Periode penilaian (disimpan di URL ?periode=YYYY-MM, sama seperti halaman detail); bawaan = bulan berjalan
  const [searchParams, setSearchParams] = useSearchParams();
  const periode = getPeriode(searchParams.get('periode'));
  const isPeriodeBerjalan = periode.key === PERIODE_BERJALAN.key;
  const setPeriode = (key: string) => {
    const next = new URLSearchParams(searchParams);
    if (key === PERIODE_BERJALAN.key) next.delete('periode');
    else next.set('periode', key);
    setSearchParams(next, { replace: true });
  };
  const detailUrl = (id: string) =>
    `/beranda/detail-analisis?id=${id}${isPeriodeBerjalan ? '' : `&periode=${periode.key}`}`;

  // Penilaian 34 P3DW pada periode terpilih: titik matriks & baris leaderboard
  const { scatterData, leaderboardData } = useMemo(() => {
    const evaluasi = getEvaluasiSemua(periode.key);
    const byId = new Map(evaluasi.map((e) => [e.id, e]));
    const scatter: P3dwScatterData[] = evaluasi.map((e) => ({
      id: e.id,
      nama: e.nama,
      x: e.x,
      y: e.y,
      box: e.boxLabel,
      boxNumber: e.boxNumber,
      kategori: e.kategori,
      skorTotal: e.total,
      korwil: e.korwil,
      kinerjaLevel: e.kinerjaLevel,
      potensiLevel: e.potensiLevel,
    }));
    const leaderboard: P3dwLeaderboardData[] = mockLeaderboardData
      .map((u) => {
        const e = byId.get(u.id)!;
        return {
          ...u,
          peringkat: e.peringkat,
          totalSkor: e.total,
          predikat: e.predikat,
          grade: e.grade,
          scorePendapatan: e.pendapatan,
          scoreKepatuhan: e.kepatuhan,
          scorePelayanan: e.pelayanan,
          scoreTataKelola: e.tataKelola,
          scoreSdm: e.sdm,
          skorY: e.y,
          skorX: e.x,
          boxNumber: e.boxNumber,
          boxName: e.boxName,
        };
      })
      .sort((a, b) => a.peringkat - b.peringkat);
    return { scatterData: scatter, leaderboardData: leaderboard };
  }, [periode.key]);

  // Ringkasan kartu atas untuk periode terpilih
  const ringkasan = useMemo(() => {
    const n = scatterData.length || 1;
    return {
      rataSkor: (scatterData.reduce((acc, u) => acc + u.skorTotal, 0) / n).toFixed(1),
      box9: scatterData.filter((u) => u.boxNumber === 9).length,
      box1: scatterData.filter((u) => u.boxNumber === 1).length,
      rataPendapatan: (leaderboardData.reduce((acc, u) => acc + u.scorePendapatan, 0) / n).toFixed(1),
    };
  }, [scatterData, leaderboardData]);

  // State
  // Default tidak ada unit terpilih; klik ulang unit yang sama, tombol ✕, atau Esc untuk membatalkan pilihan.
  // Yang disimpan hanya id-nya, agar ringkasan unit ikut berganti saat periode diganti.
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const selectedUnit = scatterData.find((s) => s.id === selectedUnitId) ?? null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedUnitId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const [filterKlaster, setFilterKlaster] = useState<string>('ALL');
  const [filterKorwil, setFilterKorwil] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState<boolean>(false);
  const [selectedBoxModal, setSelectedBoxModal] = useState<number>(9);

  const handleOpenBoxExplanation = (boxNum: number) => {
    setSelectedBoxModal(boxNum);
    setIsExplanationModalOpen(true);
  };

  // Pilih unit tanpa mengubah filter tabel, agar daftar P3DW lain tetap tampil
  const handleSelectBranch = (unitId: string) => {
    setSelectedUnitId((prev) => (prev === unitId ? null : unitId));
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
  const filteredLeaderboard = leaderboardData.filter((item) => {
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

  // Titik matriks yang tidak lolos filter diredupkan
  const filteredIds = new Set(filteredLeaderboard.map((item) => item.id));
  const dimmedUnitIds = new Set(scatterData.filter((item) => !filteredIds.has(item.id)).map((item) => item.id));

  // Tampilkan semua data; tabel di-scroll di dalam kartunya sendiri
  const displayedLeaderboard = filteredLeaderboard;

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

  // Warna baris tabel mengikuti klaster: Besar hijau, Sedang kuning, Kecil merah
  const KLASTER_ROW_TINT: Record<string, string> = {
    'Klaster Besar': 'bg-green-100 dark:bg-[#064E3B]/20',
    'Klaster Sedang': 'bg-yellow-100 dark:bg-[#78350F]/20',
    'Klaster Kecil': 'bg-red-100 dark:bg-[#881337]/20',
  };
  const KLASTER_ROW_HOVER: Record<string, string> = {
    'Klaster Besar': 'hover:bg-green-200/70 dark:hover:bg-[#064E3B]/35',
    'Klaster Sedang': 'hover:bg-yellow-200/70 dark:hover:bg-[#78350F]/35',
    'Klaster Kecil': 'hover:bg-red-200/70 dark:hover:bg-[#881337]/35',
  };

  const getRowBgColor = (klaster: string, isSelected: boolean) => {
    if (isSelected) return 'bg-[#E6F4EA] dark:bg-[#00875A]/30 border-l-4 border-l-[#00875A]';
    return `${KLASTER_ROW_TINT[klaster] ?? ''} ${KLASTER_ROW_HOVER[klaster] ?? ''}`;
  };

  // Warna lapisan kolom AKSI yang di-pin: sama dengan warna baris, ditumpuk di atas latar solid
  const getRowTint = (klaster: string, isSelected: boolean) =>
    isSelected ? 'bg-[#E6F4EA] dark:bg-[#00875A]/30' : KLASTER_ROW_TINT[klaster] ?? '';

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
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-7 pb-10 font-roboto antialiased text-[#212121]">
      {/* 0. PAGE TITLE (Sesuai Dokumen Talent Box KPI Kepala Pusat Cabang Samsat) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-[26px] font-semibold text-[#212121] tracking-tight leading-tight">
            Dashboard Kinerja Strategis
          </h1>
          <p className="text-[12px] text-[#757575] font-normal mt-0.5">
            Sistem Informasi Evaluasi Kinerja Strategis & Pemetaan Potensial P3DW Bapenda Jawa Barat
          </p>
        </div>
        {/* Pilih periode penilaian yang ingin ditinjau (sama seperti di halaman detail) */}
        <div className="shrink-0">
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
      </div>

      {/* Penanda saat meninjau periode lampau */}
      {!isPeriodeBerjalan && (
        <div className="-mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] dark:bg-[#78350F]/20 px-4 py-2.5 text-[12.5px] text-[#92400E] dark:text-[#FBBF24]">
          <span>
            Menampilkan penilaian <b>{periode.label}</b>. Peringkat, posisi matriks, dan skor mengikuti periode tersebut.
          </span>
          <button
            type="button"
            onClick={() => setPeriode(PERIODE_BERJALAN.key)}
            className="font-semibold underline underline-offset-2 hover:no-underline cursor-pointer"
          >
            Kembali ke {PERIODE_BERJALAN.label}
          </button>
        </div>
      )}

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
                {ringkasan.rataSkor.replace('.', ',')}
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
                {ringkasan.box9}
              </span>
              <span className="text-[13px] font-semibold text-[#64748B]">P3DW</span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#00875A]">
            Box 9 (Kinerja ≥ 100 &amp; Potensi ≥ 95)
          </div>
        </div>

        {/* Card 3: Capaian Area Pendapatan */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-roboto">
              Capaian Area Pendapatan
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E8F8EE] text-[#00875A] flex items-center justify-center shrink-0">
              <Banknote size={16} />
            </div>
          </div>

          <div className="my-2">
            <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight font-roboto">
              {ringkasan.rataPendapatan.replace('.', ',')}%
            </span>
          </div>

          <div className="text-[11px] font-medium text-[#64748B]">
            Rata-rata 34 P3DW · {periode.label}
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
                {ringkasan.box1}
              </span>
              <span className="text-[13px] font-semibold text-[#E53935]/80">P3DW</span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#E53935]">
            Box 1 (Priority Improvement: Y &lt; 90, X &lt; 85)
          </div>
        </div>
      </section>

      {/* 2–3. Matriks & Leaderboard: berdampingan bila lebar cukup, bertumpuk bila tidak */}
      <div className="flex flex-wrap items-stretch gap-6">
      {/* 2. MIDDLE SECTION: Matriks Kinerja dan Potensi */}
      <section className="relative z-0 flex-[2_1_480px] min-w-0 max-w-full">
        {/* Kolom Kiri: Matriks Kinerja dan Potensial (ScatterChart) */}
        <div className="h-full bg-white rounded-xl p-4 sm:p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Title & Panduan Button Sesuai yang Ada di Detail */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
                  Matriks Kinerja dan Potensi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBoxExplanation(selectedUnit?.boxNumber ?? 9)}
                className="text-[11px] font-medium text-[#00875A] hover:text-[#006644] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0 py-1 px-2.5 rounded-lg bg-[#E6F4EA]/70 hover:bg-[#E6F4EA] transition"
                title="Lihat penjelasan dan panduan untuk tiap box"
              >
                <HelpCircle size={13} />
                <span>Panduan</span>
              </button>
            </div>

            <div className="max-w-[560px] mx-auto">
            <TalentBoxMatrix
              showCounts
              dimmed={dimmedUnitIds}
              selectedId={selectedUnit?.id}
              onSelect={handleSelectBranch}
              onBoxClick={handleOpenBoxExplanation}
              points={scatterData.map((item) => ({
                id: item.id,
                label: item.nama,
                x: item.x,
                y: item.y,
                final: item.skorTotal,
                sub: item.korwil,
              }))}
            />
            <MatrixLegend />
            </div>
          </div>

          {/* Unit Terpilih: identitas unit, lalu angka sumbu, skor & tombol detail dalam satu baris */}
          {selectedUnit ? (
            <div className="mt-4 p-4 rounded-xl bg-[#FAFAFA] dark:!bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-[#757575] dark:text-[#94A3B8]">Unit Terpilih</div>
                  <div className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC] leading-snug truncate">
                    {selectedUnit.nama}
                  </div>
                  <div className="text-[12px] leading-snug">
                    <span className="font-semibold text-[#00875A] dark:text-[#34D399]">
                      Box {selectedUnit.boxNumber} · {NINE_BOX_DETAILS[selectedUnit.boxNumber]?.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {' '}({NINE_BOX_DETAILS[selectedUnit.boxNumber]?.label.replace(', ', ' · ')})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="whitespace-nowrap text-[10px] font-medium text-[#475569] dark:text-[#E2E8F0] bg-[#F1F5F9] dark:!bg-[#1E293B] px-2.5 py-0.5 rounded-full border border-[#E2E8F0] dark:border-[#334155]">
                    {selectedUnit.korwil}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedUnitId(null)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] transition cursor-pointer"
                    title="Batalkan pilihan (Esc)"
                    aria-label="Batalkan pilihan unit"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3 mt-3 pt-3 border-t border-[#E0E0E0] dark:border-[#334155]">
                <div className="flex gap-5">
                  <div>
                    <div className="text-[11px] text-[#757575] dark:text-[#94A3B8]">Kinerja (Y)</div>
                    <div className="text-[17px] font-bold leading-tight text-[#00875A] dark:text-[#34D399]">
                      {selectedUnit.y.toFixed(1).replace('.', ',')}
                      <span className="ml-1 text-[10px] font-medium text-[#94A3B8]">{selectedUnit.kinerjaLevel}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#757575] dark:text-[#94A3B8]">Potensi (X)</div>
                    <div className="text-[17px] font-bold leading-tight text-[#0284C7] dark:text-[#38BDF8]">
                      {selectedUnit.x.toFixed(1).replace('.', ',')}
                      <span className="ml-1 text-[10px] font-medium text-[#94A3B8]">{selectedUnit.potensiLevel}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#757575] dark:text-[#94A3B8]">Skor Akhir</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[17px] font-bold leading-tight text-[#212121] dark:text-[#F8FAFC]">
                        {selectedUnit.skorTotal.toFixed(1).replace('.', ',')}
                      </span>
                      <span
                        className={`px-2 py-px rounded-full text-[10px] font-semibold whitespace-nowrap ${getKategoriBadgeStyle(
                          selectedUnit.kategori
                        )}`}
                      >
                        {selectedUnit.kategori}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(detailUrl(selectedUnit.id))}
                  className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#00875A] hover:bg-[#00724C] text-white rounded-[10px] text-[13px] font-medium transition shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <span>Lihat Detail</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl border border-dashed border-[#CBD5E1] dark:border-[#334155] text-center text-[12px] text-[#757575] dark:text-[#94A3B8]">
              Belum ada unit dipilih. Klik titik di matriks atau nama P3DW di tabel untuk melihat ringkasannya.
            </div>
          )}
        </div>
      </section>

      {/* 3. LEADERBOARD & KOMPARASI AREA (Sesuai Referensi Gambar) */}
      <section className="flex-[3_1_860px] min-w-0 max-w-full flex flex-col bg-white dark:bg-[#1E293B] rounded-xl p-4 sm:p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm">
        {/* Header: judul & keterangan warna sebaris, filter dalam satu baris di bawahnya */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
              Leaderboard &amp; Komparasi Area
            </h3>
            <div className="flex items-center gap-3 text-[12px] text-[#616161] dark:text-[#CBD5E1] flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52C41A] inline-block shrink-0" /> Klaster Besar
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FADB14] inline-block shrink-0" /> Klaster Sedang
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7875] inline-block shrink-0" /> Klaster Kecil
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Pencarian langsung saat mengetik */}
            <label className="flex-[1_1_220px] flex items-center gap-2 h-10 px-3.5 bg-white dark:bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155] rounded-[12px] shadow-2xs focus-within:border-[#00875A] focus-within:ring-1 focus-within:ring-[#00875A] transition-all">
              <Search size={16} className="text-[#00875A] shrink-0 stroke-[2.5]" />
              <input
                type="text"
                placeholder="Cari nama P3DW atau kode wilayah"
                aria-label="Pencarian"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[14px] text-[#212121] dark:text-[#F8FAFC] placeholder:text-[#757575] dark:placeholder:text-[#94A3B8]"
              />
            </label>
            <CustomSelect
              compact
              placeholder="Klaster"
              value={filterKlaster}
              options={klasterOptions}
              onChange={(val) => setFilterKlaster(val)}
              className="w-40"
            />
            <CustomSelect
              compact
              placeholder="Korwil"
              value={filterKorwil}
              options={korwilOptions}
              onChange={(val) => setFilterKorwil(val)}
              className="w-56"
            />
          </div>
        </div>

        {/* Tabel Data (Header Hijau Sesuai Gambar 1 & Style Sebelumnya) */}
        {/* Tinggi tabel mengikuti kartu matriks di sampingnya; isi tabel di-scroll di dalam */}
        <div className="relative flex-1 min-h-[480px] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm overflow-hidden bg-white dark:bg-[#1E293B]">
          <div className="absolute inset-0 overflow-auto">
            <table className="w-full text-left border-collapse font-roboto">
              <thead className="sticky top-0 z-10 bg-[#00875A] text-white text-[12px] font-semibold tracking-wide">
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
                    C (20%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    D (10%)
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-white/20 whitespace-nowrap">
                    E (15%)
                  </th>
                  <th className="sticky right-0 z-20 bg-[#00875A] py-3.5 px-4 text-center shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.25)]">
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
                        row.klaster,
                        selectedUnit?.id === row.id
                      )}`}
                    >
                      <td className="py-3 px-3 font-bold text-center text-[#1E293B] dark:text-[#F8FAFC] border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        #{row.peringkat}
                      </td>
                      <td className="py-3 px-4 border-r border-[#E0E0E0]/60 dark:border-[#334155]">
                        <div>
                          <div
                            className="font-bold text-[13px] text-[#1E293B] dark:text-[#F8FAFC] hover:text-[#00875A] cursor-pointer transition-colors leading-snug"
                            onClick={() => handleSelectBranch(row.id)}
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
                      {/* Kolom AKSI di-pin ke kanan agar tombol Detail selalu terlihat */}
                      <td className="sticky right-0 z-[1] py-3 px-4 text-center bg-white dark:bg-[#1E293B] shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.18)]">
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${getRowTint(row.klaster, selectedUnit?.id === row.id)}`}
                        />
                        <button
                          type="button"
                          onClick={() => navigate(detailUrl(row.id))}
                          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00875A] hover:bg-[#00724C] text-white text-[12px] font-medium transition cursor-pointer shadow-xs active:scale-95"
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

        </div>
      </section>
      </div>

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
