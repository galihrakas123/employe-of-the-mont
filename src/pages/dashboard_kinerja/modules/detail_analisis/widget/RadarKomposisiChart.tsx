import React from 'react';

interface RadarKomposisiChartProps {
  scores?: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
  };
}

export const RadarKomposisiChart: React.FC<RadarKomposisiChartProps> = ({
  scores = { a: 96, b: 95, c: 96, d: 94, e: 97 },
}) => {
  const avg = (scores.a + scores.b + scores.c + scores.d + scores.e) / 5;

  // Center & max radius
  const cx = 120;
  const cy = 100;
  const maxR = 72;

  // Calculate dynamic coordinates for each axis
  const getPoint = (scoreVal: number, angleDeg: number) => {
    const r = (Math.max(15, Math.min(100, scoreVal)) / 100) * maxR;
    const rad = (angleDeg * Math.PI) / 180;
    const x = Math.round(cx + r * Math.cos(rad));
    const y = Math.round(cy + r * Math.sin(rad));
    return { x, y };
  };

  const pA = getPoint(scores.a, -90);
  const pB = getPoint(scores.b, -18);
  const pC = getPoint(scores.c, 54);
  const pD = getPoint(scores.d, 126);
  const pE = getPoint(scores.e, 198);

  const polygonPoints = `${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y} ${pE.x},${pE.y}`;

  // Color theme according to average score
  let strokeColor = '#00875A';
  let fillColor = 'rgba(0, 135, 90, 0.18)';
  if (avg < 60) {
    strokeColor = '#DC2626';
    fillColor = 'rgba(220, 38, 38, 0.18)';
  } else if (avg < 75) {
    strokeColor = '#D97706';
    fillColor = 'rgba(217, 119, 6, 0.18)';
  } else if (avg < 85) {
    strokeColor = '#0284C7';
    fillColor = 'rgba(2, 132, 199, 0.18)';
  }

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto flex flex-col justify-between">
      <div className="mb-2">
        <h4 className="text-[15px] font-semibold text-[#212121]">
          Komposisi 5 Pilar Kinerja
        </h4>
        <p className="text-[12px] text-[#757575] mt-0.5">
          Distribusi capaian pilar penilaian strategis
        </p>
      </div>

      <div className="w-full flex items-center justify-center my-2">
        <svg viewBox="0 0 240 210" className="w-full max-h-[190px]">
          {/* Pentagon web lines */}
          <polygon points="120,25 195,75 168,160 72,160 45,75" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <polygon points="120,50 170,85 152,142 88,142 70,85" fill="none" stroke="#F1F5F9" strokeWidth="1" />
          <polygon points="120,75 145,95 136,124 104,124 95,95" fill="none" stroke="#F8FAFC" strokeWidth="1" />

          {/* Web center spoke lines */}
          <line x1="120" y1="100" x2="120" y2="25" stroke="#CBD5E1" strokeDasharray="2" />
          <line x1="120" y1="100" x2="195" y2="75" stroke="#CBD5E1" strokeDasharray="2" />
          <line x1="120" y1="100" x2="168" y2="160" stroke="#CBD5E1" strokeDasharray="2" />
          <line x1="120" y1="100" x2="72" y2="160" stroke="#CBD5E1" strokeDasharray="2" />
          <line x1="120" y1="100" x2="45" y2="75" stroke="#CBD5E1" strokeDasharray="2" />

          {/* Provinsi benchmark (grey dashed) */}
          <polygon
            points="120,45 175,82 155,145 85,145 65,82"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3"
          />

          {/* Unit Dynamic Polygon */}
          <polygon
            points={polygonPoints}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
          <circle cx={pA.x} cy={pA.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx={pB.x} cy={pB.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx={pC.x} cy={pC.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx={pD.x} cy={pD.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />
          <circle cx={pE.x} cy={pE.y} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />

          {/* Axis Labels */}
          <text x="120" y="16" textAnchor="middle" fontSize="8" fill="#1E293B" fontWeight="700">A. Fiskal ({scores.a})</text>
          <text x="202" y="78" textAnchor="start" fontSize="8" fill="#1E293B" fontWeight="700">B. WP ({scores.b})</text>
          <text x="175" y="174" textAnchor="middle" fontSize="8" fill="#1E293B" fontWeight="700">C. Proses ({scores.c})</text>
          <text x="65" y="174" textAnchor="middle" fontSize="8" fill="#1E293B" fontWeight="700">D. Budaya ({scores.d})</text>
          <text x="38" y="78" textAnchor="end" fontSize="8" fill="#1E293B" fontWeight="700">E. SDM ({scores.e})</text>
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeColor }} /> Capaian Unit ({avg.toFixed(1)})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 border-t-2 border-dashed border-[#94A3B8]" /> Rata-rata Jabar
        </span>
      </div>
    </div>
  );
};

export default RadarKomposisiChart;
