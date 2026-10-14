import React from 'react';
import { SectionMessage, SectionMessageVariant } from '@/components/ui/SectionMessage';

interface InsightBannerCardProps {
  unitName?: string;
  totalSkor?: number;
  kategori?: string;
  scorePendapatan?: number;
  scoreA?: number;
  scoreE?: number;
}

export const InsightBannerCard: React.FC<InsightBannerCardProps> = ({
  unitName = 'P3DW Kota Bandung I',
  totalSkor = 112.4,
  kategori = 'Sangat Baik',
  scorePendapatan,
  scoreA = 115,
}) => {
  const pScore = scorePendapatan ?? scoreA;
  let variant: SectionMessageVariant = 'info';
  let title = 'Insight & Rekomendasi Sistem Evaluasi Talent Box';
  let content = (
    <p className="m-0 leading-relaxed">
      {unitName} menunjukkan performa unggul di seluruh pilar utama dengan kontribusi terbesar dari realisasi penerimaan pajak daerah (Area 1: {pScore}) dan indeks kepuasan wajib pajak. Rekomendasi: jadikan unit ini sebagai <em className="font-medium text-[#1E293B]">benchmark percontohan</em> bagi UPTD wilayah lain.
    </p>
  );

  if (kategori === 'Kurang' || totalSkor < 70) {
    variant = 'error';
    title = 'Evaluasi Kritis & Rencana Pembinaan Khusus';
    content = (
      <p className="m-0 leading-relaxed text-[#991B1B]">
        {unitName} saat ini berada di kategori predikat <strong className="font-bold">Kurang</strong> dengan skor akhir {totalSkor.toFixed(1)} / 120. Rekomendasi: Bapenda perlu melakukan <em>intervensi pengawasan langsung</em>, audit kepatuhan SOP penagihan, serta pendampingan intensif bersama Tim Pembina Samsat.
      </p>
    );
  } else if (kategori === 'Cukup' || (totalSkor >= 70 && totalSkor < 90)) {
    variant = 'warning';
    title = 'Catatan Evaluasi & Area Perbaikan Unit';
    content = (
      <p className="m-0 leading-relaxed text-[#92400E]">
        {unitName} memiliki catatan capaian predikat <strong className="font-semibold">Cukup</strong> (skor akhir {totalSkor.toFixed(1)} / 120). Rekomendasi: Fokuskan strategi pada optimalisasi penagihan tunggakan PKB badan usaha, penelusuran KTMDU/KBMDU, dan peningkatan kualitas pelayanan Samsat.
      </p>
    );
  } else if (kategori === 'Baik' || (totalSkor >= 90 && totalSkor < 110)) {
    variant = 'info';
    title = 'Capaian Positif & Peluang Optimalisasi Menuju Sangat Baik';
    content = (
      <p className="m-0 leading-relaxed text-[#0369A1]">
        {unitName} menunjukkan capaian predikat <strong className="font-semibold">Baik</strong> (skor {totalSkor.toFixed(1)} / 120). Rekomendasi: Tingkatkan adopsi digitalisasi Samsat Digital/Sambara dan pertahankan konsistensi realisasi target pajak untuk mencapai predikat Sangat Baik.
      </p>
    );
  }

  return (
    <SectionMessage
      variant={variant}
      title={title}
      className="shadow-sm"
    >
      {content}
    </SectionMessage>
  );
};

export default InsightBannerCard;
