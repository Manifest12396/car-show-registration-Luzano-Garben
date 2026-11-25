import type { RegistrationStatus } from '../api/types';

interface StatusBadgeProps {
  status: RegistrationStatus;
}

const statusConfig: Record<
  RegistrationStatus,
  { label: string; classes: string; dot: string }
> = {
  Pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    label: 'Confirmed',
    classes: 'bg-blue-50 text-blue-800 ring-blue-200',
    dot: 'bg-blue-500',
  },
  CheckedIn: {
    label: 'Checked In',
    classes: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    label: 'Cancelled',
    classes: 'bg-rose-50 text-rose-800 ring-rose-200',
    dot: 'bg-rose-500',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
