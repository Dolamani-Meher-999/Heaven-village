export default function OwnerPropertyCard({ property, onDelete, onEdit }) {
  const {
    _id, title = "", location = {}, price = 0,
    propertyType = "apartment", bedrooms, bathrooms,
    images = [], status = "pending", availabilityStatus = "available",
    views = 0, createdAt,
  } = property;

  const imgUrl = images?.[0]?.url ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";

  const statusConfig = {
    approved: { label: "Approved",  bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200",  dot: "bg-green-500"  },
    pending:  { label: "Pending",   bg: "bg-orange/8",  text: "text-orange",     border: "border-orange/25",  dot: "bg-orange"     },
    rejected: { label: "Rejected",  bg: "bg-red-50",    text: "text-red-500",    border: "border-red-200",    dot: "bg-red-500"    },
  };

  const availConfig = {
    available:   { label: "Available",   text: "text-green-600",  bg: "bg-green-50"  },
    rented:      { label: "Rented",      text: "text-blue-600",   bg: "bg-blue-50"   },
    unavailable: { label: "Unavailable", text: "text-gray-500",   bg: "bg-gray-100"  },
  };

  const sc = statusConfig[status]   || statusConfig.pending;
  const ac = availConfig[availabilityStatus] || availConfig.available;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={imgUrl} alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 ${sc.bg} border ${sc.border} px-2.5 py-1 rounded-full`}>
          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          <span className={`font-body text-[11px] font-bold ${sc.text}`}>{sc.label}</span>
        </div>

        {/* Views */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <span className="text-white text-xs">👁</span>
          <span className="font-body text-xs text-white font-medium">{views}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display text-lg font-bold text-charcoal truncate flex-1 group-hover:text-orange transition-colors">
            {title}
          </h3>
        </div>
        <p className="font-body text-sm text-charcoal/45 mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-orange shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          {location?.address}, {location?.city}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
          {bedrooms  != null && <span className="font-body text-xs text-charcoal/45">🛏 {bedrooms} Beds</span>}
          {bathrooms != null && <span className="font-body text-xs text-charcoal/45">🚿 {bathrooms} Baths</span>}
          <span className="font-body text-xs font-semibold text-charcoal/40 capitalize bg-gray-50 px-2 py-0.5 rounded-md">
            {propertyType}
          </span>
        </div>

        {/* Price + Availability */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-display text-xl font-bold text-orange">₹{price?.toLocaleString("en-IN")}</span>
            <span className="font-body text-xs text-charcoal/35 ml-1">/month</span>
          </div>
          <span className={`font-body text-[11px] font-semibold px-2.5 py-1 rounded-full ${ac.bg} ${ac.text}`}>
            {ac.label}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button onClick={() => onEdit?.(property)}
            className="flex-1 bg-gray-50 border border-gray-200 py-2.5 rounded-xl font-body text-xs font-semibold text-charcoal/60 hover:text-charcoal hover:border-gray-300 transition-all flex items-center justify-center gap-1.5">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete?.(_id)}
            className="flex-1 bg-red-50 border border-red-100 py-2.5 rounded-xl font-body text-xs font-semibold text-red-500 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
