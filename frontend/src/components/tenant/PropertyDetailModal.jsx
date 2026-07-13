import { useEffect } from "react";

export default function PropertyDetailModal({ property, onClose, onRequestRent }) {
  const {
    title = "", location = {}, price = 0, propertyType = "apartment",
    bedrooms, bathrooms, area, images = [], owner = {},
    availabilityStatus = "available", description = "",
    amenities = [], createdAt,
  } = property;

  const imgUrl = images?.[0]?.url || images?.[0]
    || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  const typeColors = {
    apartment: { bg: "#EFF6FF", color: "#1D4ED8" },
    house:     { bg: "#F0FDF4", color: "#15803D" },
    villa:     { bg: "#F5F3FF", color: "#6D28D9" },
    pg:        { bg: "#FFF7ED", color: "#C2410C" },
  };
  const tc = typeColors[propertyType] || typeColors.apartment;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(26,26,46,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col"
        style={{ boxShadow: "0 32px 80px rgba(26,26,46,0.3)", animation: "slideUp 0.25s ease" }}
      >
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* Image header */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden">
          <img src={imgUrl} alt={title} className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,26,46,0.6) 0%, transparent 50%)" }} />

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal/70 hover:text-charcoal transition-colors font-bold text-lg shadow-md">
            ✕
          </button>

          {/* Type badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold font-body capitalize"
              style={{ background: tc.bg, color: tc.color }}>
              {propertyType}
            </span>
          </div>

          {/* Price on image */}
          <div className="absolute bottom-4 left-5">
            <span className="font-display text-2xl font-bold text-white drop-shadow">
              ₹{price?.toLocaleString("en-IN")}
              <span className="font-body text-sm font-normal text-white/70">/month</span>
            </span>
          </div>

          {/* Availability */}
          <div className="absolute bottom-4 right-5">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-body ${
              availabilityStatus === "available"
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}>
              {availabilityStatus === "available" ? "✓ Available" : "✗ Unavailable"}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">

            {/* Title + location */}
            <h2 className="font-display text-2xl font-bold text-charcoal mb-2">{title}</h2>
            <p className="font-body text-sm text-charcoal/50 flex items-center gap-1.5 mb-5">
              <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {location?.address}, {location?.city}
              {location?.state && `, ${location.state}`}
              {location?.pincode && ` - ${location.pincode}`}
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "🛏", label: "Bedrooms",  value: bedrooms  != null ? `${bedrooms} Beds`   : "—" },
                { icon: "🚿", label: "Bathrooms", value: bathrooms != null ? `${bathrooms} Baths`  : "—" },
                { icon: "📐", label: "Area",      value: area      != null ? `${area} sq ft`       : "—" },
              ].map((s) => (
                <div key={s.label} className="bg-cream rounded-2xl p-4 text-center"
                  style={{ border: "1px solid rgba(26,26,46,0.06)" }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-display text-base font-bold text-charcoal">{s.value}</div>
                  <div className="font-body text-[11px] text-charcoal/40">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h3 className="font-display text-base font-bold text-charcoal mb-2 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
                  About this Property
                </h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-base font-bold text-charcoal mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} className="px-3 py-1.5 rounded-full font-body text-xs font-semibold text-orange"
                      style={{ background: "rgba(232,98,26,0.08)", border: "1px solid rgba(232,98,26,0.2)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl mb-6"
              style={{ background: "rgba(26,26,46,0.03)", border: "1px solid rgba(26,26,46,0.07)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                {owner?.name?.[0]?.toUpperCase() || "O"}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-bold text-charcoal">{owner?.name || "Owner"}</div>
                <div className="font-body text-xs text-charcoal/40">Verified Property Owner</div>
                {owner?.email && <div className="font-body text-xs text-orange mt-0.5">{owner.email}</div>}
              </div>
              {createdAt && (
                <div className="text-right">
                  <div className="font-body text-[11px] text-charcoal/30">Listed on</div>
                  <div className="font-body text-xs font-semibold text-charcoal/50">
                    {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl font-body text-sm font-semibold text-charcoal/60 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all">
            Close
          </button>
          <button
            onClick={() => { onClose(); onRequestRent?.(property); }}
            disabled={availabilityStatus !== "available"}
            className="flex-2 px-8 py-3 rounded-xl font-body text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)", boxShadow: "0 8px 24px rgba(232,98,26,0.3)", flex: 2 }}
          >
            {availabilityStatus === "available" ? "Request Rent →" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}
