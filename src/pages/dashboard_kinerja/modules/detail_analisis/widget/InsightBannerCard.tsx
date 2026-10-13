import React from 'react';
import { SectionMessage, SectionMessageVariant } from '@/components/ui/SectionMessage';

interface InsightBannerCardProps {
  unitName?: string;
  totalSkor?: number;
  kategori?: string;
  scoreA?: number;
  scoreE?: number;
}

export const InsightBannerCard: React.FC<InsightBannerCardProps> = ({
  unitName = 'P3DW Kota Bandung I',
  totalSkor = 95.8,
  kategori = 'Sangat Baik',
  scoreA = 96,
  scoreE = 97,
}) => {
  let variant: SectionMessageVariant = 'info';
  let title = 'Insight & Rekomendasi Sistem Evaluasi';
  let content = (
    <p className="m-0 leading-relaxed">
      {unitName} menunjukkan performa unggul di seluruh pilar utama dengan kontribusi terbesar dari realisasi penerimaan pajak daerah (Pilar A: {scoreA}%) dan indeks kepuasan wajib pajak. Rekomendasi: jadikan unit ini sebagai <em className="font-medium text-[#1E293B]">benchmark percontohan</em> bagi UPTD wilayah lain.
    </p>
  );

  if (kategori === 'Perlu Pembinaan' || totalSkor < 60) {
    variant = 'error';
    title = 'Evaluasi Kritis & Rencana Pembinaan Khusus';
    content = (
      <p className="m-0 leading-relaxed text-[#991B1B]">
        {unitName} saat ini berada di kuadran <strong className="font-bold">Perlu Pembinaan</strong> dengan skor total {totalSkor.toFixed(1)} / 100. Rekomendasi: Bapenda perlu melakukan <em>intervensi pengawasan langsung</em>, audit kepatuhan SOP penagihan, serta pendampingan manajemen SDM secara berkala.
      </p>
    );
  } else if (kategori === 'Kurang' || (totalSkor >= 60 && totalSkor < 70)) {
    variant = 'warning';
    title = 'Catatan Evaluasi & Area Perbaikan Unit';
    content = (
      <p className="m-0 leading-relaxed text-[#92400E]">
        {unitName} memiliki catatan kinerja yang memerlukan perbaikan segera (skor total {totalSkor.toFixed(1)} / 100). Rekomendasi: Fokuskan strategi pada optimalisasi penagihan tunggakan PKB badan usaha dan pembenahan fasilitas pelayanan Samsat.
      </p>
    );
  } else if (kategori === 'Cukup' || (totalSkor >= 70 && totalSkor < 80)) {
    variant = 'warning';
    title = 'Evaluasi Kinerja & Peluang Optimalisasi';
    content = (
      <p className="m-0 leading-relaxed text-[#92400E]">
        {unitName} menunjukkan capaian kategori <strong className="font-semibold">Cukup</strong> (skor {totalSkor.toFixed(1)} / 100). Rekomendasi: Maksimalkan pemanfaatan aplikasi Samsat digital dan layanan jemput bola untuk meningkatkan rasio capaian menuju kuadran unggul.
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
