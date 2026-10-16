// ============================================================================
// DATA PENILAIAN PER PERIODE (BULAN) TAHUN BERJALAN
// Sumber tunggal untuk tren area, riwayat posisi box, dan penilaian periode
// tertentu di halaman detail. Skor area bulanan masih data contoh: dibangkitkan
// konsisten per unit dan berakhir tepat di skor area periode berjalan
// (sama dengan dashboard). Y, X, skor akhir, box, dan peringkat dihitung dari
// skor area dengan rumus yang sama seperti dashboard.
// ============================================================================

import {
  AREA_GROUPS,
  AREA_WEIGHTS,
  AreaKey,
  KPI_DEFINITIONS,
  SUMBU_X_WEIGHT,
  SUMBU_Y_WEIGHT,
  Kategori,
  getBoxByCoordinates,
  getKategori,
  getPredikatBySkor,
  hitungKpi,
  mockLeaderboardData,
} from './dashboardMockData';

export const TAHUN = 2026;
export const BULAN_BERJALAN = 10; // Oktober

const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const SINGKAT_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

export interface PeriodeBulan {
  key: string; // "2026-06"
  index: number; // 0 = Januari
  nama: string; // "Juni"
  label: string; // "Juni 2026"
  short: string; // "Jun"
}

// Januari s.d. bulan berjalan
export const PERIODE_LIST: PeriodeBulan[] = Array.from({ length: BULAN_BERJALAN }, (_, i) => ({
  key: `${TAHUN}-${String(i + 1).padStart(2, '0')}`,
  index: i,
  nama: NAMA_BULAN[i],
  label: `${NAMA_BULAN[i]} ${TAHUN}`,
  short: SINGKAT_BULAN[i],
}));

export const PERIODE_BERJALAN = PERIODE_LIST[PERIODE_LIST.length - 1];

export const getPeriode = (key: string | null | undefined): PeriodeBulan =>
  PERIODE_LIST.find((p) => p.key === key) ?? PERIODE_BERJALAN;

export interface AreaScores {
  pendapatan: number;
  kepatuhan: number;
  pelayanan: number;
  tataKelola: number;
  sdm: number;
}

const AREA_ORDER: (keyof AreaScores)[] = ['pendapatan', 'kepatuhan', 'pelayanan', 'tataKelola', 'sdm'];

export interface EvaluasiPeriode extends AreaScores {
  id: string;
  nama: string;
  korwil: string;
  periode: PeriodeBulan;
  y: number;
  x: number;
  total: number;
  boxNumber: number;
  boxName: string;
  boxLabel: string;
  kinerjaLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  potensiLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  predikat: 'Sangat baik' | 'Baik' | 'Cukup' | 'Kurang';
  grade: 'A' | 'B' | 'C' | 'D';
  kategori: Kategori;
  peringkat: number;
}

// Pembangkit acak deterministik (mulberry32) agar data tiap unit selalu sama
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const round1 = (v: number) => Math.round(v * 10) / 10;

const seriesCache = new Map<string, AreaScores[]>();

// Skor area per bulan (indeks 0 = Januari): mundur dari skor periode berjalan
export function getAreaSeries(unitId: string): AreaScores[] {
  const cached = seriesCache.get(unitId);
  if (cached) return cached;

  const unit = mockLeaderboardData.find((u) => u.id === unitId) ?? mockLeaderboardData[0];
  const current: AreaScores = {
    pendapatan: unit.scorePendapatan,
    kepatuhan: unit.scoreKepatuhan,
    pelayanan: unit.scorePelayanan,
    tataKelola: unit.scoreTataKelola,
    sdm: unit.scoreSdm,
  };
  const rand = seeded(parseInt(unit.id, 10) || 1);
  const perArea = {} as Record<keyof AreaScores, number[]>;
  AREA_ORDER.forEach((key) => {
    const arr = new Array<number>(PERIODE_LIST.length);
    arr[arr.length - 1] = current[key];
    for (let i = arr.length - 2; i >= 0; i--) {
      arr[i] = round1(Math.max(55, Math.min(120, arr[i + 1] - (rand() - 0.4) * 4)));
    }
    perArea[key] = arr;
  });

  const series = PERIODE_LIST.map((_, i) =>
    Object.fromEntries(AREA_ORDER.map((key) => [key, perArea[key][i]])) as unknown as AreaScores
  );
  seriesCache.set(unitId, series);
  return series;
}

