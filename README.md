# CRM Frontend (app-ui)

React + TypeScript frontend for the CRM. Uses Vite, React Router, React Query, and modular SCSS. Provides authentication, leads/customers, work items, tasks, kanban, dashboard, and detailed pages with chat.

## Features

- Auth (login/signup), persistent session validation
- Leads/Customers CRUD (single Leads table with is_converted flag; soft delete)
- Work Items and Tasks with statuses; draggable Kanban board
- Client Conversations (chat-like UI) against Leads; user detail view of recorded conversations
- Reusable components: CommonForm, FormModal (Portal), ConfirmationModal (Portal), StatusBadge, TagInput, ChatThread, Protected/Public routes, Layout, Sidebar, TopBar
- React Query with centralized query keys and cache invalidation
- Centralized env config, messages, button labels
- SCSS-based design with consistent classes

## Project Structure

```
src/
├── App.tsx
├── components/
│   ├── ChatThread.tsx
│   ├── CommonForm.tsx
│   ├── ConfirmationModal.tsx
│   ├── FormModal.tsx
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicRoute.tsx
│   ├── Sidebar.tsx
│   ├── StatusBadge.tsx
│   └── TopBar.tsx
├── config/
│   └── env.ts
├── constants/
│   └── queryKeys.ts
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useCommunications.ts
│   ├── useLeads.ts
│   ├── useRoles.ts
│   ├── useUsers.ts
│   └── useWorkItems.ts
├── lib/
│   └── queryClient.ts
├── pages/
│   ├── Customers.tsx
│   ├── Dashboard.tsx
│   ├── Kanban.tsx
│   ├── LeadDetails.tsx
│   ├── Leads.tsx
│   ├── LoginPage.tsx
│   ├── Settings.tsx
│   ├── SignupPage.tsx
│   └── WorkItems.tsx
├── services/
│   ├── authService.ts
│   ├── communicationService.ts
│   ├── leadService.ts
│   └── api.ts (legacy)
├── styles/
│   ├── main.scss
│   ├── components/ (_buttons.scss, _layout.scss, _sidebar.scss, _topbar.scss, ...)
│   ├── pages/ (_dashboard.scss, _kanban.scss, _lead-details.scss, _work-items.scss, ...)
│   └── utils/ (_utilities.scss)
├── utils/
│   ├── ButtonLabels.ts
│   ├── Messages.ts
│   └── formatters.ts
├── main.tsx
└── vite-env.d.ts
```

## Environment

Copy env example and update values:
```bash
cp env.example .env
```

`.env` keys:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_AUTH_TOKEN_KEY=crm_auth_token
VITE_AUTH_USER_KEY=crm_auth_user
VITE_NODE_ENV=development
```

## Scripts

```bash
npm install         # install deps
npm run dev         # start Vite dev server
npm run build       # prod build
npm run preview     # preview prod build
```

## Data Fetching (React Query)

- Query keys centralized in `src/constants/queryKeys.ts`
- Errors funneled via `lib/queryClient.ts::handleQueryError`
- Hooks provide CRUD and cache invalidation:
  - `useLeads`, `useUsers`, `useRoles`, `useWorkItems`, `useCommunications`

## Reusable UI

- `FormModal` and `ConfirmationModal` render via React Portals (true modal layering)
- `CommonForm` for configurable forms (fields/buttons/validation)
- `TagInput` searchable single/multi select with floating dropdown (no clipping)
- `ChatThread` for conversations (read-only or send mode)

## Pages Highlights

- Leads/Customers: CRUD with duplicate validation; soft delete; conversion to customer
- Work Items: table with filters by customer/user/status; nested tasks; edit modals
- Kanban: drag-and-drop across Work Status columns (Work Items + Tasks)
- Dashboard: tiles + charts (Recharts), metrics (conversion, counts, turnaround)
- Lead Details: profile-style layout; About/Timeline; Work Items/Tasks/Chats in a row; User filter (filters assignees/creators)
- User Details: About; unified Customer/Lead filter; Work Items/Tasks (by customer) and chats recorded by that user

## Styling

- SCSS modules under `styles/` with consistent class naming (`lead-card`, `filters__bar`, `lead-details__triple`, etc.)
- No inline styles except minimal layout conveniences where necessary

## Auth

- `AuthContext` persists token and user to localStorage; validates token via `/api/users/me`

## Search

- TopBar search indexes Leads and Users; selecting navigates to Lead Details or User Details

## Notes

- Ensure backend is running and seeded; configure `VITE_API_BASE_URL` accordingly
- Use Prisma/seed scripts in backend to populate ample sample data