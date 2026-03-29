import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const FEATURED = [
  { id:1, img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", title:"Skyline Residency",    location:"Banjara Hills, Hyderabad", price:"₹28,000", beds:3, baths:2, area:"1,450 sq ft", tag:"Premium" },
  { id:2, img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", title:"The Garden Villas",   location:"Koramangala, Bengaluru",  price:"₹42,000", beds:4, baths:3, area:"2,200 sq ft", tag:"New" },
  { id:3, img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", title:"Urban Nest Apartments",location:"Andheri West, Mumbai",    price:"₹35,000", beds:2, baths:2, area:"980 sq ft",   tag:"Popular" },
];

export default function FeaturedProperties() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="bg-white py-24 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-body text-xs font-semibold tracking-[0.15em] text-orange uppercase mb-4">HANDPICKED FOR YOU</p>
            <h2 className="font-display text-[42px] font-bold text-charcoal">Featured Properties</h2>
          </div>
          <a href="#" className="font-body text-sm font-semibold text-orange tracking-wide border-b border-orange/30 pb-0.5 hover:border-orange transition-colors">
            View All Properties →
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {FEATURED.map((p, i) => (
            <div key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s ease ${i * 0.15}s` }}>
              <div className="relative h-[220px]">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-3.5 left-3.5 orange-gradient text-white text-[11px] font-bold font-body px-2.5 py-1 rounded-md">
                  {p.tag}
                </div>
              </div>
              <div className="p-5 pb-6">
                <h3 className="font-display text-xl font-bold text-charcoal mb-1.5">{p.title}</h3>
                <p className="font-body text-sm text-charcoal/45 mb-4 flex items-center gap-1">
                  <span className="text-orange text-xs">📍</span> {p.location}
                </p>
                <div className="flex gap-4 pb-4 mb-4 border-b border-gray-100">
                  <span className="font-body text-xs text-charcoal/50">🛏 {p.beds} Beds</span>
                  <span className="font-body text-xs text-charcoal/50">🚿 {p.baths} Baths</span>
                  <span className="font-body text-xs text-charcoal/50">📐 {p.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-[22px] font-bold text-orange">{p.price}</span>
                    <span className="font-body text-xs text-charcoal/35 ml-1">/month</span>
                  </div>
                  <button className="font-body text-xs font-semibold text-orange tracking-wide px-4 py-2 rounded-lg bg-orange/8 border border-orange/20 hover:bg-orange/15 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
