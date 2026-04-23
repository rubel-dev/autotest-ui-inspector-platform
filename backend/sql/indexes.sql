CREATE INDEX IF NOT EXISTS idx_projects_owner_created_at ON projects (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_owner_lower_name ON projects (owner_id, lower(name));
CREATE INDEX IF NOT EXISTS idx_projects_owner_updated_at ON projects (owner_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_pages_project_inspected_at ON project_pages (project_id, inspected_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_pages_project_lower_url ON project_pages (project_id, lower(url));

CREATE INDEX IF NOT EXISTS idx_ui_elements_project_type ON ui_elements (project_id, element_type);
CREATE INDEX IF NOT EXISTS idx_ui_elements_page ON ui_elements (page_id);
CREATE INDEX IF NOT EXISTS idx_ui_elements_project_created_at ON ui_elements (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ui_elements_metadata_gin ON ui_elements USING gin (metadata);

CREATE INDEX IF NOT EXISTS idx_test_cases_project_status_priority ON test_cases (project_id, status, priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_project_created_at ON test_cases (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_cases_created_by ON test_cases (created_by);
CREATE INDEX IF NOT EXISTS idx_test_cases_project_lower_name ON test_cases (project_id, lower(name));

CREATE INDEX IF NOT EXISTS idx_test_steps_case_order ON test_steps (test_case_id, step_order);

CREATE INDEX IF NOT EXISTS idx_test_runs_project_created_at ON test_runs (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_runs_case_created_at ON test_runs (test_case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_runs_status_created_at ON test_runs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_runs_triggered_by_created_at ON test_runs (triggered_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_runs_project_status_created_at ON test_runs (project_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_run_logs_run_created_at ON run_logs (run_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_run_logs_severity_created_at ON run_logs (severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_run_logs_status_created_at ON run_logs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_run_logs_message_lower ON run_logs (lower(message));

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created_at ON activity_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_created_at ON activity_logs (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_created_at ON activity_logs (action, created_at DESC);
