import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const STATS = [
  { value: "12,400+", label: "Properties Listed" },
  { value: "8,200+",  label: "Happy Tenants" },
  { value: "3,100+",  label: "Verified Owners" },
  { value: "98%",     label: "Satisfaction Rate" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="bg-white border-t border-b border-gray-100 py-16 px-12 shadow-[0_2px_20px_rgba(26,26,46,0.04)]">
      <div className="max-w-5xl mx-auto grid grid-cols-4 gap-10">
        {STATS.map((s, i) => (
          <div key={i} className="text-center transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 0.1}s` }}>
            <div className="font-display text-[42px] font-bold orange-text mb-2">{s.value}</div>
            <div className="font-body text-sm text-charcoal/50 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
