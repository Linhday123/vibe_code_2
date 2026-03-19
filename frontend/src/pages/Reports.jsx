import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppLayout from "../components/layout/AppLayout";
import Badge from "../components/ui/Badge";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const [unreturned, setUnreturned] = useState([]);

  useEffect(() => {
    Promise.all([apiClient.getMostBorrowed(), apiClient.getUnreturned()])
      .then(([mostBorrowedRows, unreturnedRows]) => {
        setMostBorrowed(mostBorrowedRows);
        setUnreturned(unreturnedRows);
      })
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc bao cao.", "error"));
  }, []);

  return (
    <AppLayout user={user} onLogout={logout} title="Bao cao thong ke" breadcrumb={["Bao cao", "Thong ke"]}>
      <div className="space-y-6">
        <section className="card-ui p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Top sach muon nhieu nhat</h2>
              <p className="text-sm text-slate-500">Ket hop bar chart ngang va bang thong ke</p>
            </div>
            <button
              className="btn-secondary"
              onClick={() =>
                apiClient
                  .exportMostBorrowedCsv()
                  .then((blob) => downloadBlob(blob, "most-borrowed.csv"))
                  .catch((error) => pushToast(error.response?.data?.message || "Khong xuat duoc CSV.", "error"))
              }
              type="button"
            >
              <Download className="h-4 w-4" />
              Xuat CSV
            </button>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostBorrowed} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="title_name" type="category" width={130} />
                  <Tooltip />
                  <Bar dataKey="borrow_count" radius={[0, 8, 8, 0]}>
                    {mostBorrowed.map((item, index) => (
                      <Cell fill={index % 2 === 0 ? "#4F46E5" : "#7C3AED"} key={item.title_id} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ten sach</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Tac gia</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Luot muon</th>
                  </tr>
                </thead>
                <tbody>
                  {mostBorrowed.map((item, index) => (
                    <tr className="hover:bg-slate-50" key={item.title_id}>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.title_name}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.author}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.borrow_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card-ui p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Doc gia chua tra sach</h2>
              <p className="text-sm text-slate-500">Highlight mau vang neu >14 ngay va do neu >30 ngay</p>
            </div>
            <button
              className="btn-secondary"
              onClick={() =>
                apiClient
                  .exportUnreturnedCsv()
                  .then((blob) => downloadBlob(blob, "unreturned.csv"))
                  .catch((error) => pushToast(error.response?.data?.message || "Khong xuat duoc CSV.", "error"))
              }
              type="button"
            >
              <Download className="h-4 w-4" />
              Xuat CSV
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ma doc gia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ho ten</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Lop</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ten sach</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ma ban sao</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Ngay muon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">So ngay</th>
                </tr>
              </thead>
              <tbody>
                {unreturned.map((item) => (
                  <tr
                    className={`hover:bg-slate-50 ${item.borrow_days > 30 ? "bg-red-50" : item.borrow_days > 14 ? "bg-amber-50" : ""}`}
                    key={`${item.reader_id}-${item.copy_id}`}
                  >
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.reader_id}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.full_name}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.class_name}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.title_name}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.copy_id}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">{item.borrow_date}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                      <Badge variant={item.borrow_days > 30 ? "borrowed" : item.borrow_days > 14 ? "borrowed" : "available"}>{item.borrow_days} ngay</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
