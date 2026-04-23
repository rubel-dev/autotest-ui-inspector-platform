INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Rubel Ahmed',
        'rubel@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$hjtNCMChhQ677k7FTH6RZQ$2jr4q9iFMarqjwYYmxhMUbATpuyZuDmeR8c7r5B41U4',
        'user',
        now() - interval '14 days',
        now() - interval '14 days'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Admin Reviewer',
        'admin@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$hjtNCMChhQ677k7FTH6RZQ$2jr4q9iFMarqjwYYmxhMUbATpuyZuDmeR8c7r5B41U4',
        'admin',
        now() - interval '20 days',
        now() - interval '20 days'
    )
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (id, owner_id, name, base_url, description, created_at, updated_at)
VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        '11111111-1111-1111-1111-111111111111',
        'Acme Marketing Site',
        'https://acme.test',
        'Regression coverage for public marketing and pricing pages.',
        now() - interval '12 days',
        now() - interval '1 day'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        '11111111-1111-1111-1111-111111111111',
        'Northstar App',
        'https://app.northstar.test',
        'Core dashboard flows for a B2B SaaS application.',
        now() - interval '9 days',
        now() - interval '2 hours'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        '11111111-1111-1111-1111-111111111111',
        'Docs Portal',
        'https://docs.example.test',
        'Documentation search, navigation, and signup CTA checks.',
        now() - interval '5 days',
        now() - interval '6 hours'
    )
ON CONFLICT (owner_id, name) DO NOTHING;

INSERT INTO project_pages (id, project_id, url, title, status_code, html_hash, inspected_at, created_at)
VALUES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'https://acme.test/',
        'Acme - Home',
        200,
        'sha256:home-acme-demo',
        now() - interval '10 days',
        now() - interval '10 days'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'https://acme.test/pricing',
        'Acme - Pricing',
        200,
        'sha256:pricing-acme-demo',
        now() - interval '3 days',
        now() - interval '3 days'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'https://app.northstar.test/login',
        'Northstar Login',
        200,
        'sha256:login-northstar-demo',
        now() - interval '2 days',
        now() - interval '2 days'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        'https://docs.example.test/search',
        'Docs Search',
        200,
        'sha256:docs-search-demo',
        now() - interval '1 day',
        now() - interval '1 day'
    )
ON CONFLICT (project_id, url) DO NOTHING;

INSERT INTO ui_elements (
    id,
    project_id,
    page_id,
    element_type,
    tag_name,
    selector,
    text_content,
    attribute_id,
    attribute_name,
    attribute_type,
    href,
    placeholder,
    aria_label,
    metadata,
    created_at
)
VALUES
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc1',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        'link',
        'a',
        'a[data-testid="hero-start"]',
        'Start free trial',
        NULL,
        NULL,
        NULL,
        '/signup',
        NULL,
        'Start free trial',
        '{"classes": ["btn", "btn-primary"], "source": "seed"}',
        now() - interval '10 days'
    ),
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc2',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        'button',
        'button',
        'button[data-plan="pro"]',
        'Choose Pro',
        NULL,
        NULL,
        'button',
        NULL,
        NULL,
        'Choose Pro plan',
        '{"classes": ["pricing-card__cta"], "plan": "pro", "source": "seed"}',
        now() - interval '3 days'
    ),
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc3',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
        'input',
        'input',
        'input[name="email"]',
        NULL,
        'login-email',
        'email',
        'email',
        NULL,
        'you@company.com',
        'Email address',
        '{"required": true, "source": "seed"}',
        now() - interval '2 days'
    ),
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc4',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
        'input',
        'input',
        'input[name="password"]',
        NULL,
        'login-password',
        'password',
        'password',
        NULL,
        'Password',
        'Password',
        '{"required": true, "source": "seed"}',
        now() - interval '2 days'
    ),
    (
        'cccccccc-cccc-cccc-cccc-ccccccccccc5',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
        'form',
        'form',
        'form[role="search"]',
        NULL,
        NULL,
        'search',
        NULL,
        NULL,
        NULL,
        'Search documentation',
        '{"method": "get", "source": "seed"}',
        now() - interval '1 day'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_cases (id, project_id, name, description, priority, status, created_by, created_at, updated_at)
VALUES
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'Pricing CTA opens signup',
        'Verifies that the Pro plan CTA routes users to signup.',
        'high',
        'active',
        '11111111-1111-1111-1111-111111111111',
        now() - interval '8 days',
        now() - interval '1 day'
    ),
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'Login form accepts valid credentials',
        'Checks the basic login form happy path.',
        'critical',
        'active',
        '11111111-1111-1111-1111-111111111111',
        now() - interval '7 days',
        now() - interval '2 hours'
    ),
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd3',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        'Docs search returns relevant results',
        'Confirms that documentation search displays matching results.',
        'medium',
        'draft',
        '11111111-1111-1111-1111-111111111111',
        now() - interval '4 days',
        now() - interval '6 hours'
    )
