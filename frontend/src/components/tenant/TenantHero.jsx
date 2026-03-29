import { useState } from "react";

export default function TenantHero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [type,  setType]  = useState("");
  const user = JSON.parse(localStorage.getItem("hv_user") || "{}");

  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/88 via-charcoal/75 to-cream" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/12 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-orange" />
          <span className="font-body text-xs font-semibold tracking-[0.12em] text-white uppercase">
            Welcome back, {user?.name?.split(" ")[0] || "Tenant"}
          </span>
        </div>

        <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
          Find Your Next{" "}
          <span style={{background:"linear-gradient(135deg,#E8621A,#F5874A)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Perfect Home
          </span>
        </h1>
        <p className="font-body text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Browse thousands of verified properties. Filter by location, budget, and type.
        </p>

        <div className="max-w-2xl mx-auto flex bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-center px-4 text-charcoal/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.({ query, type })}
            placeholder="Search by city, locality or landmark..."
            className="flex-1 bg-transparent border-none py-4 text-charcoal text-[15px] font-body placeholder:text-charcoal/35" />
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="bg-gray-50 border-l border-gray-100 text-charcoal/55 px-4 text-sm font-body cursor-pointer">
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="pg">PG</option>
          </select>
          <button onClick={() => onSearch?.({ query, type })}
            className="orange-gradient px-7 text-white text-sm font-bold font-body tracking-wide hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-8">
          {[{ value:"12,400+", label:"Properties" }, { value:"98%", label:"Verified" }, { value:"24hrs", label:"Avg Response" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-xl font-bold text-white">{s.value}</div>
              <div className="font-body text-xs text-white/45 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
