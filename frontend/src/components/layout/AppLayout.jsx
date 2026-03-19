import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ user, onLogout, title, breadcrumb, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="min-h-screen lg:ml-[260px]">
        <Topbar title={title} breadcrumb={breadcrumb} user={user} onLogout={onLogout} />
        <main className="page-fade p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
