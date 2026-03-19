import { Bell, ChevronRight, LogOut } from "lucide-react";

export default function Topbar({ title, breadcrumb, user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
      <div>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
          {breadcrumb.map((item, index) => (
            <span className="flex items-center gap-2" key={item + index}>
              {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50" type="button">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden rounded-xl border border-slate-200 px-3 py-2 md:flex md:items-center md:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            {user?.full_name?.slice(0, 1)?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{user?.full_name}</div>
            <div className="text-xs text-slate-400">{user?.role}</div>
          </div>
        </div>
        <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 md:hidden" onClick={onLogout} type="button">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
