import { RotateCcw, Search } from 'lucide-react';
import type { RegistrationStatus, RegistrationType } from '../api/types';

interface RegistrationFiltersProps {
  participantName: string;
  type: RegistrationType | '';
  status: RegistrationStatus | '';
  onParticipantNameChange: (value: string) => void;
  onTypeChange: (value: RegistrationType | '') => void;
  onStatusChange: (value: RegistrationStatus | '') => void;
  onClear: () => void;
}

export function RegistrationFilters({
  participantName,
  type,
  status,
  onParticipantNameChange,
  onTypeChange,
  onStatusChange,
  onClear,
}: RegistrationFiltersProps) {
  const hasActiveFilters =
    participantName.trim() !== '' || type !== '' || status !== '';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filter-participant-name"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Participant Name
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-participant-name"
              type="text"
              value={participantName}
              onChange={(e) => onParticipantNameChange(e.target.value)}
              placeholder="Search participant name…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-type"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Registration Type
          </label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) =>
              onTypeChange(e.target.value as RegistrationType | '')
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="Exhibitor">Exhibitor</option>
            <option value="Competitor">Competitor</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-status"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Status
          </label>
          <select
            id="filter-status"
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as RegistrationStatus | '')
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">CheckedIn</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end">
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          <RotateCcw className="h-4 w-4" />
          Clear filters
        </button>
      </div>
    </div>
  );
}
