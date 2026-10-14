import React, { useState } from 'react';
import { korwilMasterData, KorwilGroupInfo } from '@/services/dashboardMockData';

interface KorwilFilterAccordionProps {
  selectedKorwil: string;
  onSelectKorwil: (korwilName: string) => void;
  selectedBranchName?: string;
  onSelectBranch?: (branchName: string) => void;
  className?: string;
}

export const KorwilFilterAccordion: React.FC<KorwilFilterAccordionProps> = ({
  selectedKorwil,
  onSelectKorwil,
  selectedBranchName,
  onSelectBranch,
  className = '',
}) => {
  // Track open/closed state for each of the 5 Korwil (default open all like in the screenshots)
  const [openKorwils, setOpenKorwils] = useState<Record<string, boolean>>({
    'Korwil Bandung Raya': true,
    'Korwil Purwakarta': true,
    'Korwil Bogor': true,
    'Korwil Priangan Timur': true,
    'Korwil Ciayumajakuning': true,
  });

  const toggleKorwil = (name: string) => {
    setOpenKorwils((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className={`space-y-4 font-roboto ${className}`}>
      {korwilMasterData.map((korwil: KorwilGroupInfo) => {
        const isOpen = openKorwils[korwil.name] ?? true;
        const isSelectedKorwil = selectedKorwil === korwil.name;

        return (
          <div
            key={korwil.name}
            className={`bg-white dark:bg-[#1E293B] rounded-sm sm:rounded-md border transition-all duration-200 overflow-hidden shadow-2xs ${
              isSelectedKorwil
                ? 'border-[#00875A] ring-1 ring-[#00875A]/30'
                : 'border-[#E5E7EB] dark:border-[#334155]'
            }`}
          >
            {/* Header: Exact match to user screenshot ([-] Korwil Name) */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#1E293B] hover:bg-[#F9FAFB] dark:hover:bg-[#334155]/20 transition-colors">
              <div
                onClick={() => toggleKorwil(korwil.name)}
                className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleKorwil(korwil.name);
                  }
                }}
              >
                {/* Square Box with Minus/Plus icon matching user's screenshot */}
                <span
                  className="w-3.5 h-3.5 border border-[#CBD5E1] dark:border-[#475569] rounded-[2px] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] text-[11px] font-mono leading-none bg-white dark:bg-[#0F172A] shrink-0"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  {isOpen ? (
                    <span className="block w-2 h-[1px] bg-[#64748B] dark:bg-[#94A3B8]" />
                  ) : (
                    <span className="block text-[11px] leading-none font-bold text-[#64748B] dark:text-[#94A3B8]">+</span>
                  )}
                </span>

                <span className="text-[14px] sm:text-[15px] font-normal text-[#1E293B] dark:text-[#F8FAFC]">
                  {korwil.name}
                </span>
              </div>

              {/* Action: Filter by this Korwil */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  ({korwil.count} unit)
                </span>
                <button
                  type="button"
                  onClick={() => onSelectKorwil(isSelectedKorwil ? 'ALL' : korwil.name)}
                  className={`text-[11px] px-2 py-0.5 rounded transition font-medium cursor-pointer ${
                    isSelectedKorwil
                      ? 'bg-[#00875A] text-white'
                      : 'bg-[#F1F5F9] dark:bg-[#334155] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0]'
                  }`}
                  title={isSelectedKorwil ? 'Batalkan filter Korwil ini' : `Filter hanya ${korwil.name}`}
                >
                  {isSelectedKorwil ? 'Aktif' : 'Filter'}
                </button>
              </div>
            </div>

            {/* Horizontal Divider Line matching screenshot */}
            <div className="border-t border-[#E5E7EB] dark:border-[#334155]" />

            {/* Body: Bullet list of P3D Wilayah in Green font */}
            {isOpen && (
              <div className="px-6 py-3.5 bg-white dark:bg-[#1E293B]">
                <ul className="space-y-2 text-[13px] sm:text-[14px]">
                  {korwil.branches.map((branch) => {
                    const isBranchActive = selectedBranchName === branch.nama;
                    return (
                      <li
                        key={branch.kd_wil}
                        className="flex items-start gap-2.5 text-[#00875A] dark:text-[#2DD4BF]"
                      >
                        <span className="text-[#00875A] dark:text-[#2DD4BF] select-none text-[15px] leading-snug">
                          •
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectBranch) {
                              onSelectBranch(branch.nama);
                            }
                          }}
                          className={`text-left transition-colors cursor-pointer hover:underline ${
                            isBranchActive
                              ? 'font-bold underline text-[#006644] dark:text-[#5EEAD4]'
                              : 'font-normal hover:text-[#006644] dark:hover:text-[#5EEAD4]'
                          }`}
                        >
                          {branch.nama}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KorwilFilterAccordion;
