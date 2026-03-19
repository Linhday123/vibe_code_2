import { CreditCard, Pencil, Plus, Printer, Search, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import ReaderForm from "../components/forms/ReaderForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function Readers() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [readers, setReaders] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [selectedReader, setSelectedReader] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [printReader, setPrintReader] = useState(null);

  function loadReaders() {
    apiClient
      .getReaders({ search, gender })
      .then(setReaders)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc doc gia.", "error"));
  }

  useEffect(() => {
    loadReaders();
  }, [search, gender]);

  const columns = useMemo(
    () => [
      { key: "reader_id", header: "Ma doc gia" },
      { key: "full_name", header: "Ho ten" },
      { key: "class_name", header: "Lop" },
      { key: "birth_date", header: "Ngay sinh" },
      { key: "gender", header: "Gioi tinh", render: (row) => (row.gender === "male" ? "Nam" : "Nu") },
      { key: "created_at", header: "Ngay tao" },
      {
        key: "actions",
        header: "Thao tac",
        render: (row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-600" onClick={() => openEdit(row)} type="button">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600" onClick={() => openDelete(row)} type="button">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600" onClick={() => setPrintReader(row)} type="button">
              <Printer className="h-4 w-4" />
            </button>
          </div>
        )
      }
    ],
    []
  );

  function openEdit(row) {
    setSelectedReader(row);
    setShowForm(true);
  }

  function openDelete(row) {
    setSelectedReader(row);
    setShowDelete(true);
  }

  async function handleSave(payload) {
    try {
      if (selectedReader) {
        await apiClient.updateReader(selectedReader.reader_id, payload);
        pushToast("Cap nhat doc gia thanh cong.");
      } else {
        await apiClient.createReader(payload);
        pushToast("Them doc gia thanh cong.");
      }
      setShowForm(false);
      setSelectedReader(null);
      loadReaders();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the luu doc gia.", "error");
    }
  }

  async function handleDelete() {
    try {
      await apiClient.deleteReader(selectedReader.reader_id);
      pushToast("Xoa doc gia thanh cong.");
      setShowDelete(false);
      setSelectedReader(null);
      loadReaders();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the xoa doc gia.", "error");
    }
  }

  return (
    <AppLayout user={user} onLogout={logout} title="Quan ly Doc gia" breadcrumb={["Danh muc", "Doc gia"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quan ly Doc gia</h2>
            <p className="mt-1 text-slate-500">Quan ly ho so doc gia, thong tin lop va in the thu vien</p>
          </div>
          <button className="btn-primary" onClick={() => { setSelectedReader(null); setShowForm(true); }} type="button">
            <Plus className="h-4 w-4" />
            Them doc gia
          </button>
        </div>

        <div className="card-ui p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input-ui pl-10" placeholder="Tim theo ma, ten, lop..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <select className="input-ui" value={gender} onChange={(event) => setGender(event.target.value)}>
              <option value="">Tat ca gioi tinh</option>
              <option value="male">Nam</option>
              <option value="female">Nu</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={readers}
          pageSize={6}
          emptyIcon={Users}
          emptyTitle="Chua co doc gia"
          emptyDescription="Hay them doc gia dau tien de bat dau quan ly."
          emptyAction={
            <button className="btn-primary" onClick={() => setShowForm(true)} type="button">
              <Plus className="h-4 w-4" />
              Them doc gia
            </button>
          }
        />
      </div>

      <Modal open={showForm} title={selectedReader ? "Cap nhat doc gia" : "Them doc gia"} onClose={() => { setShowForm(false); setSelectedReader(null); }}>
        <ReaderForm initialData={selectedReader} onSubmit={handleSave} />
      </Modal>

      <Modal
        open={Boolean(printReader)}
        title="Preview the thu vien"
        onClose={() => setPrintReader(null)}
        footer={
          <button className="btn-secondary" onClick={() => window.print()} type="button">
            <Printer className="h-4 w-4" />
            In the
          </button>
        }
      >
        {printReader ? (
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-indigo-700">UniLib System</div>
                <div className="text-sm text-slate-400">The thu vien dai hoc</div>
              </div>
              <CreditCard className="h-10 w-10 text-indigo-500" />
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <div><strong>Ma doc gia:</strong> {printReader.reader_id}</div>
              <div><strong>Ho ten:</strong> {printReader.full_name}</div>
              <div><strong>Lop:</strong> {printReader.class_name}</div>
              <div><strong>Ngay cap:</strong> {new Date().toISOString().slice(0, 10)}</div>
              <div><strong>QR gia lap:</strong> QR-{printReader.reader_id}</div>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Xac nhan xoa doc gia"
        description={`Ban sap xoa doc gia ${selectedReader?.full_name || ""}.`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
