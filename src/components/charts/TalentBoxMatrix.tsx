import React, { useLayoutEffect, useRef, useState } from 'react';
import { getBoxByCoordinates, getPredikatBySkor } from '@/services/dashboardMockData';
import { NINE_BOX_DETAILS } from '@/constants/nineBoxData';

// Matriks Kinerja × Potensi (9 box) dengan titik posisi unit.
// Tiap sepertiga sumbu mewakili satu kategori, jadi skala dalam tiap sepertiga
// berbeda (Kinerja 60–90 | 90–100 | 100–120, Potensi 60–85 | 85–95 | 95–120).

export interface MatrixPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Skor akhir (untuk tooltip & warna titik sesuai predikat). */
  final?: number;
  /** Keterangan kecil di tooltip, mis. "Korwil Bogor". */
  sub?: string;
}

interface TalentBoxMatrixProps {
  points: MatrixPoint[];
  /** Titik utama (besar). Box-nya diberi bingkai. */
  focusId?: string;
  /** Titik terpilih (diberi cincin), untuk mode pilih. */
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Titik yang diredupkan (mis. tidak lolos filter). */
  dimmed?: Set<string>;
  /** Tampilkan jumlah unit per box. */
  showCounts?: boolean;
  /** Versi ringkas untuk kolom sempit: tiap box hanya menampilkan nama singkatnya. */
  compact?: boolean;
  /** Klik box (mis. membuka panduan box). */
  onBoxClick?: (boxNumber: number) => void;
}

type Level = 'Tinggi' | 'Sedang' | 'Rendah';
type Tone = 'star' | 'mid' | 'neutral' | 'warn' | 'risk';

const CHART_RANGE = { min: 60, max: 120 };
const THRESHOLDS = {
  Y: { mid: 90, high: 100, labels: { Tinggi: 'Tinggi', Sedang: 'Sedang', Rendah: 'Rendah' } },
  X: { mid: 85, high: 95, labels: { Tinggi: 'Tinggi', Sedang: 'Sedang', Rendah: 'Rendah' } },
};

// Box tersusun dari kiri atas: Kinerja Tinggi di atas, Potensi Rendah di kiri
const GRID_ROWS: number[][] = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
];

const BOX_TONE: Record<number, Tone> = { 9: 'star', 8: 'mid', 6: 'mid', 7: 'neutral', 5: 'neutral', 3: 'neutral', 4: 'warn', 2: 'warn', 1: 'risk' };

const CELL_CLASS: Record<Tone, string> = {
  star: 'bg-[#E0F2FE] dark:bg-[#0284C7]/15',
  mid: 'bg-[#ECFDF5] dark:bg-[#10B981]/10',
  neutral: 'bg-[#F8FAFC] dark:bg-white/[0.03]',
  warn: 'bg-[#FFFDEB] dark:bg-[#D97706]/10',
  risk: 'bg-[#FFF0F2] dark:bg-[#DC2626]/10',
};

const CELL_NO_CLASS: Record<Tone, string> = {
  star: 'text-[#00875A] dark:text-[#34D399]',
  mid: 'text-[#047857] dark:text-[#6EE7B7]',
  neutral: 'text-[#0F172A] dark:text-[#F8FAFC]',
  warn: 'text-[#D97706] dark:text-[#FBBF24]',
  risk: 'text-[#DC2626] dark:text-[#F87171]',
};

const LEVEL_TEXT: Record<Level, string> = {
  Tinggi: 'text-[#00875A] dark:text-[#34D399]',
  Sedang: 'text-[#B45309] dark:text-[#FBBF24]',
  Rendah: 'text-[#C62828] dark:text-[#F87171]',
};

// Warna titik mengikuti predikat skor akhir
const PREDIKAT_COLOR: Record<string, string> = {
  'Sangat baik': '#00875A',
  Baik: '#0284C7',
  Cukup: '#FF8F00',
  Kurang: '#E53935',
};

export const MATRIX_LEGEND = [
  { label: 'Sangat Baik (≥ 110)', color: PREDIKAT_COLOR['Sangat baik'] },
  { label: 'Baik (90–109,9)', color: PREDIKAT_COLOR.Baik },
  { label: 'Cukup (70–89,9)', color: PREDIKAT_COLOR.Cukup },
  { label: 'Kurang (< 70)', color: PREDIKAT_COLOR.Kurang },
];

const LEVEL_EN: Record<Level, string> = { Tinggi: 'High', Sedang: 'Moderate', Rendah: 'Low' };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const fmtNum = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

/** Posisi 0–100% dengan tiga segmen sama lebar. */
function segPos(v: number, mid: number, high: number): number {
  const { min, max } = CHART_RANGE;
  const c = clamp(v, min, max);
  const f =
    c < mid
      ? (c - min) / (mid - min) / 3
      : c < high
        ? 1 / 3 + (c - mid) / (high - mid) / 3
        : 2 / 3 + (c - high) / (max - high) / 3;
  return clamp(f * 100, 3, 97);
}

