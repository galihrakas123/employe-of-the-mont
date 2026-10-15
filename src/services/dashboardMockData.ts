// ============================================================================
// TALENT BOX KPI KEPALA PUSAT CABANG SAMSAT (BAPENDA JAWA BARAT)
// Standar Baku Berdasarkan Dokumen Resmi:
// Bobot usulan lembar "Penilaian KPI P3D" (diskusi 14 Okt 2026), 24 KPI:
// - Sumbu Y (Kinerja – Realisasi & Potensi Pajak): Meningkatnya Kemandirian Keuangan Daerah (55%)
//   Area A: Pendapatan (5 KPI, bobot 35%)
//   Area B: Kepatuhan WP (6 KPI, bobot 20%)
// - Sumbu X (Potensi – Layanan & Kepuasan Masyarakat): Meningkatnya Kualitas Pelayanan Publik (45%)
//   Area C: Pelayanan (5 KPI, bobot 20%)
//   Area D: Tata Kelola (3 KPI, bobot 10%)
//   Area E: SDM dan Koordinasi (5 KPI, bobot 15%)
//
// Rumus Skor Akhir: 0.55 * Skor Y + 0.45 * Skor X
// Batas Kategori Sumbu:
// - Kinerja (Y): Tinggi >= 100, Sedang 90-99.9, Rendah < 90
// - Potensi (X): Tinggi >= 95, Sedang 85-94.9, Rendah < 85
// ============================================================================

export interface P3dwScatterData {
  id: string;
  nama: string;
  x: number; // Sumbu X - Potensi (skala target 100, cutoffs: 85 & 95)
  y: number; // Sumbu Y - Kinerja (skala target 100, cutoffs: 90 & 100)
  box: string; // e.g. "Box 9 (Kapus of the Month)"
  boxNumber: number;
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';
  skorTotal: number;
  korwil?: string;
  kinerjaLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  potensiLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  pendapatan?: number;
  kepatuhan?: number;
  pelayanan?: number;
  tataKelola?: number;
  sdm?: number;
}

export interface P3dwLeaderboardData {
  id: string;
  kd_wil: string;
  peringkat: number;
  namaP3dw: string;
  namaPendek: string;
  korwilRomawi?: string;
  totalSkor: number;
  predikat: 'Sangat baik' | 'Baik' | 'Cukup' | 'Kurang';
  grade: 'A' | 'B' | 'C' | 'D';
  scorePendapatan: number; // 35%
  scoreKepatuhan: number;  // 20%
  scorePelayanan: number;  // 20%
  scoreTataKelola: number; // 10%
  scoreSdm: number;        // 15%
  pendapatanScore?: number;
  kepatuhanScore?: number;
  pelayananScore?: number;
  tataKelolaScore?: number;
  sdmScore?: number;
  // Backward-compatible alias fields:
  scoreA: number; // 35% Pendapatan
  scoreB: number; // 20% Kepatuhan
  scoreC: number; // 20% Pelayanan
  scoreD: number; // 10% Tata Kelola
  scoreE: number; // 15% SDM dan Koordinasi
  skorY: number;  // Kinerja (55%)
  skorX: number;  // Potensi (45%)
  boxNumber: number;
  boxName: string;
  klaster: 'Klaster Besar' | 'Klaster Sedang' | 'Klaster Kecil';
  kanwil: string;
}

export interface MapMarkerData {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  skor: number;
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';
  predikat: string;
  boxNumber: number;
}

// Helper resmi menentukan Box berdasarkan aturan baku dokumen
export function getBoxByCoordinates(y: number, x: number): {
  boxNumber: number;
  boxName: string;
  boxLabel: string;
  kinerjaLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  potensiLevel: 'Tinggi' | 'Sedang' | 'Rendah';
} {
  const isYTinggi = y >= 100;
  const isYSedang = y >= 90 && y < 100;
  const kinerjaLevel: 'Tinggi' | 'Sedang' | 'Rendah' = isYTinggi ? 'Tinggi' : isYSedang ? 'Sedang' : 'Rendah';

  const isXTinggi = x >= 95;
  const isXSedang = x >= 85 && x < 95;
  const potensiLevel: 'Tinggi' | 'Sedang' | 'Rendah' = isXTinggi ? 'Tinggi' : isXSedang ? 'Sedang' : 'Rendah';

  if (isYTinggi) {
    if (isXTinggi) return { boxNumber: 9, boxName: 'Kapus of the Month', boxLabel: 'Box 9 (Kapus of the Month)', kinerjaLevel, potensiLevel };
    if (isXSedang) return { boxNumber: 8, boxName: 'Strategic Contributor', boxLabel: 'Box 8 (Strategic Contributor)', kinerjaLevel, potensiLevel };
    return { boxNumber: 7, boxName: 'Maintain', boxLabel: 'Box 7 (Maintain)', kinerjaLevel, potensiLevel };
  } else if (isYSedang) {
    if (isXTinggi) return { boxNumber: 6, boxName: 'Growth Potential', boxLabel: 'Box 6 (Growth Potential)', kinerjaLevel, potensiLevel };
    if (isXSedang) return { boxNumber: 5, boxName: 'Core Contributor', boxLabel: 'Box 5 (Core Contributor)', kinerjaLevel, potensiLevel };
    return { boxNumber: 4, boxName: 'Develop', boxLabel: 'Box 4 (Develop)', kinerjaLevel, potensiLevel };
  } else {
    if (isXTinggi) return { boxNumber: 3, boxName: 'Potential Developee', boxLabel: 'Box 3 (Potential Developee)', kinerjaLevel, potensiLevel };
    if (isXSedang) return { boxNumber: 2, boxName: 'Monitor', boxLabel: 'Box 2 (Monitor)', kinerjaLevel, potensiLevel };
    return { boxNumber: 1, boxName: 'Priority Improvement', boxLabel: 'Box 1 (Priority Improvement)', kinerjaLevel, potensiLevel };
  }
}

export type Kategori = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';

// Kategori status unit (badge) dari posisi box dan skor akhir
export function getKategori(boxNumber: number, skorTotal: number): Kategori {
  if (boxNumber === 9 || skorTotal >= 110) return 'Sangat Baik';
  if (boxNumber === 8 || boxNumber === 6 || skorTotal >= 90) return 'Baik';
  if (boxNumber === 5 || boxNumber === 7 || boxNumber === 3 || skorTotal >= 70) return 'Cukup';
  if (boxNumber === 2 || boxNumber === 4) return 'Kurang';
  return 'Perlu Pembinaan';
}

// Helper predikat skor akhir sesuai tabel 3 Dokumen & referensi visual
export function getPredikatBySkor(skorAkhir: number): {
  predikat: 'Sangat baik' | 'Baik' | 'Cukup' | 'Kurang';
  grade: 'A' | 'B' | 'C' | 'D';
} {
  if (skorAkhir >= 110) return { predikat: 'Sangat baik', grade: 'A' };
  if (skorAkhir >= 90) return { predikat: 'Baik', grade: 'B' };
  if (skorAkhir >= 70) return { predikat: 'Cukup', grade: 'C' };
  return { predikat: 'Kurang', grade: 'D' };
}

