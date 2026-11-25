import { useCallback, useEffect, useState } from 'react';
import { CarFront, Plus, RefreshCw } from 'lucide-react';
import {
  createRegistration,
  deleteRegistration,
  getRegistrations,
  getSummary,
  updateRegistration,
} from '../api/registrationsApi';
import type {
  CreateRegistrationPayload,
  PagedRegistrationsResponse,
  Registration,
  RegistrationStatus,
  RegistrationSummary,
  RegistrationType,
  UpdateRegistrationPayload,
} from '../api/types';
import { KpiCards } from '../components/KpiCards';
import { NewRegistrationModal } from '../components/NewRegistrationModal';
import { Pagination } from '../components/Pagination';
import { RegistrationDetailsModal } from '../components/RegistrationDetailsModal';
import { RegistrationFilters } from '../components/RegistrationFilters';
import { RegistrationTable } from '../components/RegistrationTable';
import { useDebounce } from '../hooks/useDebounce';

export function RegistrationsPage() {
  const [participantName, setParticipantName] = useState('');
  const [type, setType] = useState<RegistrationType | ''>('');
  const [status, setStatus] = useState<RegistrationStatus | ''>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedName = useDebounce(participantName, 400);

  const [pagedData, setPagedData] = useState<PagedRegistrationsResponse>({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState<RegistrationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const fetchSummaryData = useCallback(async (signal?: AbortSignal) => {
    setSummaryLoading(true);
    try {
      const result = await getSummary(signal);
      setSummary(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchListData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRegistrations(
          {
            participantName: debouncedName,
            type,
            status,
            page,
            pageSize,
          },
          signal
        );
        setPagedData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to connect to the Car Show API.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedName, type, status, page, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.resolve().then(async () => {
      if (!active) return;
      await fetchSummaryData(controller.signal);
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [fetchSummaryData, refreshTick]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.resolve().then(async () => {
      if (!active) return;
      await fetchListData(controller.signal);
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [fetchListData, refreshTick]);

  const handleParticipantNameChange = (value: string) => {
    setParticipantName(value);
    setPage(1);
  };

  const handleTypeChange = (value: RegistrationType | '') => {
    setType(value);
    setPage(1);
  };

  const handleStatusChange = (value: RegistrationStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const handlePageSizeChange = (nextSize: number) => {
    setPageSize(nextSize);
    setPage(1);
  };

  const handleClearFilters = () => {
    setParticipantName('');
    setType('');
    setStatus('');
    setPage(1);
  };

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
  };

  const handleCreate = async (payload: CreateRegistrationPayload) => {
    await createRegistration(payload);
    setPage(1);
    handleRefresh();
  };

  const handleUpdate = async (
    id: string,
    payload: UpdateRegistrationPayload
  ) => {
    await updateRegistration(id, payload);
    handleRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteRegistration(id);
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Car Show 2027
              </h1>
              <p className="text-xs text-slate-500">
                AutoVista Events · Sorsogon City Coliseum Registration Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Registration
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <KpiCards summary={summary} loading={summaryLoading} />

        <section aria-label="Registrations management" className="space-y-4">
          <RegistrationFilters
            participantName={participantName}
            type={type}
            status={status}
            onParticipantNameChange={handleParticipantNameChange}
            onTypeChange={handleTypeChange}
            onStatusChange={handleStatusChange}
            onClear={handleClearFilters}
          />

          <RegistrationTable
            items={pagedData.items}
            loading={loading}
            error={error}
            pageSize={pageSize}
            onRetry={handleRefresh}
            onClearFilters={handleClearFilters}
            onSelectRegistration={setSelectedRegistration}
          />

          {!error ? (
            <Pagination
              page={pagedData.page}
              pageSize={pagedData.pageSize}
              totalCount={pagedData.totalCount}
              totalPages={pagedData.totalPages}
              loading={loading}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </section>
      </main>

      <NewRegistrationModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <RegistrationDetailsModal
        key={selectedRegistration?.id ?? 'closed'}
        registration={selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
