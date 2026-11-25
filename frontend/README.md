# Car Show 2027 — Registration Dashboard (Frontend)

React + TypeScript + Vite + Tailwind CSS dashboard for the **Car Show 2027 Registration System** (AutoVista Events, Sorsogon City Coliseum).

## Setup & Run

1. Make sure `.env.development` points to the running C# backend API:

   ```env
   VITE_API_BASE_URL=http://localhost:5205
   ```

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

   The app runs on `http://localhost:5173`.

## Switching Between Sample Data and the Real API

Both `src/api/registrationsApi.ts` and `src/api/sample-data.ts` export the exact same functions and return shapes (`getRegistrations`, `getSummary`, `getRegistrationById`, `createRegistration`, `updateRegistration`, `deleteRegistration`).

In `src/pages/RegistrationsPage.tsx` (and `src/components/RegistrationDetailsModal.tsx`), you can switch between the real C# API and local sample data by changing the import path:

- **Real C# API (default):**
  ```ts
  import {
    createRegistration,
    deleteRegistration,
    getRegistrations,
    getSummary,
    updateRegistration,
  } from '../api/registrationsApi';
  ```

- **Local Sample Data (25 offline registrations):**
  ```ts
  import {
    createRegistration,
    deleteRegistration,
    getRegistrations,
    getSummary,
    updateRegistration,
  } from '../api/sample-data';
  ```