// Mapping koordinat matematis skor (X & Y) ke posisi persentase visual grid 3x3
export function getGridCoordinates(x: number, y: number): { left: string; top: string } {
  // Sumbu X: Kolom 1 (<85), Kolom 2 (85..95), Kolom 3 (>=95)
  let posX = 50;
  if (x < 85) {
    const ratio = Math.max(0, Math.min(1, (x - 60) / (85 - 60)));
    posX = 6 + ratio * (28 - 6);
  } else if (x < 95) {
    const ratio = Math.max(0, Math.min(1, (x - 85) / (95 - 85)));
    posX = 38 + ratio * (62 - 38);
  } else {
    const ratio = Math.max(0, Math.min(1, (x - 95) / (120 - 95)));
    posX = 72 + ratio * (95 - 72);
  }

  // Sumbu Y: Baris 1 (>=100, atas), Baris 2 (90..100, tengah), Baris 3 (<90, bawah)
  let posY = 50;
  if (y >= 100) {
    const ratio = Math.max(0, Math.min(1, (y - 100) / (120 - 100)));
    posY = 28 - ratio * (28 - 6);
  } else if (y >= 90) {
    const ratio = Math.max(0, Math.min(1, (y - 90) / (100 - 90)));
    posY = 62 - ratio * (62 - 38);
  } else {
    const ratio = Math.max(0, Math.min(1, (y - 60) / (90 - 60)));
    posY = 94 - ratio * (94 - 72);
  }

  return { left: `${posX.toFixed(1)}%`, top: `${posY.toFixed(1)}%` };
}

// ----------------------------------------------------------------------------
// DATA MENTAH 34 P3DW SE-JAWA BARAT
// Dihitung 100% konsisten sesuai bobot pilar:
// Sumbu Y = (0.35 * Pendapatan + 0.20 * Kepatuhan) / 0.55
// Sumbu X = (0.20 * Pelayanan + 0.10 * TataKelola + 0.15 * SDM) / 0.45
// Skor Akhir = 0.55 * Y + 0.45 * X
// ----------------------------------------------------------------------------

interface RawP3dw {
  id: string;
  kd_wil: string;
  nama: string;
  namaPendek: string;
  kanwil: 'Korwil Bandung Raya' | 'Korwil Purwakarta' | 'Korwil Bogor' | 'Korwil Priangan Timur' | 'Korwil Ciayumajakuning';
  korwilRomawi: 'Korwil I' | 'Korwil II' | 'Korwil III' | 'Korwil IV' | 'Korwil V';
  klaster: 'Klaster Besar' | 'Klaster Sedang' | 'Klaster Kecil';
  lat: number;
  lng: number;
  scorePendapatan: number; // 35%
  scoreKepatuhan: number;  // 20%
  scorePelayanan: number;  // 20%
  scoreTataKelola: number; // 10%
  scoreSdm: number;        // 15%
}

export interface KorwilGroupInfo {
  name: 'Korwil Bandung Raya' | 'Korwil Purwakarta' | 'Korwil Bogor' | 'Korwil Priangan Timur' | 'Korwil Ciayumajakuning';
  count: number;
  branches: { kd_wil: string; nama: string }[];
}

export const korwilMasterData: KorwilGroupInfo[] = [
  {
    name: 'Korwil Bandung Raya',
    count: 7,
    branches: [
      { kd_wil: '12000', nama: 'P3D Wilayah Kota Bandung I Pajajaran' },
      { kd_wil: '12010', nama: 'P3D Wilayah Kota Bandung II Kawaluyaan' },
      { kd_wil: '12020', nama: 'P3D Wilayah Kota Bandung III Soekarno Hatta' },
      { kd_wil: '13100', nama: 'P3D Wilayah Kota Cimahi' },
      { kd_wil: '12300', nama: 'P3D Wilayah Kab Bandung Barat' },
      { kd_wil: '12400', nama: 'P3D Wilayah Kab Bandung I Rancaekek' },
      { kd_wil: '12410', nama: 'P3D Wilayah Kab Bandung II Soreang' },
    ],
  },
  {
    name: 'Korwil Purwakarta',
    count: 5,
    branches: [
      { kd_wil: '11100', nama: 'P3D Wilayah Kab Purwakarta' },
      { kd_wil: '11000', nama: 'P3D Wilayah Kab Karawang' },
      { kd_wil: '20800', nama: 'P3D Wilayah Kota Bekasi' },
      { kd_wil: '20900', nama: 'P3D Wilayah Kab Bekasi (Cikarang)' },
      { kd_wil: '11200', nama: 'P3D Wilayah Kab Subang' },
    ],
  },
  {
    name: 'Korwil Bogor',
    count: 8,
    branches: [
      { kd_wil: '10700', nama: 'P3D Wilayah Kab Cianjur' },
      { kd_wil: '10400', nama: 'P3D Wilayah Kota Sukabumi' },
      { kd_wil: '10500', nama: 'P3D Wilayah Kab Sukabumi I Cibadak' },
      { kd_wil: '10510', nama: 'P3D Wilayah Kab Sukabumi II Palabuan Ratu' },
      { kd_wil: '10300', nama: 'P3D Wilayah Kota Bogor' },
      { kd_wil: '10200', nama: 'P3D Wilayah Kab Bogor (Cibinong)' },
      { kd_wil: '20100', nama: 'P3D Wilayah Kota Depok I' },
      { kd_wil: '20110', nama: 'P3D Wilayah Kota Depok II Cinere' },
    ],
  },
  {
    name: 'Korwil Priangan Timur',
    count: 7,
    branches: [
      { kd_wil: '12500', nama: 'P3D Wilayah Kab Sumedang' },
      { kd_wil: '12600', nama: 'P3D Wilayah Kab Garut' },
      { kd_wil: '12800', nama: 'P3D Wilayah Kab Tasikmalaya (Sukaraja)' },
      { kd_wil: '12700', nama: 'P3D Wilayah Kota Tasikmalaya' },
      { kd_wil: '12900', nama: 'P3D Wilayah Kab Ciamis' },
      { kd_wil: '13300', nama: 'P3D Wilayah Kota Banjar' },
      { kd_wil: '12910', nama: 'P3D Wilayah Kab Pangandaran' },
    ],
  },
  {
    name: 'Korwil Ciayumajakuning',
    count: 7,
    branches: [
      { kd_wil: '11900', nama: 'P3D Wilayah Kab Majalengka' },
      { kd_wil: '11600', nama: 'P3D Wilayah Kab Indramayu I' },
      { kd_wil: '11610', nama: 'P3D Wilayah Kab Indramayu II (Haurgeulis)' },
      { kd_wil: '11300', nama: 'P3D Wilayah Kota Cirebon' },
      { kd_wil: '11400', nama: 'P3D Wilayah Kab Cirebon I (Sumber)' },
      { kd_wil: '11410', nama: 'P3D Wilayah Kab Cirebon II (Ciledug)' },
      { kd_wil: '11800', nama: 'P3D Wilayah Kab Kuningan' },
    ],
  },
];

