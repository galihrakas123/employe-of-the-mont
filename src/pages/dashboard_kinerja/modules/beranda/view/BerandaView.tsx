import React from 'react';
import useBerandaController from '../controller/useBerandaController';
import StatSummaryCards from '../widget/StatSummaryCards';
import NineBoxMatrix from '../widget/NineBoxMatrix';
import WestJavaMap from '../widget/WestJavaMap';
import LeaderboardTable from '../widget/LeaderboardTable';

export const BerandaView: React.FC = () => {
  const {
    selectedItem,
    filterKlaster,
    setFilterKlaster,
    filterKorwil,
    setFilterKorwil,
    filteredData,
    handleSelectItem,
    handleNavigateDetail,
    handleLocationClick,
  } = useBerandaController();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Summary Stat Cards */}
      <StatSummaryCards />

      {/* Mid Section: 9-Box Matrix & Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '20px' }}>
        <NineBoxMatrix
          data={filteredData}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          onDetailClick={handleNavigateDetail}
        />
        <WestJavaMap onLocationClick={handleLocationClick} />
      </div>

      {/* Bottom Section: Leaderboard Table */}
      <LeaderboardTable
        data={filteredData}
        filterKlaster={filterKlaster}
        onFilterKlasterChange={setFilterKlaster}
        filterKorwil={filterKorwil}
        onFilterKorwilChange={setFilterKorwil}
        onDetailClick={handleNavigateDetail}
      />
    </div>
  );
};

export default BerandaView;
