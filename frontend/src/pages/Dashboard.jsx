import { BookCopy, BookOpen, BookmarkCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppLayout from "../components/layout/AppLayout";
import Badge from "../components/ui/Badge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import StatCard from "../components/ui/StatCard";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiClient
      .getDashboardStats()
      .then(setStats)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc dashboard.", "error"))
      .finally(() => setLoading(false));
  }, [pushToast]);

  if (loading) {
    return (
      <AppLayout user={user} onLogout={logout} title="Dashboard" breadcrumb={["Trang chu", "Dashboard"]}>
        <LoadingSpinner label="Dang tai dashboard..." />
      </AppLayout>
    );
  }

  const monthLabels = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const monthlyData = monthLabels.map((month) => ({
    month,
    total: stats.monthlyBorrowed.find((item) => item.month === month)?.total || 0
  }));

  return (
    <AppLayout user={user} onLogout={logout} title="Dashboard" breadcrumb={["Trang chu", "Dashboard"]}>
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Tong doc gia" value={stats.cards.totalReaders} trend="+12 doc gia moi" iconColor="#4F46E5" iconBg="#EEF2FF" />
          <StatCard icon={BookOpen} label="Tong dau sach" value={stats.cards.totalBookTitles} trend="+3 dau sach moi" iconColor="#059669" iconBg="#F0FDF4" />
          <StatCard icon={BookCopy} label="Tong ban sao" value={stats.cards.totalCopies} trend="+5 ban sao moi" iconColor="#D97706" iconBg="#FFF7ED" />
          <StatCard icon={BookmarkCheck} label="Dang muon" value={stats.cards.totalBorrowing} trend="Theo doi giao dich hien tai" iconColor="#DC2626" iconBg="#FFF1F2" />
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="card-ui p-6 xl:col-span-3">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Sach muon theo thang</h2>
              <p className="text-sm text-slate-500">Bieu do luot muon sach trong nam hien tai</p>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-ui p-6 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">Top 5 sach muon nhieu nhat</h2>
              <p className="text-sm text-slate-500">Tong hop tan suat muon theo dau sach</p>
            </div>
            <div className="space-y-4">
              {stats.topBooks.map((item, index) => (
                <div className="rounded-2xl border border-slate-200 p-4" key={item.title_name}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">{index + 1}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{item.title_name}</div>
                      <div className="text-sm text-slate-400">{item.author}</div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.max(item.borrow_count * 20, 12)}%` }} />
                      </div>
                    </div>
                    <Badge variant="available">{item.borrow_count} luot</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card-ui p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Phieu muon gan day</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Doc gia</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Sach</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ngay muon</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Trang thai</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBorrows.map((item) => (
                    <tr className="hover:bg-slate-50" key={item.record_id}>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.reader_name}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.title_name}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.borrow_date}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                        <Badge variant={item.status === "returned" ? "returned" : "borrowed"}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-ui p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Doc gia chua tra</h2>
            <div className="space-y-3">
              {stats.unreturnedReaders.map((item) => (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4" key={item.reader_id + item.title_name}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                    {item.full_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{item.full_name}</div>
                    <div className="text-sm text-slate-400">{item.title_name}</div>
                  </div>
                  <span className={`text-sm font-semibold ${item.borrow_days > 14 ? "text-red-600" : "text-slate-500"}`}>{item.borrow_days} ngay</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
