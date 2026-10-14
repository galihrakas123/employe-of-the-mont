import React from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PERIODE_BERJALAN, PERIODE_LIST, getEvaluasiSemua, getPeriode, getRiwayat } from '@/services/periodeData';

// Tren skor akhir unit: jendela maksimal 6 bulan yang BERAKHIR di periode terpilih
// (data tahun berjalan saja), dibandingkan dengan rata-rata 34 P3DW.

interface TrenSkorChartProps {
  unitId: string;
  periodeKey?: string;
}

const JENDELA = 6;

const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');

// Warna mengikuti predikat skor akhir periode terpilih
const themeOf = (skor: number) =>
  skor >= 110 ? '#00875A' : skor >= 90 ? '#0284C7' : skor >= 70 ? '#D97706' : '#DC2626';

export const TrenSkorChart: React.FC<TrenSkorChartProps> = ({ unitId, periodeKey = PERIODE_BERJALAN.key }) => {
  const periode = getPeriode(periodeKey);
  const start = Math.max(0, periode.index - (JENDELA - 1));
  const riwayat = getRiwayat(unitId).slice(start, periode.index + 1);

  const data = riwayat.map((r) => {
    const semua = getEvaluasiSemua(r.periode.key);
    return {
      bulan: r.periode.short,
      label: r.periode.label,
      skor: r.total,
      provinsi: Math.round((semua.reduce((acc, u) => acc + u.total, 0) / semua.length) * 10) / 10,
      peringkat: r.peringkat,
    };
  });

  const first = data[0];
  const last = data[data.length - 1];
  const delta = last.skor - first.skor;
  const themeColor = themeOf(last.skor);
  const gradientId = `trenSkor-${unitId}`;

  const badge =
    data.length < 2
      ? { text: 'Bulan pertama', cls: 'text-[#64748B] bg-[#F1F5F9] border-[#E2E8F0]' }
      : delta > 0.05
        ? { text: `▲ ${fmt(delta)}`, cls: 'text-[#00875A] bg-[#E6F4EA] border-[#00875A]/20' }
        : delta < -0.05
          ? { text: `▼ ${fmt(Math.abs(delta))}`, cls: 'text-[#DC2626] bg-[#FEE2E2] border-[#DC2626]/20' }
          : { text: 'Stabil', cls: 'text-[#64748B] bg-[#F1F5F9] border-[#E2E8F0]' };

  const selisihProvinsi = last.skor - last.provinsi;
  const note =
    data.length < 2
      ? `${periode.nama} adalah bulan pertama tahun ${PERIODE_LIST[0].label.split(' ')[1]}, belum ada pembanding bulan sebelumnya.`
      : `${delta > 0.05 ? 'Naik' : delta < -0.05 ? 'Turun' : 'Stabil'}${Math.abs(delta) > 0.05 ? ` ${fmt(Math.abs(delta))} poin` : ''} sejak ${first.label.split(' ')[0]} · ${
          selisihProvinsi >= 0 ? `${fmt(selisihProvinsi)} di atas` : `${fmt(Math.abs(selisihProvinsi))} di bawah`
        } rata-rata provinsi`;

  const rentang = data.length > 1 ? `${first.label.split(' ')[0]} – ${last.label}` : last.label;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto flex flex-col justify-between h-full">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <h4 className="text-[15px] font-semibold text-[#212121]">Tren Skor Akhir</h4>
          <p className="text-[12px] text-[#757575] mt-0.5">
            {rentang} ({data.length} bulan, s.d. periode terpilih)
          </p>
        </div>
        <span className={`shrink-0 text-[12px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${badge.cls}`}>{badge.text}</span>
      </div>

      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 18, right: 14, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={themeColor} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} padding={{ left: 16, right: 16 }} />
            <YAxis
              domain={[(min: number) => Math.floor(Math.min(min, 85) / 10) * 10, (max: number) => Math.ceil(Math.max(max, 105) / 10) * 10]}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <ReferenceLine y={100} stroke="#0F172A" strokeOpacity={0.3} strokeDasharray="4 3" />
            <Tooltip
              cursor={{ stroke: '#CBD5E1' }}
              content={({ active, label }) => {
                if (!active) return null;
                const row = data.find((d) => d.bulan === label);
                if (!row) return null;
                return (
                  <div className="min-w-[170px] p-3 rounded-[12px] border border-[#E2E8F0] bg-white shadow-xl text-[12px]">
                    <div className="font-bold text-[13px] text-[#0F172A] mb-1">{row.label}</div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#475569]">Skor unit</span>
                      <b className="tabular-nums" style={{ color: themeColor }}>
                        {fmt(row.skor)}
                      </b>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#475569]">Rata-rata provinsi</span>
                      <b className="tabular-nums text-[#475569]">{fmt(row.provinsi)}</b>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#475569]">Peringkat</span>
                      <b className="tabular-nums text-[#0F172A]">#{row.peringkat}</b>
                    </div>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="skor" stroke="none" fill={`url(#${gradientId})`} isAnimationActive={false} />
            <Line
              type="monotone"
              dataKey="provinsi"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="skor"
              stroke={themeColor}
              strokeWidth={3}
              dot={{ r: 4, fill: themeColor, stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              label={{ position: 'top', fontSize: 10.5, fill: '#64748B', formatter: (v: unknown) => fmt(Number(v)) }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B] mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: themeColor }} /> Skor unit
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 border-t-2 border-dashed border-[#94A3B8]" /> Rata-rata provinsi
        </span>
      </div>

      <div className="pt-3 mt-2 border-t border-[#F1F5F9] text-center text-[12px] text-[#64748B]">{note}</div>
    </div>
  );
};

export default TrenSkorChart;
