import { useEffect, useRef, useState } from "react";

function AnimCounter({ target, suffix = "", duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = null;
        const tick = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          setVal(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setVal(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * StatCard
 * Props:
 *  - label      : string  — card title
 *  - value      : number  — animated target number
 *  - suffix     : string  — e.g. "%" or "+"
 *  - icon       : string  — emoji
 *  - color      : string  — hex accent color
 *  - sublabel   : string  — optional small descriptor below
 *  - noAnimate  : boolean — skip counter animation (use for years, IDs, etc.)
 */
export default function StatCard({ label, value, suffix = "", icon, color, sublabel, noAnimate = false }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:shadow-md hover:border-gray-100 transition-all duration-200 group">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-3xl font-black leading-none mb-1" style={{ color }}>
        {noAnimate
          ? <span>{value}{suffix}</span>
          : <AnimCounter target={value} suffix={suffix} />
        }
      </div>
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      {sublabel && (
        <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
      )}
    </div>
  );
}