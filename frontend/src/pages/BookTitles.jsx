import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import BookTitleForm from "../components/forms/BookTitleForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function BookTitles() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [titles, setTitles] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState("");
  const [specId, setSpecId] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  function loadData() {
    apiClient
      .getBookTitles({ search, spec_id: specId })
      .then(setTitles)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc dau sach.", "error"));
  }

  useEffect(() => {
    apiClient.getSpecializations().then(setSpecializations);
  }, []);

  useEffect(() => {
    loadData();
  }, [search, specId]);

  const columns = useMemo(
    () => [
      { key: "title_id", header: "Ma" },
      { key: "title_name", header: "Ten sach" },
      { key: "author", header: "Tac gia" },
      { key: "publisher", header: "NXB" },
      { key: "spec_name", header: "Chuyen nganh" },
      { key: "quantity", header: "So ban sao" },
      {
        key: "actions",
        header: "Thao tac",
        render: (row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-600" onClick={() => { setSelected(row); setShowForm(true); }} type="button">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600" onClick={() => { setSelected(row); setShowDelete(true); }} type="button">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600" onClick={() => navigate(`/book-copies?title_id=${row.title_id}`)} type="button">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )
      }
    ],
    [navigate]
  );

  async function handleSave(payload) {
    try {
      if (selected) {
        await apiClient.updateBookTitle(selected.title_id, payload);
        pushToast("Cap nhat dau sach thanh cong.");
      } else {
        await apiClient.createBookTitle(payload);
        pushToast("Them dau sach thanh cong.");
      }
      setShowForm(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the luu dau sach.", "error");
    }
  }

  async function handleDelete() {
    try {
      await apiClient.deleteBookTitle(selected.title_id);
      pushToast("Xoa dau sach thanh cong.");
      setShowDelete(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the xoa dau sach.", "error");
    }
  }

  return (
    <AppLayout user={user} onLogout={logout} title="Quan ly Dau sach" breadcrumb={["Danh muc", "Dau sach"]}>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quan ly Dau sach</h2>
            <p className="mt-1 text-slate-500">Theo doi thong tin sach va dieu huong sang trang ban sao</p>
          </div>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }} type="button">
            <Plus className="h-4 w-4" />
            Them dau sach
          </button>
        </div>

        <div className="card-ui p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input-ui pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tim theo ma, ten sach, tac gia..." />
            </div>
            <select className="input-ui" value={specId} onChange={(event) => setSpecId(event.target.value)}>
              <option value="">Tat ca chuyen nganh</option>
              {specializations.map((item) => (
                <option key={item.spec_id} value={item.spec_id}>
                  {item.spec_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={titles}
          pageSize={6}
          emptyTitle="Chua co dau sach"
          emptyDescription="Hay them dau sach dau tien cho he thong."
        />
      </div>

      <Modal open={showForm} title={selected ? "Cap nhat dau sach" : "Them dau sach"} onClose={() => { setShowForm(false); setSelected(null); }}>
        <BookTitleForm initialData={selected} specializations={specializations} onSubmit={handleSave} />
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Xac nhan xoa dau sach"
        description={`Ban sap xoa dau sach ${selected?.title_name || ""}.`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
