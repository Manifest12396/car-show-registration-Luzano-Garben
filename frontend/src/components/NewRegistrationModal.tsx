import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { ApiError } from '../api/registrationsApi';
import type {
  CreateRegistrationPayload,
  RegistrationType,
} from '../api/types';
import { formatPhp } from '../utils/format';

interface NewRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRegistrationPayload) => Promise<void>;
}

const FEE_BY_TYPE: Record<RegistrationType, number> = {
  Exhibitor: 1500,
  Competitor: 2500,
  VIP: 5000,
};

const initialForm: CreateRegistrationPayload = {
  participantName: '',
  contactNumber: '',
  email: '',
  address: '',
  carMakeModel: '',
  plateNumber: '',
  registrationType: 'Exhibitor',
  amountPaid: 0,
};

export function NewRegistrationModal({
  open,
  onClose,
  onSubmit,
}: NewRegistrationModalProps) {
  const [form, setForm] = useState<CreateRegistrationPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const currentFee = FEE_BY_TYPE[form.registrationType];

  const handleClose = () => {
    if (submitting) return;
    setForm(initialForm);
    setGeneralError(null);
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      await onSubmit({
        ...form,
        amountPaid: Number(form.amountPaid) || 0,
      });
      setForm(initialForm);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        const mapped: Record<string, string> = {};
        if (err.errors) {
          for (const [key, messages] of Object.entries(err.errors)) {
            if (messages.length > 0) {
              mapped[key.toLowerCase()] = messages[0];
            }
          }
        }
        if (err.status === 409) {
          mapped.platenumber =
            err.detail || err.message || 'Plate number already exists.';
        }
        setFieldErrors(mapped);
        if (Object.keys(mapped).length === 0) {
          setGeneralError(err.message);
        }
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Failed to create registration.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: string) => fieldErrors[field.toLowerCase()];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-registration-title"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="new-registration-title"
              className="text-lg font-semibold text-slate-900"
            >
              New Car Show Registration
            </h2>
            <p className="text-xs text-slate-500">
              Register a participant and vehicle for Car Show 2027
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {generalError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {generalError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Participant Name *
              </label>
              <input
                type="text"
                required
                value={form.participantName}
                onChange={(e) =>
                  setForm({ ...form, participantName: e.target.value })
                }
                placeholder="e.g. Juan Dela Cruz"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('ParticipantName') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('ParticipantName')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Contact Number * (09XXXXXXXXX)
              </label>
              <input
                type="text"
                required
                value={form.contactNumber}
                onChange={(e) =>
                  setForm({ ...form, contactNumber: e.target.value })
                }
                placeholder="09171234567"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('ContactNumber') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('ContactNumber')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="juan@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('Email') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('Email')}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Address *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Rizal St., Sorsogon City"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('Address') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('Address')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Car Make / Model *
              </label>
              <input
                type="text"
                required
                value={form.carMakeModel}
                onChange={(e) =>
                  setForm({ ...form, carMakeModel: e.target.value })
                }
                placeholder="Toyota Supra MK4"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('CarMakeModel') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('CarMakeModel')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Plate Number *
              </label>
              <input
                type="text"
                required
                value={form.plateNumber}
                onChange={(e) =>
                  setForm({ ...form, plateNumber: e.target.value })
                }
                placeholder="ABC 1234"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('PlateNumber') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('PlateNumber')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Registration Type *
              </label>
              <select
                value={form.registrationType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    registrationType: e.target.value as RegistrationType,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Exhibitor">Exhibitor (₱1,500.00)</option>
                <option value="Competitor">Competitor (₱2,500.00)</option>
                <option value="VIP">VIP (₱5,000.00)</option>
              </select>
              {getFieldError('RegistrationType') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('RegistrationType')}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Amount Paid (Fee: {formatPhp(currentFee)})
              </label>
              <input
                type="number"
                min={0}
                max={currentFee}
                step="0.01"
                value={form.amountPaid}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amountPaid: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {getFieldError('AmountPaid') ? (
                <p className="mt-1 text-xs text-red-600">
                  {getFieldError('AmountPaid')}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Create Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
