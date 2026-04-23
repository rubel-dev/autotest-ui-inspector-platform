export const demoTestCases = [
  {
    id: "tc-101",
    name: "Pricing CTA opens signup",
    project: "Acme Marketing Site",
    priority: "high",
    status: "active",
    steps: 2,
    lastRun: "failed",
    updatedAt: "2026-04-22T10:00:00Z",
  },
  {
    id: "tc-102",
    name: "Login form accepts valid credentials",
    project: "Northstar App",
    priority: "critical",
    status: "active",
    steps: 3,
    lastRun: "passed",
    updatedAt: "2026-04-23T05:00:00Z",
  },
  {
    id: "tc-103",
    name: "Docs search returns relevant results",
    project: "Docs Portal",
    priority: "medium",
    status: "draft",
    steps: 2,
    lastRun: "failed",
    updatedAt: "2026-04-22T18:00:00Z",
  },
];

export const demoLogs = [
  {
    id: "log-1",
    timestamp: "2026-04-23T07:02:00Z",
    severity: "error",
    status: "failed",
    project: "Docs Portal",
    testCase: "Docs search returns relevant results",
    message: "Search results did not render before timeout.",
  },
  {
    id: "log-2",
    timestamp: "2026-04-22T09:01:00Z",
    severity: "error",
    status: "failed",
    project: "Acme Marketing Site",
    testCase: "Pricing CTA opens signup",
    message: "CTA selector button[data-plan='pro'] was not visible.",
  },
  {
    id: "log-3",
    timestamp: "2026-04-23T05:00:00Z",
    severity: "info",
    status: "passed",
    project: "Northstar App",
    testCase: "Login form accepts valid credentials",
    message: "Email field accepted input.",
  },
];

export const analytics = {
  totals: {
    projects: 3,
    testCases: 18,
    runs: 86,
    passRate: 82.6,
  },
  failuresByProject: [
    { project: "Acme Marketing Site", failures: 7 },
    { project: "Docs Portal", failures: 5 },
    { project: "Northstar App", failures: 3 },
  ],
  commonFailures: [
    { reason: "Selector not visible", count: 8 },
    { reason: "Timeout waiting for results", count: 5 },
    { reason: "Text assertion mismatch", count: 3 },
  ],
};
