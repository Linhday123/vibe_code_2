import { useMemo, useState } from "react";

export function usePagination(items = [], pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  return {
    page: currentPage,
    totalPages,
    paginatedItems,
    setPage
  };
}
