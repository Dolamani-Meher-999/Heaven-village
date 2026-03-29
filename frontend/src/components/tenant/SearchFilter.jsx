import { useState } from "react";
const AMENITIES = ["WiFi","AC","Parking","Gym","Pool","Furnished","Pets Allowed"];

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({ city:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"", amenities:[] });
  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const toggleAmenity = (a) => setFilters((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));
  const handleReset  = () => { const r = { city:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"", amenities:[] }; setFilters(r); onFilter?.(r); };

  return (
    <aside className="w-72 shrink-0">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-bold text-charcoal">Filters</h3>
          <button onClick={handleReset} className="font-body text-xs text-orange hover:underline">Reset All</button>
        </div>

        <div className="flex flex-col gap-5">
          {/* City */}
          <div>
            <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">City</label>
            <input value={filters.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Mumbai, Bangalore..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all" />
          </div>

          {/* Type */}
          <div>
            <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Property Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["apartment","house","villa","pg"].map((t) => (
                <button key={t} onClick={() => set("propertyType", filters.propertyType === t ? "" : t)}
                  className={`py-2 rounded-xl font-body text-xs font-semibold capitalize transition-all duration-200 ${
                    filters.propertyType === t ? "orange-gradient text-white shadow-orange" : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Price Range (₹/month)</label>
            <div className="flex gap-2">
              <input value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} placeholder="Min" type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-charcoal text-sm font-body focus:border-orange/40 transition-all" />
              <input value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} placeholder="Max" type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-charcoal text-sm font-body focus:border-orange/40 transition-all" />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Bedrooms</label>
            <div className="flex gap-2">
              {["Any","1","2","3","4+"].map((b) => (
                <button key={b} onClick={() => set("bedrooms", b === "Any" ? "" : b)}
                  className={`flex-1 py-2 rounded-xl font-body text-xs font-semibold transition-all duration-200 ${
                    (b === "Any" && !filters.bedrooms) || filters.bedrooms === b ? "orange-gradient text-white" : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{b}</button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button key={a} onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-200 ${
                    filters.amenities.includes(a) ? "bg-orange/10 border border-orange text-orange" : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <button onClick={() => onFilter?.(filters)}
            className="w-full orange-gradient py-3 rounded-xl font-body text-sm font-bold text-white tracking-wide hover:opacity-90 transition-opacity shadow-orange mt-2">
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
