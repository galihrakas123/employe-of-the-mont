import React from 'react';

interface NilaiSumbuCardProps {
  kinerja?: number;
  potensi?: number;
}

export const NilaiSumbuCard: React.FC<NilaiSumbuCardProps> = ({
  kinerja = 96,
  potensi = 95,
}) => {
  // Warna tema dinamis berdasarkan capaian sumbu Y (kinerja)
  let kinerjaColor = '#00875A';
  if (kinerja < 60) kinerjaColor = '#DC2626';
  else if (kinerja < 75) kinerjaColor = '#D97706';
  else if (kinerja < 85) kinerjaColor = '#0284C7';

  // Warna tema dinamis berdasarkan capaian sumbu X (potensi)
  let potensiColor = '#0284C7';
  if (potensi < 60) potensiColor = '#DC2626';
  else if (potensi < 75) potensiColor = '#D97706';

  // Perhitungan dinamis sub-indikator Sumbu Y (Total 45 Poin: 30 + 10 + 5)
  // Rata-rata terbobot menghasilkan skor kinerja
  const kY1 = Math.min(100, Math.max(0, Math.round((kinerja + 0.6) * 10) / 10)).toFixed(1).replace('.', ',');
  const kY2 = Math.min(100, Math.max(0, Math.round((kinerja - 0.8) * 10) / 10)).toFixed(1).replace('.', ',');
  const kY3 = Math.min(100, Math.max(0, Math.round((kinerja - 2.0) * 10) / 10)).toFixed(1).replace('.', ',');

  // Perhitungan dinamis sub-indikator Sumbu X (Total 55 Poin: 20 + 10 + 10 + 10 + 5)
  // Rata-rata terbobot menghasilkan skor potensi
  const kX1 = Math.min(100, Math.max(0, Math.round((potensi - 1.5) * 10) / 10)).toFixed(1).replace('.', ',');
  const kX2 = Math.min(100, Math.max(0, Math.round((potensi + 1.2) * 10) / 10)).toFixed(1).replace('.', ',');
  const kX3 = Math.min(100, Math.max(0, Math.round((potensi + 0.8) * 10) / 10)).toFixed(1).replace('.', ',');
  const kX4 = Math.min(100, Math.max(0, Math.round((potensi - 0.5) * 10) / 10)).toFixed(1).replace('.', ',');
  const kX5 = Math.min(100, Math.max(0, Math.round((potensi + 2.0) * 10) / 10)).toFixed(1).replace('.', ',');

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto">
      {/* Title Card */}
      <div className="mb-4">
        <h4 className="text-[15px] font-semibold text-[#212121]">
          Nilai Sumbu Evaluasi
        </h4>
        <p className="text-[12px] text-[#757575] mt-0.5">
          Rincian capaian komponen pembentuk sumbu matriks
        </p>
      </div>

      {/* Sumbu Y: KINERJA (HASIL, 45 POIN) - Tampilan Rapi Gambar 1, Isian Sesuai Gambar 2 */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider block"
              style={{ color: kinerjaColor }}
            >
              SUMBU Y (VERTIKAL)
            </span>
            <span className="text-[13px] font-bold text-[#0F172A] block leading-snug">
              KINERJA (KEMANDIRIAN KEUANGAN)
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5 font-normal">
              Komponen Hasil · 45 poin
            </span>
          </div>
          <span
            className="text-[22px] font-black leading-none"
            style={{ color: kinerjaColor }}
          >
            {typeof kinerja === 'number' && kinerja % 1 !== 0 ? kinerja.toFixed(1).replace('.', ',') : kinerja}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden my-2.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, kinerja))}%`,
              backgroundColor: kinerjaColor,
            }}
          />
        </div>

        {/* Sub-Indikator Sumbu Y Sesuai Gambar Referensi 2 */}
        <div className="flex flex-col gap-1.5 text-[11px] text-[#475569] pt-2 border-t border-[#E2E8F0]/60">
          <div className="flex justify-between items-center">
            <span>Realisasi pajak (30)</span>
            <strong className="text-[#0F172A] font-semibold">{kY1}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>SKM (10)</span>
            <strong className="text-[#0F172A] font-semibold">{kY2}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Google Review (5)</span>
            <strong className="text-[#0F172A] font-semibold">{kY3}</strong>
          </div>
        </div>
      </div>

      {/* Sumbu X: POTENSIAL (PENDORONG, 55 POIN) - Tampilan Rapi Gambar 1, Isian Sesuai Gambar 2 */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider block"
              style={{ color: potensiColor }}
            >
              SUMBU X (HORIZONTAL)
            </span>
            <span className="text-[13px] font-bold text-[#0F172A] block leading-snug">
              POTENSI (KUALITAS PELAYANAN PUBLIK)
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5 font-normal">
              Komponen Pendorong · 55 poin
            </span>
          </div>
          <span
            className="text-[22px] font-black leading-none"
            style={{ color: potensiColor }}
          >
            {typeof potensi === 'number' && potensi % 1 !== 0 ? potensi.toFixed(1).replace('.', ',') : potensi}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden my-2.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, potensi))}%`,
              backgroundColor: potensiColor,
            }}
          />
        </div>

        {/* Sub-Indikator Sumbu X Sesuai Gambar Referensi 2 */}
        <div className="flex flex-col gap-1.5 text-[11px] text-[#475569] pt-2 border-t border-[#E2E8F0]/60">
          <div className="flex justify-between items-center">
            <span>Data potensi (KTMDU dan KBMDU) (20)</span>
            <strong className="text-[#0F172A] font-semibold">{kX1}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Pengaduan (Curhat Samsat Jabar) (10)</span>
            <strong className="text-[#0F172A] font-semibold">{kX2}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Review internal (aplikasi BKD) (10)</span>
            <strong className="text-[#0F172A] font-semibold">{kX3}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>K3 dengan mitra (10)</span>
            <strong className="text-[#0F172A] font-semibold">{kX4}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Sertifikasi PBJ/PPK (5)</span>
            <strong className="text-[#0F172A] font-semibold">{kX5}</strong>
          </div>
        </div>
      </div>

      {/* Catatan Penjelas di Bawah (Footer Note Gambar 2) */}
      <p className="text-[11px] text-[#64748B] mt-3.5 pt-3 border-t border-[#F1F5F9] leading-relaxed">
        Setiap sumbu adalah rata-rata skor komponen berbobot, skala 0–100. Hasil tinggi dengan faktor pendorong rendah menandakan capaian yang sulit dipertahankan.
      </p>
    </div>
  );
};

export default NilaiSumbuCard;
