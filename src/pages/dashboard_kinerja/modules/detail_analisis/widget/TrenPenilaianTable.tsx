import React from 'react';
import { mockTrenPenilaianData } from '@/services/dashboardMockData';

interface TrenPenilaianTableProps {
  totalSkor?: number;
}

export const TrenPenilaianTable: React.FC<TrenPenilaianTableProps> = ({ totalSkor = 95.8 }) => {
  // Scaling factor agar sub-komponen dinamis mengikuti total skor unit aktual
  const factor = totalSkor ? Math.min(1.15, Math.max(0.45, totalSkor / 87.8)) : 1;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto">
      {/* Header Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-[#F1F5F9] gap-2">
        <div>
          <h3 className="text-[16px] font-semibold text-[#212121]">
            Rincian Evaluasi &amp; Tren Penilaian 5 Dimensi
          </h3>
          <p className="text-[12px] text-[#757575] mt-0.5">
            Rincian evaluasi secara menyeluruh dari 5 dimensi manajemen — Evaluasi Periode Triwulan III
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-semibold text-[#00875A] bg-[#E6F4EA] px-3 py-1 rounded-full border border-[#00875A]/20">
            Audit Q3 • Terverifikasi
          </span>
        </div>
      </div>

      {/* Tabel Komponen dengan Header Hijau #00875A & Divider Vertikal */}
      <div className="rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-roboto text-[13px]">
            <thead className="bg-[#00875A] text-white text-[12px] font-medium tracking-wide">
              <tr>
                <th className="py-3 px-4 border-r border-white/20 min-w-[280px]">
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
                if (row.isTotal) {
                  const displayTotal = totalSkor.toFixed(1).replace('.', ',');
                  return (
                    <tr
                      key={row.id}
                      className="bg-[#E6F4EA] text-[#00875A] font-bold border-b border-[#00875A]/30"
                    >
                      <td className="py-3 px-4 border-r border-[#CBD5E1] text-[14px]">
                        {row.komponen}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1]">
                        {row.bobot}%
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1]">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#00875A] text-white shadow-xs">
                          {displayTotal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#CBD5E1] text-[14px] font-bold">
                        {displayTotal}
                      </td>
                      <td className="py-3 px-4 text-center text-[14px] font-bold">
                        {displayTotal}
                      </td>
                    </tr>
                  );
                }

                const isHeaderLevel = row.level === 1;
                const isSubHeader = row.level === 2;
                const paddingLeft = `${16 + row.level * 16}px`;

                // Hitung capaian dinamis mengikuti skor aktual unit
                const rawCapaian = parseFloat(row.capaian.replace(',', '.'));
                const rawSkor = parseFloat(row.skor.replace(',', '.'));
                const rawPoin = parseFloat(row.poin.replace(',', '.'));

                const scaledCapaian = Math.min(100, Math.round(rawCapaian * factor * 10) / 10).toFixed(1).replace('.', ',');
                const scaledSkor = Math.min(100, Math.round(rawSkor * factor * 10) / 10).toFixed(1).replace('.', ',');
                const scaledPoin = Math.min(100, Math.round(rawPoin * factor * 10) / 10).toFixed(1).replace('.', ',');

                const capaianNum = parseFloat(scaledCapaian.replace(',', '.'));

                // Badge style dinamis
                let badgeStyle = 'bg-[#FEF3C7] text-[#B45309]';
                if (capaianNum >= 85) {
                  badgeStyle = 'bg-[#E6F4EA] text-[#00875A]';
                } else if (capaianNum >= 75) {
                  badgeStyle = 'bg-[#E0F2FE] text-[#0369A1]';
                } else if (capaianNum < 60) {
                  badgeStyle = 'bg-[#FEE2E2] text-[#DC2626]';
                }

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-[#E0E0E0] transition hover:bg-[#F9FAFB] ${
                      isHeaderLevel
                        ? 'bg-[#F8FAFC] font-semibold text-[#0F172A]'
                        : isSubHeader
                        ? 'bg-white font-medium text-[#334155]'
                        : 'bg-white text-[#475569]'
                    }`}
                  >
                    <td
                      className="py-2.5 px-4 border-r border-[#E0E0E0]"
                      style={{ paddingLeft }}
                    >
                      <span className={isHeaderLevel ? 'text-[#00875A] font-semibold' : ''}>
                        {row.komponen}
                      </span>
                      {row.target && (
                        <span className="text-[11px] text-[#94A3B8] ml-2 font-normal italic">
                          ({row.target})
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-[#E0E0E0] text-[#64748B]">
                      {row.bobot}%
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-[#E0E0E0]">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${badgeStyle}`}>
                        {scaledCapaian}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-semibold text-[#212121] border-r border-[#E0E0E0]">
                      {scaledSkor}
                    </td>
                    <td className="py-2.5 px-4 text-center font-semibold text-[#212121]">
                      {scaledPoin}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrenPenilaianTable;
