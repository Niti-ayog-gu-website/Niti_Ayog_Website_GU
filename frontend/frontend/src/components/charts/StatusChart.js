/**
 * StatusChart — SVG donut for Employed / Unemployed / Underemployed split.
 * Props:
 *  - data : array of objects with a `status` field
 */
const STATUS_CONFIG = [
  { key: "Employed",      color: "#10B981", label: "Employed"      },
  { key: "Unemployed",    color: "#EF4444", label: "Unemployed"    },
  { key: "Underemployed", color: "#F59E0B", label: "Underemployed" },
];

export default function StatusChart({ data = [] }) {
  const total = data.length || 1;
  const SIZE  = 90;
  const CX    = SIZE / 2;
  const CY    = SIZE / 2;
  const R     = 32;
  const HOLE  = 20;

  const counts = STATUS_CONFIG.map((s) => ({
    ...s,
    value: data.filter((d) => d.status === s.key).length,
  }));

  let startAngle = -90;
  const arcs = counts.map((seg) => {
    const sweep = (seg.value / total) * 360;
    const start = startAngle;
    startAngle += sweep;
    if (sweep >= 360) {
      return { ...seg, d: `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R} Z` };
    }
    const toRad = (d) => (d * Math.PI) / 180;
    const sx = CX + R * Math.cos(toRad(start));
    const sy = CY + R * Math.sin(toRad(start));
    const ex = CX + R * Math.cos(toRad(start + sweep));
    const ey = CY + R * Math.sin(toRad(start + sweep));
    return {
      ...seg,
      d: `M ${sx} ${sy} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${ex} ${ey} L ${CX} ${CY} Z`,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-white">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Employment Status
      </div>
      <div className="flex items-center gap-6">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {arcs.map((a, i) => (
            <path key={i} d={a.d} fill={a.color} opacity={0.85} />
          ))}
          <circle cx={CX} cy={CY} r={HOLE} fill="white" />
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="#374151">
            {data.length}
          </text>
        </svg>

        <div className="space-y-2.5 flex-1">
          {counts.map((seg) => (
            <div key={seg.key} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-xs text-gray-600 flex-1">{seg.label}</span>
              <span className="text-xs font-bold text-gray-900">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini progress bars */}
      <div className="mt-4 space-y-1.5">
        {counts.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div className="text-xs text-gray-400 w-24 truncate">{seg.label}</div>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }}
              />
            </div>
            <div className="text-xs text-gray-400 w-8 text-right">
              {Math.round((seg.value / total) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
