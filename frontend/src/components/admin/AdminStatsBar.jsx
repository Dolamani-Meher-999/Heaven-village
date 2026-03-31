export default function AdminStatsBar({ stats }) {
  const cards = [
    {
      label: "Total Properties",
      value: stats.totalProperties ?? "—",
      icon: "🏠",
      iconBg: "linear-gradient(135deg,#E8621A,#F5874A)",
      border: "rgba(232,98,26,0.15)",
      trend: "All listings",
    },
    {
      label: "Pending Approval",
      value: stats.pending ?? "—",
      icon: "⏳",
      iconBg: "linear-gradient(135deg,#F59E0B,#FCD34D)",
      border: "rgba(245,158,11,0.2)",
      trend: "Needs review",
      urgent: (stats.pending ?? 0) > 0,
    },
    {
      label: "Approved",
      value: stats.approved ?? "—",
      icon: "✅",
      iconBg: "linear-gradient(135deg,#10B981,#34D399)",
      border: "rgba(16,185,129,0.15)",
      trend: "Live listings",
    },
    {
      label: "Total Users",
      value: stats.totalUsers ?? "—",
      icon: "👥",
      iconBg: "linear-gradient(135deg,#6366F1,#818CF8)",
      border: "rgba(99,102,241,0.15)",
      trend: "Registered",
    },
    {
      label: "Active Users",
      value: stats.activeUsers ?? "—",
      icon: "🟢",
      iconBg: "linear-gradient(135deg,#10B981,#34D399)",
      border: "rgba(16,185,129,0.15)",
      trend: "Currently active",
    },
    {
      label: "Rent Requests",
      value: stats.rentRequests ?? "—",
      icon: "📋",
      iconBg: "linear-gradient(135deg,#E8621A,#F5874A)",
      border: "rgba(232,98,26,0.15)",
      trend: "Total requests",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4 mb-8">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
          style={{ border: `1px solid ${c.border}`, boxShadow: "0 2px 12px rgba(26,26,46,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: c.iconBg }}
            >
              {c.icon}
            </div>
            {c.urgent && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-charcoal leading-none mb-1">{c.value}</div>
            <div className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide">{c.label}</div>
          </div>
          <div className="font-body text-[11px] text-charcoal/30">{c.trend}</div>
        </div>
      ))}
    </div>
  );
}
