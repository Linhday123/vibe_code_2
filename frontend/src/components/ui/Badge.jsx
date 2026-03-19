export default function Badge({ children, variant = "default" }) {
  const variants = {
    available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    borrowed: "border-amber-200 bg-amber-50 text-amber-700",
    returned: "border-blue-200 bg-blue-50 text-blue-700",
    admin: "border-indigo-200 bg-indigo-50 text-indigo-700",
    librarian: "border-slate-200 bg-slate-100 text-slate-700",
    default: "border-slate-200 bg-slate-50 text-slate-700"
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
