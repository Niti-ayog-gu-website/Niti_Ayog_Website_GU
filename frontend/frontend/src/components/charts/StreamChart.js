import { THEMES } from "../../utils/api";

/**
 * StreamChart — bar chart showing count by course/stream.
 * Props:
 *  - data      : array of objects with a `course` field
 *  - color     : hex color for bars (optional, defaults to primary)
 *  - title     : chart title string
 */
export default function StreamChart({ data = [], color = THEMES.primary, title = "By Course / Stream" }) {
  // Aggregate counts per course
  const counts = {};
  data.forEach((d) => {
    counts[d.course] = (counts[d.course] || 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max     = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-white">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
        {title}
      </div>

      {entries.length === 0 ? (
        <div className="text-center text-gray-300 text-sm py-8">No data</div>
      ) : (
        <div className="space-y-3">
          {entries.map(([course, count]) => (
            <div key={course} className="flex items-center gap-3">
              {/* Label */}
              <div className="text-xs text-gray-600 w-20 flex-shrink-0 truncate" title={course}>
                {course}
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700"
                  style={{
                    width:      `${(count / max) * 100}%`,
                    background: color,
                    opacity:    0.75 + (count / max) * 0.25,
                    minWidth:   "2rem",
                  }}
                >
                  <span className="text-white text-xs font-bold">{count}</span>
                </div>
              </div>

              {/* % */}
              <div className="text-xs text-gray-400 w-8 text-right flex-shrink-0">
                {Math.round((count / data.length) * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
        {data.length} total entries · {entries.length} unique streams
      </div>
    </div>
  );
}
