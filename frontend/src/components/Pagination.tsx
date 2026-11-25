import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  loading,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);
  const safeTotalPages = Math.max(totalPages, 1);

  const pageNumbers = Array.from(
    { length: safeTotalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span>
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {startItem}–{endItem}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{totalCount}</span>
        </span>

        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <span>Per page</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            disabled={loading}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1.5"
      >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={loading || page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pageNumbers.map((num) => {
          const isActive = num === page;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              disabled={loading}
              aria-current={isActive ? 'page' : undefined}
              className={`min-w-8 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {num}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={loading || page >= safeTotalPages || totalCount === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
