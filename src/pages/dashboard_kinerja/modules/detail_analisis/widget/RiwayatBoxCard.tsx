import React from 'react';
import { NINE_BOX_DETAILS } from '@/constants/nineBoxData';
import { TAHUN, getRiwayat } from '@/services/periodeData';

// Riwayat posisi box per bulan (Januari s.d. bulan berjalan).
// Tiap bulan ditampilkan sebagai matriks 3×3 mini; klik untuk meninjau penilaian bulan itu.

interface RiwayatBoxCardProps {
  unitId: string;
  periodeKey: string;
  onSelectPeriode: (key: string) => void;
}

// Susunan box dari kiri atas (Kinerja Tinggi di atas, Potensi Rendah di kiri)
const GRID = [7, 8, 9, 4, 5, 6, 1, 2, 3];

// Warna sel terisi, selaras dengan nada box di matriks
const BOX_FILL: Record<number, string> = {
  9: '#00875A',
  8: '#10B981',
  6: '#10B981',
  7: '#64748B',
  5: '#64748B',
  3: '#64748B',
  4: '#D97706',
  2: '#D97706',
  1: '#DC2626',
};

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

export const RiwayatBoxCard: React.FC<RiwayatBoxCardProps> = ({ unitId, periodeKey, onSelectPeriode }) => {
  const riwayat = getRiwayat(unitId);

  // Ringkasan: box paling sering & jumlah perpindahan box
  const counts = new Map<number, number>();
  riwayat.forEach((r) => counts.set(r.boxNumber, (counts.get(r.boxNumber) ?? 0) + 1));
  const [boxTersering, jumlahTersering] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const perpindahan = riwayat.filter((r, i) => i > 0 && r.boxNumber !== riwayat[i - 1].boxNumber).length;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-6 font-roboto">
      <div className="mb-3">
        <h4 className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC]">Riwayat Posisi Box</h4>
        <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
          Posisi unit pada matriks tiap bulan tahun {TAHUN}. Klik bulan untuk melihat penilaiannya.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {riwayat.map((r, i) => {
          const selected = r.periode.key === periodeKey;
          const prev = riwayat[i - 1];
          const pindah = prev && prev.boxNumber !== r.boxNumber;
          return (
            <button
              key={r.periode.key}
              type="button"
              onClick={() => onSelectPeriode(r.periode.key)}
              aria-pressed={selected}
              title={`${r.periode.label} · Box ${r.boxNumber} ${NINE_BOX_DETAILS[r.boxNumber]?.name} · Kinerja ${fmt(r.y)} · Potensi ${fmt(r.x)} · Skor ${fmt(r.total)}`}
              className={`relative flex flex-col items-center gap-1 rounded-lg border px-1 pt-1.5 pb-1 cursor-pointer transition ${
                selected
                  ? 'border-[#00875A] bg-[#E6F4EA] dark:bg-[#00875A]/20 ring-1 ring-[#00875A]'
                  : 'border-[#E2E8F0] dark:border-[#334155] hover:border-[#00875A]/60 hover:bg-[#F8FAFC] dark:hover:bg-white/[0.04]'
              }`}
            >
              {pindah && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#0284C7]" title="Pindah box dari bulan sebelumnya" />
              )}
              <span className="text-[10.5px] font-semibold text-[#64748B] dark:text-[#94A3B8] leading-none">{r.periode.short}</span>
              <span className="grid grid-cols-3 gap-[2px] p-[2px] rounded bg-[#E2E8F0] dark:bg-[#334155]">
                {GRID.map((no) => (
                  <span
                    key={no}
                    className="w-[9px] h-[9px] rounded-[2px] bg-[#FCFDFE] dark:bg-[#0F172A]"
                    style={no === r.boxNumber ? { backgroundColor: BOX_FILL[no] } : undefined}
                  />
                ))}
              </span>
              <span className="text-[11px] font-bold leading-none" style={{ color: BOX_FILL[r.boxNumber] }}>
                Box {r.boxNumber}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#F1F5F9] dark:border-[#334155] text-[12px] text-[#475569] dark:text-[#CBD5E1]">
        <span>
          Paling sering:{' '}
          <b className="text-[#0F172A] dark:text-[#F8FAFC]">
            Box {boxTersering} · {NINE_BOX_DETAILS[boxTersering]?.name}
          </b>{' '}
          ({jumlahTersering} bln)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
          Pindah box: <b className="text-[#0F172A] dark:text-[#F8FAFC]">{perpindahan}×</b>
        </span>
      </div>
    </div>
  );
};

export default RiwayatBoxCard;
