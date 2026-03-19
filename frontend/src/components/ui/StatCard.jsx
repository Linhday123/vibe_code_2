export default function StatCard({ icon: Icon, label, value, trend, iconColor, iconBg }) {
  return (
    <div className="card-ui p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: iconBg, color: iconColor }}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 text-xs font-medium text-emerald-600">{trend}</div>
        </div>
      </div>
    </div>
  );
}
