import { AlertTriangle, CheckCircle2, XCircle, X } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle
};

const colorMap = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  warning: "bg-amber-500"
};

export default function Toast({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || CheckCircle2;
        return (
          <div key={toast.id} className={`toast-enter flex w-80 items-start gap-3 rounded-xl px-4 py-3 text-white shadow-lg ${colorMap[toast.type] || colorMap.success}`}>
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm leading-6">{toast.message}</p>
            <button onClick={() => onClose(toast.id)} type="button">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