ON CONFLICT (project_id, name) DO NOTHING;

INSERT INTO test_steps (id, test_case_id, step_order, action, target, input_value, expected_result, created_at)
VALUES
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        1,
        'navigate',
        'https://acme.test/pricing',
        NULL,
        'Pricing page loads successfully',
        now() - interval '8 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        2,
        'click',
        'button[data-plan="pro"]',
        NULL,
        'Signup route is opened',
        now() - interval '8 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        1,
        'navigate',
        'https://app.northstar.test/login',
        NULL,
        'Login page loads successfully',
        now() - interval '7 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4',
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        2,
        'type',
        'input[name="email"]',
        'demo@northstar.test',
        'Email field contains the typed address',
        now() - interval '7 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5',
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        3,
        'type',
        'input[name="password"]',
        'demo-password',
        'Password field accepts input',
        now() - interval '7 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee6',
        'dddddddd-dddd-dddd-dddd-ddddddddddd3',
        1,
        'navigate',
        'https://docs.example.test/search',
        NULL,
        'Docs search page loads successfully',
        now() - interval '4 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee7',
        'dddddddd-dddd-dddd-dddd-ddddddddddd3',
        2,
        'type',
        'form[role="search"] input',
        'authentication',
        'Search query is entered',
        now() - interval '4 days'
    )
ON CONFLICT (test_case_id, step_order) DO NOTHING;

