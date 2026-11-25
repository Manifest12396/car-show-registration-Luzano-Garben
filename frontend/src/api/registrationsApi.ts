import type {
  ApiProblemDetails,
  CreateRegistrationPayload,
  GetRegistrationsParams,
  PagedRegistrationsResponse,
  Registration,
  RegistrationSummary,
  UpdateRegistrationPayload,
} from './types';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205'
).replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, problem?: ApiProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.title = problem?.title;
    this.detail = problem?.detail;
    this.errors = problem?.errors;
  }
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let problem: ApiProblemDetails | undefined;
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json')) {
      problem = (await response.json()) as ApiProblemDetails;
    }
  } catch {
    // Ignore JSON parse errors on error responses
  }

  let message =
    problem?.detail ||
    problem?.title ||
    `Request failed with status ${response.status}`;

  if (problem?.errors) {
    const firstFieldErrors = Object.values(problem.errors).flat();
    if (firstFieldErrors.length > 0) {
      message = firstFieldErrors[0];
    }
  }

  return new ApiError(message, response.status, problem);
}

async function requestJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getRegistrations(
  params: GetRegistrationsParams = {},
  signal?: AbortSignal
): Promise<PagedRegistrationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.participantName?.trim()) {
    searchParams.set('participantName', params.participantName.trim());
  }
  if (params.type) {
    searchParams.set('type', params.type);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('pageSize', String(params.pageSize ?? 10));

  return requestJson<PagedRegistrationsResponse>(
    `/api/registrations?${searchParams.toString()}`,
    { signal }
  );
}

export async function getSummary(
  signal?: AbortSignal
): Promise<RegistrationSummary> {
  return requestJson<RegistrationSummary>('/api/registrations/summary', {
    signal,
  });
}

export async function getRegistrationById(
  id: string,
  signal?: AbortSignal
): Promise<Registration> {
  return requestJson<Registration>(`/api/registrations/${id}`, { signal });
}

export async function createRegistration(
  payload: CreateRegistrationPayload
): Promise<Registration> {
  return requestJson<Registration>('/api/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateRegistration(
  id: string,
  payload: UpdateRegistrationPayload
): Promise<Registration> {
  return requestJson<Registration>(`/api/registrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteRegistration(id: string): Promise<void> {
  return requestJson<void>(`/api/registrations/${id}`, {
    method: 'DELETE',
  });
}
