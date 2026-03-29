import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ filters, onRequestRent }) {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy,     setSortBy]     = useState("newest");

  const fetchProperties = async (pageNum = 1) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum); params.set("limit", 9);
      if (filters?.query)        params.set("city",         filters.query);
      if (filters?.city)         params.set("city",         filters.city);
      if (filters?.type)         params.set("propertyType", filters.type);
      if (filters?.propertyType) params.set("propertyType", filters.propertyType);
      if (filters?.minPrice)     params.set("minPrice",     filters.minPrice);
      if (filters?.maxPrice)     params.set("maxPrice",     filters.maxPrice);
      if (filters?.bedrooms && filters.bedrooms !== "Any") params.set("bedrooms", filters.bedrooms);
      const hasFilter = Object.values(filters || {}).some((v) => v && v.length > 0);
      const endpoint  = hasFilter ? `/api/properties/search?${params}` : `/api/properties?${params}`;
      const res  = await fetch(`http://localhost:5000${endpoint}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(data.data || []); setTotalPages(data.totalPages || 1); setPage(pageNum);
    } catch (err) { setError(err.message || "Failed to load properties"); }
    finally       { setLoading(false); }
  };

  useEffect(() => { fetchProperties(1); }, [filters]);

  const sorted = [...properties].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-charcoal/50 text-sm">{loading ? "Loading..." : `${properties.length} properties found`}</p>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-charcoal/60 text-sm font-body focus:border-orange/40 cursor-pointer shadow-sm">
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading && (
        <div className="grid grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card animate-pulse">
              <div className="h-52 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                <div className="h-3 bg-gray-100 rounded-lg w-full" />
                <div className="h-9 bg-gray-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">Failed to Load</h3>
          <p className="font-body text-charcoal/40 text-sm mb-6">{error}</p>
          <button onClick={() => fetchProperties(1)} className="orange-gradient px-6 py-2.5 rounded-xl font-body text-sm font-bold text-white shadow-orange">Try Again</button>
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🏘️</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Properties Found</h3>
          <p className="font-body text-charcoal/40 text-sm">Try adjusting your search filters</p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-5">
            {sorted.map((p) => <PropertyCard key={p._id} property={p} onRequestRent={onRequestRent} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => fetchProperties(page - 1)} disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 font-body text-sm text-charcoal/60 hover:border-orange/30 hover:text-orange transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => fetchProperties(i + 1)}
                  className={`w-9 h-9 rounded-xl font-body text-sm font-semibold transition-all shadow-sm ${
                    page === i + 1 ? "orange-gradient text-white shadow-orange" : "bg-white border border-gray-200 text-charcoal/60 hover:border-orange/30"
                  }`}>{i + 1}</button>
              ))}
              <button onClick={() => fetchProperties(page + 1)} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 font-body text-sm text-charcoal/60 hover:border-orange/30 hover:text-orange transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
