# API Plan

## API Style

The backend will expose a versioned REST API under `/api/v1`. All protected endpoints require a JWT bearer token.

Base conventions:

- JSON request and response bodies.
- Pydantic request validation.
- Consistent response envelopes for list endpoints.
- Consistent error response shape.
- Pagination on collection endpoints.
- Search and filters where useful.
- Parameterized SQL in repositories only.

## Common Response Shapes

### Paginated List

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 0,
  "has_next": false
}
```

### Error

```json
{
  "detail": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid."
  }
}
```

## Authentication

### `POST /api/v1/auth/register`

Creates a new user.

Request:

```json
{
  "name": "Rubel Ahmed",
  "email": "rubel@example.com",
  "password": "strong-password"
}
```

Response `201` includes user ID, name, email, role, and created timestamp.

### `POST /api/v1/auth/login`

Authenticates a user and returns a JWT access token.

Request:

```json
{
  "email": "rubel@example.com",
  "password": "strong-password"
}
```

Response `200`:

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "Rubel Ahmed",
    "email": "rubel@example.com",
    "role": "user"
  }
}
```

### `GET /api/v1/auth/me`

Returns the current authenticated user profile.

## Projects

### `POST /api/v1/projects`

Creates a project.

Request:

```json
{
  "name": "Marketing Website",
  "base_url": "https://example.com",
  "description": "Public website regression suite"
}
```

### `GET /api/v1/projects`

Lists projects owned by the authenticated user.

Query parameters:

- `page`
- `page_size`
- `search`
- `sort_by`: `created_at`, `name`, `updated_at`, `test_case_count`, `run_count`
- `sort_dir`: `asc`, `desc`

Each item should include project fields, page count, UI element count, test case count, run count, and last run status.

### `GET /api/v1/projects/{project_id}`

Returns project details with aggregates and recent activity.

### `PATCH /api/v1/projects/{project_id}`

Updates project name, base URL, or description.

### `DELETE /api/v1/projects/{project_id}`

Deletes a project and dependent resources according to schema constraints.

## Project Pages and UI Inspector

### `POST /api/v1/projects/{project_id}/inspect`

Fetches and parses a page URL, then stores page and UI element metadata.

Request:

```json
{
  "url": "https://example.com/pricing"
}
```

Response `201`:

```json
{
  "page": {
    "id": "uuid",
    "project_id": "uuid",
    "url": "https://example.com/pricing",
    "title": "Pricing",
    "status_code": 200,
    "inspected_at": "2026-04-23T10:00:00Z"
  },
  "summary": {
    "buttons": 4,
    "inputs": 2,
    "links": 18,
    "forms": 1,
    "total_elements": 25
  }
}
```

### `GET /api/v1/projects/{project_id}/pages`

Lists inspected pages for a project with `page`, `page_size`, and `search`.

### `GET /api/v1/projects/{project_id}/elements`

Lists stored UI elements for a project.

Query parameters:

- `page`
- `page_size`
- `page_id`
- `element_type`: `button`, `input`, `link`, `form`
- `search`

## Test Cases

### `POST /api/v1/test-cases`

Creates a test case with ordered steps.

Request:

```json
{
  "project_id": "uuid",
  "name": "Pricing CTA opens signup",
  "description": "Verify the pricing page CTA routes to signup.",
  "priority": "high",
  "status": "active",
  "steps": [
    {
      "step_order": 1,
      "action": "navigate",
      "target": "https://example.com/pricing",
      "expected_result": "Pricing page loads"
    },
    {
      "step_order": 2,
      "action": "click",
      "target": "a[href='/signup']",
      "expected_result": "Signup page opens"
    }
  ]
}
```

### `GET /api/v1/test-cases`

Lists test cases with `page`, `page_size`, `project_id`, `status`, `priority`, and `search` filters.

### `GET /api/v1/test-cases/{test_case_id}`

Returns test case details with steps, project summary, and recent runs.

### `PATCH /api/v1/test-cases/{test_case_id}`

Updates test case metadata. Step replacement can be handled through a dedicated endpoint if needed during implementation.

### `DELETE /api/v1/test-cases/{test_case_id}`

Deletes a test case and dependent steps and runs according to schema constraints.

## Test Runs

### `POST /api/v1/test-cases/{test_case_id}/runs`

Creates a simulated test run from a test case.

Request:

```json
{
  "environment": "local",
  "browser": "chromium"
}
```

Response `201`:

```json
{
  "id": "uuid",
  "test_case_id": "uuid",
  "project_id": "uuid",
  "status": "passed",
  "duration_ms": 1840,
  "started_at": "2026-04-23T10:00:00Z",
  "finished_at": "2026-04-23T10:00:02Z"
}
```

### `GET /api/v1/test-runs`

Lists test runs with `page`, `page_size`, `project_id`, `test_case_id`, `status`, `search`, `from_date`, and `to_date`.

### `GET /api/v1/test-runs/{run_id}`

Returns run details with test case, project, and logs.

## Logs

### `GET /api/v1/logs`

Returns searchable execution logs.

Query parameters:

- `page`
- `page_size`
- `project_id`
- `test_case_id`
- `run_id`
- `severity`
- `status`
- `search`
- `from_date`
- `to_date`

Each item should include run, project, and test case context using joins.

## Analytics

### `GET /api/v1/analytics/overview`

Returns dashboard metrics for the authenticated user.

Response:

```json
{
  "totals": {
    "projects": 3,
    "test_cases": 18,
    "runs": 86,
    "pass_rate": 82.6
  },
  "recent_runs": [],
  "failures_by_project": [],
  "common_failure_reasons": []
}
```

### `GET /api/v1/analytics/projects/{project_id}`

Returns project-specific analytics, including run trend, pass rate, recent failures, and most active test cases.

## Activity Logs

Activity logs are primarily for internal audit-style history and dashboard timelines. They may be exposed through project details or a future `/api/v1/activity` endpoint.

Tracked actions:

- User registered.
- Project created, updated, deleted.
- Page inspected.
- Test case created or updated.
- Test run created.

## Validation Rules

- Emails must be normalized to lowercase.
- Passwords must meet minimum length requirements.
- URLs must be valid HTTP or HTTPS URLs.
- Project names are required and length-limited.
- Test cases must have at least one step.
- Step order must be unique within a test case.
- Test run status values are constrained.
- Pagination values are bounded to avoid expensive queries.

## Authorization Rules

- Users can only access their own projects and dependent records.
- Every repository query for project-owned resources must join or filter by `owner_id`.
- Admin role can be added later for cross-user operations, but the core product should work fully for normal users.
