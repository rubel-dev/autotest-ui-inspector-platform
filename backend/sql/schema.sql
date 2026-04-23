CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash text NOT NULL,
    role varchar(30) NOT NULL DEFAULT 'user',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'user')),
    CONSTRAINT users_email_lower_check CHECK (email = lower(email)),
    CONSTRAINT users_name_length_check CHECK (char_length(trim(name)) >= 2)
);

CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name varchar(160) NOT NULL,
    base_url text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT projects_owner_name_unique UNIQUE (owner_id, name),
    CONSTRAINT projects_name_length_check CHECK (char_length(trim(name)) >= 2),
    CONSTRAINT projects_base_url_http_check CHECK (base_url ~* '^https?://')
);

CREATE TABLE project_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url text NOT NULL,
    title text,
    status_code integer,
    html_hash text,
    inspected_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT project_pages_project_url_unique UNIQUE (project_id, url),
    CONSTRAINT project_pages_project_id_id_unique UNIQUE (project_id, id),
    CONSTRAINT project_pages_url_http_check CHECK (url ~* '^https?://'),
    CONSTRAINT project_pages_status_code_check CHECK (status_code IS NULL OR status_code BETWEEN 100 AND 599)
);

CREATE TABLE ui_elements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    page_id uuid NOT NULL,
    element_type varchar(30) NOT NULL,
    tag_name varchar(40) NOT NULL,
    selector text,
    text_content text,
    attribute_id text,
    attribute_name text,
    attribute_type text,
    href text,
    placeholder text,
    aria_label text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ui_elements_project_page_fk FOREIGN KEY (project_id, page_id) REFERENCES project_pages(project_id, id) ON DELETE CASCADE,
    CONSTRAINT ui_elements_element_type_check CHECK (element_type IN ('button', 'input', 'link', 'form')),
    CONSTRAINT ui_elements_tag_name_check CHECK (char_length(trim(tag_name)) > 0)
);

CREATE TABLE test_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name varchar(180) NOT NULL,
    description text,
    priority varchar(20) NOT NULL DEFAULT 'medium',
    status varchar(20) NOT NULL DEFAULT 'active',
    created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT test_cases_project_name_unique UNIQUE (project_id, name),
    CONSTRAINT test_cases_project_id_id_unique UNIQUE (project_id, id),
    CONSTRAINT test_cases_name_length_check CHECK (char_length(trim(name)) >= 3),
    CONSTRAINT test_cases_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT test_cases_status_check CHECK (status IN ('draft', 'active', 'archived'))
);

CREATE TABLE test_steps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id uuid NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    step_order integer NOT NULL,
    action varchar(40) NOT NULL,
    target text,
    input_value text,
    expected_result text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT test_steps_case_order_unique UNIQUE (test_case_id, step_order),
    CONSTRAINT test_steps_order_positive_check CHECK (step_order > 0),
    CONSTRAINT test_steps_action_check CHECK (action IN ('navigate', 'click', 'type', 'assert_text', 'assert_visible', 'wait')),
    CONSTRAINT test_steps_expected_result_check CHECK (char_length(trim(expected_result)) > 0)
);

CREATE TABLE test_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    test_case_id uuid NOT NULL,
    triggered_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status varchar(20) NOT NULL,
    environment varchar(80) NOT NULL DEFAULT 'local',
    browser varchar(80) NOT NULL DEFAULT 'chromium',
    duration_ms integer,
    failure_reason text,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT test_runs_project_case_fk FOREIGN KEY (project_id, test_case_id) REFERENCES test_cases(project_id, id) ON DELETE CASCADE,
    CONSTRAINT test_runs_status_check CHECK (status IN ('queued', 'running', 'passed', 'failed', 'cancelled')),
    CONSTRAINT test_runs_duration_check CHECK (duration_ms IS NULL OR duration_ms >= 0),
    CONSTRAINT test_runs_finished_after_started_check CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE run_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id uuid NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
    test_step_id uuid REFERENCES test_steps(id) ON DELETE SET NULL,
    step_order integer,
    severity varchar(20) NOT NULL,
    status varchar(20) NOT NULL,
    message text NOT NULL,
    failure_reason text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT run_logs_step_order_positive_check CHECK (step_order IS NULL OR step_order > 0),
    CONSTRAINT run_logs_severity_check CHECK (severity IN ('debug', 'info', 'warning', 'error')),
    CONSTRAINT run_logs_status_check CHECK (status IN ('passed', 'failed', 'skipped')),
    CONSTRAINT run_logs_message_check CHECK (char_length(trim(message)) > 0)
);

CREATE TABLE activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    action varchar(80) NOT NULL,
    entity_type varchar(80) NOT NULL,
    entity_id uuid,
    message text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT activity_logs_action_check CHECK (char_length(trim(action)) > 0),
    CONSTRAINT activity_logs_entity_type_check CHECK (char_length(trim(entity_type)) > 0),
    CONSTRAINT activity_logs_message_check CHECK (char_length(trim(message)) > 0)
);
