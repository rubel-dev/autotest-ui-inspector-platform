import { getToken } from "@/lib/auth";
import type { ApiError, AuthResponse, PaginatedResponse, Project, ProjectListItem, User } from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Something went wrong.";
    try {
      const error = (await response.json()) as ApiError;
      message = error.detail?.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register(payload: { name: string; email: string; password: string }) {
    return request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    });
  },
  login(payload: { email: string; password: string }) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    });
  },
  me() {
    return request<User>("/auth/me");
  },
  listProjects(params: URLSearchParams) {
    return request<PaginatedResponse<ProjectListItem>>(`/projects?${params.toString()}`);
  },
  createProject(payload: { name: string; base_url: string; description?: string }) {
    return request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getProject(id: string) {
    return request<ProjectListItem>(`/projects/${id}`);
  },
  updateProject(id: string, payload: Partial<{ name: string; base_url: string; description: string | null }>) {
    return request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteProject(id: string) {
    return request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};
