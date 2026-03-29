import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const STEPS = [
  { step:"01", icon:"◎", title:"Create Your Account",  desc:"Sign up as a tenant or property owner in under 2 minutes. No hidden fees." },
  { step:"02", icon:"◈", title:"Browse or List",        desc:"Tenants explore verified properties. Owners post listings with photos & details." },
  { step:"03", icon:"◇", title:"Request & Connect",     desc:"Send rent requests directly to owners. Get responses fast — no middlemen." },
  { step:"04", icon:"◆", title:"Move In",               desc:"Finalize details, sign agreements, and settle into your perfect space." },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="bg-cream py-24 px-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs font-semibold tracking-[0.15em] text-orange uppercase mb-4">SIMPLE PROCESS</p>
          <h2 className="font-display text-[42px] font-bold text-charcoal">How Heaven Village Works</h2>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s ease ${i * 0.15}s` }}>
              <div className="w-[72px] h-[72px] rounded-full border-2 border-orange/20 bg-orange/6 flex items-center justify-center mx-auto mb-5 text-[28px] text-orange shadow-[0_4px_20px_rgba(232,98,26,0.1)]">
                {s.icon}
              </div>
              <div className="font-body text-[11px] font-bold tracking-[0.15em] text-orange/50 uppercase mb-2.5">Step {s.step}</div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">{s.title}</h3>
              <p className="font-body text-sm text-charcoal/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
