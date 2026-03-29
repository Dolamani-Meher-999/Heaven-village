export default function AdminStatsBar({ stats }) {
  const cards = [
    { label: "Total Properties", value: stats.totalProperties, icon: "🏠", color: "text-charcoal" },
    { label: "Pending Approval", value: stats.pending,         icon: "⏳", color: "text-amber-500" },
    { label: "Approved",         value: stats.approved,        icon: "✅", color: "text-green-500" },
    { label: "Total Users",      value: stats.totalUsers,      icon: "👥", color: "text-blue-500"  },
    { label: "Active Users",     value: stats.activeUsers,     icon: "🟢", color: "text-green-500" },
    { label: "Rent Requests",    value: stats.rentRequests,    icon: "📋", color: "text-orange"    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex flex-col gap-1">
          <div className="text-2xl">{c.icon}</div>
          <div className={`font-display text-2xl font-bold ${c.color}`}>{c.value ?? "—"}</div>
          <div className="font-body text-xs text-charcoal/45 leading-tight">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
