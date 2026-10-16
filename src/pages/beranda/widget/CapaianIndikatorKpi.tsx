import React, { useMemo, useState } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import { AREA_GROUPS, AreaKey, KPI_DEFINITIONS } from '@/services/dashboardMockData';
import { PeriodeBulan, getCapaianKpiSemua, getEvaluasiSemua } from '@/services/periodeData';
import TrenCapaianKpi, { AREA_INFO, TrenMode, fmt, rata, statusArea, toggleAreaKpi, warna } from './TrenCapaianKpi';

// Capaian tiap indikator KPI (nilai ÷ target × 100; arah turun: target ÷ nilai × 100) untuk 34 P3DW:
// 1) rata-rata per KPI pada periode terpilih, 2) tren bulanannya Januari s.d. periode terpilih.
// Cakupan bisa rata-rata 34 P3DW atau satu P3DW (dibandingkan dengan rata-rata 34 P3DW).

interface CapaianIndikatorKpiProps {
  periode: PeriodeBulan;
}

const SEMUA = 'semua';
const TARGET = 100;
const SKALA = 130; // lebar penuh batang = capaian 130

const fmtSelisih = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${fmt(Math.abs(v))}`;

interface StatKpi {
  idx: number;
  rata: number;
  min: number;
  max: number;
  minNama: string;
  maxNama: string;
  diBawah: number; // jumlah P3DW di bawah target
  unit?: number; // capaian P3DW terpilih
  peringkat?: number; // peringkat P3DW terpilih untuk KPI ini (1 = tertinggi)
}

export const CapaianIndikatorKpi: React.FC<CapaianIndikatorKpiProps> = ({ periode }) => {
  const [cakupan, setCakupan] = useState<string>(SEMUA);
  const [urut, setUrut] = useState<'kpi' | 'terendah'>('kpi');
  const [trenMode, setTrenMode] = useState<TrenMode>('indikator');
  const [kpiSel, setKpiSel] = useState<number[]>([1]);

  const evaluasi = getEvaluasiSemua(periode.key);
  const unitOptions = useMemo(
    () => [
      { label: 'Rata-rata 34 P3DW', value: SEMUA },
      ...[...evaluasi].sort((a, b) => a.nama.localeCompare(b.nama)).map((e) => ({ label: e.nama, value: e.id })),
    ],
    [evaluasi]
  );
  const unitIdx = cakupan === SEMUA ? -1 : evaluasi.findIndex((e) => e.id === cakupan);
  const unitNama = unitIdx >= 0 ? evaluasi[unitIdx].nama : 'Rata-rata 34 P3DW';

  // Statistik tiap KPI pada periode terpilih
  const stats = useMemo<StatKpi[]>(() => {
    const rows = getCapaianKpiSemua(periode.key);
    return KPI_DEFINITIONS.map((_, i) => {
      const col = rows.map((r) => r[i]);
      const min = Math.min(...col);
      const max = Math.max(...col);
      const stat: StatKpi = {
        idx: i,
        rata: rata(col),
        min,
        max,
        minNama: evaluasi[col.indexOf(min)].nama,
        maxNama: evaluasi[col.indexOf(max)].nama,
        diBawah: col.filter((v) => v < TARGET).length,
      };
      if (unitIdx >= 0) {
        stat.unit = col[unitIdx];
        stat.peringkat = col.filter((v) => v > col[unitIdx]).length + 1;
      }
      return stat;
    });
  }, [periode.key, evaluasi, unitIdx]);

  const nilai = (s: StatKpi) => s.unit ?? s.rata;
  const memenuhi = stats.filter((s) => nilai(s) >= TARGET).length;
  const terendah = stats.reduce((a, b) => (nilai(b) < nilai(a) ? b : a));

  // Kelompok baris: per area (urutan KPI) atau satu daftar dari capaian terendah
  const kelompok =
    urut === 'kpi'
      ? AREA_GROUPS.map((g) => ({
          id: g.id,
          area: g.id as AreaKey | undefined,
          judul: `${AREA_INFO[g.id].kode}. ${AREA_INFO[g.id].nama}`,
          color: AREA_INFO[g.id].color,
          items: stats.filter((s) => KPI_DEFINITIONS[s.idx].area === g.id),
        }))
      : [{ id: 'semua', area: undefined, judul: '', color: '', items: [...stats].sort((a, b) => nilai(a) - nilai(b)) }];

  // Judul area: pilih/lepas semua KPI area itu di grafik tren
  const toggleArea = (area: AreaKey) => {
    setKpiSel((prev) => (trenMode === 'indikator' ? toggleAreaKpi(prev, area) : toggleAreaKpi([], area)));
    setTrenMode('indikator');
    document.getElementById('tren-capaian-kpi')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // KPI di grafik tren: klik baris menambah/menghapus (minimal satu)
  const toggleKpi = (no: number) => {
    setTrenMode('indikator');
    setKpiSel((prev) => {
      if (trenMode !== 'indikator') return prev.includes(no) ? prev : [...prev, no];
      if (prev.includes(no)) return prev.length > 1 ? prev.filter((n) => n !== no) : prev;
      return [...prev, no];
    });
    // Bawa kartu tren ke layar bila berada di bawah
    document.getElementById('tren-capaian-kpi')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. RATA-RATA CAPAIAN TIAP INDIKATOR KPI */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl p-4 sm:p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold text-[#212121] dark:text-[#F8FAFC]">Rata-rata Capaian per Indikator KPI</h3>
            <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5 max-w-[720px]">
              Capaian = nilai ÷ target × 100 (KPI ↓ makin rendah makin baik: target ÷ nilai × 100), {periode.label}. Garis tegak
              = target 100. Klik KPI untuk menambahkan atau menghapusnya dari grafik tren.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3 shrink-0">
            <div>
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">Cakupan</div>
              <CustomSelect compact placeholder="Pilih P3DW" value={cakupan} options={unitOptions} onChange={setCakupan} className="w-60" />
            </div>
            <div>
              <div className="text-[10px] text-[#757575] font-semibold uppercase tracking-wider mb-1">Urutkan</div>
              <div className="flex h-10 rounded-lg border border-[#E2E8F0] dark:border-[#334155] p-0.5 bg-[#F8FAFC] dark:bg-[#0F172A]">
                {(
                  [
                    ['kpi', 'Per area'],
                    ['terendah', 'Terendah dulu'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setUrut(key)}
                    className={`px-3 rounded-md text-[12px] font-semibold transition cursor-pointer ${
                      urut === key
                        ? 'bg-white dark:bg-[#1E293B] text-[#00875A] shadow-sm'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#00875A]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-4 py-3">
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">KPI memenuhi target · {unitNama}</div>
            <div className="text-[20px] font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              {memenuhi}
              <span className="text-[13px] font-medium text-[#64748B]"> / {KPI_DEFINITIONS.length}</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-4 py-3">
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Rata-rata capaian seluruh KPI</div>
            <div className="text-[20px] font-bold tabular-nums" style={{ color: warna(rata(stats.map(nilai))) }}>
              {fmt(rata(stats.map(nilai)))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleKpi(KPI_DEFINITIONS[terendah.idx].no)}
            className="text-left rounded-lg bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#FECACA] dark:border-[#7F1D1D]/50 px-4 py-3 hover:border-[#DC2626] transition cursor-pointer min-w-0"
          >
            <div className="text-[11px] text-[#991B1B] dark:text-[#FCA5A5]">Capaian terendah</div>
            <div className="text-[13.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
              {KPI_DEFINITIONS[terendah.idx].no}. {KPI_DEFINITIONS[terendah.idx].nama}{' '}
              <span className="tabular-nums" style={{ color: warna(nilai(terendah)) }}>
                {fmt(nilai(terendah))}
              </span>
            </div>
          </button>
        </div>

        {/* Daftar KPI: dua kolom di layar lebar */}
        <div className="lg:columns-2 gap-8">
          {kelompok.map((g) => (
            <div key={g.id} className="break-inside-avoid mb-4">
              {g.area && (
                // Klik judul area: tampilkan/lepas semua KPI area ini di grafik tren
                <button
                  type="button"
                  onClick={() => toggleArea(g.area!)}
                  className="group w-full flex items-center gap-2 mb-1.5 px-2 py-0.5 -mx-0 rounded-md text-left hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03] cursor-pointer"
                  title="Tampilkan atau lepas semua KPI area ini di grafik tren"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <span className="flex-1 text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">{g.judul}</span>
                  <span className="text-[10.5px] font-semibold text-[#00875A] opacity-0 group-hover:opacity-100 transition-opacity">
                    {trenMode === 'indikator' && statusArea(kpiSel, g.area) === 'semua' ? 'Lepas semua dari tren' : 'Tampilkan semua di tren'}
                  </span>
                </button>
              )}
              {g.items.map((s) => {
                const def = KPI_DEFINITIONS[s.idx];
                const v = nilai(s);
                const aktif = trenMode === 'indikator' && kpiSel.includes(def.no);
                return (
                  <button
                    key={def.no}
                    type="button"
                    onClick={() => toggleKpi(def.no)}
                    title={`Rata-rata 34 P3DW ${fmt(s.rata)} · terendah ${fmt(s.min)} (${s.minNama}) · tertinggi ${fmt(s.max)} (${s.maxNama})`}
                    className={`w-full grid grid-cols-[minmax(0,1fr)_minmax(80px,150px)_44px_76px] items-center gap-3 px-2 py-1.5 rounded-md text-left transition cursor-pointer ${
                      aktif ? 'bg-[#E6F4EA] dark:bg-[#00875A]/15' : 'hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-[12.5px] text-[#1E293B] dark:text-[#E2E8F0] truncate">
                      {urut === 'terendah' && (
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                          style={{ background: AREA_INFO[def.area].color }}
                        />
                      )}
                      <span className="text-[#94A3B8] tabular-nums">{def.no}.</span> {def.nama}
                      {def.arah === 'turun' && <span className="text-[#94A3B8]"> ↓</span>}
                    </span>
                    {/* Batang capaian, garis tegak = target 100 */}
                    <span className="relative h-2 rounded-full bg-[#EEF2F6] dark:bg-[#334155]">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${Math.min(100, (v / SKALA) * 100)}%`, background: warna(v) }}
                      />
                      <span
                        className="absolute -top-1 -bottom-1 w-[2px] bg-[#0F172A]/50 dark:bg-white/50"
                        style={{ left: `${(TARGET / SKALA) * 100}%` }}
                      />
                    </span>
                    <span className="text-[12.5px] font-bold tabular-nums text-right" style={{ color: warna(v) }}>
                      {fmt(v)}
                    </span>
                    {s.unit !== undefined ? (
                      <span
                        className={`text-[11px] font-semibold tabular-nums text-right ${
                          s.unit - s.rata >= 0 ? 'text-[#00875A]' : 'text-[#DC2626]'
                        }`}
                        title="Selisih terhadap rata-rata 34 P3DW"
                      >
                        {fmtSelisih(s.unit - s.rata)} rata²
                      </span>
                    ) : (
                      <span
                        className={`text-[11px] tabular-nums text-right ${s.diBawah ? 'text-[#DC2626]' : 'text-[#00875A]'}`}
                        title="Jumlah P3DW di bawah target"
                      >
                        {s.diBawah ? `${s.diBawah} di bawah` : 'semua ≥ target'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-1">
          {unitIdx >= 0
            ? `Kolom kanan: selisih capaian ${unitNama} terhadap rata-rata 34 P3DW.`
            : 'Kolom kanan: jumlah P3DW yang capaiannya di bawah target. Arahkan kursor ke KPI untuk melihat P3DW terendah dan tertinggi.'}
        </p>
      </section>

      {/* 2. TREN RATA-RATA CAPAIAN: beberapa indikator KPI atau beberapa area */}
      <TrenCapaianKpi
        periode={periode}
        mode={trenMode}
        onModeChange={setTrenMode}
        kpiSel={kpiSel}
        onKpiSelChange={setKpiSel}
        cakupan={cakupan}
        onCakupanChange={setCakupan}
        unitOptions={unitOptions}
      />
    </div>
  );
};

export default CapaianIndikatorKpi;
