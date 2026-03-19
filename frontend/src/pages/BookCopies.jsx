import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import BookCopyForm from "../components/forms/BookCopyForm";
import Badge from "../components/ui/Badge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function BookCopies() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const titleId = searchParams.get("title_id") || "";
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [copies, setCopies] = useState([]);
  const [titles, setTitles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const selectedTitle = titles.find((item) => item.title_id === titleId);

  function loadData() {
    apiClient
      .getBookCopies({ title_id: titleId })
      .then(setCopies)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc ban sao.", "error"));
  }

  useEffect(() => {
    apiClient.getBookTitles().then(setTitles);
  }, []);

  useEffect(() => {
    loadData();
  }, [titleId]);

  const columns = useMemo(
    () => [
      { key: "copy_id", header: "Ma ban sao" },
      { key: "title_name", header: "Dau sach" },
      { key: "status", header: "Trang thai", render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
      { key: "import_date", header: "Ngay nhap" },
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
          </div>
        )
      }
    ],
    []
  );

  async function handleSave(payload) {
    try {
      if (selected) {
        await apiClient.updateBookCopy(selected.copy_id, payload);
        pushToast("Cap nhat ban sao thanh cong.");
      } else {
        await apiClient.createBookCopy({ ...payload, title_id: payload.title_id || titleId });
        pushToast("Them ban sao thanh cong.");
      }
      setShowForm(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the luu ban sao.", "error");
    }
  }

  async function handleDelete() {
    try {
      await apiClient.deleteBookCopy(selected.copy_id);
      pushToast("Xoa ban sao thanh cong.");
      setShowDelete(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the xoa ban sao.", "error");
    }
  }

  return (
    <AppLayout user={user} onLogout={logout} title={selectedTitle ? `Ban sao: ${selectedTitle.title_name}` : "Tat ca ban sao"} breadcrumb={["Danh muc", "Ban sao"]}>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            {titleId ? (
              <button className="mb-3 inline-flex items-center gap-2 text-sm text-indigo-600" onClick={() => navigate("/book-titles")} type="button">
                <ArrowLeft className="h-4 w-4" />
                Quay lai
              </button>
            ) : null}
            <h2 className="text-2xl font-bold text-slate-800">{selectedTitle ? `Ban sao: ${selectedTitle.title_name}` : "Tat ca ban sao"}</h2>
            <p className="mt-1 text-slate-500">Khong cho xoa neu ban sao dang duoc muon</p>
          </div>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }} type="button">
            <Plus className="h-4 w-4" />
            Them ban sao
          </button>
        </div>

        <DataTable columns={columns} data={copies} pageSize={6} emptyTitle="Chua co ban sao" emptyDescription="Hay them ban sao cho dau sach nay." />
      </div>

      <Modal open={showForm} title={selected ? "Cap nhat ban sao" : "Them ban sao"} onClose={() => { setShowForm(false); setSelected(null); }}>
        <BookCopyForm initialData={selected || (titleId ? { title_id: titleId } : null)} titles={titles} onSubmit={handleSave} />
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Xac nhan xoa ban sao"
        description={`Ban sap xoa ban sao ${selected?.copy_id || ""}.`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
