export interface P3dwScatterData {
  id: string;
  nama: string;
  x: number; // Potensial (0 - 100)
  y: number; // Kinerja (0 - 100)
  box: string; // e.g. "Box 9 (Bintang Utama)"
  boxNumber: number;
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';
  skorTotal: number;
  korwil?: string;
}

export interface P3dwLeaderboardData {
  id: string;
  peringkat: number;
  namaP3dw: string;
  totalSkor: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  scoreA: number; // 40%
  scoreB: number; // 20%
  scoreC: number; // 20%
  scoreD: number; // 10%
  scoreE: number; // 10%
  klaster: 'Kuat' | 'Sedang' | 'Kurang';
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
}

export const mockKpiTopCards = [
  {
    title: 'Rata-rata Skor KPI',
    value: '78.5',
    total: '/ 100',
    subtitle: 'Gabungan Area (3.1)',
    topColor: 'border-t-emerald-500',
    iconColor: 'text-emerald-600 bg-emerald-50',
    type: 'activity',
  },
  {
    title: 'Cabang Bintang Utama',
    value: '8',
    unit: 'P3DW',
    subtitle: 'Kinerja akhir di proses optimal',
    topColor: 'border-t-purple-500',
    iconColor: 'text-purple-600 bg-purple-50',
    type: 'star',
  },
  {
    title: 'Realisasi PKB terhadap target',
    value: '96,2%',
    subtitle: 'Target kumulatif s.d. Oktober',
    topColor: 'border-t-blue-500',
    iconColor: 'text-blue-600 bg-blue-50',
    type: 'dollar',
  },
  {
    title: 'Unit perlu perhatian',
    value: '4',
    unit: 'P3DW',
    subtitle: 'Berada di kuadran Kritis',
    topColor: 'border-t-rose-500',
    iconColor: 'text-rose-600 bg-rose-50',
    type: 'alert',
  },
];

export const mockScatterData: P3dwScatterData[] = [
  { id: '1', nama: 'P3DW Kota Bandung I', x: 95, y: 96, box: 'Box 9 (Unggul Penuh)', boxNumber: 9, kategori: 'Sangat Baik', skorTotal: 95.8, korwil: 'Korwil II' },
  { id: '2', nama: 'P3DW Kab. Cirebon', x: 91, y: 93, box: 'Box 9 (Unggul Penuh)', boxNumber: 9, kategori: 'Sangat Baik', skorTotal: 92.0, korwil: 'Korwil III' },
  { id: '3', nama: 'P3DW Kota Sukabumi', x: 78, y: 88, box: 'Box 8 (Hasil Unggul)', boxNumber: 8, kategori: 'Baik', skorTotal: 83.0, korwil: 'Korwil I' },
  { id: '4', nama: 'P3DW Kab. Bekasi', x: 82, y: 84, box: 'Box 8 (Hasil Unggul)', boxNumber: 8, kategori: 'Baik', skorTotal: 83.0, korwil: 'Korwil I' },
  { id: '5', nama: 'P3DW Kab. Subang', x: 65, y: 72, box: 'Box 5 (Inti)', boxNumber: 5, kategori: 'Cukup', skorTotal: 68.5, korwil: 'Korwil II' },
  { id: '6', nama: 'P3DW Kab. Garut', x: 60, y: 64, box: 'Box 5 (Inti)', boxNumber: 5, kategori: 'Cukup', skorTotal: 62.0, korwil: 'Korwil V' },
  { id: '7', nama: 'P3DW Kota Cimahi', x: 86, y: 78, box: 'Box 6 (Pendorong Kuat)', boxNumber: 6, kategori: 'Baik', skorTotal: 82.0, korwil: 'Korwil II' },
  { id: '8', nama: 'P3DW Kab. Indramayu', x: 74, y: 68, box: 'Box 5 (Inti)', boxNumber: 5, kategori: 'Cukup', skorTotal: 71.0, korwil: 'Korwil III' },
  { id: '9', nama: 'P3DW Kab. Tasikmalaya', x: 48, y: 52, box: 'Box 1 (Perlu Pembinaan)', boxNumber: 1, kategori: 'Perlu Pembinaan', skorTotal: 50.0, korwil: 'Korwil V' },
  { id: '10', nama: 'P3DW Kab. Cianjur', x: 54, y: 64, box: 'Box 4 (Pendorong Lemah)', boxNumber: 4, kategori: 'Perlu Pembinaan', skorTotal: 56.5, korwil: 'Korwil I' },
  { id: '11', nama: 'P3DW Kota Depok', x: 89, y: 90, box: 'Box 9 (Unggul Penuh)', boxNumber: 9, kategori: 'Sangat Baik', skorTotal: 89.5, korwil: 'Korwil I' },
  { id: '12', nama: 'P3DW Kab. Karawang', x: 81, y: 86, box: 'Box 8 (Hasil Unggul)', boxNumber: 8, kategori: 'Baik', skorTotal: 83.5, korwil: 'Korwil II' },
  { id: '13', nama: 'P3DW Kab. Majalengka', x: 64, y: 55, box: 'Box 2 (Hasil Tertinggal)', boxNumber: 2, kategori: 'Kurang', skorTotal: 61.0, korwil: 'Korwil III' },
  { id: '14', nama: 'P3DW Kab. Kuningan', x: 68, y: 74, box: 'Box 5 (Inti)', boxNumber: 5, kategori: 'Cukup', skorTotal: 71.0, korwil: 'Korwil III' },
  { id: '15', nama: 'P3DW Kab. Pangandaran', x: 72, y: 76, box: 'Box 5 (Inti)', boxNumber: 5, kategori: 'Baik', skorTotal: 74.0, korwil: 'Korwil V' },
];

