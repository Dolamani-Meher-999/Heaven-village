import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const TYPES = [
  { icon: "🏢", label: "Apartments", count: "4,200+ listings", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
  { icon: "🏠", label: "Houses",     count: "3,100+ listings", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80" },
  { icon: "🏨", label: "PG / Hostels",count: "2,800+ listings",img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { icon: "🏡", label: "Villas",     count: "1,300+ listings", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
];

export default function PropertyTypes() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="bg-cream py-24 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-body text-xs font-semibold tracking-[0.15em] text-orange uppercase mb-4">EXPLORE BY TYPE</p>
          <h2 className="font-display text-[42px] font-bold text-charcoal tracking-tight">
            Every Kind of Home,<br />One Platform
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {TYPES.map((t, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden h-[280px] cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s ease ${i * 0.12}s` }}>
              <img src={t.img} alt={t.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="text-2xl mb-1.5">{t.icon}</div>
                <div className="font-display text-xl font-bold text-white mb-1">{t.label}</div>
                <div className="font-body text-xs font-semibold text-orange-light">{t.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
