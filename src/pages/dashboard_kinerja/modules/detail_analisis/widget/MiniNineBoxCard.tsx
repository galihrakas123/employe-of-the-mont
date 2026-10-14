import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import NineBoxExplanationModal from '@/components/ui/NineBoxExplanationModal';
import TalentBoxMatrix from '@/components/charts/TalentBoxMatrix';
import { mockScatterData } from '@/services/dashboardMockData';

interface MiniNineBoxCardProps {
  boxNumber?: number;
  boxTitle?: string;
  kinerja?: number;
  potensi?: number;
  unitName?: string;
  unitId?: string;
}

export const MiniNineBoxCard: React.FC<MiniNineBoxCardProps> = ({
  boxNumber = 9,
  boxTitle = 'Box 9 (Kapus of the Month)',
  kinerja = 108.5,
  potensi = 105.2,
  unitName = 'Unit Kerja',
  unitId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-5 font-roboto">
        {/* Header Card */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h4 className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
              Matriks Kinerja dan Potensi
            </h4>
            <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
              Posisi {unitName} pada sembilan kuadran evaluasi kinerja. Titik samar = unit lain.
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

        <TalentBoxMatrix
          compact
          focusId={unitId}
          onBoxClick={() => setIsModalOpen(true)}
          dimmed={new Set(mockScatterData.filter((item) => item.id !== unitId).map((item) => item.id))}
          points={mockScatterData.map((item) => ({
            id: item.id,
            label: item.nama,
            x: item.id === unitId ? potensi : item.x,
            y: item.id === unitId ? kinerja : item.y,
            final: item.skorTotal,
            sub: item.korwil,
          }))}
        />

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
