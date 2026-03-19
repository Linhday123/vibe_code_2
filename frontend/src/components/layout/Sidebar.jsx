import { BarChart3, BookCopy, BookOpen, BookOpenCheck, LayoutDashboard, Library, LogOut, UserCog, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import Badge from "../ui/Badge";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/readers", label: "Doc gia", icon: Users },
  { to: "/specializations", label: "Chuyen nganh", icon: Library },
  { to: "/book-titles", label: "Dau sach", icon: BookOpen },
  { to: "/book-copies", label: "Ban sao", icon: BookCopy },
  { to: "/borrows", label: "Muon tra", icon: BookOpenCheck },
  { to: "/reports", label: "Bao cao", icon: BarChart3 },
  { to: "/users", label: "Tai khoan", icon: UserCog, adminOnly: true }
];

export default function Sidebar({ user, onLogout }) {
  const initials = user?.full_name
    ?.split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((item) => item[0]?.toUpperCase())
    .join("");

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col bg-[linear-gradient(180deg,#1E1B4B,#312E81,#4C1D95)] p-5 text-white lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">📚</div>
        <div>
          <div className="text-xl font-bold">UniLib System</div>
          <div className="text-sm text-white/70">Quan ly thu vien dai hoc</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items
          .filter((item) => !item.adminOnly || user?.role === "admin")
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border-l-4 px-4 py-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white ${
                    isActive ? "border-indigo-300 bg-white/15 text-white" : "border-transparent"
                  }`
                }
                to={item.to}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-semibold">{initials}</div>
          <div>
            <div className="font-semibold">{user?.full_name}</div>
            <Badge variant={user?.role}>{user?.role === "admin" ? "Admin" : "Librarian"}</Badge>
          </div>
        </div>
        <button className="btn-secondary mt-4 w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={onLogout} type="button">
          <LogOut className="h-4 w-4" />
          Dang xuat
        </button>
      </div>
    </aside>
  );
}
