"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable, TableCell, TableHead } from "@/components/ui/data-table";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ProjectListItem } from "@/types/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", base_url: "", description: "" });

  const params = useMemo(() => {
    const query = new URLSearchParams({ page: "1", page_size: "20", sort_by: "updated_at", sort_dir: "desc" });
    if (search.trim()) query.set("search", search.trim());
    return query;
  }, [search]);

  async function loadProjects() {
    setLoading(true);
    setError("");
    try {
      const response = await api.listProjects(params);
      setProjects(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, [params]);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.createProject({
        name: form.name,
        base_url: form.base_url,
        description: form.description || undefined,
      });
      setForm({ name: "", base_url: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage inspected websites and their related test coverage."
        action={<Button form="project-create-form" disabled={submitting}><Plus className="h-4 w-4" />New project</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              className="border-0 bg-transparent px-0 shadow-none focus:ring-0"
              placeholder="Search by project name or URL"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? <LoadingState label="Loading projects" /> : null}
          {error && !loading ? <ErrorState message={error} onRetry={loadProjects} /> : null}
          {!loading && !error && projects.length === 0 ? (
            <EmptyState title="No projects found" description="Create a project to start collecting pages, UI elements, test cases, and execution history." />
          ) : null}
          {!loading && !error && projects.length > 0 ? (
            <DataTable>
              <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHead>Project</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Elements</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Runs</TableHead>
                    <TableHead>Last run</TableHead>
                    <TableHead>Updated</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Link href={`/projects/${project.id}`} className="font-semibold text-ink hover:text-brand-700">
                          {project.name}
                        </Link>
                        <p className="mt-1 max-w-sm truncate text-xs text-slate-500">{project.base_url}</p>
                      </TableCell>
                      <TableCell className="text-slate-700">{project.page_count}</TableCell>
                      <TableCell className="text-slate-700">{project.element_count}</TableCell>
                      <TableCell className="text-slate-700">{project.test_case_count}</TableCell>
                      <TableCell className="text-slate-700">{project.run_count}</TableCell>
                      <TableCell>{project.last_run_status ? <Badge value={project.last_run_status} /> : <span className="text-slate-400">N/A</span>}</TableCell>
                      <TableCell className="text-slate-500">{formatDate(project.updated_at)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Create project</h2>
          </CardHeader>
          <CardContent>
            <form id="project-create-form" className="space-y-4" onSubmit={createProject}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Base URL</span>
                <Input value={form.base_url} onChange={(event) => setForm({ ...form, base_url: event.target.value })} placeholder="https://example.com" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
                <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </label>
              <Button className="w-full" disabled={submitting}>
                {submitting ? "Creating..." : "Create project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
