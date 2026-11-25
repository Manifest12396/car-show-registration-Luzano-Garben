import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { ApiError, getRegistrationById } from '../api/registrationsApi';
import type {
  Registration,
  RegistrationStatus,
  UpdateRegistrationPayload,
} from '../api/types';
import { formatPhp, formatRegistrationDate } from '../utils/format';
import { PaymentBadge } from './PaymentBadge';
import { StatusBadge } from './StatusBadge';

interface RegistrationDetailsModalProps {
  registration: Registration | null;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateRegistrationPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RegistrationDetailsModal({
  registration,
  onClose,
  onUpdate,
  onDelete,
}: RegistrationDetailsModalProps) {
  const [details, setDetails] = useState<Registration | null>(registration);
  const [loading, setLoading] = useState(Boolean(registration));
  const [status, setStatus] = useState<RegistrationStatus>(
    registration?.status ?? 'Pending'
  );
  const [amountPaid, setAmountPaid] = useState<number>(
    registration?.amountPaid ?? 0
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!registration) return;

    const controller = new AbortController();
    let active = true;

    getRegistrationById(registration.id, controller.signal)
      .then((fresh) => {
        if (!active) return;
        setDetails(fresh);
        setStatus(fresh.status);
        setAmountPaid(fresh.amountPaid);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Keep fallback row details if detail fetch fails
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [registration]);

  if (!registration || !details) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onUpdate(details.id, {
        participantName: details.participantName,
        contactNumber: details.contactNumber,
        email: details.email,
        address: details.address,
        carMakeModel: details.carMakeModel,
        plateNumber: details.plateNumber,
        registrationType: details.registrationType,
        status,
        amountPaid: Number(amountPaid) || 0,
      });
      onClose();
    } catch (err) {
      if (err instanceof ApiError || err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update registration.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onDelete(details.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiError || err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete registration.');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="details-modal-title"
                className="font-mono text-lg font-bold text-slate-900"
              >
                {details.registrationNumber}
              </h2>
              <StatusBadge status={details.status} />
              <PaymentBadge paymentStatus={details.paymentStatus} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Registered {formatRegistrationDate(details.registrationDate)}
              {loading ? ' · Refreshing…' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Participant
              </dt>
              <dd className="mt-0.5 font-medium text-slate-900">
                {details.participantName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Contact Number
              </dt>
              <dd className="mt-0.5 text-slate-900">{details.contactNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Email</dt>
              <dd className="mt-0.5 text-slate-900">{details.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Type</dt>
              <dd className="mt-0.5 font-medium text-slate-900">
                {details.registrationType}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-500">Address</dt>
              <dd className="mt-0.5 text-slate-900">{details.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Car Make / Model
              </dt>
              <dd className="mt-0.5 font-medium text-slate-900">
                {details.carMakeModel}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Plate Number
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-slate-900">
                {details.plateNumber}
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
              Staff Quick Update
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as RegistrationStatus)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="CheckedIn">CheckedIn</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Amount Paid (Fee: {formatPhp(details.registrationFee)})
                </label>
                <input
                  type="number"
                  min={0}
                  max={details.registrationFee}
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || deleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || deleting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Updating…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
