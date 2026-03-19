import { useEffect, useState } from "react";

const defaultState = {
  title_id: "",
  status: "available",
  import_date: new Date().toISOString().slice(0, 10)
};

export default function BookCopyForm({ initialData, titles, onSubmit }) {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    setForm(initialData ? { ...defaultState, ...initialData } : defaultState);
  }, [initialData]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div>
        <label className="label-ui">Dau sach</label>
        <select className="input-ui" value={form.title_id} onChange={(event) => setForm({ ...form, title_id: event.target.value })} required>
          <option value="">Chon dau sach</option>
          {titles.map((item) => (
            <option key={item.title_id} value={item.title_id}>
              {item.title_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-ui">Trang thai</label>
        <select className="input-ui" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>
      <div>
        <label className="label-ui">Ngay nhap</label>
        <input className="input-ui" type="date" value={form.import_date} onChange={(event) => setForm({ ...form, import_date: event.target.value })} />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" type="submit">
          Luu ban sao
        </button>
      </div>
    </form>
  );
}