export const mockLeaderboardData: P3dwLeaderboardData[] = [
  { id: '1', peringkat: 1, namaP3dw: 'P3DW Kota Bandung I', totalSkor: 95.8, predikat: 'A', scoreA: 96, scoreB: 95, scoreC: 96, scoreD: 94, scoreE: 97, klaster: 'Kuat', kanwil: 'Korwil II' },
  { id: '2', peringkat: 2, namaP3dw: 'P3DW Kab. Cirebon', totalSkor: 92.0, predikat: 'A', scoreA: 93, scoreB: 90, scoreC: 92, scoreD: 88, scoreE: 94, klaster: 'Kuat', kanwil: 'Korwil III' },
  { id: '3', peringkat: 3, namaP3dw: 'P3DW Kota Depok', totalSkor: 89.5, predikat: 'A', scoreA: 89, scoreB: 88, scoreC: 90, scoreD: 86, scoreE: 88, klaster: 'Kuat', kanwil: 'Korwil I' },
  { id: '4', peringkat: 4, namaP3dw: 'P3DW Kab. Karawang', totalSkor: 82.5, predikat: 'B', scoreA: 84, scoreB: 82, scoreC: 80, scoreD: 78, scoreE: 76, klaster: 'Sedang', kanwil: 'Korwil II' },
  { id: '5', peringkat: 5, namaP3dw: 'P3DW Kota Sukabumi', totalSkor: 78.5, predikat: 'B', scoreA: 78, scoreB: 80, scoreC: 75, scoreD: 74, scoreE: 70, klaster: 'Sedang', kanwil: 'Korwil I' },
  { id: '6', peringkat: 6, namaP3dw: 'P3DW Kab. Bekasi', totalSkor: 76.2, predikat: 'B', scoreA: 76, scoreB: 78, scoreC: 74, scoreD: 72, scoreE: 68, klaster: 'Sedang', kanwil: 'Korwil I' },
  { id: '7', peringkat: 7, namaP3dw: 'P3DW Kab. Subang', totalSkor: 70.8, predikat: 'B', scoreA: 72, scoreB: 74, scoreC: 70, scoreD: 68, scoreE: 65, klaster: 'Sedang', kanwil: 'Korwil II' },
  { id: '8', peringkat: 8, namaP3dw: 'P3DW Kab. Garut', totalSkor: 64.2, predikat: 'C', scoreA: 65, scoreB: 66, scoreC: 62, scoreD: 60, scoreE: 58, klaster: 'Kurang', kanwil: 'Korwil V' },
  { id: '9', peringkat: 9, namaP3dw: 'P3DW Kab. Cianjur', totalSkor: 58.5, predikat: 'C', scoreA: 58, scoreB: 60, scoreC: 56, scoreD: 54, scoreE: 52, klaster: 'Kurang', kanwil: 'Korwil I' },
  { id: '10', peringkat: 10, namaP3dw: 'P3DW Kab. Tasikmalaya', totalSkor: 51.0, predikat: 'D', scoreA: 52, scoreB: 50, scoreC: 48, scoreD: 46, scoreE: 44, klaster: 'Kurang', kanwil: 'Korwil V' },
];

