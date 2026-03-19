import { useEffect, useState } from "react";

const defaultState = {
  spec_name: "",
  description: ""
};

export default function SpecializationForm({ initialData, onSubmit }) {
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
        <label className="label-ui">Ten chuyen nganh</label>
        <input className="input-ui" value={form.spec_name} onChange={(event) => setForm({ ...form, spec_name: event.target.value })} required />
      </div>
      <div>
        <label className="label-ui">Mo ta</label>
        <textarea className="input-ui min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" type="submit">
          Luu chuyen nganh
        </button>
      </div>
    </form>
  );
}
