import { useEffect, useState } from "react";

const defaultState = {
  reader_id: "",
  full_name: "",
  class_name: "",
  birth_date: "",
  gender: "male"
};

export default function ReaderForm({ initialData, onSubmit }) {
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
        <label className="label-ui">Ma doc gia</label>
        <input className="input-ui bg-slate-50" readOnly value={form.reader_id || "Tu dong sinh sau khi them"} />
      </div>
      <div>
        <label className="label-ui">Ho ten</label>
        <input className="input-ui" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Lop</label>
        <input className="input-ui" value={form.class_name} onChange={(event) => setForm({ ...form, class_name: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Ngay sinh</label>
        <input className="input-ui" type="date" value={form.birth_date} onChange={(event) => setForm({ ...form, birth_date: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Gioi tinh</label>
        <select className="input-ui" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} required>
          <option value="male">Nam</option>
          <option value="female">Nu</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" type="submit">
          Luu doc gia
        </button>
      </div>
    </form>
  );
}
