import { useState } from "react";
const AMENITIES = ["WiFi", "AC", "Parking", "Gym", "Pool", "Furnished", "Pets Allowed"];

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    city: "", propertyType: "", minPrice: "", maxPrice: "", bedrooms: "", amenities: [],
  });

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const toggleAmenity = (a) => setFilters((f) => ({
    ...f,
    amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
  }));
  const handleReset = () => {
    const r = { city: "", propertyType: "", minPrice: "", maxPrice: "", bedrooms: "", amenities: [] };
    setFilters(r);
    onFilter?.(r);
  };

  return (
    <aside className="w-52 shrink-0 self-start sticky top-24">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-bold text-charcoal">Filters</h3>
          <button onClick={handleReset} className="font-body text-xs text-orange hover:underline">Reset</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-body text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1.5 block">City</label>
            <input value={filters.city} onChange={(e) => set("city", e.target.value)}
              placeholder="Mumbai, Bangalore..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal text-xs font-body focus:border-orange/40 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="font-body text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1.5 block">Property Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {["apartment", "house", "villa", "pg"].map((t) => (
                <button key={t} onClick={() => set("propertyType", filters.propertyType === t ? "" : t)}
                  className={`py-1.5 rounded-lg font-body text-[11px] font-semibold capitalize transition-all duration-200 ${
                    filters.propertyType === t
                      ? "orange-gradient text-white shadow-orange"
                      : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1.5 block">Price (₹/month)</label>
            <div className="flex gap-1.5">
              <input value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)}
                placeholder="Min" type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-charcoal text-xs font-body focus:border-orange/40 transition-all" />
              <input value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)}
                placeholder="Max" type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-charcoal text-xs font-body focus:border-orange/40 transition-all" />
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1.5 block">Bedrooms</label>
            <div className="flex gap-1">
              {["Any", "1", "2", "3", "4+"].map((b) => (
                <button key={b} onClick={() => set("bedrooms", b === "Any" ? "" : b)}
                  className={`flex-1 py-1.5 rounded-lg font-body text-[11px] font-semibold transition-all duration-200 ${
                    (b === "Any" && !filters.bedrooms) || filters.bedrooms === b
                      ? "orange-gradient text-white"
                      : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{b}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1.5 block">Amenities</label>
            <div className="flex flex-wrap gap-1.5">
              {AMENITIES.map((a) => (
                <button key={a} onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 rounded-full font-body text-[11px] font-medium transition-all duration-200 ${
                    filters.amenities.includes(a)
                      ? "bg-orange/10 border border-orange text-orange"
                      : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <button onClick={() => onFilter?.(filters)}
            className="w-full orange-gradient py-2.5 rounded-xl font-body text-xs font-bold text-white tracking-wide hover:opacity-90 transition-opacity shadow-orange mt-1">
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
