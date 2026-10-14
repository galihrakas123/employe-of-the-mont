export type UserRole = 'ADMIN' | 'OPERATOR' | 'KURIR' | 'KEPALA_DINAS';

export interface User {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  division?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface NineBoxItem {
  id: string;
  name: string;
  unit: string;
  box: number; // 1 - 9
  boxLabel: string;
  kinerja: number; // 40 - 100 (Y-axis)
  potensial: number; // 40 - 100 (X-axis)
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Perlu Pembinaan';
  skorTotal: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  scoreA: number; // 40% Pendapatan
  scoreB: number; // 20% Kepatuhan
  scoreC: number; // 15% Pelayanan
  scoreD: number; // 10% Tata Kelola
  scoreE: number; // 15% SDM dan Koordinasi
  klaster: 'Hijau' | 'Sedang' | 'Kritis';
  korwil: string;
}

export interface DetailProfile {
  title: string;
  subtitle: string;
  namaKepala: string;
  subKepala: string;
  nip: string;
  pangkat: string;
  jabatan: string;
  unitKerja: string;
  korwil: string;
  masaJabatan: string;
  pendidikan: string;
  sertifikasi: string;
  jumlahPegawai: string;
  kontak: string;
}

export interface TrenPenilaianItem {
  id: string;
  level: number;
  komponen: string;
  bobot: string;
  target?: string;
  capaian: string;
  skor: string;
  poin: string;
  isTotal?: boolean;
}
