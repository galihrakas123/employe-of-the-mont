import React, { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CustomSelect from '@/components/ui/CustomSelect';
import { PERIODE_LIST, TAHUN, getAreaSeries } from '@/services/periodeData';

// Tren skor tiap area (A–E) per bulan tahun berjalan, dengan rentang bulan yang bisa dipilih.
// Data dari periodeData (sama dengan riwayat box & penilaian per periode).

interface TrenAreaChartProps {
  unitId: string;
  /** Periode yang sedang ditinjau di halaman detail; ditandai garis vertikal. */
  periodeKey?: string;
}

const ALL_MONTHS = PERIODE_LIST.map((p) => ({ key: p.key, label: p.label, option: p.nama, short: p.short }));

const AREAS = [
  { key: 'a', code: 'A', nama: 'Pendapatan', color: '#00875A' },
  { key: 'b', code: 'B', nama: 'Kepatuhan WP', color: '#0284C7' },
  { key: 'c', code: 'C', nama: 'Pelayanan', color: '#D97706' },
  { key: 'd', code: 'D', nama: 'Tata Kelola', color: '#7C3AED' },
  { key: 'e', code: 'E', nama: 'SDM & Koordinasi', color: '#DB2777' },
] as const;

type AreaKey = (typeof AREAS)[number]['key'];

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

export const TrenAreaChart: React.FC<TrenAreaChartProps> = ({ unitId, periodeKey }) => {
  // Hanya bulan s.d. periode terpilih (penilaian dibaca "per periode", tanpa bulan sesudahnya)
  const periodeIdx = ALL_MONTHS.findIndex((m) => m.key === periodeKey);
  const MONTHS = ALL_MONTHS.slice(0, periodeIdx >= 0 ? periodeIdx + 1 : ALL_MONTHS.length);
  const monthOptions = MONTHS.map((m) => ({ label: m.option, value: m.key }));

  const [from, setFrom] = useState<string>(MONTHS[Math.max(0, MONTHS.length - 6)].key);
  const [to, setTo] = useState<string>(MONTHS[MONTHS.length - 1].key);
  const [hidden, setHidden] = useState<Set<AreaKey>>(new Set());

  const series = useMemo(
    () =>
      getAreaSeries(unitId).map((v, i) => ({
        bulan: ALL_MONTHS[i].short,
        label: ALL_MONTHS[i].label,
        a: v.pendapatan,
        b: v.kepatuhan,
        c: v.pelayanan,
        d: v.tataKelola,
        e: v.sdm,
      })),
    [unitId]
  );

  const fromIdx = MONTHS.findIndex((m) => m.key === from);
  const toIdx = MONTHS.findIndex((m) => m.key === to);
  const data = series.slice(fromIdx, toIdx + 1);

  // Jaga agar "Dari" tidak melewati "Sampai" (dan sebaliknya)
  const handleFrom = (val: string) => {
    setFrom(val);
    if (MONTHS.findIndex((m) => m.key === val) > toIdx) setTo(val);
  };
  const handleTo = (val: string) => {
    setTo(val);
    if (MONTHS.findIndex((m) => m.key === val) < fromIdx) setFrom(val);
  };

  const toggleArea = (key: AreaKey) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // Perubahan skor dari bulan awal ke bulan akhir rentang
  const first = data[0];
  const last = data[data.length - 1];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-6 font-roboto">
      <div className="mb-3">
        <h4 className="text-[15px] font-semibold text-[#212121] dark:text-[#F8FAFC]">Tren Kinerja per Area</h4>
        <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
          Skor tiap area per bulan sepanjang tahun {TAHUN}. Klik nama area untuk menyembunyikan atau menampilkan garisnya.
        </p>
      </div>

      {/* Rentang bulan: dua pilihan sejajar + pintasan N bulan terakhir */}
      <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-3 mb-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">Dari</span>
            <CustomSelect compact placeholder="Dari bulan" value={from} options={monthOptions} onChange={handleFrom} className="w-full" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">Sampai</span>
            <CustomSelect compact placeholder="Sampai bulan" value={to} options={monthOptions} onChange={handleTo} className="w-full" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="text-[11px] text-[#94A3B8] mr-0.5">Terakhir:</span>
          {[...new Set([3, 6, MONTHS.length].filter((n) => n <= MONTHS.length))].map((n) => {
            const active = toIdx === MONTHS.length - 1 && fromIdx === MONTHS.length - n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setFrom(MONTHS[MONTHS.length - n].key);
                  setTo(MONTHS[MONTHS.length - 1].key);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                  active
                    ? 'bg-[#00875A] text-white border-[#00875A]'
                    : 'bg-white dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] border-[#E2E8F0] dark:border-[#334155] hover:border-[#00875A] hover:text-[#00875A]'
                }`}
              >
                {n === MONTHS.length ? `Jan–${MONTHS[MONTHS.length - 1].short}` : `${n} bln`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
            <YAxis
              domain={[(min: number) => Math.floor(Math.min(min, 90) / 10) * 10, (max: number) => Math.ceil(Math.max(max, 105) / 10) * 10]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            {periodeKey && data.some((d) => d.label === MONTHS.find((m) => m.key === periodeKey)?.label) && (
              <ReferenceLine
                x={MONTHS.find((m) => m.key === periodeKey)?.short}
                stroke="#00875A"
                strokeOpacity={0.5}
                strokeWidth={6}
              />
            )}
            <ReferenceLine y={100} stroke="#0F172A" strokeOpacity={0.4} strokeDasharray="4 3" label={{ value: 'Target 100', position: 'insideTopRight', fontSize: 10, fill: '#64748B' }} />
            <Tooltip
              cursor={{ stroke: '#CBD5E1' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = data.find((d) => d.bulan === label);
                return (
                  <div className="min-w-[180px] p-3 rounded-[12px] border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-xl text-[12px]">
                    <div className="font-bold text-[13px] text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">{row?.label ?? label}</div>
                    {payload.map((p) => {
                      const area = AREAS.find((a) => a.key === p.dataKey);
                      if (!area) return null;
                      return (
                        <div key={area.key} className="flex items-center justify-between gap-3 py-0.5">
                          <span className="flex items-center gap-1.5 text-[#475569] dark:text-[#CBD5E1]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: area.color }} />
                            {area.code} · {area.nama}
                          </span>
                          <b className="tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">{fmt(Number(p.value))}</b>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {AREAS.map((a) =>
              hidden.has(a.key) ? null : (
                <Line
                  key={a.key}
                  type="monotone"
                  dataKey={a.key}
                  stroke={a.color}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: a.color, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda + perubahan dalam rentang (klik untuk sembunyikan/tampilkan) */}
      <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-[#F1F5F9] dark:border-[#334155]">
        {AREAS.map((a) => {
          const isHidden = hidden.has(a.key);
          const delta = last && first ? last[a.key] - first[a.key] : 0;
          return (
            <button
              key={a.key}
              type="button"
              onClick={() => toggleArea(a.key)}
              aria-pressed={!isHidden}
              className={`flex items-center justify-between gap-2 px-2 py-1 rounded-md text-[12px] cursor-pointer transition hover:bg-[#F8FAFC] dark:hover:bg-white/[0.04] ${
                isHidden ? 'opacity-40' : ''
              }`}
            >
              <span className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: a.color }} />
                Area {a.code} · {a.nama}
              </span>
              <span className="flex items-center gap-2 tabular-nums">
                <b className="text-[#0F172A] dark:text-[#F8FAFC]">{last ? fmt(last[a.key]) : '–'}</b>
                <span
                  className={`min-w-[52px] text-right text-[11px] font-semibold ${
                    delta > 0.05 ? 'text-[#00875A] dark:text-[#34D399]' : delta < -0.05 ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#64748B]'
                  }`}
                >
                  {delta > 0.05 ? '▲' : delta < -0.05 ? '▼' : '•'} {fmt(Math.abs(delta))}
                </span>
              </span>
            </button>
          );
        })}
        <span className="px-2 text-[11px] text-[#94A3B8]">
          Angka kanan = skor {last?.label} dan perubahan sejak {first?.label}.
        </span>
      </div>
    </div>
  );
};

export default TrenAreaChart;
