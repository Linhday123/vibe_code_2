import { Clock3, Filter, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import BorrowForm from "../components/forms/BorrowForm";
import Badge from "../components/ui/Badge";
import DataTable from "../components/ui/DataTable";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

const tabs = [
  { key: "active", label: "Dang muon" },
  { key: "create", label: "Tao phieu muon" },
  { key: "history", label: "Lich su" }
];

export default function Borrows() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [readers, setReaders] = useState([]);
  const [titles, setTitles] = useState([]);
  const [copies, setCopies] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [historyBorrows, setHistoryBorrows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start_date: "", end_date: "" });

  function loadBaseData() {
    Promise.all([apiClient.getReaders(), apiClient.getBookCopies(), apiClient.getBookTitles()])
      .then(([readerRows, copyRows, titleRows]) => {
        setReaders(readerRows);
        setTitles(titleRows);
        setCopies(copyRows.filter((item) => item.status === "available"));
      })
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc du lieu muon tra.", "error"));
  }

  function loadBorrows() {
    apiClient.getBorrows({ status: "borrowing" }).then(setActiveBorrows).catch(() => {});
    apiClient.getBorrows({ status: statusFilter, ...dateRange }).then(setHistoryBorrows).catch(() => {});
  }

  useEffect(() => {
    loadBaseData();
    loadBorrows();
  }, []);

  useEffect(() => {
    apiClient.getBorrows({ status: statusFilter, ...dateRange }).then(setHistoryBorrows).catch(() => {});
  }, [statusFilter, dateRange.start_date, dateRange.end_date]);

  const readersForBorrow = useMemo(() => {
    const activeReaderIds = new Set(activeBorrows.map((item) => item.reader_id));
    return readers.filter((item) => !activeReaderIds.has(item.reader_id));
  }, [activeBorrows, readers]);

  const activeColumns = [
    { key: "record_id", header: "Ma phieu" },
    { key: "reader_name", header: "Doc gia" },
    { key: "title_name", header: "Sach" },
    { key: "librarian_name", header: "Thu thu" },
    { key: "borrow_date", header: "Ngay muon" },
    {
      key: "borrow_days",
      header: "So ngay",
      render: (row) => <span className={row.borrow_days > 14 ? "font-semibold text-red-600" : ""}>{row.borrow_days}</span>
    },
    {
      key: "actions",
      header: "Thao tac",
      render: (row) => (
        <button
          className="btn-success px-3 py-2"
          onClick={() =>
            apiClient
              .returnBorrow(row.record_id)
              .then(() => {
                pushToast("Tra sach thanh cong.");
                loadBaseData();
                loadBorrows();
              })
              .catch((error) => pushToast(error.response?.data?.message || "Khong the tra sach.", "error"))
          }
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Tra sach
        </button>
      )
    }
  ];

  const historyColumns = [
    { key: "record_id", header: "Ma phieu" },
    { key: "reader_name", header: "Doc gia" },
    { key: "title_name", header: "Sach" },
    { key: "borrow_date", header: "Ngay muon" },
    { key: "return_date", header: "Ngay tra" },
    { key: "status", header: "Trang thai", render: (row) => <Badge variant={row.status === "returned" ? "returned" : "borrowed"}>{row.status}</Badge> }
  ];

  function handleCreateBorrow(payload) {
    apiClient
      .createBorrow(payload)
      .then(() => {
        pushToast("Tao phieu muon thanh cong.");
        setActiveTab("active");
        loadBaseData();
        loadBorrows();
      })
      .catch((error) => pushToast(error.response?.data?.message || "Khong the tao phieu muon.", "error"));
  }

  const copiesWithTitle = copies.map((copy) => ({
    ...copy,
    title_name: titles.find((title) => title.title_id === copy.title_id)?.title_name || copy.title_name || ""
  }));

  return (
    <AppLayout user={user} onLogout={logout} title="Muon tra sach" breadcrumb={["Nghiep vu", "Muon tra sach"]}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-6 border-b border-slate-200">
          {tabs.map((item) => (
            <button
              className={`relative pb-3 text-sm font-semibold ${activeTab === item.key ? "text-indigo-600" : "text-slate-500"}`}
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              type="button"
            >
              {item.label}
              {item.key === "active" ? <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{activeBorrows.length}</span> : null}
              {activeTab === item.key ? <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-600" /> : null}
            </button>
          ))}
        </div>

        {activeTab === "active" ? (
          <DataTable columns={activeColumns} data={activeBorrows} pageSize={6} emptyIcon={Clock3} emptyTitle="Khong co phieu muon dang active" emptyDescription="Tat ca sach da duoc tra." />
        ) : null}

        {activeTab === "create" ? (
          <BorrowForm readers={readersForBorrow} copies={copiesWithTitle} onSubmit={handleCreateBorrow} />
        ) : null}

        {activeTab === "history" ? (
          <div className="space-y-4">
            <div className="card-ui p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="label-ui">Trang thai</label>
                  <select className="input-ui" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="">Tat ca</option>
                    <option value="borrowing">Borrowing</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <div>
                  <label className="label-ui">Tu ngay</label>
                  <input className="input-ui" type="date" value={dateRange.start_date} onChange={(event) => setDateRange({ ...dateRange, start_date: event.target.value })} />
                </div>
                <div>
                  <label className="label-ui">Den ngay</label>
                  <input className="input-ui" type="date" value={dateRange.end_date} onChange={(event) => setDateRange({ ...dateRange, end_date: event.target.value })} />
                </div>
              </div>
            </div>
            <DataTable columns={historyColumns} data={historyBorrows} pageSize={6} emptyIcon={Filter} emptyTitle="Chua co lich su" emptyDescription="Khong co giao dich nao phu hop bo loc." />
          </div>
        ) : null}
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
