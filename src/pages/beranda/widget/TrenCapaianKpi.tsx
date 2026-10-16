import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Minus, Search, X } from 'lucide-react';
import CustomSelect, { CustomSelectOption } from '@/components/ui/CustomSelect';
import { AREA_GROUPS, AreaKey, KPI_DEFINITIONS } from '@/services/dashboardMockData';
import { PERIODE_LIST, PeriodeBulan, getCapaianKpiSemua, getEvaluasiSemua } from '@/services/periodeData';

// Tren capaian bulanan (Januari s.d. periode terpilih) untuk beberapa indikator KPI sekaligus,
// atau beberapa area. Capaian area = rata-rata capaian KPI di area itu, ditimbang bobot KPI.
// Satu seri: garis + pita rentang terendah–tertinggi 34 P3DW. Beberapa seri: satu garis per seri.

export type TrenMode = 'indikator' | 'area';

export const TARGET = 100;
// Di atas jumlah ini garis dibuat tipis tanpa titik; sorot lewat kursor agar tetap terbaca
const BATAS_PADAT = 6;
const SEMUA_KPI = KPI_DEFINITIONS.map((k) => k.no);

export const AREA_INFO: Record<AreaKey, { kode: string; nama: string; color: string }> = {
  area_a: { kode: 'A', nama: 'Pendapatan', color: '#00875A' },
  area_b: { kode: 'B', nama: 'Kepatuhan WP', color: '#0284C7' },
  area_c: { kode: 'C', nama: 'Pelayanan', color: '#D97706' },
  area_d: { kode: 'D', nama: 'Tata Kelola', color: '#7C3AED' },
  area_e: { kode: 'E', nama: 'SDM & Koordinasi', color: '#DB2777' },
};

// Warna garis indikator menurut urutan dipilih; setelah 6 warna dasar, rona disebar dengan sudut emas
const WARNA_SERI = ['#0284C7', '#D97706', '#7C3AED', '#00875A', '#DB2777', '#0891B2'];
const warnaSeri = (i: number) =>
  i < WARNA_SERI.length ? WARNA_SERI[i] : `hsl(${Math.round((i * 137.508) % 360)}, 62%, 46%)`;

