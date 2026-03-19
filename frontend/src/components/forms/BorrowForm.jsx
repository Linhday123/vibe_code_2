import { CheckCircle2, ChevronLeft, ChevronRight, FileCheck2, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

export default function BorrowForm({ readers, copies, onSubmit }) {
  const [step, setStep] = useState(1);
  const [readerSearch, setReaderSearch] = useState("");
  const [copySearch, setCopySearch] = useState("");
  const [payload, setPayload] = useState({ reader_id: "", copy_id: "" });

  const availableReaders = useMemo(
    () => readers.filter((item) => `${item.reader_id} ${item.full_name} ${item.class_name}`.toLowerCase().includes(readerSearch.toLowerCase())),
    [readerSearch, readers]
  );
  const availableCopies = useMemo(
    () => copies.filter((item) => `${item.copy_id} ${item.title_name} ${item.author}`.toLowerCase().includes(copySearch.toLowerCase())),
    [copySearch, copies]
  );

  const selectedReader = readers.find((item) => item.reader_id === payload.reader_id);
  const selectedCopy = copies.find((item) => item.copy_id === payload.copy_id);

  const steps = [
    { id: 1, label: "Chon doc gia", icon: UserRound },
    { id: 2, label: "Chon ban sao", icon: Search },
    { id: 3, label: "Xac nhan", icon: FileCheck2 }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[260px,1fr]">
      <div className="card-ui p-6">
        <div className="space-y-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div className="flex items-center gap-3" key={item.id}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= item.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">{item.label}</div>
                  <div className="text-xs text-slate-400">Buoc {item.id}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-ui p-6">
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="label-ui">Tim doc gia</label>
              <input className="input-ui" value={readerSearch} onChange={(event) => setReaderSearch(event.target.value)} placeholder="Nhap ma, ten hoac lop..." />
            </div>
            <div>
              <label className="label-ui">Chon doc gia</label>
              <select className="input-ui" value={payload.reader_id} onChange={(event) => setPayload({ ...payload, reader_id: event.target.value })}>
                <option value="">Chon doc gia</option>
                {availableReaders.map((item) => (
                  <option key={item.reader_id} value={item.reader_id}>
                    {item.reader_id} - {item.full_name} - {item.class_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div>
              <label className="label-ui">Tim ban sao</label>
              <input className="input-ui" value={copySearch} onChange={(event) => setCopySearch(event.target.value)} placeholder="Nhap ma ban sao, ten sach..." />
            </div>
            <div>
              <label className="label-ui">Chon ban sao available</label>
              <select className="input-ui" value={payload.copy_id} onChange={(event) => setPayload({ ...payload, copy_id: event.target.value })}>
                <option value="">Chon ban sao</option>
                {availableCopies.map((item) => (
                  <option key={item.copy_id} value={item.copy_id}>
                    {item.copy_id} - {item.title_name} - {item.author}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Xac nhan thong tin phieu muon</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div><strong>Doc gia:</strong> {selectedReader?.full_name} ({selectedReader?.reader_id})</div>
                <div><strong>Lop:</strong> {selectedReader?.class_name}</div>
                <div><strong>Ban sao:</strong> {selectedCopy?.copy_id}</div>
                <div><strong>Ten sach:</strong> {selectedCopy?.title_name}</div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-between">
          <button className="btn-secondary" disabled={step === 1} onClick={() => setStep(step - 1)} type="button">
            <ChevronLeft className="h-4 w-4" />
            Quay lai
          </button>
          {step < 3 ? (
            <button
              className="btn-primary"
              disabled={(step === 1 && !payload.reader_id) || (step === 2 && !payload.copy_id)}
              onClick={() => setStep(step + 1)}
              type="button"
            >
              Tiep tuc
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="btn-primary" onClick={() => onSubmit(payload)} type="button">
              Tao phieu muon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
