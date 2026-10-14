// ============================================================================
// TALENT BOX KPI KEPALA PUSAT CABANG SAMSAT (BAPENDA JAWA BARAT)
// Standar Baku Berdasarkan Dokumen Resmi:
// - Sumbu Y (Kinerja): Meningkatnya Kemandirian Keuangan Daerah (55%)
//   Area 1: Pendapatan (5 KPI, bobot 35%)
//   Area 2: Kepatuhan WP (4 KPI, bobot 20%)
// - Sumbu X (Potensi): Meningkatnya Kualitas Pelayanan Publik (45%)
//   Area 3: Pelayanan (3 KPI, bobot 25%)
//   Area 4: Tata Kelola (2 KPI, bobot 5%)
//   Area 5: SDM & Koordinasi (4 KPI, bobot 15%)
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
  scorePelayanan: number;  // 25%
  scoreTataKelola: number; // 5%
  scoreSdm: number;        // 15%
  pendapatanScore?: number;
  kepatuhanScore?: number;
  pelayananScore?: number;
  tataKelolaScore?: number;
  sdmScore?: number;
  // Backward-compatible alias fields:
  scoreA: number; // 35% Pendapatan
  scoreB: number; // 20% Kepatuhan
  scoreC: number; // 25% Pelayanan
  scoreD: number; // 5% Tata Kelola
  scoreE: number; // 15% SDM & Koordinasi
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
// Sumbu X = (0.25 * Pelayanan + 0.05 * TataKelola + 0.15 * SDM) / 0.45
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
  scorePelayanan: number;  // 25%
  scoreTataKelola: number; // 5%
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
  { id: '10700', kd_wil: '10700', nama: 'P3D Wil. Kab. Cianjur', namaPendek: 'Kab. Cianjur', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.8219, lng: 107.1397, scorePendapatan: 108, scoreKepatuhan: 109, scorePelayanan: 104, scoreTataKelola: 106, scoreSdm: 111 },
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
  { id: '11000', kd_wil: '11000', nama: 'P3D Wil. Kab. Karawang', namaPendek: 'Kab. Karawang', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Besar', lat: -6.3227, lng: 107.3376, scorePendapatan: 106, scoreKepatuhan: 104, scorePelayanan: 94, scoreTataKelola: 92, scoreSdm: 94 },
  { id: '11100', kd_wil: '11100', nama: 'P3D Wil. Kab. Purwakarta', namaPendek: 'Kab. Purwakarta', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Sedang', lat: -6.5569, lng: 107.4433, scorePendapatan: 104, scoreKepatuhan: 102, scorePelayanan: 92, scoreTataKelola: 90, scoreSdm: 93 },
  { id: '11200', kd_wil: '11200', nama: 'P3D Wil. Kab. Subang', namaPendek: 'Kab. Subang', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Sedang', lat: -6.5716, lng: 107.7587, scorePendapatan: 102, scoreKepatuhan: 100, scorePelayanan: 90, scoreTataKelola: 92, scoreSdm: 90 },
  { id: '10300', kd_wil: '10300', nama: 'P3D Wil. Kota Bogor', namaPendek: 'Kota Bogor', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.5971, lng: 106.8060, scorePendapatan: 103, scoreKepatuhan: 101, scorePelayanan: 89, scoreTataKelola: 88, scoreSdm: 89 },
  { id: '10200', kd_wil: '10200', nama: 'P3D Wil. Kab. Bogor - Cibinong', namaPendek: 'Kab. Bogor - Cibinong', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.4811, lng: 106.8536, scorePendapatan: 102, scoreKepatuhan: 98, scorePelayanan: 88, scoreTataKelola: 90, scoreSdm: 88 },
  { id: '10400', kd_wil: '10400', nama: 'P3D Wil. Kota Sukabumi', namaPendek: 'Kota Sukabumi', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Sedang', lat: -6.9277, lng: 106.9300, scorePendapatan: 100, scoreKepatuhan: 96, scorePelayanan: 89, scoreTataKelola: 87, scoreSdm: 88 },
  { id: '20100', kd_wil: '20100', nama: 'P3D Wil. Kota Depok I', namaPendek: 'Kota Depok I', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Besar', lat: -6.4025, lng: 106.7942, scorePendapatan: 101, scoreKepatuhan: 98, scorePelayanan: 87, scoreTataKelola: 86, scoreSdm: 88 },
  { id: '20110', kd_wil: '20110', nama: 'P3D Wil. Kota Depok II Cinere', namaPendek: 'Kota Depok II Cinere', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Sedang', lat: -6.3456, lng: 106.7820, scorePendapatan: 98, scoreKepatuhan: 96, scorePelayanan: 88, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '20800', kd_wil: '20800', nama: 'P3D Wil. Kota Bekasi', namaPendek: 'Kota Bekasi', kanwil: 'Korwil Purwakarta', korwilRomawi: 'Korwil I', klaster: 'Klaster Besar', lat: -6.2349, lng: 106.9896, scorePendapatan: 96, scoreKepatuhan: 95, scorePelayanan: 86, scoreTataKelola: 88, scoreSdm: 85 },
  { id: '12300', kd_wil: '12300', nama: 'P3D Wil. Kab. Bandung Barat', namaPendek: 'Kab. Bandung Barat', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Sedang', lat: -6.8431, lng: 107.5050, scorePendapatan: 95, scoreKepatuhan: 93, scorePelayanan: 87, scoreTataKelola: 85, scoreSdm: 84 },
  { id: '12400', kd_wil: '12400', nama: 'P3D Wil. Kab. Bandung I Rancaekek', namaPendek: 'Kab. Bandung I Rancaekek', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -6.9712, lng: 107.7612, scorePendapatan: 93, scoreKepatuhan: 92, scorePelayanan: 84, scoreTataKelola: 83, scoreSdm: 84 },
  { id: '12410', kd_wil: '12410', nama: 'P3D Wil. Kab. Bandung II Soreang', namaPendek: 'Kab. Bandung II Soreang', kanwil: 'Korwil Bandung Raya', korwilRomawi: 'Korwil III', klaster: 'Klaster Besar', lat: -7.0253, lng: 107.5198, scorePendapatan: 92, scoreKepatuhan: 90, scorePelayanan: 84, scoreTataKelola: 82, scoreSdm: 83 },
  { id: '12500', kd_wil: '12500', nama: 'P3D Wil. Kab. Sumedang', namaPendek: 'Kab. Sumedang', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -6.8580, lng: 107.9240, scorePendapatan: 89, scoreKepatuhan: 88, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '12600', kd_wil: '12600', nama: 'P3D Wil. Kab. Garut', namaPendek: 'Kab. Garut', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Besar', lat: -7.2278, lng: 107.9087, scorePendapatan: 91, scoreKepatuhan: 90, scorePelayanan: 83, scoreTataKelola: 82, scoreSdm: 82 },
  { id: '12700', kd_wil: '12700', nama: 'P3D Wil. Kota Tasikmalaya', namaPendek: 'Kota Tasikmalaya', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -7.3274, lng: 108.2207, scorePendapatan: 84, scoreKepatuhan: 83, scorePelayanan: 96, scoreTataKelola: 95, scoreSdm: 95 },
  { id: '11300', kd_wil: '11300', nama: 'P3D Wil. Kota Cirebon', namaPendek: 'Kota Cirebon', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Sedang', lat: -6.7063, lng: 108.5570, scorePendapatan: 91, scoreKepatuhan: 90, scorePelayanan: 96, scoreTataKelola: 95, scoreSdm: 95 },
  { id: '11400', kd_wil: '11400', nama: 'P3D Wil. Kab Cirebon I Sumber', namaPendek: 'Kab Cirebon I Sumber', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Besar', lat: -6.7320, lng: 108.5523, scorePendapatan: 83, scoreKepatuhan: 82, scorePelayanan: 88, scoreTataKelola: 86, scoreSdm: 87 },
  { id: '11900', kd_wil: '11900', nama: 'P3D Wil. Kab. Majalengka', namaPendek: 'Kab. Majalengka', kanwil: 'Korwil Ciayumajakuning', korwilRomawi: 'Korwil IV', klaster: 'Klaster Sedang', lat: -6.8361, lng: 108.2278, scorePendapatan: 82, scoreKepatuhan: 81, scorePelayanan: 87, scoreTataKelola: 86, scoreSdm: 87 },
  { id: '13300', kd_wil: '13300', nama: 'P3D Wil. Kota Banjar', namaPendek: 'Kota Banjar', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Kecil', lat: -7.3736, lng: 108.5342, scorePendapatan: 80, scoreKepatuhan: 79, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 86 },
  { id: '10510', kd_wil: '10510', nama: 'P3D Wil. Kab. Sukabumi II Pelabuhan Ratu', namaPendek: 'Kab. Sukabumi II Pelabuhan Ratu', kanwil: 'Korwil Bogor', korwilRomawi: 'Korwil II', klaster: 'Klaster Kecil', lat: -6.9877, lng: 106.5412, scorePendapatan: 76, scoreKepatuhan: 75, scorePelayanan: 86, scoreTataKelola: 85, scoreSdm: 85 },
  { id: '12800', kd_wil: '12800', nama: 'P3D Wil. Kab. Tasikmalaya - Sukaraja', namaPendek: 'Kab. Tasikmalaya - Sukaraja', kanwil: 'Korwil Priangan Timur', korwilRomawi: 'Korwil V', klaster: 'Klaster Sedang', lat: -7.3512, lng: 108.1120, scorePendapatan: 70, scoreKepatuhan: 68, scorePelayanan: 65, scoreTataKelola: 64, scoreSdm: 65 },
];

// Helper kalkulasi otomatis seluruh list dengan presisi tinggi
const calculatedP3dwList = rawP3dwList.map((raw) => {
  // Sumbu Y = (0.35 * Pendapatan + 0.20 * Kepatuhan) / 0.55
  const y = Math.round(((raw.scorePendapatan * 0.35 + raw.scoreKepatuhan * 0.20) / 0.55) * 10) / 10;
  // Sumbu X = (0.25 * Pelayanan + 0.05 * TataKelola + 0.15 * SDM) / 0.45
  const x = Math.round(((raw.scorePelayanan * 0.25 + raw.scoreTataKelola * 0.05 + raw.scoreSdm * 0.15) / 0.45) * 10) / 10;
  // Skor Akhir = 0.35 * A + 0.20 * B + 0.25 * C + 0.05 * D + 0.15 * E
  const skorTotal = Math.round((raw.scorePendapatan * 0.35 + raw.scoreKepatuhan * 0.20 + raw.scorePelayanan * 0.25 + raw.scoreTataKelola * 0.05 + raw.scoreSdm * 0.15) * 10) / 10;

  const boxInfo = getBoxByCoordinates(y, x);
  const predikatInfo = getPredikatBySkor(skorTotal);

  let kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan' = 'Baik';
  if (boxInfo.boxNumber === 9 || skorTotal >= 110) kategori = 'Sangat Baik';
  else if (boxInfo.boxNumber === 8 || boxInfo.boxNumber === 6 || skorTotal >= 90) kategori = 'Baik';
  else if (boxInfo.boxNumber === 5 || boxInfo.boxNumber === 7 || boxInfo.boxNumber === 3 || skorTotal >= 70) kategori = 'Cukup';
  else if (boxInfo.boxNumber === 2 || boxInfo.boxNumber === 4) kategori = 'Kurang';
  else kategori = 'Perlu Pembinaan';

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
  realisasiPkuSub: 'Total capaian PKB & Pendapatan',
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
    title: 'Realisasi Pendapatan vs Target',
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
// RINCIAN 18 KPI SESUAI BAB 2 DOKUMEN TALENT BOX
// ----------------------------------------------------------------------------
export const mockTrenPenilaianData = [
  { id: 'total', level: 0, komponen: 'Skor Akhir (Total 5 Area)', bobot: '100', capaian: '104,1', skor: '104,1', poin: '104,1', isTotal: true },

  // SUMBU Y - KINERJA (55%)
  { id: 'sumbu_y', level: 1, komponen: 'Sumbu Y – Kinerja: Kemandirian Keuangan Daerah', bobot: '55', capaian: '106,1', skor: '106,1', poin: '58,4' },

  // AREA 1: PENDAPATAN (35%)
  { id: 'area_1', level: 2, komponen: 'Area 1: Pendapatan', bobot: '35', capaian: '108,5', skor: '108,5', poin: '38,0' },
  { id: 'kpi_1', level: 3, komponen: '1. Realisasi PKB', bobot: '15', target: '100%', capaian: '109,2', skor: '109,2', poin: '16,4' },
  { id: 'kpi_2', level: 3, komponen: '2. Realisasi BBNKB', bobot: '10', target: '100%', capaian: '108,4', skor: '108,4', poin: '10,8' },
  { id: 'kpi_3', level: 3, komponen: '3. Realisasi Pajak Air Permukaan (PAP)', bobot: '3', target: '100%', capaian: '105,0', skor: '105,0', poin: '3,2' },
  { id: 'kpi_4', level: 3, komponen: '4. Realisasi Pajak Alat Berat (PAB)', bobot: '2', target: '100%', capaian: '102,0', skor: '102,0', poin: '2,0' },
  { id: 'kpi_5', level: 3, komponen: '5. Pertumbuhan Pendapatan (PKB, BBNKB, PAP, PAB)', bobot: '5', target: '≥ 5%', capaian: '112,0', skor: '112,0', poin: '5,6' },

  // AREA 2: KEPATUHAN WP (20%)
  { id: 'area_2', level: 2, komponen: 'Area 2: Kepatuhan WP', bobot: '20', capaian: '102,0', skor: '102,0', poin: '20,4' },
  { id: 'kpi_6', level: 3, komponen: '6. Rasio Kepatuhan (WP Taat)', bobot: '7', target: '≥ 75%', capaian: '101,5', skor: '101,5', poin: '7,1' },
  { id: 'kpi_7', level: 3, komponen: '7. Penelusuran Objek Tunggakan (Atos Pamor)', bobot: '5', target: '100%', capaian: '104,0', skor: '104,0', poin: '5,2' },
  { id: 'kpi_8', level: 3, komponen: '8. Penelusuran Tunggakan Mandiri (Panah Pasopati)', bobot: '4', target: '100%', capaian: '102,5', skor: '102,5', poin: '4,1' },
  { id: 'kpi_9', level: 3, komponen: '9. Penurunan KTMDU', bobot: '4', target: '≥ 10%', capaian: '100,0', skor: '100,0', poin: '4,0' },

  // SUMBU X - POTENSI (45%)
  { id: 'sumbu_x', level: 1, komponen: 'Sumbu X – Potensi: Kualitas Pelayanan Publik', bobot: '45', capaian: '101,6', skor: '101,6', poin: '45,7' },

  // AREA 3: PELAYANAN (25%)
  { id: 'area_3', level: 2, komponen: 'Area 3: Pelayanan', bobot: '25', capaian: '104,0', skor: '104,0', poin: '26,0' },
  { id: 'kpi_10', level: 3, komponen: '10. IKM / Nilai SKM', bobot: '9', target: '≥ 82', capaian: '106,0', skor: '106,0', poin: '9,5' },
  { id: 'kpi_11', level: 3, komponen: '11. Adopsi Kanal Digital (Signal & Sambara)', bobot: '11', target: '≥ 30%', capaian: '104,5', skor: '104,5', poin: '11,5' },
  { id: 'kpi_12', level: 3, komponen: '12. Penyelesaian Pengaduan (SLA)', bobot: '5', target: '≥ 90%', capaian: '100,0', skor: '100,0', poin: '5,0' },

  // AREA 4: TATA KELOLA (10%)
  { id: 'area_4', level: 2, komponen: 'Area 4: Tata Kelola', bobot: '10', capaian: '100,0', skor: '100,0', poin: '10,0' },
  { id: 'kpi_13', level: 3, komponen: '13. Tindak Lanjut Temuan Audit', bobot: '3', target: '100%', capaian: '100,0', skor: '100,0', poin: '3,0' },
  { id: 'kpi_14', level: 3, komponen: '14. Kesiapan Pejabat Pengadaan (Sertifikasi PBJ & Status PPK)', bobot: '2', target: '100%', capaian: '100,0', skor: '100,0', poin: '2,0' },
  { id: 'kpi_15', level: 3, komponen: '15. Penyerapan Anggaran', bobot: '5', target: '≥ 95%', capaian: '98,0', skor: '100,0', poin: '5,0' },

  // AREA 5: SDM & KOORDINASI (15%)
  { id: 'area_5', level: 2, komponen: 'Area 5: SDM & Koordinasi', bobot: '15', capaian: '98,0', skor: '98,0', poin: '14,7' },
  { id: 'kpi_16', level: 3, komponen: '16. Capaian SKP Pegawai', bobot: '4', target: 'Predikat "Baik"', capaian: '100,0', skor: '100,0', poin: '4,0' },
  { id: 'kpi_17', level: 3, komponen: '17. Koordinasi Tim Pembina Samsat (Polri & Jasa Raharja)', bobot: '3', target: '≥ 12/tahun', capaian: '100,0', skor: '100,0', poin: '3,0' },
  { id: 'kpi_18', level: 3, komponen: '18. Kegiatan Cost Sharing Kabupaten/Kota', bobot: '5', target: '≥ 95%', capaian: '96,0', skor: '96,0', poin: '4,8' },
  { id: 'kpi_19', level: 3, komponen: '19. Inovasi Layanan', bobot: '3', target: '≥ 1/tahun', capaian: '100,0', skor: '100,0', poin: '3,0' },
];

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
