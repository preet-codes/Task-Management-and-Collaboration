import Head from "next/head";
import { useState } from "react";

import { AppShell } from "~/components/app-shell";
import { RequireAuth } from "~/components/require-auth";
import { api } from "~/utils/api";

export default function TasksPage() {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  const projects = api.project.list.useQuery();
  const tasks = api.task.list.useQuery({ page: 1, limit: 50 });

  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      setDescription("");
      await utils.task.list.invalidate();
      await utils.dashboard.stats.invalidate();
      await utils.dashboard.recentActivity.invalidate();
      await utils.dashboard.upcomingTasks.invalidate();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      await utils.dashboard.stats.invalidate();
      await utils.dashboard.recentActivity.invalidate();
      await utils.dashboard.upcomingTasks.invalidate();
    },
  });

  const updateStatus = api.task.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      await utils.dashboard.stats.invalidate();
      await utils.dashboard.recentActivity.invalidate();
      await utils.dashboard.upcomingTasks.invalidate();
    },
  });

  return (
    <RequireAuth>
      <Head>
        <title>Tasks | TaskFlow</title>
      </Head>
      <AppShell title="Tasks" subtitle="Create, assign and track execution">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-heading text-lg font-bold text-ink">Create task</h2>
              <p className="mt-1 text-sm text-dim">Capture work with deadline, priority, and project context.</p>
            </div>
            <span className="badge badge-accent">Quick add</span>
          </div>
          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim()) return;
              createTask.mutate({
                title,
                description,
                priority,
                status: "TODO",
                projectId,
                tags: [],
              });
            }}
          >
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Task title</label>
              <input
                className="input-field"
                placeholder="Design onboarding flow"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Priority</label>
              <select
                className="input-field select-field"
                value={priority}
                onChange={(event) => setPriority(event.target.value as "LOW" | "MEDIUM" | "HIGH")}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Project</label>
              <select
                className="input-field select-field"
                value={projectId ?? ""}
                onChange={(event) => setProjectId(event.target.value || undefined)}
              >
                <option value="">No Project</option>
                {projects.data?.map((project) => (
                  <option value={project.id} key={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Description</label>
              <textarea
                className="input-field min-h-[110px] resize-y"
                placeholder="Add details, acceptance criteria, or context"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button className="btn-primary" disabled={createTask.isPending} type="submit">
                {createTask.isPending ? "Creating..." : "Create Task"}
              </button>
              <span className="text-sm text-dim">Tip: Keep titles action-oriented and brief.</span>
            </div>
          </form>
        </section>

        <section className="mt-5 surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="section-heading text-lg font-bold text-ink">Task list</h2>
            <span className="badge badge-muted">{tasks.data?.pagination.total ?? 0} items</span>
          </div>
          <ul className="mt-4 space-y-3">
            {tasks.data?.tasks.length ? (
              tasks.data.tasks.map((task) => (
                <li className="list-item" key={task.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="badge badge-accent">{task.status}</span>
                        <span className="badge badge-muted">{task.priority}</span>
                        {task.project ? <span className="badge badge-warm">{task.project.name}</span> : null}
                      </div>
                      <p className="card-title text-lg font-bold text-ink">{task.title}</p>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-dim">{task.description ?? "No description"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <select
                        className="input-field select-field min-w-[11rem] py-2 text-sm"
                        value={task.status}
                        onChange={(event) => {
                          updateStatus.mutate({
                            id: task.id,
                            status: event.target.value as "TODO" | "IN_PROGRESS" | "DONE",
                          });
                        }}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                      <button className="btn-danger" onClick={() => deleteTask.mutate({ id: task.id })} type="button">
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-state text-sm">No tasks yet</li>
            )}
          </ul>
        </section>
      </AppShell>
    </RequireAuth>
  );
}
