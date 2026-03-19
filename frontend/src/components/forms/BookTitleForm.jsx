import { useEffect, useState } from "react";

const defaultState = {
  title_name: "",
  publisher: "",
  pages: "",
  dimensions: "",
  author: "",
  spec_id: ""
};

export default function BookTitleForm({ initialData, specializations, onSubmit }) {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    setForm(initialData ? { ...defaultState, ...initialData } : defaultState);
  }, [initialData]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="md:col-span-2">
        <label className="label-ui">Ten sach</label>
        <input className="input-ui" value={form.title_name} onChange={(event) => setForm({ ...form, title_name: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Tac gia</label>
        <input className="input-ui" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Nha xuat ban</label>
        <input className="input-ui" value={form.publisher} onChange={(event) => setForm({ ...form, publisher: event.target.value })} />
      </div>
      <div>
        <label className="label-ui">So trang</label>
        <input className="input-ui" type="number" value={form.pages} onChange={(event) => setForm({ ...form, pages: event.target.value })} />
      </div>
      <div>
        <label className="label-ui">Kich thuoc</label>
        <input className="input-ui" value={form.dimensions} onChange={(event) => setForm({ ...form, dimensions: event.target.value })} />
      </div>
      <div className="md:col-span-2">
        <label className="label-ui">Chuyen nganh</label>
        <select className="input-ui" value={form.spec_id} onChange={(event) => setForm({ ...form, spec_id: event.target.value })} required>
          <option value="">Chon chuyen nganh</option>
          {specializations.map((item) => (
            <option key={item.spec_id} value={item.spec_id}>
              {item.spec_name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button className="btn-primary" type="submit">
          Luu dau sach
        </button>
      </div>
    </form>
  );
}
