import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: ReactNode;
  accentClass?: string;
  loading?: boolean;
}

export function KpiCard({
  label,
  value,
  sublabel,
  icon,
  accentClass = 'bg-slate-100 text-slate-700',
  loading = false,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs animate-pulse">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3.5 w-24 rounded bg-slate-200" />
          <div className="h-8 w-8 rounded-lg bg-slate-200" />
        </div>
        <div className="mt-3 h-7 w-28 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          {label}
        </span>
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentClass}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {sublabel ? (
        <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
      ) : null}
    </div>
  );
}