INSERT INTO test_runs (
    id,
    project_id,
    test_case_id,
    triggered_by,
    status,
    environment,
    browser,
    duration_ms,
    failure_reason,
    started_at,
    finished_at,
    created_at
)
VALUES
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff1',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        '11111111-1111-1111-1111-111111111111',
        'passed',
        'local',
        'chromium',
        1840,
        NULL,
        now() - interval '2 days',
        now() - interval '2 days' + interval '1840 milliseconds',
        now() - interval '2 days'
    ),
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff2',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        '11111111-1111-1111-1111-111111111111',
        'failed',
        'staging',
        'chromium',
        2210,
        'CTA selector button[data-plan="pro"] was not visible',
        now() - interval '1 day',
        now() - interval '1 day' + interval '2210 milliseconds',
        now() - interval '1 day'
    ),
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff3',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        '11111111-1111-1111-1111-111111111111',
        'passed',
        'local',
        'firefox',
        2960,
        NULL,
        now() - interval '5 hours',
        now() - interval '5 hours' + interval '2960 milliseconds',
        now() - interval '5 hours'
    ),
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff4',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        'dddddddd-dddd-dddd-dddd-ddddddddddd3',
        '11111111-1111-1111-1111-111111111111',
        'failed',
        'local',
        'chromium',
        3150,
        'Expected search results did not render before timeout',
        now() - interval '3 hours',
        now() - interval '3 hours' + interval '3150 milliseconds',
        now() - interval '3 hours'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO run_logs (
    id,
    run_id,
    test_step_id,
    step_order,
    severity,
    status,
    message,
    failure_reason,
    metadata,
    created_at
)
VALUES
    (
        '99999999-9999-9999-9999-999999999991',
        'ffffffff-ffff-ffff-ffff-fffffffffff1',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
        1,
        'info',
        'passed',
        'Navigated to pricing page.',
        NULL,
        '{"url": "https://acme.test/pricing"}',
        now() - interval '2 days'
    ),
    (
        '99999999-9999-9999-9999-999999999992',
        'ffffffff-ffff-ffff-ffff-fffffffffff1',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
        2,
        'info',
        'passed',
        'Clicked Pro plan CTA and reached signup.',
        NULL,
        '{"selector": "button[data-plan=\"pro\"]"}',
        now() - interval '2 days' + interval '1 second'
    ),
    (
        '99999999-9999-9999-9999-999999999993',
        'ffffffff-ffff-ffff-ffff-fffffffffff2',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
        1,
        'info',
        'passed',
        'Navigated to pricing page.',
        NULL,
        '{"url": "https://acme.test/pricing"}',
        now() - interval '1 day'
    ),
    (
        '99999999-9999-9999-9999-999999999994',
        'ffffffff-ffff-ffff-ffff-fffffffffff2',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
        2,
        'error',
        'failed',
        'CTA selector was not visible.',
        'CTA selector button[data-plan="pro"] was not visible',
        '{"selector": "button[data-plan=\"pro\"]", "timeout_ms": 5000}',
        now() - interval '1 day' + interval '1 second'
    ),
    (
        '99999999-9999-9999-9999-999999999995',
        'ffffffff-ffff-ffff-ffff-fffffffffff3',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
        1,
        'info',
        'passed',
        'Login page loaded.',
        NULL,
        '{"browser": "firefox"}',
        now() - interval '5 hours'
    ),
    (
        '99999999-9999-9999-9999-999999999996',
        'ffffffff-ffff-ffff-ffff-fffffffffff3',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4',
        2,
        'info',
        'passed',
        'Email field accepted input.',
        NULL,
        '{"selector": "input[name=\"email\"]"}',
        now() - interval '5 hours' + interval '1 second'
    ),
    (
        '99999999-9999-9999-9999-999999999997',
        'ffffffff-ffff-ffff-ffff-fffffffffff4',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee7',
        2,
        'error',
        'failed',
        'Search results did not render before timeout.',
        'Expected search results did not render before timeout',
        '{"query": "authentication", "timeout_ms": 5000}',
        now() - interval '3 hours'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, user_id, project_id, action, entity_type, entity_id, message, metadata, created_at)
VALUES
    (
        '77777777-7777-7777-7777-777777777771',
        '11111111-1111-1111-1111-111111111111',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'project.created',
        'project',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'Created Acme Marketing Site project.',
        '{}',
        now() - interval '12 days'
    ),
    (
        '77777777-7777-7777-7777-777777777772',
        '11111111-1111-1111-1111-111111111111',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'page.inspected',
        'project_page',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        'Inspected pricing page and extracted UI elements.',
        '{"element_count": 1}',
        now() - interval '3 days'
    ),
    (
        '77777777-7777-7777-7777-777777777773',
        '11111111-1111-1111-1111-111111111111',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        'test_run.failed',
        'test_run',
        'ffffffff-ffff-ffff-ffff-fffffffffff2',
        'Pricing CTA opens signup failed in staging.',
        '{"status": "failed"}',
        now() - interval '1 day'
    ),
    (
        '77777777-7777-7777-7777-777777777774',
        '11111111-1111-1111-1111-111111111111',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        'test_run.passed',
        'test_run',
        'ffffffff-ffff-ffff-ffff-fffffffffff3',
        'Login form accepts valid credentials passed locally.',
        '{"status": "passed"}',
        now() - interval '5 hours'
    )
ON CONFLICT (id) DO NOTHING;
