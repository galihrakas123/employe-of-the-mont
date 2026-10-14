import React, { useState } from 'react';
import { AREA_WEIGHTS, mockLeaderboardData } from '@/services/dashboardMockData';

interface RadarKomposisiChartProps {
  scores?: {
    pendapatan?: number;
    kepatuhan?: number;
    pelayanan?: number;
    tataKelola?: number;
    sdm?: number;
    a?: number;
    b?: number;
    c?: number;
    d?: number;
    e?: number;
  };
}

const AREAS = [
  { code: 'A', nama: 'Pendapatan', key: 'pendapatan', field: 'scorePendapatan', angle: -90 },
  { code: 'B', nama: 'Kepatuhan WP', key: 'kepatuhan', field: 'scoreKepatuhan', angle: -18 },
  { code: 'C', nama: 'Pelayanan', key: 'pelayanan', field: 'scorePelayanan', angle: 54 },
  { code: 'D', nama: 'Tata Kelola', key: 'tataKelola', field: 'scoreTataKelola', angle: 126 },
  { code: 'E', nama: 'SDM & Koordinasi', key: 'sdm', field: 'scoreSdm', angle: 198 },
] as const;

// Rata-rata provinsi per area dari 34 P3DW
const PROV_AVG = AREAS.map(
  (a) => mockLeaderboardData.reduce((acc, row) => acc + row[a.field], 0) / mockLeaderboardData.length
);

const VIEW_W = 260;
const VIEW_H = 220;
const CX = 130;
const CY = 108;
const MAX_R = 74;

const point = (score: number, angleDeg: number, extra = 0) => {
  const r = (Math.max(0, Math.min(120, score)) / 120) * MAX_R + extra;
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
};

