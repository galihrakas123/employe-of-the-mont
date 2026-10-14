import React from 'react';

interface NilaiSumbuCardProps {
  kinerja?: number;
  potensi?: number;
  pendapatan?: number;
  kepatuhan?: number;
  pelayanan?: number;
  tataKelola?: number;
  sdm?: number;
}

export const NilaiSumbuCard: React.FC<NilaiSumbuCardProps> = ({
  kinerja = 96,
  potensi = 95,
  pendapatan,
  kepatuhan,
  pelayanan,
  tataKelola,
  sdm,
}) => {
  // Warna tema dinamis berdasarkan capaian sumbu Y (kinerja, cutoffs: 100, 90)
  let kinerjaColor = '#00875A';
  if (kinerja < 90) kinerjaColor = '#DC2626';
  else if (kinerja < 100) kinerjaColor = '#0284C7';

  // Warna tema dinamis berdasarkan capaian sumbu X (potensi, cutoffs: 95, 85)
  let potensiColor = '#00875A';
  if (potensi < 85) potensiColor = '#DC2626';
  else if (potensi < 95) potensiColor = '#0284C7';

  // Fallback sub-indikator jika tidak diberikan
  const valPendapatan = pendapatan ?? Math.min(120, Math.max(0, Math.round((kinerja + 0.8) * 10) / 10));
  const valKepatuhan = kepatuhan ?? Math.min(120, Math.max(0, Math.round((kinerja - 1.2) * 10) / 10));
  
  const valPelayanan = pelayanan ?? Math.min(120, Math.max(0, Math.round((potensi + 1.0) * 10) / 10));
  const valTataKelola = tataKelola ?? Math.min(120, Math.max(0, Math.round((potensi - 0.5) * 10) / 10));
  const valSdm = sdm ?? Math.min(120, Math.max(0, Math.round((potensi - 1.2) * 10) / 10));

  const formatScore = (val: number) =>
    (Math.round(val * 10) / 10).toFixed(1).replace('.', ',');

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto">
      {/* Title Card */}
      <div className="mb-4">
        <h4 className="text-[15px] font-semibold text-[#212121]">
          Nilai Sumbu Evaluasi
        </h4>
        <p className="text-[12px] text-[#757575] mt-0.5">
          Rincian capaian komponen pembentuk matriks Talent Box
        </p>
      </div>

      {/* Sumbu Y: KINERJA (55%) */}
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
              KINERJA (HASIL & REALISASI)
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5 font-normal">
              Bobot Sumbu 55% · Threshold: Tinggi ≥100, Sedang 90–99.9, Rendah &lt;90
            </span>
          </div>
          <span
            className="text-[22px] font-black leading-none"
            style={{ color: kinerjaColor }}
          >
            {formatScore(kinerja)}
          </span>
        </div>

        {/* Progress Bar (skala max 120) */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden my-2.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, (kinerja / 120) * 100))}%`,
              backgroundColor: kinerjaColor,
            }}
          />
        </div>

        {/* Sub-Indikator Sumbu Y (Area 1 & Area 2) */}
        <div className="flex flex-col gap-1.5 text-[11px] text-[#475569] pt-2 border-t border-[#E2E8F0]/60">
          <div className="flex justify-between items-center">
            <span>Area 1: Pendapatan (Bobot 35% · 5 KPI)</span>
            <strong className="text-[#0F172A] font-semibold">{formatScore(valPendapatan)}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Area 2: Kepatuhan WP (Bobot 20% · 4 KPI)</span>
            <strong className="text-[#0F172A] font-semibold">{formatScore(valKepatuhan)}</strong>
          </div>
        </div>
      </div>

      {/* Sumbu X: POTENSI (45%) */}
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
              POTENSI (LAYANAN & TATA KELOLA)
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5 font-normal">
              Bobot Sumbu 45% · Threshold: Tinggi ≥95, Sedang 85–94.9, Rendah &lt;85
            </span>
          </div>
          <span
            className="text-[22px] font-black leading-none"
            style={{ color: potensiColor }}
          >
            {formatScore(potensi)}
          </span>
        </div>

        {/* Progress Bar (skala max 120) */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden my-2.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, (potensi / 120) * 100))}%`,
              backgroundColor: potensiColor,
            }}
          />
        </div>

        {/* Sub-Indikator Sumbu X (Area 3, 4, 5) */}
        <div className="flex flex-col gap-1.5 text-[11px] text-[#475569] pt-2 border-t border-[#E2E8F0]/60">
          <div className="flex justify-between items-center">
            <span>Area 3: Pelayanan (Bobot 25% · 3 KPI)</span>
            <strong className="text-[#0F172A] font-semibold">{formatScore(valPelayanan)}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Area 4: Tata Kelola & Akuntabilitas (Bobot 5% · 3 KPI)</span>
            <strong className="text-[#0F172A] font-semibold">{formatScore(valTataKelola)}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Area 5: SDM & Koordinasi (Bobot 15% · 4 KPI)</span>
            <strong className="text-[#0F172A] font-semibold">{formatScore(valSdm)}</strong>
          </div>
        </div>
      </div>

      {/* Catatan Penjelas di Bawah */}
      <p className="text-[11px] text-[#64748B] mt-3.5 pt-3 border-t border-[#F1F5F9] leading-relaxed">
        Skor Akhir = <strong>0.55 × Y + 0.45 × X</strong> (Skala 0–120). Predikat: Sangat Baik (≥110), Baik (90–109.9), Cukup (70–89.9), Kurang (&lt;70).
      </p>
    </div>
  );
};

export default NilaiSumbuCard;
