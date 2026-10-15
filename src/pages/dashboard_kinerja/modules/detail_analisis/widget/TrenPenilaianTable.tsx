import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import {
  AREA_GROUPS,
  AreaKey,
  KPI_DEFINITIONS,
  KpiDefinition,
  KpiHasil,
  KpiHitung,
  getPredikatBySkor,
  hitungKpi,
  mockTrenPenilaianTotal,
} from '@/services/dashboardMockData';

// Tree penilaian: Skor Akhir → 2 sumbu → 5 area → 24 KPI.
// Tombol i menampilkan rumus, sumber data, data mentah yang dipakai, dan rantai hitung nilai → skor → poin.

interface TrenPenilaianTableProps {
  totalSkor?: number;
}

type SumbuKey = 'sumbu_y' | 'sumbu_x';

const SUMBU: Record<SumbuKey, { nama: string; sub: string; mid: number; high: number; tone: 'y' | 'x' }> = {
  sumbu_y: { nama: 'Sumbu Y – Kinerja', sub: 'Kemandirian Keuangan Daerah', mid: 90, high: 100, tone: 'y' },
  sumbu_x: { nama: 'Sumbu X – Potensi', sub: 'Kualitas Pelayanan Publik', mid: 85, high: 95, tone: 'x' },
};

const AREA_CODE: Record<AreaKey, string> = { area_a: 'A', area_b: 'B', area_c: 'C', area_d: 'D', area_e: 'E' };

// Kolom: komponen | capaian vs target | batang | skor | poin
export const GRID = 'grid grid-cols-[minmax(260px,1fr)_150px_96px_64px_56px] gap-2.5 items-center';

export const fmt = (val: number) => (Math.round(val * 10) / 10).toFixed(1).replace('.', ',');
export const fmtBobot = (val: number) => `${String(Math.round(val * 10) / 10).replace('.', ',')}%`;

