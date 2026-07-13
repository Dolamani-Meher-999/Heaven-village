import { useState, useEffect } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=90",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90",
  "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1600&q=90",
];

export default function Hero({ onRegister }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((i) => (i + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center">
      {IMAGES.map((img, i) => (
        <div key={i} className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms]"
          style={{ backgroundImage: `url(${img})`, opacity: i === current ? 1 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-charcoal/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

      {/* Orange accent line */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[3px] h-44 bg-gradient-to-b from-transparent via-orange to-transparent" />

      <div className="relative z-10 pl-20 pr-12 max-w-3xl animate-fadeUp">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-7">
          <div className="w-1.5 h-1.5 rounded-full bg-orange" />
          <span className="font-body text-xs font-semibold tracking-[0.15em] text-white uppercase">
            India's Premium Rental Platform
          </span>
        </div>

        <h1 className="font-display text-[clamp(42px,6vw,76px)] font-bold text-white leading-[1.1] mb-6 tracking-tight">
          Find Your Perfect<br />
          <span style={{background:"linear-gradient(135deg,#E8621A,#F5874A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
            Place to Call Home
          </span>
        </h1>

        <p className="font-body text-lg text-white/65 leading-relaxed mb-10 max-w-lg">
          Heaven Village connects tenants with verified property owners across India.
          Transparent. Fast. Trusted by thousands.
        </p>

        {/* Search Bar */}
        <div className="flex max-w-[580px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)] mb-8">
          <div className="flex items-center px-4 text-charcoal/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input placeholder="Search by city, area or locality..."
            className="flex-1 bg-transparent border-none py-4 text-charcoal text-[15px] font-body placeholder:text-charcoal/40" />
          <select className="bg-gray-50 border-l border-gray-200 text-charcoal/60 px-4 text-sm font-body cursor-pointer">
            <option>All Types</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Villa</option>
            <option>PG</option>
          </select>
          <button className="orange-gradient px-7 text-white text-sm font-bold font-body tracking-wide hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onRegister}
            className="orange-gradient px-8 py-3.5 rounded-xl text-white text-[15px] font-bold font-body tracking-wide shadow-orange hover:opacity-90 transition-opacity">
            Browse Properties
          </button>
          <button className="bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-3.5 rounded-xl text-white text-[15px] font-body hover:bg-white/20 transition-all duration-200">
            List Your Property →
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)}
            className="h-[3px] rounded-sm cursor-pointer transition-all duration-300"
            style={{ width: i === current ? 28 : 8, background: i === current ? "#E8621A" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </section>
  );
}
