export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | string;
  created_at?: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: User;
};

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  base_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectListItem = Project & {
  page_count: number;
  element_count: number;
  test_case_count: number;
  run_count: number;
  last_run_status: string | null;
  recent_activity_count?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
};

export type ApiError = {
  detail?: {
    code: string;
    message: string;
  };
};
