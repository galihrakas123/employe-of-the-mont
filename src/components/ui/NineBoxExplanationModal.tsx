import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Target, Award, Sparkles } from 'lucide-react';
import { NINE_BOX_DETAILS, NINE_BOX_LIST, NineBoxDetail } from '@/constants/nineBoxData';

interface NineBoxExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBoxNumber?: number;
}

export const NineBoxExplanationModal: React.FC<NineBoxExplanationModalProps> = ({
  isOpen,
  onClose,
  initialBoxNumber,
}) => {
  const [selectedBox, setSelectedBox] = useState<number | 'all'>('all');

  useEffect(() => {
    if (initialBoxNumber && NINE_BOX_DETAILS[initialBoxNumber]) {
      setSelectedBox(initialBoxNumber);
    } else {
      setSelectedBox('all');
    }
  }, [initialBoxNumber, isOpen]);

  if (!isOpen) return null;

  const boxesToDisplay =
    selectedBox === 'all'
      ? NINE_BOX_LIST
      : [NINE_BOX_DETAILS[selectedBox]];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden font-roboto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00875A]/10 text-[#00875A] flex items-center justify-center shrink-0">
              <Award size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">
                Penjelasan & Panduan Tiap Box Matriks 9-Box
              </h3>
              <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                Kriteria evaluasi, makna strategis, dan rekomendasi tindak lanjut bagi P3DW Bapenda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills / Navigation Buttons */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center gap-1.5 overflow-x-auto text-[12px] font-medium shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedBox('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedBox === 'all'
                ? 'bg-[#00875A] text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua Box (1–9)
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
          {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => {
            const item = NINE_BOX_DETAILS[num];
            const isSelected = selectedBox === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedBox(num)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0F172A] text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.titleColor }}
                />
                <span>{item.code}: {item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Box Cards List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]">
          {boxesToDisplay.map((box: NineBoxDetail) => {
            const isKapusBox = box.boxNumber === 9;
            return (
              <div
                key={box.boxNumber}
                className={`rounded-xl border p-5 transition-all bg-white dark:bg-[#1E293B] shadow-xs hover:shadow-md ${
                  isKapusBox
                    ? 'border-[#00875A]/40 ring-1 ring-[#00875A]/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className="px-2.5 py-1 rounded-md text-[12px] font-bold"
                      style={{
                        backgroundColor: box.bgColor,
                        color: box.titleColor,
                        border: `1px solid ${box.borderColor}`,
                      }}
                    >
                      {box.code}
                    </span>
                    <h4 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {box.name}
                    </h4>
                    {isKapusBox && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8EE] text-[#00875A]">
                        <Sparkles size={12} />
                        Teladan Utama
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 self-start sm:self-auto">
                    <span className="text-[12px] font-semibold text-[#64748B] dark:text-[#94A3B8] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                      {box.level}
                    </span>
                    <span className="text-[11px] italic text-[#94A3B8]">{box.label}</span>
                  </div>
                </div>

                {/* Grid 2 Kolom: Kondisi & Makna */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Kondisi */}
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#64748B] dark:text-[#94A3B8] uppercase mb-1">
                      <Info size={13} className="text-[#0284C7]" />
                      <span>Kondisi Cabang</span>
                    </div>
                    <p className="text-[13px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                      {box.kondisi}
                    </p>
                  </div>

                  {/* Makna */}
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#64748B] dark:text-[#94A3B8] uppercase mb-1">
                      <Target size={13} className="text-[#00875A]" />
                      <span>Makna Evaluasi</span>
                    </div>
                    <p className="text-[13px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                      {box.makna}
                    </p>
                  </div>
                </div>

                {/* Tindak Lanjut */}
                <div className="p-3.5 rounded-lg bg-[#FAFDF9] dark:bg-slate-800/40 border border-[#00875A]/20">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#00875A] dark:text-[#34D399] uppercase mb-2">
                    <CheckCircle2 size={13} />
                    <span>Rekomendasi Tindak Lanjut</span>
                  </div>
                  <ul className="space-y-1.5 text-[12.5px] text-[#334155] dark:text-[#CBD5E1]">
                    {box.tindakLanjut.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] mt-1.5 shrink-0" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between">
          <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
            Sistem Evaluasi Kinerja & Potensi Bapenda Jawa Barat
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#00875A] hover:bg-[#00724C] text-white rounded-lg text-[13px] font-medium transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

export default NineBoxExplanationModal;
