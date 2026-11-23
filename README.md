# Car Show 2027 Registration System

Car Show 2027 is a full-stack car show registration system for managing exhibitor,
competitor, and VIP participants, registration payments, check-in status, filtering,
and event KPIs.

## Repository Layout

```text
backend/
frontend/
docs/screenshots/
README.md
```

## Team

| Role | Responsibilities |
| --- | --- |
| Backend Developer | .NET API, domain model, EF Core/SQLite, validation, and migration |
| Frontend Developer | React/Vite UI, API integration, forms, tables, and dashboard |

## Run the Backend

```bash
cd backend/Final-Project-BackendAPI-Startup
dotnet restore
dotnet run --project Api
```

The API is available at `http://localhost:5205`; Scalar documentation is available at
`http://localhost:5205/scalar/v1`.

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server uses `http://localhost:5173`.
