import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Percent,
  UserCheck,
  Users,
} from 'lucide-react';
import type { RegistrationSummary } from '../api/types';
import { formatPhp } from '../utils/format';
import { KpiCard } from './KpiCard';

interface KpiCardsProps {
  summary: RegistrationSummary | null;
  loading: boolean;
}

export function KpiCards({ summary, loading }: KpiCardsProps) {
  const collectionRate =
    summary && summary.totalFees > 0
      ? Math.round((summary.totalPayments / summary.totalFees) * 100)
      : 0;

  return (
    <section
      aria-label="Event summary KPIs"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      <KpiCard
        label="Total Registrations"
        value={summary ? String(summary.totalRegistrations) : '0'}
        sublabel={
          summary
            ? `${summary.pending} pending · ${summary.cancelled} cancelled`
            : undefined
        }
        icon={<Users className="h-4 w-4" />}
        accentClass="bg-slate-100 text-slate-700"
        loading={loading}
      />
      <KpiCard
        label="Total Payments"
        value={summary ? formatPhp(summary.totalPayments) : formatPhp(0)}
        sublabel={
          summary ? `of ${formatPhp(summary.totalFees)} total fees` : undefined
        }
        icon={<CircleDollarSign className="h-4 w-4" />}
        accentClass="bg-emerald-50 text-emerald-700"
        loading={loading}
      />
      <KpiCard
        label="Uncollected"
        value={summary ? formatPhp(summary.uncollectedPayments) : formatPhp(0)}
        sublabel="Balance due from active entries"
        icon={<Clock3 className="h-4 w-4" />}
        accentClass="bg-amber-50 text-amber-700"
        loading={loading}
      />
      <KpiCard
        label="Confirmed"
        value={summary ? String(summary.confirmed) : '0'}
        sublabel="Approved participants"
        icon={<CheckCircle2 className="h-4 w-4" />}
        accentClass="bg-blue-50 text-blue-700"
        loading={loading}
      />
      <KpiCard
        label="Checked In"
        value={summary ? String(summary.checkedIn) : '0'}
        sublabel="Arrived at coliseum"
        icon={<UserCheck className="h-4 w-4" />}
        accentClass="bg-indigo-50 text-indigo-700"
        loading={loading}
      />
      <KpiCard
        label="Collection Rate"
        value={`${collectionRate}%`}
        sublabel="Collected vs total fees"
        icon={<Percent className="h-4 w-4" />}
        accentClass="bg-teal-50 text-teal-700"
        loading={loading}
      />
    </section>
  );
}