export const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
const fmtSelisih = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${fmt(Math.abs(v))}`;
export const rata = (vals: number[]) => vals.reduce((acc, v) => acc + v, 0) / (vals.length || 1);
// Warna status terhadap target 100
export const warna = (v: number) => (v >= TARGET ? '#00875A' : v >= 90 ? '#D97706' : '#DC2626');

const SEMUA = 'semua';

// Pilih/lepas semua KPI satu area sekaligus.
// Belum semua terpilih → ditambahkan.
// Sudah semua terpilih → dilepas (minimal satu KPI tetap tersisa).
export const kpiNoArea = (area: AreaKey) => KPI_DEFINITIONS.filter((k) => k.area === area).map((k) => k.no);
export const statusArea = (sel: number[], area: AreaKey): 'semua' | 'sebagian' | 'tidak' => {
  const nos = kpiNoArea(area);
  const n = nos.filter((no) => sel.includes(no)).length;
  return n === nos.length ? 'semua' : n ? 'sebagian' : 'tidak';
};
export const toggleAreaKpi = (sel: number[], area: AreaKey): number[] => {
  const nos = kpiNoArea(area);
  if (statusArea(sel, area) === 'semua') {
    const sisa = sel.filter((no) => !nos.includes(no));
    return sisa.length ? sisa : [nos[0]];
  }
  return [...sel, ...nos.filter((no) => !sel.includes(no))];
};

interface TitikSeri {
  rata: number;
  min: number;
  max: number;
  minNama: string;
  maxNama: string;
  diBawah: number;
  unit?: number;
  peringkat?: number;
}

interface Seri {
  key: string;
  label: string;
  info: string;
  color: string;
  titik: TitikSeri[]; // per bulan
}

interface TrenCapaianKpiProps {
  periode: PeriodeBulan;
  mode: TrenMode;
  onModeChange: (mode: TrenMode) => void;
  kpiSel: number[];
  onKpiSelChange: (sel: number[]) => void;
  cakupan: string;
  onCakupanChange: (value: string) => void;
  unitOptions: CustomSelectOption[];
}

// Capaian per P3DW untuk satu seri: kolom KPI, atau rata-rata berbobot KPI satu area
const kolomKpi = (rows: number[][], idx: number) => rows.map((r) => r[idx]);
const kolomArea = (rows: number[][], area: AreaKey) => {
  const idxs = KPI_DEFINITIONS.map((k, i) => (k.area === area ? i : -1)).filter((i) => i >= 0);
  const bobot = idxs.reduce((acc, i) => acc + KPI_DEFINITIONS[i].bobot, 0);
  return rows.map((r) => idxs.reduce((acc, i) => acc + r[i] * KPI_DEFINITIONS[i].bobot, 0) / bobot);
};

export const TrenCapaianKpi: React.FC<TrenCapaianKpiProps> = ({
  periode,
  mode,
  onModeChange,
  kpiSel,
  onKpiSelChange,
  cakupan,
  onCakupanChange,
  unitOptions,
}) => {
  const [areaSel, setAreaSel] = useState<AreaKey[]>(AREA_GROUPS.map((g) => g.id));

  const evaluasi = getEvaluasiSemua(periode.key);
  const unitIdx = cakupan === SEMUA ? -1 : evaluasi.findIndex((e) => e.id === cakupan);
  const unitNama = unitIdx >= 0 ? evaluasi[unitIdx].nama : 'Rata-rata 34 P3DW';
  const bulan = PERIODE_LIST.slice(0, periode.index + 1);

  const seri = useMemo<Seri[]>(() => {
    const perBulan = bulan.map((p) => getCapaianKpiSemua(p.key));
    const titik = (col: number[]): TitikSeri => {
      const min = Math.min(...col);
      const max = Math.max(...col);
      const t: TitikSeri = {
        rata: Math.round(rata(col) * 10) / 10,
        min,
        max,
        minNama: evaluasi[col.indexOf(min)].nama,
        maxNama: evaluasi[col.indexOf(max)].nama,
        diBawah: col.filter((v) => v < TARGET).length,
      };
      if (unitIdx >= 0) {
        t.unit = Math.round(col[unitIdx] * 10) / 10;
        t.peringkat = col.filter((v) => v > col[unitIdx]).length + 1;
      }
      return t;
    };
    if (mode === 'area') {
      return AREA_GROUPS.filter((g) => areaSel.includes(g.id)).map((g) => {
        const kpis = KPI_DEFINITIONS.filter((k) => k.area === g.id);
        return {
          key: g.id,
          label: `Area ${AREA_INFO[g.id].kode}. ${AREA_INFO[g.id].nama}`,
          info: `${kpis.length} KPI · bobot ${kpis.reduce((acc, k) => acc + k.bobot, 0)}%`,
          color: AREA_INFO[g.id].color,
          titik: perBulan.map((rows) => titik(kolomArea(rows, g.id))),
        };
      });
    }
    return kpiSel.map((no, i) => {
      const idx = KPI_DEFINITIONS.findIndex((k) => k.no === no);
      const def = KPI_DEFINITIONS[idx];
      return {
        key: `k${no}`,
        label: `${def.no}. ${def.nama}`,
        info: `Area ${AREA_INFO[def.area].kode} · bobot ${String(def.bobot).replace('.', ',')}% · target ${def.target}${
          def.arah === 'turun' ? ' · ↓ makin rendah makin baik' : ''
        }`,
        color: warnaSeri(i),
        titik: perBulan.map((rows) => titik(kolomKpi(rows, idx))),
      };
    });
  }, [mode, kpiSel, areaSel, periode.index, unitIdx, evaluasi]);

  const tunggal = seri.length === 1;
  const padat = seri.length > BATAS_PADAT;
  // Seri yang disorot (kursor di garis, chip, atau baris tabel); seri lain dipudarkan
  const [sorot, setSorot] = useState<string | null>(null);
  const [chipLengkap, setChipLengkap] = useState(false);
  const opasitas = (key: string) => (sorot && sorot !== key ? 0.12 : 1);
  const tebal = (key: string) => (sorot === key ? 3.5 : padat ? 1.75 : 2.5);
  const titikGaris = padat ? false : { r: 3 };
  const sorotProps = (key: string) => ({
    onMouseEnter: () => setSorot(key),
    onMouseLeave: () => setSorot((k) => (k === key ? null : k)),
  });
  // Layar lebar (xl): tinggi grafik mengikuti tinggi panel ringkasan di sampingnya (min. 300px).
  // Layar sempit: panel ada di bawah grafik, tinggi grafik tetap.
  const sampingRef = useRef<HTMLDivElement>(null);
  const [tinggiSamping, setTinggiSamping] = useState(0);
  useEffect(() => {
    const el = sampingRef.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1280px)');
    const update = () => setTinggiSamping(mq.matches ? el.offsetHeight : 0);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener('change', update);
    update();
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', update);
    };
  }, []);
  const tinggiGrafik = tinggiSamping ? Math.max(300, tinggiSamping) : padat ? 480 : 300;
  const BATAS_CHIP = 8;
  const chipTampil = chipLengkap ? seri : seri.slice(0, BATAS_CHIP);
  const nilai = (t: TitikSeri) => t.unit ?? t.rata;

  // Baris grafik per bulan: r_<seri> = rata-rata 34 P3DW, u_<seri> = P3DW terpilih, rentang = pita (satu seri)
  const data = bulan.map((p, i) => {
    const row: Record<string, unknown> = { bulan: p.short, label: p.label };
    seri.forEach((s) => {
      row[`r_${s.key}`] = s.titik[i].rata;
      if (unitIdx >= 0) row[`u_${s.key}`] = s.titik[i].unit;
    });
    if (tunggal) row.rentang = [seri[0].titik[i].min, seri[0].titik[i].max];
    return row;
  });

  const toggleArea = (id: AreaKey) =>
    setAreaSel((prev) => (prev.includes(id) ? (prev.length > 1 ? prev.filter((a) => a !== id) : prev) : [...prev, id]));
  const hapusKpi = (no: number) => kpiSel.length > 1 && onKpiSelChange(kpiSel.filter((n) => n !== no));

  const n = bulan.length;

  return (
    <section
      id="tren-capaian-kpi"
      className="scroll-mt-24 bg-white dark:bg-[#1E293B] rounded-xl p-4 sm:p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
            Tren Rata-rata Capaian {mode === 'area' ? 'per Area' : 'Indikator KPI'}
          </h3>
          <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5 max-w-[640px]">
            {PERIODE_LIST[0].nama} s.d. {periode.label} · {unitNama}.{' '}
            {mode === 'area' && 'Capaian area = rata-rata capaian KPI di area itu, ditimbang bobot KPI. '}
            {tunggal
              ? 'Pita abu-abu = rentang terendah–tertinggi 34 P3DW.'
              : `Pilih satu ${mode === 'area' ? 'area' : 'indikator'} saja untuk melihat rentang 34 P3DW.`}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3 shrink-0">
          <div>
            <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">Tampilkan</div>
            <div className="flex h-10 rounded-lg border border-[#E2E8F0] dark:border-[#334155] p-0.5 bg-[#F8FAFC] dark:bg-[#0F172A]">
              {(
                [
                  ['indikator', 'Indikator KPI'],
                  ['area', 'Area'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onModeChange(key)}
                  className={`px-3 rounded-md text-[12px] font-semibold transition cursor-pointer ${
                    mode === key ? 'bg-white dark:bg-[#1E293B] text-[#00875A] shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#00875A]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {mode === 'indikator' && (
            <div>
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">
                Indikator KPI
              </div>
              <PilihIndikator value={kpiSel} onChange={onKpiSelChange} />
            </div>
          )}
          <div>
            <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">Cakupan</div>
            <CustomSelect compact placeholder="Pilih P3DW" value={cakupan} options={unitOptions} onChange={onCakupanChange} className="w-60" />
          </div>
        </div>
      </div>

      {/* Pilihan aktif: chip indikator (klik ✕ untuk menghapus) atau chip area (klik untuk tampil/sembunyi) */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {mode === 'area'
          ? AREA_GROUPS.map((g) => {
              const on = areaSel.includes(g.id);
              const info = AREA_INFO[g.id];
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleArea(g.id)}
                  className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-[11.5px] font-semibold transition cursor-pointer ${
                    on ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#94A3B8] border-dashed'
                  }`}
                  style={on ? { borderColor: info.color, background: `${info.color}14` } : { borderColor: '#CBD5E1' }}
                  title={on ? 'Sembunyikan dari grafik' : 'Tampilkan di grafik'}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: on ? info.color : '#CBD5E1' }} />
                  {info.kode}. {info.nama}
                </button>
              );
            })
          : chipTampil.map((s) => (
              <span
                key={s.key}
                {...sorotProps(s.key)}
                className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1 rounded-full border text-[11.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] max-w-[320px] transition-opacity"
                style={{ borderColor: s.color, background: `${s.color}14`, opacity: sorot && sorot !== s.key ? 0.5 : 1 }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="truncate">{s.label}</span>
                {seri.length > 1 && (
                  <button
                    type="button"
                    onClick={() => hapusKpi(Number(s.key.slice(1)))}
                    className="w-5 h-5 shrink-0 rounded-full inline-flex items-center justify-center text-[#64748B] hover:bg-black/10 cursor-pointer"
                    aria-label={`Hapus ${s.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
        {mode === 'indikator' && seri.length > BATAS_CHIP && (
          <button
            type="button"
            onClick={() => setChipLengkap((v) => !v)}
            className="h-7 px-2.5 rounded-full border border-[#CBD5E1] text-[11.5px] font-semibold text-[#475569] hover:border-[#00875A] hover:text-[#00875A] cursor-pointer"
          >
            {chipLengkap ? 'Ringkas' : `+${seri.length - BATAS_CHIP} lainnya`}
          </button>
        )}
        {mode === 'indikator' && (
          <span className="flex items-center gap-3 ml-1 text-[11.5px] font-semibold">
            {kpiSel.length < SEMUA_KPI.length && (
              <button type="button" onClick={() => onKpiSelChange(SEMUA_KPI)} className="text-[#00875A] hover:underline cursor-pointer">
                Pilih semua ({SEMUA_KPI.length})
              </button>
            )}
            {kpiSel.length > 1 && (
              <button
                type="button"
                onClick={() => onKpiSelChange([kpiSel[0]])}
                className="text-[#64748B] hover:text-[#DC2626] hover:underline cursor-pointer"
              >
                Hapus pilihan
              </button>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start gap-5">
        <div className="flex-1 min-w-0" style={{ height: tinggiGrafik }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
              <YAxis
                domain={[(min: number) => Math.floor(Math.min(min, 85) / 10) * 10, (max: number) => Math.ceil(Math.max(max, 110) / 10) * 10]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <ReferenceLine
                y={TARGET}
                stroke="#0F172A"
                strokeOpacity={0.4}
                strokeDasharray="4 3"
                label={{ value: 'Target 100', position: 'insideTopRight', fontSize: 10, fill: '#64748B' }}
              />
              {tunggal && <Area dataKey="rentang" stroke="none" fill="#94A3B8" fillOpacity={0.18} isAnimationActive={false} />}
              {seri.map((s) =>
                unitIdx >= 0 ? (
                  <React.Fragment key={s.key}>
                    {/* Rata-rata 34 P3DW sebagai pembanding (putus-putus) */}
                    <Line
                      dataKey={`r_${s.key}`}
                      stroke={tunggal ? '#94A3B8' : s.color}
                      strokeOpacity={tunggal ? 1 : 0.45 * opasitas(s.key)}
                      strokeWidth={1.5}
                      strokeDasharray="5 4"
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      dataKey={`u_${s.key}`}
                      stroke={s.color}
                      strokeOpacity={opasitas(s.key)}
                      strokeWidth={tebal(s.key)}
                      dot={titikGaris}
                      activeDot={sorot && sorot !== s.key ? false : { r: 5 }}
                      isAnimationActive={false}
                      {...sorotProps(s.key)}
                    />
                  </React.Fragment>
                ) : (
                  <Line
                    key={s.key}
                    dataKey={`r_${s.key}`}
                    stroke={s.color}
                    strokeOpacity={opasitas(s.key)}
                    strokeWidth={tebal(s.key)}
                    dot={titikGaris}
                    activeDot={sorot && sorot !== s.key ? false : { r: 5 }}
                    isAnimationActive={false}
                    {...sorotProps(s.key)}
                  />
                )
              )}
              <Tooltip
                cursor={{ stroke: '#CBD5E1' }}
                content={({ active, label }) => {
                  if (!active) return null;
                  const i = bulan.findIndex((b) => b.short === label);
                  if (i < 0) return null;
                  return (
                    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-lg text-[12px] min-w-[240px] max-w-[380px]">
                      <div className="font-semibold text-[#0F172A] mb-1">
                        {bulan[i].label}
                        {unitIdx >= 0 && <span className="font-normal text-[#64748B]"> · {unitNama}</span>}
                      </div>
                      {(padat ? [...seri].sort((a, b) => nilai(b.titik[i]) - nilai(a.titik[i])) : seri).map((s) => {
                        const t = s.titik[i];
                        return (
                          <div
                            key={s.key}
                            className={`flex items-center justify-between gap-3 ${padat ? 'text-[11px] leading-[1.45]' : ''} ${
                              sorot === s.key ? 'font-bold bg-[#F1F5F9] -mx-1 px-1 rounded' : ''
                            }`}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                              <span className="truncate text-[#334155]">{s.label}</span>
                            </span>
                            <span className="tabular-nums shrink-0">
                              <b style={{ color: warna(nilai(t)) }}>{fmt(nilai(t))}</b>
                              {t.unit !== undefined && <span className="text-[#94A3B8]"> / rata² {fmt(t.rata)}</span>}
                            </span>
                          </div>
                        );
                      })}
                      {tunggal && (
                        <>
                          <div className="flex justify-between gap-4 text-[#64748B] mt-1">
                            <span>Rentang 34 P3DW</span>
                            <span className="tabular-nums">
                              {fmt(seri[0].titik[i].min)} – {fmt(seri[0].titik[i].max)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 text-[#64748B]">
                            <span>Di bawah target</span>
                            <span className="tabular-nums">{seri[0].titik[i].diBawah} P3DW</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Ringkasan: rinci untuk satu seri, tabel ringkas untuk beberapa seri */}
        <div ref={sampingRef} className="xl:w-[360px] shrink-0">
          {tunggal ? (
            <RingkasanTunggal s={seri[0]} periode={periode} unit={unitIdx >= 0} />
          ) : (
            <div className="rounded-lg border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1fr)_40px_46px_42px] gap-2 px-3 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                <span>{mode === 'area' ? 'Area' : 'Indikator'}</span>
                <span className="text-right">{periode.short}</span>
                <span className="text-right">vs bln lalu</span>
                <span className="text-right">vs {bulan[0].short}</span>
              </div>
              {seri.map((s) => {
                const akhir = nilai(s.titik[n - 1]);
                return (
                  <div
                    key={s.key}
                    {...sorotProps(s.key)}
                    className={`grid grid-cols-[minmax(0,1fr)_40px_46px_42px] gap-2 items-center px-3 ${padat ? 'py-1.5' : 'py-2'} border-t border-[#E2E8F0] dark:border-[#334155] text-[12px] transition-colors ${
                      sorot === s.key ? 'bg-[#F1F5F9] dark:bg-white/5' : ''
                    }`}
                    title={s.info}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="truncate text-[#1E293B] dark:text-[#E2E8F0]">{s.label}</span>
                    </span>
                    <b className="text-right tabular-nums" style={{ color: warna(akhir) }}>
                      {fmt(akhir)}
                    </b>
                    <Selisih nilai={n > 1 ? akhir - nilai(s.titik[n - 2]) : undefined} kecil />
                    <Selisih nilai={n > 1 ? akhir - nilai(s.titik[0]) : undefined} kecil />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const RingkasanTunggal: React.FC<{ s: Seri; periode: PeriodeBulan; unit: boolean }> = ({ s, periode, unit }) => {
  const n = s.titik.length;
  const akhir = s.titik[n - 1];
  const v = (t: TitikSeri) => t.unit ?? t.rata;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">{s.info}</span>
        </div>
        <div className="text-[13.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{s.label}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Kotak judul={periode.label}>
          <div className="text-[20px] font-bold tabular-nums" style={{ color: warna(v(akhir)) }}>
            {fmt(v(akhir))}
          </div>
        </Kotak>
        <Kotak judul="vs bulan lalu">
          <Selisih nilai={n > 1 ? v(akhir) - v(s.titik[n - 2]) : undefined} />
        </Kotak>
        <Kotak judul={`vs ${PERIODE_LIST[0].label}`}>
          <Selisih nilai={n > 1 ? v(akhir) - v(s.titik[0]) : undefined} />
        </Kotak>
        {unit ? (
          <Kotak judul="Peringkat di 34 P3DW">
            <div className="text-[20px] font-bold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
              {akhir.peringkat}
              <span className="text-[13px] font-medium text-[#64748B]"> / 34</span>
            </div>
          </Kotak>
        ) : (
          <Kotak judul="Di bawah target">
            <div className="text-[20px] font-bold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
              {akhir.diBawah}
              <span className="text-[13px] font-medium text-[#64748B]"> P3DW</span>
            </div>
          </Kotak>
        )}
      </div>
      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
        Terendah {periode.short}: <b className="text-[#334155] dark:text-[#E2E8F0]">{akhir.minNama}</b> ({fmt(akhir.min)})
        <br />
        Tertinggi {periode.short}: <b className="text-[#334155] dark:text-[#E2E8F0]">{akhir.maxNama}</b> ({fmt(akhir.max)})
      </div>
    </div>
  );
};

const Kotak: React.FC<{ judul: string; children: React.ReactNode }> = ({ judul, children }) => (
  <div className="rounded-lg border border-[#E2E8F0] dark:border-[#334155] px-3 py-2.5">
    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{judul}</div>
    {children}
  </div>
);

const Selisih: React.FC<{ nilai?: number; kecil?: boolean }> = ({ nilai, kecil }) => {
  const size = kecil ? 'text-[12px] justify-end' : 'text-[20px]';
  if (nilai === undefined) return <div className={`flex font-bold text-[#94A3B8] ${size}`}>–</div>;
  const datar = Math.abs(nilai) < 0.05;
  const Icon = datar ? Minus : nilai > 0 ? ArrowUpRight : ArrowDownRight;
  const color = datar ? '#64748B' : nilai > 0 ? '#00875A' : '#DC2626';
  return (
    <div className={`flex items-center gap-0.5 font-bold tabular-nums ${size}`} style={{ color }}>
      {!kecil && <Icon className="w-4 h-4" strokeWidth={2.5} />}
      {fmtSelisih(nilai)}
    </div>
  );
};

// Dropdown pilih banyak indikator KPI, dikelompokkan per area, dengan pencarian
const PilihIndikator: React.FC<{ value: number[]; onChange: (v: number[]) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const q = query.toLowerCase().trim();
  const toggle = (no: number) => {
    if (value.includes(no)) {
      if (value.length > 1) onChange(value.filter((n) => n !== no));
    } else onChange([...value, no]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-72 h-10 px-3 flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#1E293B] hover:border-[#00875A] transition cursor-pointer"
        aria-expanded={open}
      >
        <span className="truncate">
          {value.length === 1
            ? KPI_DEFINITIONS.find((k) => k.no === value[0])?.no + '. ' + KPI_DEFINITIONS.find((k) => k.no === value[0])?.nama
            : value.length === SEMUA_KPI.length
              ? `Semua indikator (${SEMUA_KPI.length})`
              : `${value.length} indikator dipilih`}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-1 w-[380px] max-w-[90vw] rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
          <div className="p-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <Search className="w-4 h-4 text-[#94A3B8]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari indikator..."
                className="flex-1 bg-transparent outline-none text-[13px] text-[#1E293B]"
              />
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto py-1">
            {AREA_GROUPS.map((g) => {
              const items = KPI_DEFINITIONS.filter(
                (k) => k.area === g.id && (!q || `${k.no}. ${k.nama}`.toLowerCase().includes(q))
              );
              if (!items.length) return null;
              return (
                <div key={g.id}>
                  {/* Klik judul area: pilih/lepas semua KPI di area itu */}
                  <AreaHeader area={g.id} status={statusArea(value, g.id)} onClick={() => onChange(toggleAreaKpi(value, g.id))} />
                  {items.map((k) => {
                    const on = value.includes(k.no);
                    const terakhir = on && value.length === 1;
                    return (
                      <button
                        key={k.no}
                        type="button"
                        onClick={() => toggle(k.no)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12.5px] transition text-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-white/5 cursor-pointer"
                        title={on && value.length === 1 ? 'Minimal satu indikator' : undefined}
                      >
                        <span
                          className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                            on ? 'bg-[#00875A] border-[#00875A] text-white' : 'border-[#CBD5E1]'
                          } ${terakhir ? 'opacity-60' : ''}`}
                        >
                          {on && <Check className="w-3 h-3" strokeWidth={3} />}
                        </span>
                        <span className="truncate">
                          {k.no}. {k.nama}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#E2E8F0] text-[11.5px]">
            <span className="text-[#64748B]">
              {value.length} / {SEMUA_KPI.length} dipilih
            </span>
            <span className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange(SEMUA_KPI)}
              className="font-semibold text-[#00875A] hover:underline cursor-pointer disabled:text-[#CBD5E1] disabled:no-underline disabled:cursor-default"
              disabled={value.length === SEMUA_KPI.length}
            >
              Pilih semua
            </button>
            <button
              type="button"
              onClick={() => onChange([value[0]])}
              className="font-semibold text-[#00875A] hover:underline cursor-pointer disabled:text-[#CBD5E1] disabled:no-underline disabled:cursor-default"
              disabled={value.length === 1}
            >
              Sisakan satu
            </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const AreaHeader: React.FC<{ area: AreaKey; status: ReturnType<typeof statusArea>; onClick: () => void }> = ({
  area,
  status,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 pt-2.5 pb-1.5 text-left hover:bg-[#F1F5F9] dark:hover:bg-white/5 cursor-pointer group"
    title={status === 'semua' ? 'Lepas semua indikator di area ini' : 'Pilih semua indikator di area ini'}
  >
    <span
      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
        status === 'tidak' ? 'border-[#CBD5E1]' : 'bg-[#00875A] border-[#00875A] text-white'
      }`}
    >
      {status === 'semua' && <Check className="w-3 h-3" strokeWidth={3} />}
      {status === 'sebagian' && <Minus className="w-3 h-3" strokeWidth={3} />}
    </span>
    <span className="w-1.5 h-1.5 rounded-full" style={{ background: AREA_INFO[area].color }} />
    <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
      {AREA_INFO[area].kode}. {AREA_INFO[area].nama}
    </span>
    <span className="text-[10.5px] font-semibold text-[#00875A] opacity-0 group-hover:opacity-100">
      {status === 'semua' ? 'Lepas semua' : 'Pilih semua'}
    </span>
  </button>
);

export default TrenCapaianKpi;
