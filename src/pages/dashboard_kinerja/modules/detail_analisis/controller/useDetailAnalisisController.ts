import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  mockLeaderboardData,
  mockScatterData,
  P3dwLeaderboardData,
  P3dwScatterData,
} from '@/services/dashboardMockData';
import { PERIODE_BERJALAN, getEvaluasi, getPeriode } from '@/services/periodeData';

const TREE_V2_KEY = 'detail-analisis:tree-v2';

export const useDetailAnalisisController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const unitId = searchParams.get('id') || '1';

  // Cari data dari leaderboard
  const unitData: P3dwLeaderboardData =
    mockLeaderboardData.find((item) => item.id === unitId) ||
    mockLeaderboardData.find((item) => item.namaP3dw.toLowerCase().includes(unitId.toLowerCase())) ||
    mockLeaderboardData[0];

  // Cari data scatter yang berkesesuaian
  const scatterData: P3dwScatterData =
    mockScatterData.find((item) => item.id === unitData.id || item.nama === unitData.namaP3dw) ||
    mockScatterData[0];

  // Periode penilaian yang ditinjau (disimpan di URL ?periode=YYYY-MM); bawaan = bulan berjalan
  const periode = getPeriode(searchParams.get('periode'));
  const isPeriodeBerjalan = periode.key === PERIODE_BERJALAN.key;
  const evaluasi = getEvaluasi(unitData.id, periode.key);

  const setPeriode = (key: string) => {
    const next = new URLSearchParams(searchParams);
    if (key === PERIODE_BERJALAN.key) next.delete('periode');
    else next.set('periode', key);
    setSearchParams(next, { replace: true });
  };

  // Tree Penilaian Versi 2 disembunyikan; tampil lewat ketik "v2" di halaman atau URL ?v2=1 (?v2=0 menyembunyikan).
  // Pilihan diingat per browser sampai disembunyikan lagi.
  const [showTreeV2, setShowTreeV2] = useState<boolean>(() => {
    const param = searchParams.get('v2');
    if (param === '1' || param === '0') return param === '1';
    try {
      return localStorage.getItem(TREE_V2_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (showTreeV2) localStorage.setItem(TREE_V2_KEY, '1');
      else localStorage.removeItem(TREE_V2_KEY);
    } catch {
      // penyimpanan browser tidak tersedia; pilihan hanya berlaku di sesi ini
    }
  }, [showTreeV2]);

  // Bersihkan ?v2 dari URL setelah dibaca agar link tetap rapi
  useEffect(() => {
    if (!searchParams.has('v2')) return;
    const next = new URLSearchParams(searchParams);
    next.delete('v2');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Ketik "v2" (di luar kolom isian) untuk menampilkan/menyembunyikan
  useEffect(() => {
    let last = '';
    let lastAt = 0;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      const isTyping = el instanceof HTMLElement && el.closest('input, textarea, select, [contenteditable="true"]');
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping) return;
      const now = Date.now();
      if (last === 'v' && e.key === '2' && now - lastAt < 800) {
        setShowTreeV2((v) => !v);
        last = '';
        return;
      }
      last = e.key.toLowerCase();
      lastAt = now;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleBack = () => {
    // Kembali ke dashboard dengan periode yang sama
    navigate(isPeriodeBerjalan ? '/beranda' : `/beranda?periode=${periode.key}`);
  };

  const getKategoriBadgeStyle = (kategori: string) => {
    switch (kategori) {
      case 'Sangat Baik':
        return 'bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20';
      case 'Baik':
        return 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/20';
      case 'Cukup':
        return 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20';
      case 'Kurang':
        return 'bg-[#FFF7ED] text-[#EA580C] border border-[#EA580C]/20';
      case 'Perlu Pembinaan':
        return 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return {
    handleBack,
    unitData,
    scatterData,
    getKategoriBadgeStyle,
    periode,
    isPeriodeBerjalan,
    evaluasi,
    setPeriode,
    showTreeV2,
  };
};

export default useDetailAnalisisController;