const ring = (score: number) =>
  AREAS.map((a) => {
    const p = point(score, a.angle);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

const status = (skor: number) =>
  skor >= 100
    ? { label: 'Di atas target', cls: 'text-[#00875A] dark:text-[#34D399]' }
    : skor >= 90
      ? { label: 'Mendekati target', cls: 'text-[#B45309] dark:text-[#FBBF24]' }
      : { label: 'Di bawah target', cls: 'text-[#DC2626] dark:text-[#F87171]' };

export const RadarKomposisiChart: React.FC<RadarKomposisiChartProps> = ({
  scores = { a: 96, b: 95, c: 96, d: 94, e: 97 },
}) => {
  const [hover, setHover] = useState<number | null>(null);

  const values = [
    scores.pendapatan ?? scores.a ?? 96,
    scores.kepatuhan ?? scores.b ?? 95,
    scores.pelayanan ?? scores.c ?? 96,
    scores.tataKelola ?? scores.d ?? 94,
    scores.sdm ?? scores.e ?? 97,
  ];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // Warna poligon mengikuti rata-rata capaian unit
  let strokeColor = '#00875A';
  let fillColor = 'rgba(0, 135, 90, 0.18)';
  if (avg < 70) {
    strokeColor = '#DC2626';
    fillColor = 'rgba(220, 38, 38, 0.18)';
  } else if (avg < 90) {
    strokeColor = '#D97706';
    fillColor = 'rgba(217, 119, 6, 0.18)';
  } else if (avg < 100) {
    strokeColor = '#0284C7';
    fillColor = 'rgba(2, 132, 199, 0.18)';
  }

  const unitPts = AREAS.map((a, i) => point(values[i], a.angle));
  const provPts = AREAS.map((a, i) => point(PROV_AVG[i], a.angle));
  const toPoints = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const hovered = hover !== null ? { area: AREAS[hover], value: values[hover], prov: PROV_AVG[hover], pt: unitPts[hover] } : null;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto flex flex-col justify-between">
      <div className="mb-2">
        <h4 className="text-[15px] font-semibold text-[#212121]">Komposisi 5 Area Penilaian</h4>
        <p className="text-[12px] text-[#757575] mt-0.5">Arahkan kursor ke titik atau nama area untuk melihat rinciannya</p>
      </div>

      <div className="relative w-full my-2" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full max-h-[220px]">
          {/* Jaring 40 / 80 / 120 dan garis target 100 */}
          {[40, 80, 120].map((v) => (
            <polygon key={v} points={ring(v)} fill="none" stroke="#E2E8F0" strokeWidth="1" />
          ))}
          <polygon points={ring(100)} fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="1 2" />
          {AREAS.map((a, i) => {
            const end = point(120, a.angle);
            return (
              <line
                key={a.code}
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke={hover === i ? strokeColor : '#CBD5E1'}
                strokeDasharray="2"
                strokeWidth={hover === i ? 1.5 : 1}
              />
            );
          })}

          {/* Rata-rata provinsi */}
          <polygon points={toPoints(provPts)} fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3" />

          {/* Capaian unit */}
          <polygon points={toPoints(unitPts)} fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />

          {/* Titik unit + area hover yang lebih besar */}
          {unitPts.map((p, i) => (
            <g
              key={AREAS[i].code}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              role="img"
              aria-label={`Area ${AREAS[i].code} ${AREAS[i].nama}: skor ${fmt(values[i])}`}
              className="cursor-pointer outline-none"
            >
              <circle cx={p.x} cy={p.y} r="11" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={hover === i ? 5.5 : 3.5}
                fill={strokeColor}
                stroke="#FFFFFF"
                strokeWidth={hover === i ? 2 : 1}
                style={{ transition: 'r 120ms' }}
              />
            </g>
          ))}

          {/* Label area (juga bisa di-hover) */}
          {AREAS.map((a, i) => {
            const p = point(120, a.angle, 12);
            const anchor = Math.abs(Math.cos((a.angle * Math.PI) / 180)) < 0.3 ? 'middle' : Math.cos((a.angle * Math.PI) / 180) > 0 ? 'start' : 'end';
            const dy = a.angle === -90 ? -2 : a.angle > 0 && a.angle < 180 ? 8 : 3;
            return (
              <text
                key={a.code}
                x={p.x}
                y={p.y + dy}
                textAnchor={anchor}
                fontSize="8"
                fontWeight="700"
                fill={hover === i ? strokeColor : '#1E293B'}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHover(i)}
              >
                {a.code}. {a.nama} ({Math.round(values[i])})
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            role="tooltip"
            className="absolute z-10 pointer-events-none min-w-[180px] p-3 rounded-[12px] border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-xl text-[12px]"
            style={{
              left: `${Math.min(80, Math.max(20, (hovered.pt.x / VIEW_W) * 100))}%`,
              top: `${(hovered.pt.y / VIEW_H) * 100}%`,
              transform: hovered.pt.y < CY ? 'translate(-50%, 14px)' : 'translate(-50%, calc(-100% - 14px))',
            }}
          >
            <div className="font-bold text-[13px] text-[#0F172A] dark:text-[#F8FAFC]">
              Area {hovered.area.code} · {hovered.area.nama}
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Bobot {Math.round(AREA_WEIGHTS[hovered.area.key] * 100)}% dari skor akhir
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#F1F5F9] dark:border-[#334155]">
              <span className="flex flex-col text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                Skor unit
                <b className="text-[14px]" style={{ color: strokeColor }}>
                  {fmt(hovered.value)}
                </b>
              </span>
              <span className="flex flex-col text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                Rata-rata provinsi
                <b className="text-[14px] text-[#475569] dark:text-[#CBD5E1]">{fmt(hovered.prov)}</b>
              </span>
            </div>
            <div className={`mt-1.5 text-[11px] font-semibold ${status(hovered.value).cls}`}>
              {status(hovered.value).label} · {hovered.value >= hovered.prov ? '+' : ''}
              {fmt(hovered.value - hovered.prov)} dari rata-rata provinsi
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeColor }} /> Capaian Unit ({fmt(avg)})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 border-t-2 border-dashed border-[#94A3B8]" /> Rata-rata Provinsi
        </span>
      </div>
    </div>
  );
};

export default RadarKomposisiChart;