// Warna skor terhadap target: ≥ 100 hijau, 90–99,9 kuning, < 90 merah
const level = (skor: number) => (skor >= 100 ? 'high' : skor >= 90 ? 'mid' : 'low');
const CHIP: Record<string, string> = {
  high: 'bg-[#E6F4EA] text-[#00875A] dark:bg-[#00875A]/25 dark:text-[#34D399]',
  mid: 'bg-[#FEF3C7] text-[#B45309] dark:bg-[#D97706]/25 dark:text-[#FBBF24]',
  low: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/25 dark:text-[#F87171]',
};
const FILL: Record<string, string> = { high: 'bg-[#00875A]', mid: 'bg-[#D97706]', low: 'bg-[#DC2626]' };

export const ScoreChip: React.FC<{ skor: number }> = ({ skor }) => (
  <span className={`inline-block min-w-[48px] text-center px-2 py-1 rounded-md text-[12.5px] font-bold tabular-nums ${CHIP[level(skor)]}`}>
    {fmt(skor)}
  </span>
);

// Batang skala 0–120 dengan garis target di 100
export const ScoreBar: React.FC<{ skor: number }> = ({ skor }) => (
  <div className="relative h-2 rounded bg-[#E2E8F0] dark:bg-[#334155]">
    <div className={`h-2 rounded ${FILL[level(skor)]}`} style={{ width: `${(Math.min(120, Math.max(0, skor)) / 120) * 100}%` }} />
    <span className="absolute top-[-3px] h-[14px] w-[2px] bg-[#0F172A] dark:bg-[#F8FAFC] opacity-50" style={{ left: `${(100 / 120) * 100}%` }} />
  </div>
);

export const ToggleButton: React.FC<{ open: boolean; onClick: () => void; label: string; size?: 'md' | 'sm'; tone?: 'light' | 'muted' }> = ({
  open,
  onClick,
  label,
  size = 'sm',
  tone = 'muted',
}) => (
  <button
    type="button"
    aria-expanded={open}
    aria-label={label}
    onClick={onClick}
    className={`${size === 'md' ? 'w-8 h-8' : 'w-7 h-7'} shrink-0 rounded-lg flex items-center justify-center cursor-pointer transition ${
      tone === 'light'
        ? 'bg-white/70 hover:bg-white text-[#0F172A] dark:bg-white/10 dark:hover:bg-white/20 dark:text-[#F8FAFC]'
        : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] dark:bg-[#334155] dark:hover:bg-[#475569] dark:text-[#F8FAFC]'
    }`}
  >
    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
  </button>
);

interface KpiResult {
  def: KpiDefinition;
  hasil: KpiHasil;
  skor: number;
  poin: number;
}

// Angka data mentah: rupiah diringkas (jt/M/T), selain itu pemisah ribuan
const fmtData = (v: number, data: KpiHitung['data']) => {
  if (data !== 'Rp') return v.toLocaleString('id-ID');
  const [div, suf] = v >= 1e12 ? [1e12, 'T'] : v >= 1e9 ? [1e9, 'M'] : v >= 1e6 ? [1e6, 'jt'] : [1, ''];
  return `Rp ${(v / div).toLocaleString('id-ID', { minimumFractionDigits: div > 1 ? 1 : 0, maximumFractionDigits: 1 })}${suf ? ` ${suf}` : ''}`;
};

const fmtNilai = (v: number, satuan: KpiHitung['satuan']) => {
  if (satuan === 'inovasi' || satuan === 'kegiatan') return `${v.toLocaleString('id-ID')} ${satuan}`;
  if (satuan === 'menit') return `${fmt(v)} menit`;
  if (satuan === 'indeks') return fmt(v);
  // Persen kecil (mis. 1,96%) pakai 2 desimal agar selisih ke target tetap terlihat
  return Math.abs(v) < 10 ? `${v.toFixed(2).replace('.', ',')}%` : `${fmt(v)}%`;
};

const fmtAngka = (v: number) => String(Math.round(v * 100) / 100).replace('.', ',');

// Rincian hitung di panel info: data yang dipakai, lalu langkah nilai → skor → poin beserta hasilnya
const RincianHitung: React.FC<{ def: KpiDefinition; hasil: KpiHasil; skor: number; poin: number }> = ({ def, hasil, skor, poin }) => {
  const h = def.hitung;
  const dibatasi = hasil.skorMentah > def.batasAtas;
  const data = (v?: number) => fmtData(v ?? 0, h?.data);

  // Baris data mentah (label kiri, angka kanan)
  const dataRows: [string, string][] = !h
    ? []
    : h.jenis === 'langsung'
      ? [[h.pembilang, fmtNilai(hasil.nilai, h.satuan)]]
      : [
          [h.pembilang, data(hasil.pembilang)],
          [h.penyebut ?? '', data(hasil.penyebut)],
        ];

  const nilaiExpr = !h
    ? 'Indeks capaian (belum ada data mentah)'
    : h.jenis === 'langsung'
      ? 'Nilai terukur'
      : h.jenis === 'pertumbuhan'
        ? `(${data(hasil.pembilang)} − ${data(hasil.penyebut)}) ÷ ${data(hasil.penyebut)} × 100%`
        : `${data(hasil.pembilang)} ÷ ${data(hasil.penyebut)} × 100%`;
  const nilaiTeks = h ? fmtNilai(hasil.nilai, h.satuan) : `${fmt(hasil.nilai)}%`;
  const target = h ? fmtAngka(h.target) : '100';
  const nilaiAngka = fmtAngka(hasil.nilai);
  const skorExpr =
    def.arah === 'turun' ? `target ${target} ÷ nilai ${nilaiAngka} × 100` : `nilai ${nilaiAngka} ÷ target ${target} × 100`;

  const steps: { label: string; expr: string; hasil: string; note?: string }[] = [
    { label: 'Nilai', expr: nilaiExpr, hasil: nilaiTeks },
    {
      label: 'Skor',
      expr: dibatasi ? `${skorExpr} = ${fmt(hasil.skorMentah)}` : skorExpr,
      hasil: fmt(skor),
      note: dibatasi ? `dibatasi maks. ${def.batasAtas}` : `maks. ${def.batasAtas}`,
    },
    { label: 'Poin', expr: `skor ${fmt(skor)} × bobot ${fmtBobot(def.bobot)}`, hasil: fmt(poin) },
  ];

  return (
    <div className="mt-1 max-w-[640px] rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] overflow-hidden">
      {dataRows.length > 0 && (
        <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="text-[10.5px] font-bold tracking-wide text-[#64748B] dark:text-[#94A3B8] mb-1">DATA YANG DIPAKAI</div>
          {dataRows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-[12.5px]">
              <span>{label}</span>
              <b className="tabular-nums text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">{value}</b>
            </div>
          ))}
        </div>
      )}
      <div className="px-3 py-2">
        <div className="text-[10.5px] font-bold tracking-wide text-[#64748B] dark:text-[#94A3B8] mb-1">PERHITUNGAN</div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1.5 items-center text-[12.5px]">
          {steps.map((st, i) => (
            <React.Fragment key={st.label}>
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                {i + 1}. {st.label}
              </span>
              <span className="tabular-nums min-w-0">
                {st.expr}
                {st.note && <span className="text-[#94A3B8]"> ({st.note})</span>}
              </span>
              <b
                className={`justify-self-end tabular-nums whitespace-nowrap px-2 py-0.5 rounded-md ${
                  i === steps.length - 1
                    ? 'bg-[#00875A] text-white'
                    : 'bg-[#F1F5F9] text-[#0F172A] dark:bg-[#334155] dark:text-[#F8FAFC]'
                }`}
              >
                = {st.hasil}
              </b>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

interface GroupResult {
  bobot: number;
  poin: number;
  skor: number;
}

const summarize = (items: KpiResult[]): GroupResult => {
  const bobot = items.reduce((acc, k) => acc + k.def.bobot, 0);
  const poin = items.reduce((acc, k) => acc + k.poin, 0);
  return { bobot, poin, skor: (poin * 100) / bobot };
};

export const TrenPenilaianTable: React.FC<TrenPenilaianTableProps> = ({ totalSkor = 95.8 }) => {
  // Skala capaian contoh agar mengikuti skor akhir unit yang dibuka
  const factor = totalSkor ? Math.min(1.15, Math.max(0.45, totalSkor / mockTrenPenilaianTotal)) : 1;

  const kpis = useMemo<KpiResult[]>(
    () =>
      KPI_DEFINITIONS.map((def) => {
        const hasil = hitungKpi(def, def.capaian * factor);
        return { def, hasil, skor: hasil.skor, poin: (hasil.skor * def.bobot) / 100 };
      }),
    [factor]
  );

  const allIds = ['sumbu_y', 'sumbu_x', ...AREA_GROUPS.map((a) => a.id)];
  const [open, setOpen] = useState<Set<string>>(new Set(allIds));
  const [info, setInfo] = useState<Set<number>>(new Set());

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, key: T) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const predikat = getPredikatBySkor(totalSkor).predikat;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-6 font-roboto">
      {/* Judul & tombol buka/tutup semua */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">Tree Penilaian {KPI_DEFINITIONS.length} KPI</h3>
          <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">
            Dari skor akhir ke dua sumbu, lima area, dan {KPI_DEFINITIONS.length} KPI. Panah membuka cabang, tombol{' '}
            <span className="font-semibold">i</span> menampilkan rumus, data yang dipakai, dan perhitungan skornya.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(new Set(allIds))}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium text-[#00875A] dark:text-[#34D399] bg-[#E6F4EA] dark:bg-[#00875A]/20 border border-[#00875A]/20 hover:bg-[#D4EDDA] transition cursor-pointer"
          >
            <ChevronsUpDown size={14} /> Buka semua
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(new Set());
              setInfo(new Set());
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium text-[#475569] dark:text-[#E2E8F0] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] transition cursor-pointer"
          >
            <ChevronsDownUp size={14} /> Tutup semua
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px] flex flex-col gap-2">
          {/* Header kolom */}
          <div className={`${GRID} px-3.5 text-[11px] font-bold tracking-wide text-[#64748B] dark:text-[#94A3B8]`}>
            <span>KOMPONEN</span>
            <span className="text-right">NILAI / TARGET</span>
            <span>VS TARGET</span>
            <span className="text-right">SKOR</span>
            <span className="text-right">POIN</span>
          </div>

          {/* Skor akhir */}
          <div className={`${GRID} px-3.5 py-3 rounded-xl bg-[#00875A] text-white`}>
            <span className="text-[15px] font-bold">
              Skor Akhir · {predikat === 'Sangat baik' ? 'Sangat Baik' : predikat}
            </span>
            <span />
            <span />
            <span className="text-right text-[15px] font-bold tabular-nums">{fmt(totalSkor)}</span>
            <span className="text-right text-[15px] font-bold tabular-nums">{fmt(totalSkor)}</span>
          </div>

          {(Object.keys(SUMBU) as SumbuKey[]).map((sumbuId) => {
            const sb = SUMBU[sumbuId];
            const areas = AREA_GROUPS.filter((a) => a.sumbu === sumbuId);
            const sumbuRes = summarize(kpis.filter((k) => areas.some((a) => a.id === k.def.area)));
            const kategori = sumbuRes.skor >= sb.high ? 'Tinggi' : sumbuRes.skor >= sb.mid ? 'Sedang' : 'Rendah';
            const isOpen = open.has(sumbuId);
            const toneRow =
              sb.tone === 'y'
                ? 'bg-[#E6F4EA] text-[#00573A] dark:bg-[#00875A]/20 dark:text-[#6EE7B7]'
                : 'bg-[#E0F2FE] text-[#075985] dark:bg-[#0284C7]/20 dark:text-[#7DD3FC]';

            return (
              <div key={sumbuId} className="flex flex-col gap-1">
                <div className={`${GRID} px-3.5 py-2 rounded-xl ${toneRow}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <ToggleButton
                      open={isOpen}
                      onClick={() => toggle<string>(setOpen, sumbuId)}
                      label={`${isOpen ? 'Tutup' : 'Buka'} ${sb.nama}`}
                      size="md"
                      tone="light"
                    />
                    <span className="text-[14.5px] font-bold">{sb.nama}</span>
                    <span className="text-[12px] font-medium opacity-80 truncate">
                      {sb.sub} ({fmtBobot(sumbuRes.bobot)})
                    </span>
                  </div>
                  <span className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/70 dark:bg-white/10">
                      {kategori}
                    </span>
                  </span>
                  <span />
                  <span className="text-right text-[15px] font-bold tabular-nums">{fmt(sumbuRes.skor)}</span>
                  <span className="text-right text-[15px] font-bold tabular-nums">{fmt(sumbuRes.poin)}</span>
                </div>

                {isOpen && (
                  <div className="tkids ml-[26px]">
                    {areas.map((area) => {
                      const areaKpis = kpis.filter((k) => k.def.area === area.id);
                      const areaRes = summarize(areaKpis);
                      const areaOpen = open.has(area.id);
                      return (
                        <div key={area.id} className="tnode">
                          <div className={`${GRID} min-h-[46px] pl-1.5 pr-3.5`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <ToggleButton
                                open={areaOpen}
                                onClick={() => toggle<string>(setOpen, area.id)}
                                label={`${areaOpen ? 'Tutup' : 'Buka'} ${area.nama}`}
                              />
                              <span className="text-[14px] font-bold text-[#0F172A] dark:text-[#F8FAFC] min-w-0">
                                Area {AREA_CODE[area.id]} · {area.nama.replace(/^Area [A-E]: /, '')}{' '}
                                <span className="font-medium text-[#64748B] dark:text-[#94A3B8]">({fmtBobot(areaRes.bobot)})</span>
                              </span>
                            </div>
                            <span className="text-right text-[11px] text-[#94A3B8]">{areaKpis.length} KPI</span>
                            <ScoreBar skor={areaRes.skor} />
                            <span className="text-right">
                              <ScoreChip skor={areaRes.skor} />
                            </span>
                            <span className="text-right text-[13.5px] font-bold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
                              {fmt(areaRes.poin)}
                            </span>
                          </div>

                          {areaOpen && (
                            <div className="tkids">
                              {areaKpis.map(({ def, hasil, skor, poin }) => {
                                const infoOpen = info.has(def.no);
                                const h = def.hitung;
                                return (
                                  <div key={def.no} className="tnode">
                                    <div className={`${GRID} min-h-[46px] pl-1 pr-3.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03]`}>
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[13px] font-medium text-[#1E293B] dark:text-[#E2E8F0] min-w-0">
                                          {def.no}. {def.nama}
                                          {def.arah === 'turun' && <span title="Makin rendah makin baik"> ↓</span>}{' '}
                                          <span className="text-[#64748B] dark:text-[#94A3B8]">({fmtBobot(def.bobot)})</span>
                                        </span>
                                        <button
                                          type="button"
                                          aria-expanded={infoOpen}
                                          aria-label={`Rumus dan sumber data KPI ${def.no}`}
                                          onClick={() => toggle(setInfo, def.no)}
                                          className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                                        >
                                          <span
                                            className={`w-[18px] h-[18px] rounded-full text-white text-[11px] font-bold italic font-serif flex items-center justify-center transition ${
                                              infoOpen ? 'bg-[#00875A]' : 'bg-[#0284C7] hover:bg-[#0369A1]'
                                            }`}
                                          >
                                            i
                                          </span>
                                        </button>
                                      </div>
                                      <span className="text-right text-[12.5px] text-[#475569] dark:text-[#94A3B8] tabular-nums">
                                        <b className="text-[#0F172A] dark:text-[#F8FAFC]">{h ? fmtNilai(hasil.nilai, h.satuan) : `${fmt(hasil.nilai)}%`}</b> /{' '}
                                        {def.target}
                                      </span>
                                      <ScoreBar skor={skor} />
                                      <span className="text-right">
                                        <ScoreChip skor={skor} />
                                      </span>
                                      <span className="text-right text-[13px] font-semibold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
                                        {fmt(poin)}
                                      </span>
                                    </div>

                                    {infoOpen && (
                                      <div className="mx-3.5 mb-2 ml-9 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-3.5 py-2.5 flex flex-col gap-1 text-[12.5px] text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                                        <span>
                                          <b className="text-[#0F172A] dark:text-[#F8FAFC]">Rumus:</b> {def.rumus}
                                        </span>
                                        <span>
                                          <b className="text-[#0F172A] dark:text-[#F8FAFC]">Sumber data:</b> {def.sumber}
                                          {def.dasar && (
                                            <>
                                              {' · '}
                                              <b className="text-[#0F172A] dark:text-[#F8FAFC]">Dasar:</b> {def.dasar}
                                            </>
                                          )}
                                        </span>
                                        <span>
                                          <b className="text-[#0F172A] dark:text-[#F8FAFC]">Arah:</b>{' '}
                                          {def.arah === 'turun' ? 'makin rendah makin baik' : 'makin tinggi makin baik'}
                                        </span>
                                        <RincianHitung def={def} hasil={hasil} skor={skor} poin={poin} />
                                        {def.catatan && <span className="text-[#B45309] dark:text-[#FBBF24]">Catatan: {def.catatan}</span>}
                                        {def.target.includes('*') && (
                                          <span className="text-[#B45309] dark:text-[#FBBF24]">Target masih usulan dan perlu ditetapkan.</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keterangan warna */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t border-[#F1F5F9] dark:border-[#334155] text-[11.5px] text-[#475569] dark:text-[#CBD5E1]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#00875A]" />≥ 100: di atas target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#D97706]" />
          90–99,9: mendekati target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#DC2626]" />
          &lt; 90: di bawah target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-[2px] h-3 bg-[#0F172A] dark:bg-[#F8FAFC] opacity-50" />
          Garis target (100)
        </span>
        <span>↓ = makin rendah makin baik · * = target usulan</span>
      </div>
    </div>
  );
};

export default TrenPenilaianTable;