const pos = (p: MatrixPoint) => ({
  x: segPos(p.x, THRESHOLDS.X.mid, THRESHOLDS.X.high),
  y: segPos(p.y, THRESHOLDS.Y.mid, THRESHOLDS.Y.high),
});

const boxOf = (p: MatrixPoint) => getBoxByCoordinates(p.y, p.x).boxNumber;

export const TalentBoxMatrix: React.FC<TalentBoxMatrixProps> = ({
  points,
  focusId,
  selectedId,
  onSelect,
  dimmed,
  showCounts,
  compact: compactProp,
  onBoxClick,
}) => {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Menyesuaikan lebar wadah: < 440px pakai versi ringkas, < 340px label kategori sumbu Y disembunyikan
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(Infinity);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const tiny = width < 340;
  const compact = compactProp || width < 440;

  const focus = points.find((p) => p.id === (focusId ?? selectedId));
  const focusBox = focus ? boxOf(focus) : null;

  const counts = new Map<number, number>();
  points.forEach((p) => {
    if (dimmed?.has(p.id)) return;
    const no = boxOf(p);
    counts.set(no, (counts.get(no) ?? 0) + 1);
  });

  const hover = hoverId ? points.find((p) => p.id === hoverId) : undefined;
  const levelsTopDown: Level[] = ['Tinggi', 'Sedang', 'Rendah'];
  const levelsLeftRight: Level[] = ['Rendah', 'Sedang', 'Tinggi'];

  return (
    <div
      ref={rootRef}
      className="grid gap-y-1.5 font-roboto select-none"
      style={{
        gridTemplateColumns: tiny
          ? '14px 0 22px minmax(0, 1fr)'
          : compact
            ? '16px 44px 24px minmax(0, 1fr)'
            : '18px 52px 28px minmax(0, 1fr)',
        columnGap: tiny ? 4 : compact ? 6 : 8,
      }}
    >
      {/* Judul sumbu Y (absolut agar tidak menambah tinggi baris; terlipat bila plot pendek) */}
      <div className="relative">
        <span
          className="absolute inset-0 flex items-center justify-center text-center leading-tight text-[11px] font-bold tracking-[0.04em] text-[#0F172A] dark:text-[#F8FAFC]"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          KINERJA (REALISASI &amp; POTENSI PAJAK)
        </span>
      </div>

      {/* Label kategori sumbu Y: satu per sepertiga sumbu */}
      <div className={`grid grid-rows-3 ${tiny ? 'invisible' : ''}`}>
        {levelsTopDown.map((lvl) => (
          <span
            key={lvl}
            className={`flex items-center justify-center font-semibold ${compact ? 'text-[11px]' : 'text-[12px]'} ${LEVEL_TEXT[lvl]}`}
          >
            {THRESHOLDS.Y.labels[lvl]}
          </span>
        ))}
      </div>

      {/* Angka batas sumbu Y */}
      <div className="flex flex-col justify-between text-right text-[12px] font-semibold leading-none tabular-nums text-[#64748B] dark:text-[#94A3B8]">
        <span>{CHART_RANGE.max}</span>
        <span>{THRESHOLDS.Y.high}</span>
        <span>{THRESHOLDS.Y.mid}</span>
        <span>{CHART_RANGE.min}</span>
      </div>

      {/* Area plot */}
      <div className="relative w-full aspect-square rounded-lg border border-[#E2E8F0] dark:border-[#334155] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 rounded-lg overflow-hidden">
          {GRID_ROWS.flat().map((no) => {
            const box = NINE_BOX_DETAILS[no];
            const tone = BOX_TONE[no];
            const count = counts.get(no) ?? 0;
            return (
              <div
                key={no}
                onClick={onBoxClick ? () => onBoxClick(no) : undefined}
                title={`Box ${no} · ${box.name} (${LEVEL_EN[box.kinerja]} Performer · ${LEVEL_EN[box.potensi]} Potential)`}
                className={`flex flex-col gap-0.5 min-w-0 overflow-hidden border-r border-b border-[#E2E8F0] dark:border-[#334155] ${
                  tiny ? 'px-1.5 py-1' : compact ? 'px-2 py-1.5' : 'px-2.5 py-2'
                } ${CELL_CLASS[tone]} ${onBoxClick ? 'cursor-pointer hover:brightness-[0.97] transition' : ''}`}
                style={no === focusBox ? { boxShadow: 'inset 0 0 0 2px #00875A' } : undefined}
              >
                <span className={`flex items-center gap-1 font-bold whitespace-nowrap ${tiny ? 'text-[10px]' : 'text-[12px]'} ${CELL_NO_CLASS[tone]}`}>
                  Box {no}
                  {showCounts && count > 0 && (
                    <b className="ml-auto min-w-[20px] px-1.5 rounded-full bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs text-[10px] text-center">
                      {count}
                    </b>
                  )}
                </span>
                {tiny ? null : compact ? (
                  <span className="text-[10px] leading-tight text-[#64748B] dark:text-[#94A3B8] truncate">{box.name}</span>
                ) : (
                  <span className="text-[10px] leading-tight text-[#64748B] dark:text-[#94A3B8]">
                    {LEVEL_EN[box.kinerja]} Performer
                    <br />
                    {LEVEL_EN[box.potensi]} Potential
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Titik unit */}
        {points.map((p) => {
          const { x, y } = pos(p);
          const isFocus = p.id === focusId;
          const isSelected = p.id === selectedId;
          const isDim = dimmed?.has(p.id);
          const color = p.final !== undefined ? PREDIKAT_COLOR[getPredikatBySkor(p.final).predikat] : '#00875A';
          const size = isFocus ? 22 : 12;
          const transform = `translate(-50%, 50%) scale(${isSelected ? 1.3 : hoverId === p.id ? 1.35 : 1})`;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`${p.label} · Kinerja ${fmtNum(p.y)} · Potensi ${fmtNum(p.x)} · Box ${boxOf(p)}`}
              aria-pressed={onSelect ? isSelected : undefined}
              onClick={onSelect ? () => onSelect(p.id) : undefined}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(p.id)}
              onBlur={() => setHoverId(null)}
              className={`absolute p-0 rounded-full border-white dark:border-[#1E293B] transition-[transform,opacity] duration-150 ${
                onSelect ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{
                left: `${x}%`,
                bottom: `${y}%`,
                width: size,
                height: size,
                borderWidth: isFocus ? 3 : 2,
                backgroundColor: color,
                transform,
                opacity: isDim ? 0.18 : 1,
                zIndex: hoverId === p.id ? 4 : isSelected ? 5 : isFocus ? 3 : 2,
                boxShadow: isSelected
                  ? `0 0 0 4px ${color}66, 0 4px 6px -1px rgba(0,0,0,0.15)`
                  : isFocus
                    ? '0 0 0 3px #0F172A'
                    : '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          );
        })}

        {/* Tooltip */}
        {hover &&
          (() => {
            const { x, y } = pos(hover);
            const box = NINE_BOX_DETAILS[boxOf(hover)];
            return (
              <div
                role="tooltip"
                className="absolute z-10 pointer-events-none flex flex-col gap-0.5 min-w-[190px] p-3 rounded-[14px] border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-xl text-[12px]"
                style={{
                  left: `${clamp(x, 20, 80)}%`,
                  bottom: `${y}%`,
                  transform: y > 55 ? 'translate(-50%, calc(100% + 14px))' : 'translateX(-50%)',
                  marginBottom: y > 55 ? undefined : 14,
                }}
              >
                <b className="text-[13px] text-[#0F172A] dark:text-[#F8FAFC]">{hover.label}</b>
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  {hover.sub ? `${hover.sub} · ` : ''}Box {box.boxNumber} · {box.name}
                </span>
                <span className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#F1F5F9] dark:border-[#334155] text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="flex flex-col">
                    Kinerja
                    <b className="text-[13px] text-[#00875A]">{fmtNum(hover.y)}</b>
                  </span>
                  <span className="flex flex-col">
                    Potensi
                    <b className="text-[13px] text-[#0284C7]">{fmtNum(hover.x)}</b>
                  </span>
                  {hover.final !== undefined && (
                    <span className="flex flex-col">
                      Skor
                      <b className="text-[13px] text-[#D97706]">{fmtNum(hover.final)}</b>
                    </span>
                  )}
                </span>
              </div>
            );
          })()}
      </div>

      <span />
      <span />
      <span />

      {/* Bawah plot: angka batas, label kategori, judul sumbu X */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex justify-between text-[12px] font-semibold tabular-nums text-[#64748B] dark:text-[#94A3B8]">
          <span>{CHART_RANGE.min}</span>
          <span>{THRESHOLDS.X.mid}</span>
          <span>{THRESHOLDS.X.high}</span>
          <span>{CHART_RANGE.max}</span>
        </div>
        <div className="grid grid-cols-3 -mt-0.5">
          {levelsLeftRight.map((lvl) => (
            <span
              key={lvl}
              className={`flex items-center justify-center font-semibold ${compact ? 'text-[11px]' : 'text-[12px]'} ${LEVEL_TEXT[lvl]}`}
            >
              {THRESHOLDS.X.labels[lvl]}
            </span>
          ))}
        </div>
        <div className="text-center text-[12px] font-bold tracking-[0.04em] text-[#0F172A] dark:text-[#F8FAFC]">
          POTENSI (LAYANAN &amp; KEPUASAN MASYARAKAT)
        </div>
      </div>
    </div>
  );
};

export const MatrixLegend: React.FC = () => (
  <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#757575] dark:text-[#94A3B8] mt-3 font-medium">
    {MATRIX_LEGEND.map((item) => (
      <span key={item.label} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ backgroundColor: item.color }} />
        {item.label}
      </span>
    ))}
  </div>
);

export default TalentBoxMatrix;