export const mockMapMarkers: MapMarkerData[] = [
  { id: 'bdg', nama: 'P3DW Kota Bandung I', lat: -6.9175, lng: 107.6191, skor: 95.8, kategori: 'Sangat Baik', predikat: 'A' },
  { id: 'crb', nama: 'P3DW Kab. Cirebon', lat: -6.7320, lng: 108.5523, skor: 92.0, kategori: 'Sangat Baik', predikat: 'A' },
  { id: 'bks', nama: 'P3DW Kab. Bekasi', lat: -6.2383, lng: 106.9756, skor: 76.2, kategori: 'Baik', predikat: 'B' },
  { id: 'dpk', nama: 'P3DW Kota Depok', lat: -6.4025, lng: 106.7942, skor: 86.4, kategori: 'Sangat Baik', predikat: 'A' },
  { id: 'skb', nama: 'P3DW Kota Sukabumi', lat: -6.9277, lng: 106.9300, skor: 78.5, kategori: 'Baik', predikat: 'B' },
  { id: 'sbg', nama: 'P3DW Kab. Subang', lat: -6.5716, lng: 107.7587, skor: 70.8, kategori: 'Cukup', predikat: 'B' },
  { id: 'krw', nama: 'P3DW Kab. Karawang', lat: -6.3227, lng: 107.3376, skor: 82.5, kategori: 'Baik', predikat: 'B' },
  { id: 'grt', nama: 'P3DW Kab. Garut', lat: -7.2278, lng: 107.9087, skor: 64.2, kategori: 'Kurang', predikat: 'C' },
  { id: 'tsk', nama: 'P3DW Kab. Tasikmalaya', lat: -7.3274, lng: 108.2207, skor: 51.0, kategori: 'Perlu Pembinaan', predikat: 'D' },
  { id: 'idm', nama: 'P3DW Kab. Indramayu', lat: -6.3264, lng: 108.3200, skor: 71.0, kategori: 'Cukup', predikat: 'B' },
];

export const mockDetailProfile = {
  title: 'Detail Analisis: Kota Bandung I',
  subtitle: 'Skor Total: 87.8 (Peringkat 2) | Kategori: Zona Bintang Utama',
  namaKepala: 'Ahmad Fauzi, S.Kom',
  subKepala: 'Kepala UPTD P3DW Kota Bandung I - Korwil II',
  nip: '19890412 201402 1 003',
  pangkat: 'Penata Tk. I (III/d)',
  jabatan: 'Kepala UPTD P3DW',
  unitKerja: 'P3DW Kota Bandung I',
  korwil: 'Korwil II (Bandung Raya)',
  masaJabatan: '2 tahun 4 bulan',
  pendidikan: 'S1 Sistem Informasi, Univ. Padjadjaran',
  sertifikasi: 'Tersertifikasi (Masa berlaku s/d 2028)',
  jumlahPegawai: '48 Pegawai',
  kontak: 'p3dw.bandung1@bapenda.jabarprov.go.id | (022) 2501234',
};

