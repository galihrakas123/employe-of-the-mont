import React, { useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown, Eye, EyeOff } from 'lucide-react';
import treeData from '@/services/kpiKepalaP3dwV2.json';
import { GRID, ScoreBar, ScoreChip, ToggleButton, fmt, fmtBobot } from './TrenPenilaianTable';

// Tree penilaian versi 2 (KPI Kepala P3DW): Skor Akhir → 2 sumbu → area → KPI.
// Sumber data: kpiKepalaP3dwV2.json. Section awalnya tersembunyi, klik Tampilkan untuk membuka.

interface Kpi {
  number: number;
  name: string;
  weight_percent: number;
  achievement_percent: number;
  target: string;
  score: number;
  max_score: number;
  points: number;
  lower_is_better: boolean;
  data_source: string;
  area_code: string;
}

const data = treeData as typeof treeData & { kpis: Kpi[] };

const AXIS_TONE: Record<string, string> = {
  Y: 'bg-[#E6F4EA] text-[#00573A] dark:bg-[#00875A]/20 dark:text-[#6EE7B7]',
  X: 'bg-[#E0F2FE] text-[#075985] dark:bg-[#0284C7]/20 dark:text-[#7DD3FC]',
};

export const TrenPenilaianTableV2: React.FC = () => {
  const allIds = [...data.axes.map((a) => a.code), ...data.areas.map((a) => a.code)];
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set(allIds));
  const [info, setInfo] = useState<Set<number>>(new Set());

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, key: T) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const kpiCount = data.kpis.length;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E0E0E0] dark:border-[#334155] shadow-sm p-6 font-roboto">
      {/* Judul, tombol buka/tutup semua, dan tombol sembunyikan section */}
      <div className={`flex flex-wrap items-start justify-between gap-3 ${visible ? 'mb-4' : ''}`}>
        <div>
          <h3 className="text-[16px] font-semibold text-[#212121] dark:text-[#F8FAFC]">
            Tree Penilaian {kpiCount} KPI{' '}
            <span className="ml-1 align-middle inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E0F2FE] text-[#075985] dark:bg-[#0284C7]/20 dark:text-[#7DD3FC]">
              Versi 2
            </span>
          </h3>
          <p className="text-[12px] text-[#757575] dark:text-[#94A3B8] mt-0.5">{data.description}</p>
        </div>
        <div className="flex gap-2">
          {visible && (
            <>
              <button
                type="button"
                onClick={() => setOpen(new Set(allIds))}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium text-[#00875A] dark:text-[#34D399] bg-[#E6F4EA] dark:bg-[#00875A]/20 border border-[#00875A]/20 hover:bg-[#D4EDDA] transition cursor-pointer"
              >
                <ChevronsUpDown size={14} /> Buka semua
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(new Set());
                  setInfo(new Set());
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium text-[#475569] dark:text-[#E2E8F0] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                <ChevronsDownUp size={14} /> Tutup semua
              </button>
            </>
          )}
          <button
            type="button"
            aria-expanded={visible}
            onClick={() => setVisible((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium text-[#475569] dark:text-[#E2E8F0] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] transition cursor-pointer"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />} {visible ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
      </div>

      {visible && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[700px] flex flex-col gap-2">
              {/* Header kolom */}
              <div className={`${GRID} px-3.5 text-[11px] font-bold tracking-wide text-[#64748B] dark:text-[#94A3B8]`}>
                <span>KOMPONEN</span>
                <span className="text-right">CAPAIAN / TARGET</span>
                <span>VS TARGET</span>
                <span className="text-right">SKOR</span>
                <span className="text-right">POIN</span>
              </div>

              {/* Skor akhir + posisi matriks */}
              <div className={`${GRID} px-3.5 py-3 rounded-xl bg-[#00875A] text-white`}>
                <span className="min-w-0">
                  <span className="text-[15px] font-bold">
                    {data.final_score.label} · {data.final_score.rating}
                  </span>
                  <span className="block text-[12px] font-medium opacity-90">
                    Box {data.matrix.box} (Y {data.matrix.y_rating} · X {data.matrix.x_rating}): {data.matrix.meaning}
                  </span>
                </span>
                <span />
                <span />
                <span className="text-right text-[15px] font-bold tabular-nums">{fmt(data.final_score.score)}</span>
                <span className="text-right text-[15px] font-bold tabular-nums">{fmt(data.final_score.points)}</span>
              </div>

              {data.axes.map((axis) => {
                const areas = data.areas.filter((a) => a.axis === axis.code);
                const isOpen = open.has(axis.code);

                return (
                  <div key={axis.code} className="flex flex-col gap-1">
                    <div className={`${GRID} px-3.5 py-2 rounded-xl ${AXIS_TONE[axis.code]}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <ToggleButton
                          open={isOpen}
                          onClick={() => toggle<string>(setOpen, axis.code)}
                          label={`${isOpen ? 'Tutup' : 'Buka'} Sumbu ${axis.code}`}
                          size="md"
                          tone="light"
                        />
                        <span className="text-[14.5px] font-bold whitespace-nowrap">
                          Sumbu {axis.code} – {axis.name}
                        </span>
                        <span className="text-[12px] font-medium opacity-80 truncate" title={axis.question}>
                          {axis.component} ({fmtBobot(axis.weight_percent)})
                        </span>
                      </div>
                      <span className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/70 dark:bg-white/10">
                          {axis.rating}
                        </span>
                      </span>
                      <span />
                      <span className="text-right text-[15px] font-bold tabular-nums">{fmt(axis.score)}</span>
                      <span className="text-right text-[15px] font-bold tabular-nums">{fmt(axis.points)}</span>
                    </div>

                    {isOpen && (
                      <div className="tkids ml-[26px]">
                        {areas.map((area) => {
                          const areaKpis = data.kpis.filter((k) => k.area_code === area.code);
                          const areaOpen = open.has(area.code);
                          return (
                            <div key={area.code} className="tnode">
                              <div className={`${GRID} min-h-[46px] pl-1.5 pr-3.5`}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <ToggleButton
                                    open={areaOpen}
                                    onClick={() => toggle<string>(setOpen, area.code)}
                                    label={`${areaOpen ? 'Tutup' : 'Buka'} Area ${area.code}`}
                                  />
                                  <span className="text-[14px] font-bold text-[#0F172A] dark:text-[#F8FAFC] min-w-0">
                                    Area {area.code} · {area.name}{' '}
                                    <span className="font-medium text-[#64748B] dark:text-[#94A3B8]">({fmtBobot(area.weight)})</span>
                                  </span>
                                </div>
                                <span className="text-right text-[11px] text-[#94A3B8]">{area.kpi_count} KPI</span>
                                <ScoreBar skor={area.score} />
                                <span className="text-right">
                                  <ScoreChip skor={area.score} />
                                </span>
                                <span className="text-right text-[13.5px] font-bold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
                                  {fmt(area.points)}
                                </span>
                              </div>

                              {areaOpen && (
                                <div className="tkids">
                                  {areaKpis.map((kpi) => {
                                    const infoOpen = info.has(kpi.number);
                                    return (
                                      <div key={kpi.number} className="tnode">
                                        <div className={`${GRID} min-h-[46px] pl-1 pr-3.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03]`}>
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[13px] font-medium text-[#1E293B] dark:text-[#E2E8F0] min-w-0">
                                              {kpi.number}. {kpi.name}
                                              {kpi.lower_is_better && <span title="Makin rendah makin baik"> ↓</span>}{' '}
                                              <span className="text-[#64748B] dark:text-[#94A3B8]">({fmtBobot(kpi.weight_percent)})</span>
                                            </span>
                                            <button
                                              type="button"
                                              aria-expanded={infoOpen}
                                              aria-label={`Detail KPI ${kpi.number}`}
                                              onClick={() => toggle(setInfo, kpi.number)}
                                              className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                                            >
                                              <span
                                                className={`w-[18px] h-[18px] rounded-full text-white text-[11px] font-bold italic font-serif flex items-center justify-center transition ${
                                                  infoOpen ? 'bg-[#00875A]' : 'bg-[#0284C7] hover:bg-[#0369A1]'
                                                }`}
                                              >
                                                i
                                              </span>
                                            </button>
                                          </div>
                                          <span className="text-right text-[12.5px] text-[#475569] dark:text-[#94A3B8] tabular-nums">
                                            <b className="text-[#0F172A] dark:text-[#F8FAFC]">{fmt(kpi.achievement_percent)}%</b> / {kpi.target}
                                          </span>
                                          <ScoreBar skor={kpi.score} />
                                          <span className="text-right">
                                            <ScoreChip skor={kpi.score} />
                                          </span>
                                          <span className="text-right text-[13px] font-semibold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
                                            {fmt(kpi.points)}
                                          </span>
                                        </div>

                                        {infoOpen && (
                                          <div className="mx-3.5 mb-2 ml-9 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] px-3.5 py-2.5 flex flex-col gap-1 text-[12.5px] text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                                            <span>
                                              <b className="text-[#0F172A] dark:text-[#F8FAFC]">Sumber data:</b> {kpi.data_source}
                                            </span>
                                            <span>
                                              <b className="text-[#0F172A] dark:text-[#F8FAFC]">Arah:</b>{' '}
                                              {kpi.lower_is_better ? 'makin rendah makin baik' : 'makin tinggi makin baik'} · skor maks.{' '}
                                              {kpi.max_score}
                                              {kpi.achievement_percent > kpi.max_score &&
                                                ` (capaian ${fmt(kpi.achievement_percent)}% dibatasi ke ${kpi.max_score})`}
                                            </span>
                                            {kpi.target.includes('*') && (
                                              <span className="text-[#B45309] dark:text-[#FBBF24]">Target masih usulan dan perlu ditetapkan.</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keterangan warna & catatan */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t border-[#F1F5F9] dark:border-[#334155] text-[11.5px] text-[#475569] dark:text-[#CBD5E1]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#00875A]" />
              {data.legend.above_target}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#D97706]" />
              {data.legend.near_target}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#DC2626]" />
              {data.legend.below_target}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-[2px] h-3 bg-[#0F172A] dark:bg-[#F8FAFC] opacity-50" />
              {data.legend.target_line}
            </span>
          </div>
          <ul className="mt-2 text-[11.5px] text-[#64748B] dark:text-[#94A3B8] list-disc pl-4 space-y-0.5">
            <li>Rating sumbu: {data.legend.axis_rating}</li>
            <li>Predikat akhir: {data.legend.final_rating}</li>
            {data.legend.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TrenPenilaianTableV2;
