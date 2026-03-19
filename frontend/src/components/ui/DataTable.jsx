import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { usePagination } from "../../hooks/usePagination";
import EmptyState from "./EmptyState";

export default function DataTable({ columns, data, pageSize = 8, emptyIcon, emptyTitle, emptyDescription, emptyAction }) {
  const { page, totalPages, paginatedItems, setPage } = usePagination(data, pageSize);

  useEffect(() => {
    setPage(1);
  }, [data, setPage]);

  if (!data.length) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((row, index) => (
              <tr key={row.id || row.reader_id || row.title_id || row.copy_id || row.record_id || index} className="transition-colors hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="border-b border-slate-100 px-4 py-3 align-top text-sm text-slate-600">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <button className="btn-secondary px-3 py-2" disabled={page === 1} onClick={() => setPage(page - 1)} type="button">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${value === page ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600"}`}
              onClick={() => setPage(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
        <button className="btn-secondary px-3 py-2" disabled={page === totalPages} onClick={() => setPage(page + 1)} type="button">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
