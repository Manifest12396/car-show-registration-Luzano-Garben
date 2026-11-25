import type { PaymentStatus } from '../api/types';

interface PaymentBadgeProps {
  paymentStatus: PaymentStatus;
}

const paymentConfig: Record<
  PaymentStatus,
  { label: string; classes: string; dot: string }
> = {
  Unpaid: {
    label: 'Unpaid',
    classes: 'bg-red-50 text-red-800 ring-red-200',
    dot: 'bg-red-500',
  },
  Partial: {
    label: 'Partial',
    classes: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
  },
  Paid: {
    label: 'Paid',
    classes: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export function PaymentBadge({ paymentStatus }: PaymentBadgeProps) {
  const config = paymentConfig[paymentStatus] ?? paymentConfig.Unpaid;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
