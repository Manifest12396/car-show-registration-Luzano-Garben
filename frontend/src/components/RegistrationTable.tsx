import { AlertTriangle, RefreshCw, RotateCcw, SearchX } from 'lucide-react';
import type { Registration } from '../api/types';
import { formatPhp, formatRegistrationDate } from '../utils/format';
import { PaymentBadge } from './PaymentBadge';
import { StatusBadge } from './StatusBadge';

interface RegistrationTableProps {
  items: Registration[];
  loading: boolean;
  error: string | null;
  pageSize: number;
  onRetry: () => void;
  onClearFilters: () => void;
  onSelectRegistration: (registration: Registration) => void;
}

const typeBadgeClasses: Record<Registration['registrationType'], string> = {
  Exhibitor: 'bg-slate-100 text-slate-700',
  Competitor: 'bg-purple-50 text-purple-700',
  VIP: 'bg-amber-50 text-amber-800',
};

export function RegistrationTable({
  items,
  loading,
  error,
  pageSize,
  onRetry,
  onClearFilters,
  onSelectRegistration,
}: RegistrationTableProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-14 text-center shadow-xs"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Cannot reach the API
        </h3>
        <p className="mt-1 max-w-md text-sm text-slate-600">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No registrations match your filters
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try adjusting your search query, registration type, or status filter.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        >
          <RotateCcw className="h-4 w-4" />
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wider text-slate-600 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Reg. No.
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Date
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Participant
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Car
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Type
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-right whitespace-nowrap"
              >
                Fee / Paid
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading
              ? Array.from({ length: Math.min(pageSize, 10) }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-28 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-1.5 h-3 w-40 rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-1.5 h-3 w-20 rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-5 w-20 rounded-md bg-slate-200" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-6 w-24 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="ml-auto h-4 w-28 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-6 w-18 rounded-full bg-slate-200" />
                    </td>
                  </tr>
                ))
              : items.map((reg) => (
                  <tr
                    key={reg.id}
                    onClick={() => onSelectRegistration(reg)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/90"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {reg.registrationNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      {formatRegistrationDate(reg.registrationDate)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">
                        {reg.participantName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {reg.contactNumber} · {reg.email}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">
                        {reg.carMakeModel}
                      </div>
                      <div className="font-mono text-xs text-slate-500">
                        {reg.plateNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${typeBadgeClasses[reg.registrationType]}`}
                      >
                        {reg.registrationType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap tabular-nums">
                      <span className="font-medium text-slate-900">
                        {formatPhp(reg.registrationFee)}
                      </span>
                      <span className="mx-1 text-slate-400">/</span>
                      <span className="text-slate-600">
                        {formatPhp(reg.amountPaid)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <PaymentBadge paymentStatus={reg.paymentStatus} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {loading ? (
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-xs text-slate-500">
          Loading registrations…
        </div>
      ) : null}
    </div>
  );
}
