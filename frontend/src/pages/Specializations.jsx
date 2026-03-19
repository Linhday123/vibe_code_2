import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import SpecializationForm from "../components/forms/SpecializationForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { apiClient } from "../lib/api";

export default function Specializations() {
  const { user, logout } = useAuth();
  const { toasts, pushToast, removeToast } = useToast();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  function loadData() {
    apiClient
      .getSpecializations()
      .then(setItems)
      .catch((error) => pushToast(error.response?.data?.message || "Khong tai duoc chuyen nganh.", "error"));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave(payload) {
    try {
      if (selected) {
        await apiClient.updateSpecialization(selected.spec_id, payload);
        pushToast("Cap nhat chuyen nganh thanh cong.");
      } else {
        await apiClient.createSpecialization(payload);
        pushToast("Them chuyen nganh thanh cong.");
      }
      setShowForm(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the luu chuyen nganh.", "error");
    }
  }

  async function handleDelete() {
    try {
      await apiClient.deleteSpecialization(selected.spec_id);
      pushToast("Xoa chuyen nganh thanh cong.");
      setShowDelete(false);
      setSelected(null);
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || "Khong the xoa chuyen nganh.", "error");
    }
  }

  return (
    <AppLayout user={user} onLogout={logout} title="Quan ly Chuyen nganh" breadcrumb={["Danh muc", "Chuyen nganh"]}>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quan ly Chuyen nganh</h2>
            <p className="mt-1 text-slate-500">Hien thi chuyen nganh duoi dang cards dung voi UI mong muon</p>
          </div>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }} type="button">
            <Plus className="h-4 w-4" />
            Them chuyen nganh
          </button>
        </div>

        {items.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div className="card-ui p-6" key={item.spec_id}>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-amber-50 p-2 text-amber-600" onClick={() => { setSelected(item); setShowForm(true); }} type="button">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-red-50 p-2 text-red-600" onClick={() => { setSelected(item); setShowDelete(true); }} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-800">{item.spec_name}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500">{item.description || "Chua co mo ta."}</p>
                <div className="mt-5 text-sm font-medium text-indigo-600">{item.total_titles} dau sach thuoc chuyen nganh</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="Chua co chuyen nganh" description="Hay them chuyen nganh dau tien." />
        )}
      </div>

      <Modal open={showForm} title={selected ? "Cap nhat chuyen nganh" : "Them chuyen nganh"} onClose={() => { setShowForm(false); setSelected(null); }}>
        <SpecializationForm initialData={selected} onSubmit={handleSave} />
      </Modal>

      <ConfirmDialog
        open={showDelete}
        title="Xac nhan xoa chuyen nganh"
        description={`Ban sap xoa chuyen nganh ${selected?.spec_name || ""}.`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </AppLayout>
  );
}
