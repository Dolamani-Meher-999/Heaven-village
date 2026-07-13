import { useState } from "react";

export default function PropertyCard({ property, onRequestRent, onSaveToggle, onViewDetails }) {
  const [saved, setSaved] = useState(false);

  const {
    title = "", location = {}, price = 0, propertyType = "apartment",
    bedrooms, bathrooms, area, images = [], owner = {},
    availabilityStatus = "available",
  } = property;

  const imgUrl = images?.[0]?.url || images?.[0]
    || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";

  const typeColors = {
    apartment: "bg-blue-50 text-blue-600 border-blue-100",
    house:     "bg-green-50 text-green-600 border-green-100",
    villa:     "bg-purple-50 text-purple-600 border-purple-100",
    pg:        "bg-orange-50 text-orange-600 border-orange-100",
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    onSaveToggle?.(property, next);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card group hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={imgUrl} alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"; }}
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeColors[propertyType] || typeColors.apartment}`}>
            {propertyType}
          </span>
          <button onClick={toggleSave}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
              saved ? "bg-orange text-white" : "bg-white text-charcoal/40 hover:text-orange"
            }`}>
            {saved ? "♥" : "♡"}
          </button>
        </div>
        {availabilityStatus !== "available" && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="font-body text-sm font-bold text-charcoal/60 uppercase tracking-widest border border-charcoal/20 px-4 py-2 rounded-lg bg-white">
              {availabilityStatus === "rented" ? "Already Rented" : "Unavailable"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-charcoal mb-1 truncate group-hover:text-orange transition-colors duration-200">
          {title}
        </h3>
        <p className="font-body text-xs text-charcoal/45 mb-3 flex items-center gap-1.5 truncate">
          <svg className="w-3 h-3 text-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          {location?.address}, {location?.city}
        </p>

        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
          {bedrooms  != null && <span className="font-body text-[11px] text-charcoal/45">🛏 {bedrooms} Beds</span>}
          {bathrooms != null && <span className="font-body text-[11px] text-charcoal/45">🚿 {bathrooms} Baths</span>}
          {area      != null && <span className="font-body text-[11px] text-charcoal/45">📐 {area} sqft</span>}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full orange-gradient flex items-center justify-center text-white font-bold text-[10px]">
              {owner?.name?.[0]?.toUpperCase() || "O"}
            </div>
            <div>
              <div className="font-body text-[11px] text-charcoal/60 leading-none">{owner?.name || "Owner"}</div>
              <div className="font-body text-[9px] text-charcoal/30">Verified Owner</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold text-orange">₹{price?.toLocaleString("en-IN")}</div>
            <div className="font-body text-[9px] text-charcoal/35">/month</div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* View Details — opens detail modal */}
          <button
            onClick={() => onViewDetails?.(property)}
            className="flex-1 bg-gray-50 border border-gray-200 py-2 rounded-xl font-body text-xs font-semibold text-charcoal/60 hover:text-charcoal hover:border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            View Details
          </button>
          {/* Request Rent */}
          <button
            onClick={() => onRequestRent?.(property)}
            disabled={availabilityStatus !== "available"}
            className="flex-1 orange-gradient py-2 rounded-xl font-body text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-orange disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Request Rent
          </button>
        </div>
      </div>
    </div>
  );
}
