export default function OwnerStatsBar({ stats }) {
  const items = [
    { label: "Total Properties", value: stats?.total        ?? 0, icon: "🏠", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
    { label: "Approved",         value: stats?.approved     ?? 0, icon: "✓",  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100" },
    { label: "Pending Approval", value: stats?.pending      ?? 0, icon: "⏳", color: "text-orange",     bg: "bg-orange/8",  border: "border-orange/20" },
    { label: "Rent Requests",    value: stats?.requests     ?? 0, icon: "📋", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Currently Rented", value: stats?.rented       ?? 0, icon: "🔑", color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-100" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label}
          className={`bg-white rounded-2xl border ${item.border} p-5 shadow-card hover:shadow-card-hover transition-all duration-300`}>
          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-lg mb-3`}>
            {item.icon}
          </div>
          <div className={`font-display text-3xl font-bold ${item.color} mb-1`}>{item.value}</div>
          <div className="font-body text-xs text-charcoal/45 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
