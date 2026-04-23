# Frontend Pages Plan

## Frontend Goals

The frontend should feel like a real SaaS dashboard for QA automation teams. It should be polished, responsive, component-based, and connected to the real FastAPI backend APIs.

Design direction:

- Quiet professional dashboard.
- Clear hierarchy and dense but readable data views.
- Sidebar navigation and top navbar.
- Cards for repeated metrics and records.
- Tables with search, filters, status badges, and empty states.
- Modal or drawer forms for create and edit flows.
- Loading and error states for all API-driven pages.
- Responsive layout that works on laptop and mobile widths.

## App Shell

Shared layout for authenticated pages:

- Left sidebar with primary navigation.
- Top navbar with page title, search/action area, and user menu.
- Main content area with consistent spacing.
- Mobile sidebar drawer.

Primary navigation:

- Dashboard
- Projects
- Test Cases
- Test Runs
- Logs
- Analytics
- Settings

## Shared UI Components

Planned reusable components:

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Badge`
- `Card`
- `MetricCard`
- `DataTable`
- `TablePagination`
- `SearchInput`
- `FilterBar`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `Modal`
- `Drawer`
- `StatusBadge`
- `PriorityBadge`
- `PageHeader`
- `DashboardShell`
- `Sidebar`
- `TopNav`

## Routes

### `/login`

Purpose:

- Authenticate existing users.

UI:

- Split-free focused auth screen.
- Email and password fields.
- Submit button with loading state.
- Link to register.
- Error message for invalid credentials.

API:

- `POST /api/v1/auth/login`

### `/register`

Purpose:

- Create new account.

UI:

- Name, email, password fields.
- Password validation feedback.
- Submit button with loading state.
- Link to login.

API:

- `POST /api/v1/auth/register`

### `/dashboard`

Purpose:

- Main overview after login.

UI:

- Metric cards for total projects, test cases, runs, and pass rate.
- Recent runs table.
- Failure trend or project failure summary.
- Recent activity list.
- CTA to create project or test case when empty.

API:

- `GET /api/v1/analytics/overview`
- Project/activity data can come from analytics or project detail endpoints as implementation evolves.

### `/projects`

Purpose:

- Project management list.

UI:

- Search and sort controls.
- Create project button opening modal or drawer.
- Table with project name, base URL, page count, element count, test case count, run count, last run status, updated date.
- Empty state for first project.
- Pagination.

API:

- `GET /api/v1/projects`
- `POST /api/v1/projects`

### `/projects/[id]`

Purpose:

- Project detail and operational summary.

UI:

- Project header with name, base URL, edit/delete actions.
- Stats cards.
- Recent inspected pages.
- Recent test cases.
- Recent runs.
- Activity timeline.

API:

- `GET /api/v1/projects/{project_id}`
- `PATCH /api/v1/projects/{project_id}`
- `DELETE /api/v1/projects/{project_id}`

### `/projects/[id]/pages`

Purpose:

- Inspect and manage discovered pages.

UI:

- Inspect URL form in drawer or top panel.
- Pages table with URL, title, status code, inspected date, element count.
- Search and pagination.
- Empty state encouraging first inspection.

API:

- `POST /api/v1/projects/{project_id}/inspect`
- `GET /api/v1/projects/{project_id}/pages`

### `/projects/[id]/elements`

Purpose:

- Browse stored UI elements from inspected pages.

UI:

- Filter by page and element type.
- Search by text, selector, label, placeholder, or href.
- Table with type, selector, text, attributes, source page.
- Detail drawer showing metadata JSON in a readable format.

API:

- `GET /api/v1/projects/{project_id}/elements`

### `/test-cases`

Purpose:

- Manage reusable test definitions.

UI:

- Search, project filter, status filter, priority filter.
- Create test case drawer.
- Table with name, project, priority, status, step count, last run status, updated date.
- Pagination.

API:

- `GET /api/v1/test-cases`
- `POST /api/v1/test-cases`

### `/test-cases/[id]`

Purpose:

- View and manage a test case.

UI:

- Header with name, project, status, priority.
- Ordered step list.
- Recent runs table.
- Run test button.
- Edit metadata action.

API:

- `GET /api/v1/test-cases/{test_case_id}`
- `PATCH /api/v1/test-cases/{test_case_id}`
- `POST /api/v1/test-cases/{test_case_id}/runs`

### `/test-runs`

Purpose:

- Review execution history.

UI:

- Filter by project, test case, status, and date range.
- Table with run ID, test case, project, status, duration, browser, environment, started date.
- Row opens detail view or navigates to run-focused section.

API:

- `GET /api/v1/test-runs`
- `GET /api/v1/test-runs/{run_id}`

### `/logs`

Purpose:

- Search execution logs and diagnose failures.

UI:

- Search box.
- Filters for project, test case, run, severity, status, and date range.
- Log table with timestamp, severity, status, project, test case, message.
- Detail drawer with failure reason and metadata.

API:

- `GET /api/v1/logs`

### `/analytics`

Purpose:

- Product analytics and QA quality overview.

UI:

- Metric cards.
- Pass rate visualization.
- Recent run summary.
- Failures by project table or chart.
- Common failure reasons.
- Project filter when enough data exists.

API:

- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/projects/{project_id}`

### `/settings`

Purpose:

- Current user profile and basic preferences.

UI:

- Profile card.
- Account metadata.
- Placeholder for future team or role controls.

API:

- `GET /api/v1/auth/me`

## Data Loading Strategy

Initial implementation can use client-side data fetching with a typed API client. Later refinement can introduce server components where appropriate.

Requirements:

- Every data page has loading state.
- Every data page has error state.
- Empty states are helpful and product-specific.
- Mutations refresh relevant lists.
- Auth failure redirects to `/login`.

## Phase 4 Implementation Notes

The first Next.js frontend slice has been implemented under `frontend/` with the App Router, TypeScript, Tailwind CSS, and reusable dashboard components.

Implemented route groups:

- Public auth routes: `/login`, `/register`.
- Protected dashboard routes: `/dashboard`, `/projects`, `/projects/[id]`, `/test-cases`, `/test-cases/[id]`, `/test-runs`, `/logs`, `/analytics`, `/settings`.

Current API integration:

- Auth screens call the real backend contracts for register and login.
- Project list, create, and detail screens call the real backend project APIs.
- Test cases, test runs, logs, analytics, and settings use typed frontend data so the UI can be built and reviewed before those backend modules are completed.

The protected dashboard uses a client-side auth gate because the Phase 3 backend returns a bearer token that is currently stored by the frontend auth utility. Later production hardening can move token handling to httpOnly cookies if desired.

## Visual Quality Checklist

- Consistent spacing scale.
- Consistent typography.
- Tables remain readable on smaller screens.
- Forms use labels, validation states, and disabled loading states.
- Status and priority badges use consistent colors.
- Navigation clearly shows active route.
- Cards are used for metrics and repeated content, not nested decorative wrappers.
- The UI should look like a startup product dashboard, not a classroom assignment.
