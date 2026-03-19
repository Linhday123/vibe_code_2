import { Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import UserForm from "../components/forms/UserForm";
import Badge from "../components/ui/Badge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function Users() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  function loadData() {
    apiClient
      .getUsers()
      .then(setUsers)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc tai khoan.", "error"));
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo(
    () => [
      { key: "username", header: "Username" },
      { key: "full_name", header: "Ho ten" },
      { key: "email", header: "Email" },
      { key: "role", header: "Vai tro", render: (row) => <Badge variant={row.role}>{row.role}</Badge> },
      { key: "created_at", header: "Ngay tao" },
      {
        key: "actions",
        header: "Thao tac",
        render: (row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-600" onClick={() => { setSelected(row); setShowForm(true); }} type="button">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600" disabled={row.id === user.id} onClick={() => { setSelected(row); setShowDelete(true); }} type="button">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )
      }
    ],
    [user.id]
  );

  async function handleSave(payload) {
    try {
      if (selected) {
        await apiClient.updateUser(selected.id, payload);
        pushToast("Cap nhat tai khoan thanh cong.");
      } else {
        await apiClient.createUser(payload);
        pushToast("Them tai khoan thanh cong.");
      }
      setShowForm(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the luu tai khoan.", "error");
    }
  }

  async function handleDelete() {
    try {
      await apiClient.deleteUser(selected.id);
      pushToast("Xoa tai khoan thanh cong.");
      setShowDelete(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the xoa tai khoan.", "error");
    }
  }

  return (
    <AppLayout user={user} onLogout={logout} title="Quan ly Tai khoan" breadcrumb={["He thong", "Tai khoan"]}>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quan ly Tai khoan</h2>
            <p className="mt-1 text-slate-500">Admin only. Khong cho xoa tai khoan dang dang nhap va khong cho doi role chinh minh.</p>
          </div>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }} type="button">
            <Plus className="h-4 w-4" />
            Them tai khoan
          </button>
        </div>

        <DataTable columns={columns} data={users} pageSize={6} emptyIcon={Shield} emptyTitle="Chua co tai khoan" emptyDescription="Admin co the them tai khoan thu thu moi." />
      </div>

      <Modal open={showForm} title={selected ? "Cap nhat tai khoan" : "Them tai khoan"} onClose={() => { setShowForm(false); setSelected(null); }}>
        <UserForm initialData={selected} isSelf={selected?.id === user.id} onSubmit={handleSave} />
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Xac nhan xoa tai khoan"
        description={`Ban sap xoa tai khoan ${selected?.username || ""}.`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
