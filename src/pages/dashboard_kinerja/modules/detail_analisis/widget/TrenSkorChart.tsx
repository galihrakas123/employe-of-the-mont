import React from 'react';

interface TrenSkorChartProps {
  currentScore?: number;
}

export const TrenSkorChart: React.FC<TrenSkorChartProps> = ({ currentScore = 95.8 }) => {
  const scoreNum = typeof currentScore === 'number' ? currentScore : 95.8;

  // Nilai 6 bulan dihitung proporsional dari skor total unit
  const vOkt = scoreNum;
  const vSep = Math.max(10, Math.round((scoreNum - 1.0) * 10) / 10);
  const vAgs = Math.max(10, Math.round((scoreNum - 2.3) * 10) / 10);
  const vJul = Math.max(10, Math.round((scoreNum - 3.8) * 10) / 10);
  const vJun = Math.max(10, Math.round((scoreNum - 5.5) * 10) / 10);
  const vMei = Math.max(10, Math.round((scoreNum - 7.0) * 10) / 10);

  // Fungsi pemetaan nilai ke koordinat Y SVG (skala 40 s.d. 100)
  const getY = (val: number) => {
    const clamped = Math.max(40, Math.min(100, val));
    return Math.round(25 + ((100 - clamped) / 60) * 115);
  };

  const yMei = getY(vMei);
  const yJun = getY(vJun);
  const yJul = getY(vJul);
  const yAgs = getY(vAgs);
  const ySep = getY(vSep);
  const yOkt = getY(vOkt);

  // Penentuan warna tema sesuai besaran nilai
  let themeColor = '#00875A';
  let badgeText = '+4.2% ↑';
  let badgeClass = 'text-[#00875A] bg-[#E6F4EA] border-[#00875A]/20';
  let noteText = 'Konsistensi kinerja naik stabil selama 5 bulan berturut-turut';

  if (scoreNum < 60) {
    themeColor = '#DC2626';
    badgeText = 'Tren Kritis';
    badgeClass = 'text-[#DC2626] bg-[#FEE2E2] border-[#DC2626]/20';
    noteText = 'Capaian berada di zona perlu pembinaan, memerlukan akselerasi';
  } else if (scoreNum < 75) {
    themeColor = '#D97706';
    badgeText = '+2.1% ↑';
    badgeClass = 'text-[#D97706] bg-[#FEF3C7] border-[#D97706]/20';
    noteText = 'Performa menunjukkan perbaikan moderat namun perlu optimalisasi';
  } else if (scoreNum < 85) {
    themeColor = '#0284C7';
    badgeText = '+3.5% ↑';
    badgeClass = 'text-[#0284C7] bg-[#E0F2FE] border-[#0284C7]/20';
    noteText = 'Kinerja tumbuh positif dan stabil mendekati target optimal';
  }

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto flex flex-col justify-between h-full">
      {/* Title & Dynamic Badge */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-[15px] font-semibold text-[#212121]">
            Tren Kinerja 6 Periode
          </h4>
          <p className="text-[12px] text-[#757575] mt-0.5">
            Progres skor total Mei – Oktober 2026
          </p>
        </div>
        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-lg border ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      {/* SVG Chart - Mengisi Penuh Lebar Kartu */}
      <div className="w-full my-2">
        <svg viewBox="0 0 500 190" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="trenGradientDynamic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={themeColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y Axis Horizontal Grid Lines & Ticks */}
          <text x="24" y="29" fontSize="10" fill="#94A3B8" textAnchor="end" fontWeight="500">100</text>
          <line x1="32" y1="25" x2="480" y2="25" stroke="#F1F5F9" strokeWidth="1.2" />

          <text x="24" y="65" fontSize="10" fill="#94A3B8" textAnchor="end" fontWeight="500">80</text>
          <line x1="32" y1="62" x2="480" y2="62" stroke="#F1F5F9" strokeWidth="1.2" />

          <text x="24" y="103" fontSize="10" fill="#94A3B8" textAnchor="end" fontWeight="500">60</text>
          <line x1="32" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1.2" />

          <text x="24" y="142" fontSize="10" fill="#94A3B8" textAnchor="end" fontWeight="500">40</text>
          <line x1="32" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeWidth="1.2" />

          {/* Shaded Area under curve */}
          <polygon
            points={`48,${yMei} 130,${yJun} 215,${yJul} 300,${yAgs} 385,${ySep} 465,${yOkt} 465,145 48,145`}
            fill="url(#trenGradientDynamic)"
          />

          {/* Dotted guideline for the current month */}
          <line
            x1="465"
            y1={yOkt}
            x2="465"
            y2="145"
            stroke={themeColor}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.5"
          />

          {/* Trend line connecting all months */}
          <polyline
            points={`48,${yMei} 130,${yJun} 215,${yJul} 300,${yAgs} 385,${ySep} 465,${yOkt}`}
            fill="none"
            stroke={themeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          <circle cx="48" cy={yMei} r="4.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="130" cy={yJun} r="4.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="215" cy={yJul} r="4.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="300" cy={yAgs} r="4.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="385" cy={ySep} r="4.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="465" cy={yOkt} r="5.5" fill={themeColor} stroke="#FFFFFF" strokeWidth="3" />

          {/* Value Labels Above Circles */}
          <text x="48" y={yMei - 9} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="600">{vMei.toFixed(1)}</text>
          <text x="130" y={yJun - 9} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="600">{vJun.toFixed(1)}</text>
          <text x="215" y={yJul - 9} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="600">{vJul.toFixed(1)}</text>
          <text x="300" y={yAgs - 9} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="600">{vAgs.toFixed(1)}</text>
          <text x="385" y={ySep - 9} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="600">{vSep.toFixed(1)}</text>
          <text x="465" y={yOkt - 11} fontSize="12" fill={themeColor} textAnchor="middle" fontWeight="800">
            {vOkt.toFixed(1)}
          </text>

          {/* Month Labels on X Axis */}
          <text x="48" y="165" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="500">Mei</text>
          <text x="130" y="165" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="500">Jun</text>
          <text x="215" y="165" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="500">Jul</text>
          <text x="300" y="165" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="500">Ags</text>
          <text x="385" y="165" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="500">Sep</text>
          <text x="465" y="165" fontSize="11.5" fill={themeColor} textAnchor="middle" fontWeight="700">Okt</text>
        </svg>
      </div>

      {/* Footer Insight Note */}
      <div className="pt-3 border-t border-[#F1F5F9] text-center text-[12px] text-[#64748B]">
        {noteText}
      </div>
    </div>
  );
};

export default TrenSkorChart;
