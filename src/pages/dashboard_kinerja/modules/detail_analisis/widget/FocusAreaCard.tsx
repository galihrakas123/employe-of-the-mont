import React from 'react';

interface FocusAreaCardProps {
  scoreSDM?: number;
  bobot?: number;
}

export const FocusAreaCard: React.FC<FocusAreaCardProps> = ({
  scoreSDM = 97,
  bobot = 10,
}) => {
  // Evaluasi apakah skor unit ini kategori bagus (>= 80) atau perlu pembinaan (< 80)
  const isGoodScore = scoreSDM >= 80;

  const dataItem1 = isGoodScore
    ? {
        label: 'Rasio Penyelesaian Coaching Manajerial',
        percentage: '96%',
        width: '96%',
        barColor: 'bg-[#00875A]',
        note: 'Kepala Cabang telah menuntaskan seluruh jadwal coaching & review manajerial Q3 secara optimal.',
      }
    : {
        label: 'Rasio Penyelesaian Coaching Manajerial',
        percentage: '30%',
        width: '30%',
        barColor: 'bg-[#F43F5E]',
        note: 'Kepala Cabang absen dalam 2 jadwal review bulanan Q3.',
      };

  const dataItem2 = isGoodScore
    ? {
        label: 'Progress OKR Inovasi (Target Q4)',
        percentage: '94%',
        width: '94%',
        barColor: 'bg-[#0284C7]',
        note: 'Implementasi sistem antrean digital & layanan jemput bola berjalan optimal sesuai target roadmap.',
      }
    : {
        label: 'Progress OKR Inovasi (Target Q4)',
        percentage: '60%',
        width: '60%',
        barColor: 'bg-[#F59E0B]',
        note: 'Implementasi sistem antrean digital terhambat koordinasi tim internal.',
      };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-5 sm:p-6 font-roboto">
      {/* Header Card */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#F1F5F9]">
        <h4 className="text-[15px] sm:text-[16px] font-bold text-[#0F172A]">
          Fokus: Area E (SDM &amp; Koordinasi)
        </h4>
        <span
          className={`px-3 py-1 rounded-md text-[11px] font-bold ${
            isGoodScore
              ? 'bg-[#E6F4EA] text-[#00875A] border border-[#00875A]/20'
              : 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]'
          }`}
        >
          Bobot {bobot}% | Skor: {scoreSDM}
        </span>
      </div>

      {/* 2 Data Items - Dinamis menyesuaikan capaian nilai unit */}
      <div className="space-y-5">
        {/* Item 1 */}
        <div>
          <div className="flex justify-between items-center text-[13px] sm:text-[14px] font-bold text-[#0F172A] mb-1.5">
            <span>{dataItem1.label}</span>
            <span className={isGoodScore ? 'text-[#00875A]' : 'text-[#0F172A]'}>
              {dataItem1.percentage}
            </span>
          </div>
          <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${dataItem1.barColor}`}
              style={{ width: dataItem1.width }}
            />
          </div>
          <p className="text-[12px] text-[#64748B] mt-1.5 font-normal leading-normal">
            {dataItem1.note}
          </p>
        </div>

        {/* Item 2 */}
        <div>
          <div className="flex justify-between items-center text-[13px] sm:text-[14px] font-bold text-[#0F172A] mb-1.5">
            <span>{dataItem2.label}</span>
            <span className={isGoodScore ? 'text-[#0284C7]' : 'text-[#0F172A]'}>
              {dataItem2.percentage}
            </span>
          </div>
          <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${dataItem2.barColor}`}
              style={{ width: dataItem2.width }}
            />
          </div>
          <p className="text-[12px] text-[#64748B] mt-1.5 font-normal leading-normal">
            {dataItem2.note}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusAreaCard;
