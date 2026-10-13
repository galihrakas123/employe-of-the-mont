import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  mockLeaderboardData,
  mockScatterData,
  P3dwLeaderboardData,
  P3dwScatterData,
} from '@/services/dashboardMockData';

export const useDetailAnalisisController = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const handleBack = () => {
    navigate('/beranda');
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
  };
};

export default useDetailAnalisisController;
