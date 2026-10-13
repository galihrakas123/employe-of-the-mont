import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockNineBoxPoints, NineBoxItem } from '@/services/dashboardMockData';

export const useBerandaController = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<NineBoxItem>(mockNineBoxPoints[0]);
  const [filterKlaster, setFilterKlaster] = useState<string>('ALL');
  const [filterKorwil, setFilterKorwil] = useState<string>('ALL');

  const filteredData = useMemo(() => {
    return mockNineBoxPoints.filter((item) => {
      const matchKlaster = filterKlaster === 'ALL' || item.klaster === filterKlaster;
      const matchKorwil = filterKorwil === 'ALL' || item.korwil === filterKorwil;
      return matchKlaster && matchKorwil;
    });
  }, [filterKlaster, filterKorwil]);

  const handleSelectItem = (item: NineBoxItem) => {
    setSelectedItem(item);
  };

  const handleNavigateDetail = (item?: NineBoxItem) => {
    const target = item || selectedItem;
    navigate(`/beranda/detail-analisis?id=${target.id}`);
  };

  const handleLocationClick = (name: string, score: number) => {
    const match = mockNineBoxPoints.find((i) => i.unit.toLowerCase().includes(name.toLowerCase()));
    if (match) {
      setSelectedItem(match);
    } else {
      alert(`Lokasi: ${name}\nSkor Kinerja: ${score} Poin`);
    }
  };

  return {
    selectedItem,
    filterKlaster,
    setFilterKlaster,
    filterKorwil,
    setFilterKorwil,
    filteredData,
    handleSelectItem,
    handleNavigateDetail,
    handleLocationClick,
  };
};

export default useBerandaController;