// Rumus sama dengan dashboard: Y, X, skor akhir, box, predikat, kategori
function hitung(areas: AreaScores) {
  const w = AREA_WEIGHTS;
  const poinY = areas.pendapatan * w.pendapatan + areas.kepatuhan * w.kepatuhan;
  const poinX = areas.pelayanan * w.pelayanan + areas.tataKelola * w.tataKelola + areas.sdm * w.sdm;
  const y = round1(poinY / SUMBU_Y_WEIGHT);
  const x = round1(poinX / SUMBU_X_WEIGHT);
  const total = round1(poinY + poinX);
  const box = getBoxByCoordinates(y, x);
  return { y, x, total, ...box, ...getPredikatBySkor(total), kategori: getKategori(box.boxNumber, total) };
}

const periodeCache = new Map<string, EvaluasiPeriode[]>();

// Penilaian seluruh 34 P3DW pada satu periode, lengkap dengan peringkat bulan itu
export function getEvaluasiSemua(periodeKey: string): EvaluasiPeriode[] {
  const periode = getPeriode(periodeKey);
  const cached = periodeCache.get(periode.key);
  if (cached) return cached;

  const list = mockLeaderboardData.map((unit) => {
    const areas = getAreaSeries(unit.id)[periode.index];
    return { id: unit.id, nama: unit.namaP3dw, korwil: unit.kanwil, periode, ...areas, ...hitung(areas), peringkat: 0 };
  });
  [...list]
    .sort((a, b) => b.total - a.total)
    .forEach((item, i) => {
      item.peringkat = i + 1;
    });
  periodeCache.set(periode.key, list);
  return list;
}

export const getEvaluasi = (unitId: string, periodeKey: string): EvaluasiPeriode =>
  getEvaluasiSemua(periodeKey).find((e) => e.id === unitId) ?? getEvaluasiSemua(periodeKey)[0];

// Riwayat penilaian unit per bulan (Januari s.d. bulan berjalan)
export const getRiwayat = (unitId: string): EvaluasiPeriode[] => PERIODE_LIST.map((p) => getEvaluasi(unitId, p.key));

// ----------------------------------------------------------------------------
// CAPAIAN TIAP INDIKATOR KPI PER UNIT & PERIODE
// Capaian contoh tiap KPI diskalakan dengan rasio skor area unit pada periode itu
// terhadap skor area contoh, sehingga KPI satu area bergerak bersama skor areanya.
// Dipakai tree penilaian di halaman detail dan ringkasan capaian KPI di dashboard.
// ----------------------------------------------------------------------------

const AREA_SKOR_KEY: Record<AreaKey, keyof AreaScores> = {
  area_a: 'pendapatan',
  area_b: 'kepatuhan',
  area_c: 'pelayanan',
  area_d: 'tataKelola',
  area_e: 'sdm',
};

// Skor area dari capaian contoh: Σ(min(batas atas, capaian) × bobot) ÷ Σ bobot
const SKOR_AREA_CONTOH = Object.fromEntries(
  AREA_GROUPS.map((g) => {
    const items = KPI_DEFINITIONS.filter((k) => k.area === g.id);
    const bobot = items.reduce((acc, k) => acc + k.bobot, 0);
    return [g.id, items.reduce((acc, k) => acc + Math.min(k.batasAtas, k.capaian) * k.bobot, 0) / bobot];
  })
) as Record<AreaKey, number>;

// Indeks capaian (sebelum batas atas) tiap KPI, urut sesuai KPI_DEFINITIONS
export const getIndeksKpi = (areas: AreaScores): number[] =>
  KPI_DEFINITIONS.map((def) => {
    const faktor = areas[AREA_SKOR_KEY[def.area]] / SKOR_AREA_CONTOH[def.area];
    return def.capaian * Math.min(1.25, Math.max(0.45, faktor));
  });

const capaianCache = new Map<string, number[][]>();

// Capaian tiap KPI (nilai ÷ target × 100, setelah pembulatan data mentah) seluruh 34 P3DW pada satu periode.
// Baris mengikuti urutan getEvaluasiSemua, kolom mengikuti urutan KPI_DEFINITIONS.
export function getCapaianKpiSemua(periodeKey: string): number[][] {
  const periode = getPeriode(periodeKey);
  const cached = capaianCache.get(periode.key);
  if (cached) return cached;
  const rows = getEvaluasiSemua(periode.key).map((e) =>
    getIndeksKpi(e).map((indeks, i) => round1(hitungKpi(KPI_DEFINITIONS[i], indeks).skorMentah))
  );
  capaianCache.set(periode.key, rows);
  return rows;
}