const rawP3dwList: RawP3dw[] = [
  // 10 BESAR SESUAI GAMBAR REFERENSI LEADERBOARD
  { id: '12900', kd_wil: '12900', nama: 'P3D Wil. Kab. Ciamis', namaPendek: 'Kab. Ciamis', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Kecil', lat: -7.3274, lng: 108.3541, scorePendapatan: 116, scoreKepatuhan: 117, scorePelayanan: 114, scoreTataKelola: 115, scoreSdm: 111 },
  { id: '11600', kd_wil: '11600', nama: 'P3D Wil. Kab Indramayu I', namaPendek: 'Kab Indramayu I', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Sedang', lat: -6.3264, lng: 108.3200, scorePendapatan: 118, scoreKepatuhan: 109, scorePelayanan: 104, scoreTataKelola: 104, scoreSdm: 104 },
  { id: '10500', kd_wil: '10500', nama: 'P3D Wil. Kab. Sukabumi I Cibadak', namaPendek: 'Kab. Sukabumi I Cibadak', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Sedang', lat: -6.8920, lng: 106.7820, scorePendapatan: 107, scoreKepatuhan: 109, scorePelayanan: 111, scoreTataKelola: 112, scoreSdm: 102 },
  { id: '10700', kd_wil: '10700', nama: 'P3D Wil. Kab. Cianjur', namaPendek: 'Kab. Cianjur', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Sedang', lat: -6.8219, lng: 107.1397, scorePendapatan: 108, scoreKepatuhan: 109, scorePelayanan: 104, scoreTataKelola: 106, scoreSdm: 111 },
  { id: '20900', kd_wil: '20900', nama: 'P3D Wil. Kab. Bekasi - Cikarang', namaPendek: 'Kab. Bekasi - Cikarang', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Besar', lat: -6.2383, lng: 106.9756, scorePendapatan: 109, scoreKepatuhan: 104, scorePelayanan: 106, scoreTataKelola: 109, scoreSdm: 107 },
  { id: '12910', kd_wil: '12910', nama: 'P3D Wil. Kab. Pangandaran', namaPendek: 'Kab. Pangandaran', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Kecil', lat: -7.7011, lng: 108.4947, scorePendapatan: 116, scoreKepatuhan: 117, scorePelayanan: 92, scoreTataKelola: 93, scoreSdm: 95 },
  { id: '11410', kd_wil: '11410', nama: 'P3D Wil. Kab. Cirebon II Ciledug', namaPendek: 'Kab. Cirebon II Ciledug', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Kecil', lat: -6.9011, lng: 108.7210, scorePendapatan: 110, scoreKepatuhan: 113, scorePelayanan: 96, scoreTataKelola: 108, scoreSdm: 99 },
  { id: '11800', kd_wil: '11800', nama: 'P3D Wil. Kab. Kuningan', namaPendek: 'Kab. Kuningan', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Kecil', lat: -6.9760, lng: 108.4831, scorePendapatan: 116, scoreKepatuhan: 117, scorePelayanan: 91, scoreTataKelola: 96, scoreSdm: 91 },
  { id: '12020', kd_wil: '12020', nama: 'P3D Wil. Kota Bandung III Soetta', namaPendek: 'Kota Bandung III Soetta', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -6.9366, lng: 107.6011, scorePendapatan: 117, scoreKepatuhan: 120, scorePelayanan: 84, scoreTataKelola: 83, scoreSdm: 84 },
  { id: '11610', kd_wil: '11610', nama: 'P3D Wil. Kab Indramayu II Haurgeulis', namaPendek: 'Kab Indramayu II Haurgeulis', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Kecil', lat: -6.4520, lng: 108.0120, scorePendapatan: 113, scoreKepatuhan: 116, scorePelayanan: 91, scoreTataKelola: 91, scoreSdm: 91 },

  // CABANG 11 - 34 MELENGKAPI KESELURUHAN 34 CABANG P3DW SE-JABAR
  { id: '12000', kd_wil: '12000', nama: 'P3D Wil. Kota Bandung I Pajajaran', namaPendek: 'Kota Bandung I Pajajaran', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -6.9175, lng: 107.6050, scorePendapatan: 110, scoreKepatuhan: 112, scorePelayanan: 94, scoreTataKelola: 95, scoreSdm: 92 },
  { id: '12010', kd_wil: '12010', nama: 'P3D Wil. Kota Bandung II Kawaluyaan', namaPendek: 'Kota Bandung II Kawaluyaan', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -6.9412, lng: 107.6432, scorePendapatan: 108, scoreKepatuhan: 110, scorePelayanan: 95, scoreTataKelola: 92, scoreSdm: 93 },
  { id: '13100', kd_wil: '13100', nama: 'P3D Wil. Kota Cimahi', namaPendek: 'Kota Cimahi', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Sedang', lat: -6.8722, lng: 107.5422, scorePendapatan: 105, scoreKepatuhan: 108, scorePelayanan: 96, scoreTataKelola: 94, scoreSdm: 92 },
  { id: '11000', kd_wil: '11000', nama: 'P3D Wil. Kab. Karawang', namaPendek: 'Kab. Karawang', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Sedang', lat: -6.3227, lng: 107.3376, scorePendapatan: 106, scoreKepatuhan: 104, scorePelayanan: 94, scoreTataKelola: 92, scoreSdm: 94 },
  { id: '11100', kd_wil: '11100', nama: 'P3D Wil. Kab. Purwakarta', namaPendek: 'Kab. Purwakarta', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Sedang', lat: -6.5569, lng: 107.4433, scorePendapatan: 104, scoreKepatuhan: 102, scorePelayanan: 92, scoreTataKelola: 90, scoreSdm: 93 },
  { id: '11200', kd_wil: '11200', nama: 'P3D Wil. Kab. Subang', namaPendek: 'Kab. Subang', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Sedang', lat: -6.5716, lng: 107.7587, scorePendapatan: 102, scoreKepatuhan: 100, scorePelayanan: 90, scoreTataKelola: 92, scoreSdm: 90 },
  { id: '10300', kd_wil: '10300', nama: 'P3D Wil. Kota Bogor', namaPendek: 'Kota Bogor', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.5971, lng: 106.8060, scorePendapatan: 103, scoreKepatuhan: 101, scorePelayanan: 89, scoreTataKelola: 88, scoreSdm: 89 },
  { id: '10200', kd_wil: '10200', nama: 'P3D Wil. Kab. Bogor - Cibinong', namaPendek: 'Kab. Bogor - Cibinong', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.4811, lng: 106.8536, scorePendapatan: 102, scoreKepatuhan: 98, scorePelayanan: 88, scoreTataKelola: 90, scoreSdm: 88 },
  { id: '10400', kd_wil: '10400', nama: 'P3D Wil. Kota Sukabumi', namaPendek: 'Kota Sukabumi', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Sedang', lat: -6.9277, lng: 106.9300, scorePendapatan: 100, scoreKepatuhan: 96, scorePelayanan: 89, scoreTataKelola: 87, scoreSdm: 88 },
  { id: '20100', kd_wil: '20100', nama: 'P3D Wil. Kota Depok I', namaPendek: 'Kota Depok I', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.4025, lng: 106.7942, scorePendapatan: 101, scoreKepatuhan: 98, scorePelayanan: 87, scoreTataKelola: 86, scoreSdm: 88 },
  { id: '20110', kd_wil: '20110', nama: 'P3D Wil. Kota Depok II Cinere', namaPendek: 'Kota Depok II Cinere', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.3456, lng: 106.7820, scorePendapatan: 98, scoreKepatuhan: 96, scorePelayanan: 88, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '20800', kd_wil: '20800', nama: 'P3D Wil. Kota Bekasi', namaPendek: 'Kota Bekasi', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Besar', lat: -6.2349, lng: 106.9896, scorePendapatan: 96, scoreKepatuhan: 95, scorePelayanan: 86, scoreTataKelola: 88, scoreSdm: 85 },
  { id: '12300', kd_wil: '12300', nama: 'P3D Wil. Kab. Bandung Barat', namaPendek: 'Kab. Bandung Barat', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Sedang', lat: -6.8431, lng: 107.5050, scorePendapatan: 95, scoreKepatuhan: 93, scorePelayanan: 87, scoreTataKelola: 85, scoreSdm: 84 },
  { id: '12400', kd_wil: '12400', nama: 'P3D Wil. Kab. Bandung I Rancaekek', namaPendek: 'Kab. Bandung I Rancaekek', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -6.9712, lng: 107.7612, scorePendapatan: 93, scoreKepatuhan: 92, scorePelayanan: 84, scoreTataKelola: 83, scoreSdm: 84 },
  { id: '12410', kd_wil: '12410', nama: 'P3D Wil. Kab. Bandung II Soreang', namaPendek: 'Kab. Bandung II Soreang', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -7.0253, lng: 107.5198, scorePendapatan: 92, scoreKepatuhan: 90, scorePelayanan: 84, scoreTataKelola: 82, scoreSdm: 83 },
  { id: '12500', kd_wil: '12500', nama: 'P3D Wil. Kab. Sumedang', namaPendek: 'Kab. Sumedang', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Kecil', lat: -6.8580, lng: 107.9240, scorePendapatan: 89, scoreKepatuhan: 88, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '12600', kd_wil: '12600', nama: 'P3D Wil. Kab. Garut', namaPendek: 'Kab. Garut', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -7.2278, lng: 107.9087, scorePendapatan: 91, scoreKepatuhan: 90, scorePelayanan: 83, scoreTataKelola: 82, scoreSdm: 82 },
  { id: '12700', kd_wil: '12700', nama: 'P3D Wil. Kota Tasikmalaya', namaPendek: 'Kota Tasikmalaya', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -7.3274, lng: 108.2207, scorePendapatan: 84, scoreKepatuhan: 83, scorePelayanan: 96, scoreTataKelola: 95, scoreSdm: 95 },
  { id: '11300', kd_wil: '11300', nama: 'P3D Wil. Kota Cirebon', namaPendek: 'Kota Cirebon', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Sedang', lat: -6.7063, lng: 108.5570, scorePendapatan: 91, scoreKepatuhan: 90, scorePelayanan: 96, scoreTataKelola: 95, scoreSdm: 95 },
  { id: '11400', kd_wil: '11400', nama: 'P3D Wil. Kab Cirebon I Sumber', namaPendek: 'Kab Cirebon I Sumber', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Sedang', lat: -6.7320, lng: 108.5523, scorePendapatan: 83, scoreKepatuhan: 82, scorePelayanan: 88, scoreTataKelola: 86, scoreSdm: 87 },
  { id: '11900', kd_wil: '11900', nama: 'P3D Wil. Kab. Majalengka', namaPendek: 'Kab. Majalengka', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Kecil', lat: -6.8361, lng: 108.2278, scorePendapatan: 82, scoreKepatuhan: 81, scorePelayanan: 87, scoreTataKelola: 86, scoreSdm: 87 },
  { id: '13300', kd_wil: '13300', nama: 'P3D Wil. Kota Banjar', namaPendek: 'Kota Banjar', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Kecil', lat: -7.3736, lng: 108.5342, scorePendapatan: 80, scoreKepatuhan: 79, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '10510', kd_wil: '10510', nama: 'P3D Wil. Kab. Sukabumi II Pelabuhan Ratu', namaPendek: 'Kab. Sukabumi II Pelabuhan Ratu', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Kecil', lat: -6.9877, lng: 106.5412, scorePendapatan: 76, scoreKepatuhan: 75, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 85 },
  { id: '12800', kd_wil: '12800', nama: 'P3D Wil. Kab. Tasikmalaya - Sukaraja', namaPendek: 'Kab. Tasikmalaya - Sukaraja', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -7.3512, lng: 108.1120, scorePendapatan: 70, scoreKepatuhan: 68, scorePelayanan: 65, scoreTataKelola: 64, scoreSdm: 65 },
];

// Helper kalkulasi otomatis seluruh list dengan presisi tinggi
// Bobot inti per area (bobot usulan lembar Penilaian KPI P3D, diskusi 14 Okt 2026)
export const AREA_WEIGHTS = {
  pendapatan: 0.35,
  kepatuhan: 0.20,
  pelayanan: 0.20,
  tataKelola: 0.10,
  sdm: 0.15,
} as const;
export const SUMBU_Y_WEIGHT = AREA_WEIGHTS.pendapatan + AREA_WEIGHTS.kepatuhan; // 0.55
export const SUMBU_X_WEIGHT = AREA_WEIGHTS.pelayanan + AREA_WEIGHTS.tataKelola + AREA_WEIGHTS.sdm; // 0.45

const calculatedP3dwList = rawP3dwList.map((raw) => {
  const w = AREA_WEIGHTS;
  const poinY = raw.scorePendapatan * w.pendapatan + raw.scoreKepatuhan * w.kepatuhan;
  const poinX = raw.scorePelayanan * w.pelayanan + raw.scoreTataKelola * w.tataKelola + raw.scoreSdm * w.sdm;
  // Sumbu Y = (0.35 * Pendapatan + 0.20 * Kepatuhan) / 0.55
  const y = Math.round((poinY / SUMBU_Y_WEIGHT) * 10) / 10;
  // Sumbu X = (0.20 * Pelayanan + 0.10 * TataKelola + 0.15 * SDM) / 0.45
  const x = Math.round((poinX / SUMBU_X_WEIGHT) * 10) / 10;
  // Skor Akhir = 0.35 * A + 0.20 * B + 0.20 * C + 0.10 * D + 0.15 * E
  const skorTotal = Math.round((poinY + poinX) * 10) / 10;

  const boxInfo = getBoxByCoordinates(y, x);
  const predikatInfo = getPredikatBySkor(skorTotal);

  const kategori = getKategori(boxInfo.boxNumber, skorTotal);

  return {
    ...raw,
    y,
    x,
    skorTotal,
    ...boxInfo,
    ...predikatInfo,
    kategori,
  };
});

// Urutkan leaderboard berdasarkan skor akhir tertinggi
export const mockLeaderboardData: P3dwLeaderboardData[] = [...calculatedP3dwList]
  .sort((a, b) => b.skorTotal - a.skorTotal)
  .map((item, index) => ({
    id: item.id,
    kd_wil: item.kd_wil,
    peringkat: index + 1,
    namaP3dw: item.nama,
    namaPendek: item.namaPendek,
    korwilRomawi: item.korwilRomawi,
    totalSkor: item.skorTotal,
    predikat: item.predikat,
    grade: item.grade,
    scorePendapatan: item.scorePendapatan,
    scoreKepatuhan: item.scoreKepatuhan,
    scorePelayanan: item.scorePelayanan,
    scoreTataKelola: item.scoreTataKelola,
    scoreSdm: item.scoreSdm,
    pendapatanScore: item.scorePendapatan,
    kepatuhanScore: item.scoreKepatuhan,
    pelayananScore: item.scorePelayanan,
    tataKelolaScore: item.scoreTataKelola,
    sdmScore: item.scoreSdm,
    scoreA: item.scorePendapatan,
    scoreB: item.scoreKepatuhan,
    scoreC: item.scorePelayanan,
    scoreD: item.scoreTataKelola,
    scoreE: item.scoreSdm,
    skorY: item.y,
    skorX: item.x,
    boxNumber: item.boxNumber,
    boxName: item.boxName,
    klaster: item.klaster,
    kanwil: item.kanwil,
  }));

// Data titik scatter matriks 9-box
export const mockScatterData: P3dwScatterData[] = calculatedP3dwList.map((item) => ({
  id: item.id,
  nama: item.nama,
  x: item.x,
  y: item.y,
  box: item.boxLabel,
  boxNumber: item.boxNumber,
  kategori: item.kategori,
  skorTotal: item.skorTotal,
  korwil: item.kanwil,
  kinerjaLevel: item.kinerjaLevel,
  potensiLevel: item.potensiLevel,
  pendapatan: item.scorePendapatan,
  kepatuhan: item.scoreKepatuhan,
  pelayanan: item.scorePelayanan,
  tataKelola: item.scoreTataKelola,
  sdm: item.scoreSdm,
}));

// Marker peta sebaran
export const mockMapMarkers: MapMarkerData[] = calculatedP3dwList.map((item) => ({
  id: item.id,
  nama: item.nama,
  lat: item.lat,
  lng: item.lng,
  skor: item.skorTotal,
  kategori: item.kategori,
  predikat: item.grade,
  boxNumber: item.boxNumber,
}));

// KPI Top Cards dinamis hasil agregasi 34 cabang
const avgSkor = (calculatedP3dwList.reduce((acc, curr) => acc + curr.skorTotal, 0) / calculatedP3dwList.length).toFixed(1);
const countBox9 = calculatedP3dwList.filter((c) => c.boxNumber === 9).length;
const countBox1 = calculatedP3dwList.filter((c) => c.boxNumber === 1).length;
const avgPkb = (calculatedP3dwList.reduce((acc, curr) => acc + curr.scorePendapatan, 0) / calculatedP3dwList.length).toFixed(1);

export const mockDashboardMetrics = {
  rataRataKpi: avgSkor,
  rataRataSub: 'Rata-rata 34 P3DW se-Jawa Barat',
  cabangBintang: countBox9.toString(),
  cabangBintangSub: 'Peraih Kapus of the Month (Box 9)',
  realisasiPku: `${avgPkb}%`,
  realisasiPkuSub: 'Rata-rata skor Area A (pertumbuhan PKB, BBNKB, PAP, PAB)',
  unitPerhatian: countBox1.toString(),
  unitPerhatianSub: 'Prioritas pembinaan (Box 1)',
};

export interface MapLocationItem {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';
  score: number;
}

export const mockMapLocations: MapLocationItem[] = [
  { id: '1', name: 'Kota Bandung I', x: 44, y: 55, status: 'Sangat Baik', score: 112.4 },
  { id: '2', name: 'Kota Bekasi', x: 26, y: 35, status: 'Sangat Baik', score: 109.8 },
  { id: '3', name: 'Kota Bogor', x: 22, y: 48, status: 'Baik', score: 106.2 },
  { id: '4', name: 'Kab. Bekasi', x: 30, y: 34, status: 'Baik', score: 102.5 },
  { id: '5', name: 'Kota Cirebon', x: 78, y: 45, status: 'Baik', score: 98.4 },
  { id: '6', name: 'Kab. Karawang', x: 36, y: 32, status: 'Baik', score: 96.1 },
  { id: '7', name: 'Kota Sukabumi', x: 25, y: 65, status: 'Cukup', score: 87.5 },
  { id: '8', name: 'Kab. Garut', x: 55, y: 72, status: 'Cukup', score: 84.6 },
  { id: '9', name: 'Kota Tasikmalaya', x: 68, y: 72, status: 'Kurang', score: 79.2 },
  { id: '10', name: 'Kab. Pangandaran', x: 82, y: 85, status: 'Kurang', score: 74.8 },
];

export const mockKpiTopCards = [
  {
    title: 'Rata-rata Skor Akhir',
    value: avgSkor,
    total: '/ 120',
    subtitle: 'Gabungan 5 Area (34 P3DW)',
    topColor: 'border-t-emerald-500',
    iconColor: 'text-emerald-600 bg-emerald-50',
    type: 'activity',
  },
  {
    title: 'Kapus of the Month',
    value: countBox9.toString(),
    unit: 'P3DW',
    subtitle: 'Kuadran Box 9 (Kinerja & Potensi Unggul)',
    topColor: 'border-t-purple-500',
    iconColor: 'text-purple-600 bg-purple-50',
    type: 'star',
  },
  {
    title: 'Capaian Area Pendapatan',
    value: `${avgPkb}%`,
    subtitle: 'Rata-rata capaian 34 P3DW s.d. Oktober',
    topColor: 'border-t-blue-500',
    iconColor: 'text-blue-600 bg-blue-50',
    type: 'dollar',
  },
  {
    title: 'Unit Perlu Perhatian',
    value: countBox1.toString(),
    unit: 'P3DW',
    subtitle: 'Box 1 – Priority Improvement',
    topColor: 'border-t-rose-500',
    iconColor: 'text-rose-600 bg-rose-50',
    type: 'alert',
  },
];

// Profile Kepala Cabang untuk Detail Analisis
export const mockDetailProfile = {
  title: 'Detail Analisis: Kota Bandung I',
  subtitle: 'Skor Akhir: 104.1 (Peringkat 1) | Box 9 – Kapus of the Month',
  namaKepala: 'Ahmad Fauzi, S.Kom, M.M',
  subKepala: 'Kepala Pusat Pengelolaan Pendapatan Daerah Wilayah Kota Bandung I',
  nip: '19820412 200604 1 008',
  pangkat: 'Pembina (IV/a)',
  jabatan: 'Kepala Pusat Pengelolaan Pendapatan Daerah Wilayah (P3DW)',
  unitKerja: 'P3DW Kota Bandung I (Pajajaran)',
  korwil: 'Korwil II (Bandung Raya)',
  masaJabatan: '2 tahun 4 bulan',
  pendidikan: 'S2 Magister Manajemen, Univ. Padjadjaran',
  sertifikasi: 'Sertifikasi Pengadaan Barang & Jasa (PBJ) Terverifikasi',
  jumlahPegawai: '54 Pegawai',
  kontak: 'p3dw.bandung1@bapenda.jabarprov.go.id | (022) 2501234',
};

// ----------------------------------------------------------------------------
// RINCIAN 24 KPI KEPALA P3DW
// Bobot komponen mengikuti kolom "Bobot usulan" lembar Penilaian KPI P3D (diskusi 14 Okt 2026).
// Target bertanda * masih berupa usulan dan perlu ditetapkan.
// ----------------------------------------------------------------------------
export type AreaKey = 'area_a' | 'area_b' | 'area_c' | 'area_d' | 'area_e';

export interface KpiDefinition {
  no: number;
  area: AreaKey;
  nama: string;
  target: string;
  arah: 'naik' | 'turun'; // naik: makin tinggi makin baik, turun: makin rendah makin baik
  bobot: number; // bobot komponen (% dari skor akhir)
  batasAtas: 100 | 120;
  capaian: number; // capaian ÷ target × 100 (arah turun: target ÷ capaian × 100), contoh Kota Bandung I
  rumus: string;
  sumber: string;
  dasar?: string; // dasar penilaian (IKU Kaban, Kepgub Intensifikasi, SOP, dst.)
  catatan?: string; // hal yang masih perlu diputuskan
  hitung?: KpiHitung; // data mentah untuk KPI yang bisa langsung dihitung
}

// Cara menghitung nilai KPI dari data mentah:
// - rasio: pembilang ÷ penyebut × 100%
// - pertumbuhan: (tahun ini − tahun lalu) ÷ tahun lalu × 100%
// - langsung: nilai terukur dipakai apa adanya (indeks, menit, jumlah)
export interface KpiHitung {
  jenis: 'rasio' | 'pertumbuhan' | 'langsung';
  target: number; // target numerik dalam satuan nilai
  satuan: '%' | 'indeks' | 'menit' | 'inovasi' | 'kegiatan';
  pembilang: string;
  penyebut?: string;
  data?: 'Rp' | 'unit' | 'transaksi' | 'review' | 'temuan' | 'tahap' | 'nilai';
  basis?: number; // penyebut (rasio) atau realisasi tahun lalu (pertumbuhan), contoh Kota Bandung I
  maks?: number; // nilai tertinggi yang mungkin (mis. 100% untuk penyelesaian temuan)
}

export interface KpiHasil {
  nilai: number; // nilai KPI dalam satuan target
  skor: number; // setelah batas atas
  skorMentah: number; // sebelum batas atas
  pembilang?: number;
  penyebut?: number;
}

// Pembulatan data mentah sesuai cara tampilnya, agar hitungan di tabel bisa dicek ulang
const bulatkanData = (v: number, data: KpiHitung['data']) => {
  if (data !== 'Rp') return Math.round(v);
  const step = v >= 1e12 ? 1e11 : v >= 1e9 ? 1e8 : v >= 1e6 ? 1e5 : 1e3;
  return Math.round(v / step) * step;
};

// Hitung nilai, skor, dan data mentah KPI dari indeks capaian contoh (skor sebelum batas atas).
// Data mentah dibentuk mundur dari indeks, lalu nilai & skor dihitung ulang dari data yang sudah dibulatkan.
export function hitungKpi(def: KpiDefinition, indeks: number): KpiHasil {
  const h = def.hitung;
  const skorDari = (nilai: number, target: number) => {
    const mentah = def.arah === 'naik' ? (nilai / target) * 100 : nilai > 0 ? (target / nilai) * 100 : def.batasAtas;
    return { skorMentah: mentah, skor: Math.max(0, Math.min(def.batasAtas, mentah)) };
  };
  if (!h) {
    return { nilai: indeks, skorMentah: indeks, skor: Math.max(0, Math.min(def.batasAtas, indeks)) };
  }
  const tujuan = def.arah === 'naik' ? (h.target * indeks) / 100 : (h.target * 100) / indeks;

  if (h.jenis === 'langsung') {
    const nilai = h.satuan === 'inovasi' || h.satuan === 'kegiatan' ? Math.max(0, Math.round(tujuan)) : Math.round(tujuan * 10) / 10;
    return { nilai, ...skorDari(nilai, h.target) };
  }

  const basis = h.basis ?? 100;
  if (h.jenis === 'pertumbuhan') {
    const kini = bulatkanData(basis * (1 + tujuan / 100), h.data);
    const nilai = ((kini - basis) / basis) * 100;
    return { nilai, pembilang: kini, penyebut: basis, ...skorDari(nilai, h.target) };
  }

  let pembilang = bulatkanData((tujuan / 100) * basis, h.data);
  if (h.maks !== undefined) pembilang = Math.min(pembilang, bulatkanData((h.maks / 100) * basis, h.data));
  const nilai = (pembilang / basis) * 100;
  return { nilai, pembilang, penyebut: basis, ...skorDari(nilai, h.target) };
}

export const KPI_DEFINITIONS: KpiDefinition[] = [
  // SUMBU Y – KINERJA (55%)
  // Area A: Pendapatan (35%)
  { no: 1, area: 'area_a', nama: 'Capaian Realisasi PKB', target: '100%', arah: 'naik', bobot: 9, batasAtas: 120, capaian: 112.0, rumus: 'Realisasi PKB ÷ target tahun berjalan × 100%', sumber: 'Sistem Samsat / e-Samsat', dasar: 'IKU Kaban', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Realisasi PKB', penyebut: 'Target PKB', data: 'Rp', basis: 368_400_000_000 } },
  { no: 2, area: 'area_a', nama: 'Pertumbuhan PKB (YoY)', target: '≥ 5%', arah: 'naik', bobot: 9, batasAtas: 120, capaian: 110.0, rumus: '(Realisasi tahun berjalan − realisasi tahun lalu) ÷ realisasi tahun lalu × 100%', sumber: 'Sistem Samsat / e-Samsat', dasar: 'IKU Kaban', hitung: { jenis: 'pertumbuhan', target: 5, satuan: '%', pembilang: 'Realisasi PKB 2026', penyebut: 'Realisasi PKB 2025', data: 'Rp', basis: 351_000_000_000 } },
  { no: 3, area: 'area_a', nama: 'Capaian Realisasi BBNKB', target: '100%', arah: 'naik', bobot: 7, batasAtas: 120, capaian: 108.0, rumus: 'Realisasi BBNKB ÷ target tahun berjalan × 100%', sumber: 'Sistem Samsat / e-Samsat', dasar: 'IKU Kaban', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Realisasi BBNKB', penyebut: 'Target BBNKB', data: 'Rp', basis: 142_500_000_000 } },
  { no: 4, area: 'area_a', nama: 'Capaian Realisasi PAP', target: '100%', arah: 'naik', bobot: 5, batasAtas: 120, capaian: 104.0, rumus: 'Realisasi PAP ÷ target tahun berjalan × 100%', sumber: 'Sistem Samsat / e-Samsat', dasar: 'IKU Kaban', catatan: 'Belum ditetapkan: bila P3DW tidak punya potensi PAP, bobot 5% dialihkan ke mana.', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Realisasi PAP', penyebut: 'Target PAP', data: 'Rp', basis: 2_400_000_000 } },
  { no: 5, area: 'area_a', nama: 'Capaian Realisasi PAB', target: '100%', arah: 'naik', bobot: 5, batasAtas: 120, capaian: 101.0, rumus: 'Realisasi PAB ÷ target tahun berjalan × 100%', sumber: 'Sistem Samsat / e-Samsat', dasar: 'IKU Kaban', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Realisasi PAB', penyebut: 'Target PAB', data: 'Rp', basis: 1_800_000_000 } },
  // Area B: Kepatuhan WP (20%)
  { no: 6, area: 'area_b', nama: 'Rasio Kepatuhan Daftar Ulang', target: '≥ 75%', arah: 'naik', bobot: 5, batasAtas: 120, capaian: 101.5, rumus: 'Ranmor yang bayar daftar ulang tepat waktu ÷ ranmor terdaftar (potensi) × 100%', sumber: 'Database ranmor', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 75, satuan: '%', pembilang: 'Ranmor bayar tepat waktu', penyebut: 'Ranmor terdaftar', data: 'unit', basis: 412_350 } },
  { no: 7, area: 'area_b', nama: 'Efektivitas Penelusuran Atos Pamor', target: '≥ 40%*', arah: 'naik', bobot: 2, batasAtas: 120, capaian: 105.0, rumus: 'KBM yang membayar ÷ KBM yang telah ditelusuri × 100%', sumber: 'Data Atos Pamor', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 40, satuan: '%', pembilang: 'KBM membayar', penyebut: 'KBM ditelusuri', data: 'unit', basis: 3_200 } },
  { no: 8, area: 'area_b', nama: 'Efektivitas Penelusuran Panah Pasopati', target: '≥ 40%*', arah: 'naik', bobot: 3, batasAtas: 120, capaian: 102.0, rumus: 'KBM yang membayar ÷ KBM yang telah ditelusuri × 100%', sumber: 'Data Panah Pasopati', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 40, satuan: '%', pembilang: 'KBM membayar', penyebut: 'KBM ditelusuri', data: 'unit', basis: 2_450 } },
  { no: 9, area: 'area_b', nama: 'Pengendalian KBMDU', target: '≤ 2%/bln*', arah: 'turun', bobot: 6, batasAtas: 120, capaian: 103.0, rumus: 'Laju pertumbuhan KBMDU per bulan ÷ potensi taat tahun sebelumnya × 100%', sumber: 'Database ranmor', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 2, satuan: '%', pembilang: 'Pertambahan KBMDU bulan ini', penyebut: 'Potensi taat 2025', data: 'unit', basis: 380_000 } },
  { no: 10, area: 'area_b', nama: 'Realisasi Opsgab + Opsus', target: '≥ 5%*', arah: 'naik', bobot: 3, batasAtas: 120, capaian: 99.0, rumus: 'KBM yang terjaring saat Opsgab dan Opsus ÷ total KBMDU + KTMDU × 100%', sumber: 'Bidang PP', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 5, satuan: '%', pembilang: 'KBM terjaring Opsgab + Opsus', penyebut: 'KBMDU + KTMDU', data: 'unit', basis: 48_600 } },
  { no: 11, area: 'area_b', nama: 'Kepatuhan Pajak WP ASN', target: '≥ 90%*', arah: 'naik', bobot: 1, batasAtas: 120, capaian: 96.0, rumus: 'KBM WP ASN yang patuh ÷ potensi KBM WP ASN × 100%', sumber: 'Zonita Pamor Kab/Kota', dasar: 'Kepgub Intensifikasi', hitung: { jenis: 'rasio', target: 90, satuan: '%', pembilang: 'KBM WP ASN patuh', penyebut: 'Potensi KBM WP ASN', data: 'unit', basis: 18_400 } },

  // SUMBU X – POTENSI (45%)
  // Area C: Pelayanan (20%)
  { no: 12, area: 'area_c', nama: 'Indeks Kepuasan Masyarakat (IKM)', target: '≥ 82', arah: 'naik', bobot: 5, batasAtas: 120, capaian: 106.0, rumus: 'Nilai IKM semester terakhir (survei sesuai PermenPANRB 14/2017)', sumber: 'Survei semesteran', dasar: 'IKU Kaban', hitung: { jenis: 'langsung', target: 82, satuan: 'indeks', pembilang: 'Nilai IKM semester I 2026' } },
  { no: 13, area: 'area_c', nama: 'Waktu Layanan Daftar Ulang', target: '≤ 20 menit*', arah: 'turun', bobot: 5, batasAtas: 120, capaian: 110.0, rumus: 'Rata-rata rentang waktu jam daftar s.d. jam bayar', sumber: 'PSIP', dasar: 'SOP / Standar Layanan', hitung: { jenis: 'langsung', target: 20, satuan: 'menit', pembilang: 'Rata-rata jam daftar s.d. jam bayar' } },
  { no: 14, area: 'area_c', nama: 'Penyelesaian Pengaduan Tepat Waktu', target: '100%', arah: 'naik', bobot: 4, batasAtas: 120, capaian: 100.0, rumus: 'Total nilai pengaduan ÷ (jumlah pengaduan × 3) × 100%; nilai per pengaduan: selesai ≤ 1×24 jam = 3, ≤ 2×24 jam = 2, > 2×24 jam = 1; direlatifkan terhadap potensi P3DW', sumber: 'Drupadi', dasar: 'SOP / Standar Layanan', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Total nilai pengaduan', penyebut: 'Nilai maksimal (jumlah pengaduan × 3)', data: 'nilai', basis: 360, maks: 100 } },
  { no: 15, area: 'area_c', nama: 'Adopsi Kanal Digital', target: '≥ 30%', arah: 'naik', bobot: 3, batasAtas: 120, capaian: 104.5, rumus: 'Jumlah transaksi digital (Signal, Sambara, Kiosk, Salira, Sanggem, Samsat Digital Lw. Panjang) ÷ total transaksi × 100%', sumber: 'Sistem', hitung: { jenis: 'rasio', target: 30, satuan: '%', pembilang: 'Transaksi digital', penyebut: 'Total transaksi', data: 'transaksi', basis: 96_500 } },
  { no: 16, area: 'area_c', nama: 'Review Masyarakat (Drupadi)', target: '≤ 10%*', arah: 'turun', bobot: 3, batasAtas: 120, capaian: 97.8, rumus: 'Jumlah review negatif ÷ total review × 100%', sumber: 'Drupadi', dasar: 'SOP / Standar Layanan', catatan: 'Kepala P3DW dapat mengajukan banding atas review.', hitung: { jenis: 'rasio', target: 10, satuan: '%', pembilang: 'Review negatif', penyebut: 'Total review', data: 'review', basis: 640 } },
  // Area D: Tata Kelola (10%)
  { no: 17, area: 'area_d', nama: 'Ketepatan Penganggaran Belanja (Deviasi)', target: '≥ 95%*', arah: 'naik', bobot: 3, batasAtas: 100, capaian: 103.2, rumus: 'Realisasi belanja ÷ target anggaran kas × 100% (skor berbasis deviasi)', sumber: 'LPJ Keuangan', dasar: 'Permendagri', hitung: { jenis: 'rasio', target: 95, satuan: '%', pembilang: 'Realisasi belanja', penyebut: 'Anggaran kas kumulatif', data: 'Rp', basis: 6_850_000_000 } },
  { no: 18, area: 'area_d', nama: 'TL Temuan Internal Tepat Waktu', target: '100%', arah: 'naik', bobot: 3, batasAtas: 100, capaian: 100.0, rumus: 'Temuan Dalev yang sudah ditindaklanjuti ÷ total temuan × 100%', sumber: 'LHP', dasar: 'SPIP', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Temuan ditindaklanjuti', penyebut: 'Total temuan', data: 'temuan', basis: 12, maks: 100 } },
  { no: 19, area: 'area_d', nama: 'TL Temuan Eksternal Tepat Waktu', target: '100%', arah: 'naik', bobot: 4, batasAtas: 100, capaian: 100.0, rumus: 'Temuan BPK, BPKP, Itjen, dan Inspektorat yang sudah ditindaklanjuti ÷ total temuan × 100%', sumber: 'LHP', dasar: 'SPIP', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Temuan ditindaklanjuti', penyebut: 'Total temuan', data: 'temuan', basis: 9, maks: 100 } },
  // Area E: SDM dan Koordinasi (15%)
  { no: 20, area: 'area_e', nama: 'Penganggaran Cost Sharing', target: '100%', arah: 'naik', bobot: 4, batasAtas: 100, capaian: 100.0, rumus: 'Kesesuaian anggaran cost sharing dengan SE Gubernur (Murni dan Perubahan)', sumber: 'Dokumen anggaran Kab/Kota', dasar: 'SE Gubernur', hitung: { jenis: 'rasio', target: 100, satuan: '%', pembilang: 'Tahap sesuai SE', penyebut: 'Tahap berjalan', data: 'tahap', basis: 2, maks: 100 } },
  { no: 21, area: 'area_e', nama: 'Realisasi Cost Sharing', target: '≥ 95%*', arah: 'naik', bobot: 4, batasAtas: 100, capaian: 101.0, rumus: 'Realisasi cost sharing Kab/Kota ÷ anggaran cost sharing × 100%', sumber: 'Realisasi cost sharing Kab/Kota', dasar: 'SE Gubernur', hitung: { jenis: 'rasio', target: 95, satuan: '%', pembilang: 'Realisasi cost sharing', penyebut: 'Anggaran cost sharing', data: 'Rp', basis: 4_200_000_000 } },
  { no: 22, area: 'area_e', nama: 'Inovasi (Rubrik Kualitas)', target: '≥ 1/tahun', arah: 'naik', bobot: 3, batasAtas: 120, capaian: 100.0, rumus: 'Inovasi layanan yang diterapkan, dinilai dengan rubrik kualitas (EOTM)', sumber: 'Laporan inovasi', dasar: 'Merit sistem', hitung: { jenis: 'langsung', target: 1, satuan: 'inovasi', pembilang: 'Inovasi diterapkan tahun ini' } },
  { no: 23, area: 'area_e', nama: 'Koordinasi (Rubrik BARS)', target: '≥ 12/tahun*', arah: 'naik', bobot: 2, batasAtas: 120, capaian: 100.0, rumus: 'Jumlah kegiatan koordinasi dengan instansi (TPS + BJB, Pemkab/Pemkot), dinilai dengan rubrik BARS', sumber: 'Notulen', dasar: 'TPS', hitung: { jenis: 'langsung', target: 12, satuan: 'kegiatan', pembilang: 'Kegiatan koordinasi tahun ini' } },
  { no: 24, area: 'area_e', nama: 'Capaian SKP Pegawai', target: 'Predikat "Baik"', arah: 'naik', bobot: 2, batasAtas: 120, capaian: 100.0, rumus: 'Rata-rata nilai SKP seluruh pegawai P3D', sumber: 'Kepegawaian', dasar: 'Merit sistem' },
];

export interface TrenPenilaianRow {
  id: string;
  parent?: string;
  level: number;
  komponen: string;
  bobot: string;
  target?: string;
  capaian: string;
  skor: string;
  poin: string;
  isTotal?: boolean;
  jumlahAnak?: string;
  bobotNum?: number; // khusus baris KPI
  batasAtas?: number; // khusus baris KPI
}

export const AREA_GROUPS: { id: AreaKey; sumbu: 'sumbu_y' | 'sumbu_x'; nama: string }[] = [
  { id: 'area_a', sumbu: 'sumbu_y', nama: 'Area A: Pendapatan' },
  { id: 'area_b', sumbu: 'sumbu_y', nama: 'Area B: Kepatuhan WP' },
  { id: 'area_c', sumbu: 'sumbu_x', nama: 'Area C: Pelayanan' },
  { id: 'area_d', sumbu: 'sumbu_x', nama: 'Area D: Tata Kelola' },
  { id: 'area_e', sumbu: 'sumbu_x', nama: 'Area E: SDM dan Koordinasi' },
];

const fmt = (val: number) => (Math.round(val * 10) / 10).toFixed(1).replace('.', ',');
const fmtBobot = (val: number) => String(Math.round(val * 10) / 10).replace('.', ',');

const kpiSkor = (kpi: KpiDefinition) => Math.min(kpi.batasAtas, kpi.capaian);

// Skor kelompok = Σ(skor KPI × bobot komponen) ÷ Σ bobot komponen
const summarize = (items: KpiDefinition[]) => {
  const bobot = items.reduce((acc, k) => acc + k.bobot, 0);
  const poin = items.reduce((acc, k) => acc + (kpiSkor(k) * k.bobot) / 100, 0);
  const capaian = items.reduce((acc, k) => acc + k.capaian * k.bobot, 0) / bobot;
  return { bobot, poin, skor: (poin * 100) / bobot, capaian };
};

const buildTrenPenilaianData = (): TrenPenilaianRow[] => {
  const total = summarize(KPI_DEFINITIONS);
  const rows: TrenPenilaianRow[] = [
    { id: 'total', level: 0, komponen: 'Skor Akhir (Total 5 Area)', bobot: '100', capaian: fmt(total.skor), skor: fmt(total.skor), poin: fmt(total.poin), isTotal: true },
  ];

  const sumbuList = [
    { id: 'sumbu_y' as const, nama: 'Sumbu Y – Kinerja: Kemandirian Keuangan Daerah' },
    { id: 'sumbu_x' as const, nama: 'Sumbu X – Potensi: Kualitas Pelayanan Publik' },
  ];

  sumbuList.forEach((sumbu) => {
    const areas = AREA_GROUPS.filter((a) => a.sumbu === sumbu.id);
    const sumbuKpis = KPI_DEFINITIONS.filter((k) => areas.some((a) => a.id === k.area));
    const s = summarize(sumbuKpis);
    rows.push({
      id: sumbu.id, level: 1, komponen: sumbu.nama, bobot: fmtBobot(s.bobot),
      capaian: fmt(s.capaian), skor: fmt(s.skor), poin: fmt(s.poin),
      jumlahAnak: `${areas.length} Area • ${sumbuKpis.length} KPI`,
    });

    areas.forEach((area) => {
      const areaKpis = KPI_DEFINITIONS.filter((k) => k.area === area.id);
      const a = summarize(areaKpis);
      rows.push({
        id: area.id, parent: sumbu.id, level: 2, komponen: area.nama, bobot: fmtBobot(a.bobot),
        capaian: fmt(a.capaian), skor: fmt(a.skor), poin: fmt(a.poin),
        jumlahAnak: `${areaKpis.length} Indikator`,
      });

      areaKpis.forEach((kpi) => {
        const skor = kpiSkor(kpi);
        rows.push({
          id: `kpi_${kpi.no}`, parent: area.id, level: 3,
          komponen: `${kpi.no}. ${kpi.nama}${kpi.arah === 'turun' ? ' ↓' : ''}`,
          bobot: fmtBobot(kpi.bobot), target: kpi.target, bobotNum: kpi.bobot, batasAtas: kpi.batasAtas,
          capaian: fmt(kpi.capaian), skor: fmt(skor), poin: fmt((skor * kpi.bobot) / 100),
        });
      });
    });
  });

  return rows;
};

export const mockTrenPenilaianData: TrenPenilaianRow[] = buildTrenPenilaianData();
export const mockTrenPenilaianTotal: number = summarize(KPI_DEFINITIONS).skor;

export interface NineBoxItem {
  id: string;
  unit: string;
  korwil: string;
  klaster: string;
  box: number;
  boxLabel: string;
  kinerja: number;
  potensial: number;
  skorTotal: number;
  kategori: string;
  predikat: string;
  color?: string;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  scoreE: number;
}

export const mockNineBoxPoints: NineBoxItem[] = mockLeaderboardData.map((item) => ({
  id: item.id,
  unit: item.namaP3dw,
  korwil: item.kanwil,
  klaster: item.klaster,
  box: item.boxNumber,
  boxLabel: `Box ${item.boxNumber} (${item.boxName})`,
  kinerja: item.skorY,
  potensial: item.skorX,
  skorTotal: item.totalSkor,
  kategori: item.predikat,
  predikat: item.grade,
  scoreA: item.scorePendapatan,
  scoreB: item.scoreKepatuhan,
  scoreC: item.scorePelayanan,
  scoreD: item.scoreTataKelola,
  scoreE: item.scoreSdm,
}));