export const mockTrenPenilaianData = [
  { id: '1', level: 0, komponen: 'Skor total', bobot: '100', capaian: '87,8', skor: '87,8', poin: '87,8', isTotal: true },
  { id: '2', level: 1, komponen: '• Fiskal', bobot: '40', capaian: '88,0', skor: '35,2', poin: '35,2' },
  { id: '3', level: 2, komponen: '• Realisasi pajak', bobot: '30', capaian: '89,3', skor: '26,8', poin: '26,8' },
  { id: '4', level: 3, komponen: 'PKB', bobot: '15', target: '95,0% dari target', capaian: '96,2', skor: '14,4', poin: '14,4' },
  { id: '5', level: 3, komponen: 'BBNKB', bobot: '11', target: '94,0% dari target', capaian: '88,0', skor: '9,7', poin: '9,7' },
  { id: '6', level: 3, komponen: 'Pajak lainnya', bobot: '4', target: '94,0% dari target', capaian: '84,0', skor: '3,4', poin: '3,4' },
  { id: '7', level: 2, komponen: '• Data potensi (KTMDU dan KBMDU)', bobot: '20', capaian: '78,0', skor: '15,6', poin: '15,6' },
  { id: '8', level: 1, komponen: '• Wajib pajak', bobot: '20', capaian: '85,0', skor: '17,0', poin: '17,0' },
  { id: '9', level: 2, komponen: 'SKM', bobot: '10', capaian: '86,0', skor: '8,6', poin: '8,6' },
  { id: '10', level: 2, komponen: 'Google Review', bobot: '5', capaian: '82,0', skor: '4,1', poin: '4,1' },
  { id: '11', level: 2, komponen: 'Pengaduan (Curhat Samsat Jabar)', bobot: '5', capaian: '88,0', skor: '4,4', poin: '4,4' },
  { id: '12', level: 1, komponen: '• Proses internal dan kemitraan', bobot: '10', capaian: '84,0', skor: '8,4', poin: '8,4' },
  { id: '13', level: 2, komponen: 'K3 dengan mitra', bobot: '10', capaian: '84,0', skor: '8,4', poin: '8,4' },
  { id: '14', level: 1, komponen: '• Pembelajaran dan budaya', bobot: '15', capaian: '92,0', skor: '13,8', poin: '13,8' },
  { id: '15', level: 2, komponen: 'Sertifikasi PBB / PPK', bobot: '5', capaian: '100,0', skor: '5,0', poin: '5,0' },
  { id: '16', level: 2, komponen: 'Review internal (aplikasi BKD)', bobot: '10', capaian: '88,0', skor: '8,8', poin: '8,8' },
];

