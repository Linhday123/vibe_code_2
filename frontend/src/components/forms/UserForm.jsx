import { useEffect, useState } from "react";

const defaultState = {
  username: "",
  password: "",
  full_name: "",
  email: "",
  role: "librarian"
};

export default function UserForm({ initialData, isSelf, onSubmit }) {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    setForm(initialData ? { ...defaultState, ...initialData, password: "" } : defaultState);
  }, [initialData]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        onSubmit(payload);
      }}
    >
      <div>
        <label className="label-ui">Username</label>
        <input className="input-ui" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Mat khau {initialData ? "(de trong neu giu nguyen)" : ""}</label>
        <input className="input-ui" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={!initialData} />
      </div>
      <div>
        <label className="label-ui">Ho ten</label>
        <input className="input-ui" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Email</label>
        <input className="input-ui" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </div>
      <div>
        <label className="label-ui">Vai tro</label>
        <select className="input-ui" disabled={isSelf} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" type="submit">
          Luu tai khoan
        </button>
      </div>
    </form>
  );
}
