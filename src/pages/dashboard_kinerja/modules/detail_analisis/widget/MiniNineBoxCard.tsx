import React from 'react';

interface MiniNineBoxCardProps {
  boxNumber?: number;
  boxTitle?: string;
}

export const MiniNineBoxCard: React.FC<MiniNineBoxCardProps> = ({
  boxNumber = 9,
  boxTitle = 'Box 9 (Unggul Penuh)',
}) => {
  const getDotStyle = (active: boolean, color: string, haloColor: string) => {
    if (!active) return null;
    return (
      <div
        className="w-3.5 h-3.5 rounded-full border-2 border-white absolute right-2.5 bottom-2.5"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 0 3px ${haloColor}, 0 2px 4px rgba(0,0,0,0.15)`,
        }}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto">
      <div className="mb-3.5">
        <h4 className="text-[15px] font-semibold text-[#212121]">
          Matriks Kinerja dan Potensial
        </h4>
        <p className="text-[12px] text-[#757575] mt-0.5">
          Posisi unit pada sembilan kuadran evaluasi kinerja
        </p>
      </div>

      {/* Mini 9-Box Grid with Approved Pastel Colors */}
      <div className="relative h-[200px] border border-[#CBD5E1] rounded-lg overflow-hidden grid grid-cols-3 grid-rows-3 bg-white shadow-xs">
        {/* Row 1: Box 7, 8, 9 */}
        <div className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#1E293B]">Box 7</span>
          {getDotStyle(boxNumber === 7, '#0284c7', 'rgba(2, 132, 199, 0.35)')}
        </div>
        <div className="bg-[#F8FAFC] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#1E293B]">Box 8</span>
          {getDotStyle(boxNumber === 8, '#0284c7', 'rgba(2, 132, 199, 0.35)')}
        </div>
        <div className="bg-[#E6F4FF] border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#0066CC]">Box 9</span>
          {getDotStyle(boxNumber === 9, '#00875A', 'rgba(0, 135, 90, 0.4)')}
        </div>

        {/* Row 2: Box 4, 5, 6 */}
        <div className="bg-[#FFF0F2] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#B91C1C]">Box 4</span>
          {getDotStyle(boxNumber === 4, '#E53935', 'rgba(229, 57, 53, 0.4)')}
        </div>
        <div className="bg-[#FFFDEB] border-r border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#B45309]">Box 5</span>
          {getDotStyle(boxNumber === 5, '#FF8F00', 'rgba(255, 143, 0, 0.4)')}
        </div>
        <div className="bg-[#ECFDF5] border-b border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#00875A]">Box 6</span>
          {getDotStyle(boxNumber === 6, '#0284c7', 'rgba(2, 132, 199, 0.35)')}
        </div>

        {/* Row 3: Box 1, 2, 3 */}
        <div className="bg-[#FFF0F2] border-r border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#B91C1C]">Box 1</span>
          {getDotStyle(boxNumber === 1, '#E53935', 'rgba(229, 57, 53, 0.4)')}
        </div>
        <div className="bg-[#FEF3C7] border-r border-[#E2E8F0] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#B45309]">Box 2</span>
          {getDotStyle(boxNumber === 2, '#f97316', 'rgba(249, 115, 22, 0.4)')}
        </div>
        <div className="bg-[#F8FAFC] p-2 flex flex-col justify-start relative">
          <span className="text-[11px] font-bold text-[#1E293B]">Box 3</span>
          {getDotStyle(boxNumber === 3, '#0284c7', 'rgba(2, 132, 199, 0.35)')}
        </div>
      </div>

      <div className="mt-3.5 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20">
          <span className="w-2 h-2 rounded-full bg-[#00875A]" />
          Posisi Unit: {boxTitle}
        </span>
      </div>
    </div>
  );
};

export default MiniNineBoxCard;