export interface NineBoxItem {
  id: string;
  unit: string;
  korwil: string;
  klaster: string;
  box: number | string;
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

export const mockDashboardMetrics = {
  rataRataKpi: '78.5',
  rataRataSub: 'Gabungan Area (3.1)',
  cabangBintang: '8',
  cabangBintangSub: 'Kinerja akhir di proses optimal',
  realisasiPku: '96,2%',
  realisasiPkuSub: 'Target kumulatif s.d. Oktober',
  unitPerhatian: '4',
  unitPerhatianSub: 'Berada di kuadran Kritis',
};

export const mockNineBoxPoints: NineBoxItem[] = [
  {
    id: '1',
    unit: 'P3DW Kota Bandung I',
    korwil: 'Korwil II (Bandung Raya)',
    klaster: 'Hijau',
    box: 9,
    boxLabel: 'Bintang Utama (Box 9)',
    kinerja: 92,
    potensial: 88,
    skorTotal: 87.8,
    kategori: 'Sangat Baik',
    predikat: 'A',
    color: '#1d4ed8',
    scoreA: 88,
    scoreB: 85,
    scoreC: 90,
    scoreD: 84,
    scoreE: 75,
  },
  {
    id: '2',
    unit: 'P3DW Kab. Cirebon',
    korwil: 'Korwil III (Cirebon Raya)',
    klaster: 'Hijau',
    box: 9,
    boxLabel: 'Bintang Utama (Box 9)',
    kinerja: 94,
    potensial: 92,
    skorTotal: 92.0,
    kategori: 'Sangat Baik',
    predikat: 'A',
    color: '#1d4ed8',
    scoreA: 95,
    scoreB: 90,
    scoreC: 92,
    scoreD: 88,
    scoreE: 94,
  },
  {
    id: '3',
    unit: 'P3DW Kota Sukabumi',
    korwil: 'Korwil I (Bogor Raya)',
    klaster: 'Sedang',
    box: 8,
    boxLabel: 'Kinerja Tinggi (Box 8)',
    kinerja: 88,
    potensial: 78,
    skorTotal: 78.5,
    kategori: 'Baik',
    predikat: 'B',
    color: '#0284c7',
    scoreA: 78,
    scoreB: 80,
    scoreC: 75,
    scoreD: 74,
    scoreE: 70,
  },
  {
    id: '4',
    unit: 'P3DW Kab. Bekasi',
    korwil: 'Korwil I (Bogor Raya)',
    klaster: 'Sedang',
    box: 8,
    boxLabel: 'Kinerja Tinggi (Box 8)',
    kinerja: 84,
    potensial: 82,
    skorTotal: 76.2,
    kategori: 'Baik',
    predikat: 'B',
    color: '#0284c7',
    scoreA: 76,
    scoreB: 78,
    scoreC: 74,
    scoreD: 72,
    scoreE: 68,
  },
  {
    id: '5',
    unit: 'P3DW Kab. Subang',
    korwil: 'Korwil II (Bandung Raya)',
    klaster: 'Sedang',
    box: 5,
    boxLabel: 'Inti Berdaya (Box 5)',
    kinerja: 72,
    potensial: 65,
    skorTotal: 70.8,
    kategori: 'Cukup',
    predikat: 'B',
    color: '#d97706',
    scoreA: 72,
    scoreB: 74,
    scoreC: 70,
    scoreD: 68,
    scoreE: 65,
  },
  {
    id: '6',
    unit: 'P3DW Kab. Garut',
    korwil: 'Korwil V (Priangan Timur)',
    klaster: 'Kritis',
    box: 5,
    boxLabel: 'Inti Berdaya (Box 5)',
    kinerja: 64,
    potensial: 60,
    skorTotal: 64.2,
    kategori: 'Kurang',
    predikat: 'C',
    color: '#ea580c',
    scoreA: 65,
    scoreB: 66,
    scoreC: 62,
    scoreD: 60,
    scoreE: 58,
  },
  {
    id: '7',
    unit: 'P3DW Kab. Tasikmalaya',
    korwil: 'Korwil V (Priangan Timur)',
    klaster: 'Kritis',
    box: 1,
    boxLabel: 'Perlu Pembinaan (Box 1)',
    kinerja: 52,
    potensial: 48,
    skorTotal: 51.0,
    kategori: 'Perlu Pembinaan',
    predikat: 'D',
    color: '#dc2626',
    scoreA: 52,
    scoreB: 50,
    scoreC: 48,
    scoreD: 46,
    scoreE: 44,
  },
];

export const mockMapLocations = [
  { id: '1', name: 'P3DW Kota Bandung I', score: 87.8, status: 'Sangat Baik', x: 48, y: 55 },
  { id: '2', name: 'P3DW Kab. Cirebon', score: 92.0, status: 'Sangat Baik', x: 82, y: 45 },
  { id: '3', name: 'P3DW Kab. Bekasi', score: 76.2, status: 'Baik', x: 26, y: 35 },
  { id: '4', name: 'P3DW Kota Depok', score: 86.4, status: 'Sangat Baik', x: 22, y: 42 },
  { id: '5', name: 'P3DW Kota Sukabumi', score: 78.5, status: 'Baik', x: 30, y: 68 },
  { id: '6', name: 'P3DW Kab. Subang', score: 70.8, status: 'Cukup', x: 55, y: 40 },
  { id: '7', name: 'P3DW Kab. Garut', score: 64.2, status: 'Kurang', x: 62, y: 72 },
  { id: '8', name: 'P3DW Kab. Tasikmalaya', score: 51.0, status: 'Perlu Pembinaan', x: 74, y: 78 },
];

