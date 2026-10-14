import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { mockTrenPenilaianData, mockTrenPenilaianTotal } from '@/services/dashboardMockData';

interface TrenPenilaianTableProps {
  totalSkor?: number;
}

// Relasi hierarki baris & jumlah sub-indikator diturunkan dari data KPI
const parentMap: Record<string, string> = Object.fromEntries(
  mockTrenPenilaianData.filter((row) => row.parent).map((row) => [row.id, row.parent as string])
);

const subItemCounts: Record<string, string> = Object.fromEntries(
  mockTrenPenilaianData.filter((row) => row.jumlahAnak).map((row) => [row.id, row.jumlahAnak as string])
);

const allCollapsibleIds = mockTrenPenilaianData.filter((row) => row.level === 1 || row.level === 2).map((row) => row.id);
const jumlahKpi = mockTrenPenilaianData.filter((row) => row.level === 3).length;

export const TrenPenilaianTable: React.FC<TrenPenilaianTableProps> = ({ totalSkor = 95.8 }) => {
  // Scaling factor agar sub-komponen dinamis mengikuti total skor unit aktual
  const factor = totalSkor ? Math.min(1.15, Math.max(0.45, totalSkor / mockTrenPenilaianTotal)) : 1;

  // Skala capaian tiap KPI, lalu hitung ulang skor (dengan batas atas per KPI), poin, dan agregat area/sumbu
  const scaledRows = useMemo(() => {
    const result: Record<string, { capaian: number; skor: number; poin: number }> = {};
    const agg: Record<string, { bobot: number; capaianW: number; poin: number }> = {};

    mockTrenPenilaianData.forEach((row) => {
      if (row.level !== 3) return;
      const bobot = row.bobotNum ?? 0;
      const capaian = Math.min(120, parseFloat(row.capaian.replace(',', '.')) * factor);
      const skor = Math.min(row.batasAtas ?? 120, capaian);
      const poin = (skor * bobot) / 100;
      result[row.id] = { capaian, skor, poin };

      let parent = row.parent;
      while (parent) {
        agg[parent] ??= { bobot: 0, capaianW: 0, poin: 0 };
        agg[parent].bobot += bobot;
        agg[parent].capaianW += capaian * bobot;
        agg[parent].poin += poin;
        parent = parentMap[parent];
      }
    });

    Object.entries(agg).forEach(([id, a]) => {
      result[id] = { capaian: a.capaianW / a.bobot, skor: (a.poin * 100) / a.bobot, poin: a.poin };
    });

    return result;
  }, [factor]);

  const fmt = (val: number) => (Math.round(val * 10) / 10).toFixed(1).replace('.', ',');

  // Set default terbuka semua (User dapat toggle collapse/expand per baris)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(allCollapsibleIds));

  // Toggle satu baris tertentu
  const toggleRow = (id: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle semua baris sekaligus
  const isAllExpanded = expandedKeys.size === allCollapsibleIds.length;
  const toggleAll = () => {
    if (expandedKeys.size > 0) {
      setExpandedKeys(new Set());
    } else {
      setExpandedKeys(new Set(allCollapsibleIds));
    }
  };

  // Cek apakah sebuah baris harus ditampilkan (bergantung pada state expand parent-nya)
  const isRowVisible = (rowId: string, level: number): boolean => {
    if (level === 0 || level === 1) return true;

    if (level === 2) {
      const parentSumbu = parentMap[rowId];
      return expandedKeys.has(parentSumbu);
    }

    if (level === 3) {
      const parentArea = parentMap[rowId];
      const grandParentSumbu = parentArea ? parentMap[parentArea] : null;
      return (
        Boolean(parentArea && expandedKeys.has(parentArea)) &&
        Boolean(grandParentSumbu && expandedKeys.has(grandParentSumbu))
      );
    }

    return true;
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-6 font-roboto">
      {/* Header Title, Info, & Tombol Buka/Tutup Semua */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-[#F1F5F9] dark:border-[#334155] gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
            Rincian Evaluasi {jumlahKpi} KPI (5 Area Talent Box)
          </h3>
          <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
            Rincian evaluasi {jumlahKpi} indikator kinerja (Sumbu Y 60%) &amp; potensi (Sumbu X 40%) dengan fitur hierarki dropdown per row
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium text-[#00875A] dark:text-[#34D399] bg-[#E6F4EA] dark:bg-[#00875A]/20 hover:bg-[#D4EDDA] border border-[#00875A]/20 transition cursor-pointer active:scale-95 shadow-2xs"
            title={isAllExpanded ? 'Tutup semua baris hierarki' : 'Buka semua baris hierarki'}
          >
            <ChevronsUpDown size={13} />
            <span>{isAllExpanded ? 'Tutup Semua' : 'Buka Semua'}</span>
          </button>
          <span className="text-[11px] font-semibold text-[#00875A] dark:text-[#34D399] bg-[#E6F4EA] dark:bg-[#00875A]/20 px-3 py-1 rounded-full border border-[#00875A]/20">
            Audit Q3 • Terverifikasi
          </span>
        </div>
      </div>

      {/* Tabel Komponen dengan Dropdown per Row & Header Hijau */}
      <div className="rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-xs overflow-hidden bg-white dark:bg-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-roboto text-[13px]">
            <thead className="bg-[#00875A] text-white text-[12px] font-medium tracking-wide">
              <tr>
                <th className="py-3 px-4 border-r border-white/20 min-w-[300px]">
                  KOMPONEN DAN INDIKATOR
                </th>
                <th className="py-3 px-4 text-center border-r border-white/20 w-24">
                  BOBOT
                </th>
                <th className="py-3 px-4 text-center border-r border-white/20 w-32">
                  CAPAIAN
                </th>
                <th className="py-3 px-4 text-center border-r border-white/20 w-28">
                  SKOR
                </th>
                <th className="py-3 px-4 text-center w-28">
                  POIN
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTrenPenilaianData.map((row) => {
                // Baris Skor Total Akhir
                if (row.isTotal) {
                  const displayTotal = totalSkor.toFixed(1).replace('.', ',');
                  return (
                    <tr
                      key={row.id}
                      className="bg-[#E6F4EA] dark:bg-[#00875A]/20 text-[#00875A] dark:text-[#34D399] font-bold border-b border-[#00875A]/30"
                    >
                      <td className="py-3 px-4 border-r border-[#CBD5E1] dark:border-[#334155] text-[14px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00875A]" />
                          <span>{row.komponen}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1] dark:border-[#334155]">
                        {row.bobot}%
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1] dark:border-[#334155]">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#00875A] text-white shadow-xs">
                          {displayTotal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1] dark:border-[#334155] text-[14px] font-bold">
                        {displayTotal}
                      </td>
                      <td className="py-3 px-4 text-center text-[14px] font-bold">
                        {displayTotal}
                      </td>
                    </tr>
                  );
                }

                // Cek visibilitas baris anak
                if (!isRowVisible(row.id, row.level)) {
                  return null;
                }

                const isHeaderLevel = row.level === 1; // Sumbu Y / X
                const isSubHeader = row.level === 2;   // Area A - E
                const hasChildren = isHeaderLevel || isSubHeader;
                const isExpanded = expandedKeys.has(row.id);

                // Indentasi berjenjang
                const indentClass =
                  row.level === 1 ? 'pl-4' : row.level === 2 ? 'pl-9' : 'pl-14';

                // Capaian, skor & poin hasil skala unit aktual
                const scaled = scaledRows[row.id];
                const scaledCapaian = fmt(scaled.capaian);
                const scaledSkor = fmt(scaled.skor);
                const scaledPoin = fmt(scaled.poin);

                const capaianNum = scaled.capaian;

                // Badge style capaian
                let badgeStyle = 'bg-[#FEF3C7] text-[#B45309]';
                if (capaianNum >= 85) {
                  badgeStyle = 'bg-[#E6F4EA] text-[#00875A] dark:bg-[#00875A]/25 dark:text-[#34D399]';
                } else if (capaianNum >= 75) {
                  badgeStyle = 'bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0284C7]/25 dark:text-[#38BDF8]';
                } else if (capaianNum < 60) {
                  badgeStyle = 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/25 dark:text-[#F87171]';
                }

                return (
                  <tr
                    key={row.id}
                    onClick={hasChildren ? () => toggleRow(row.id) : undefined}
                    className={`border-b border-[#E0E0E0] dark:border-[#334155] transition select-none ${
                      isHeaderLevel
                        ? 'bg-[#F8FAFC] dark:bg-[#0F172A] font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] cursor-pointer'
                        : isSubHeader
                        ? 'bg-white dark:bg-[#1E293B] font-medium text-[#334155] dark:text-[#E2E8F0] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] cursor-pointer'
                        : 'bg-white dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:bg-[#F9FAFB] dark:hover:bg-[#0F172A]/40'
                    }`}
                  >
                    {/* Kolom Komponen & Indikator dengan Dropdown Chevron */}
                    <td className={`py-2.5 pr-4 border-r border-[#E0E0E0] dark:border-[#334155] ${indentClass}`}>
                      <div className="flex items-center gap-1.5">
                        {hasChildren ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(row.id);
                            }}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-[#00875A] hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition shrink-0 cursor-pointer"
                            title={isExpanded ? 'Tutup sub-indikator' : 'Buka sub-indikator'}
                          >
                            {isExpanded ? (
                              <ChevronDown size={15} className="text-[#00875A] dark:text-[#34D399]" />
                            ) : (
                              <ChevronRight size={15} className="text-slate-400" />
                            )}
                          </button>
                        ) : (
                          <span className="w-5 shrink-0" />
                        )}

                        <span className={isHeaderLevel ? 'text-[#00875A] dark:text-[#34D399] font-bold text-[13.5px]' : isSubHeader ? 'font-semibold text-[#1E293B] dark:text-[#F8FAFC]' : ''}>
                          {row.komponen}
                        </span>

                        {row.target && (
                          <span className="text-[11px] text-[#94A3B8] font-normal italic shrink-0">
                            ({row.target})
                          </span>
                        )}

                        {/* Indikator jumlah anak jika sedang collapse */}
                        {hasChildren && !isExpanded && subItemCounts[row.id] && (
                          <span className="ml-auto text-[10px] font-normal text-[#64748B] dark:text-[#94A3B8] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                            {subItemCounts[row.id]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Bobot */}
                    <td className="py-2.5 px-4 text-center border-r border-[#E0E0E0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] font-medium">
                      {row.bobot}%
                    </td>

                    {/* Capaian */}
                    <td className="py-2.5 px-4 text-center border-r border-[#E0E0E0] dark:border-[#334155]">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${badgeStyle}`}>
                        {scaledCapaian}
                      </span>
                    </td>

                    {/* Skor */}
                    <td className="py-2.5 px-4 text-center font-semibold text-[#212121] dark:text-[#F8FAFC] border-r border-[#E0E0E0] dark:border-[#334155]">
                      {scaledSkor}
                    </td>

                    {/* Poin */}
                    <td className="py-2.5 px-4 text-center font-semibold text-[#212121] dark:text-[#F8FAFC]">
                      {scaledPoin}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-3 leading-relaxed">
        ↓ = makin rendah makin baik (skor = target ÷ capaian × 100). Skor dibatasi 120, kecuali KPI No. 18, 19, 20, 22, 23, dan 24 (batas 100).
        Target bertanda * masih usulan dan perlu ditetapkan.
      </p>
    </div>
  );
};

export default TrenPenilaianTable;
