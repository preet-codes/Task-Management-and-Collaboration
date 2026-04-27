import Head from "next/head";
import { useState } from "react";

import { AppShell } from "~/components/app-shell";
import { RequireAuth } from "~/components/require-auth";
import { api } from "~/utils/api";

export default function ProjectsPage() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#1f8a70");

  const projects = api.project.list.useQuery();
  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      setName("");
      setDescription("");
      await utils.project.list.invalidate();
      await utils.dashboard.recentActivity.invalidate();
    },
  });

  return (
    <RequireAuth>
      <Head>
        <title>Projects | TaskFlow</title>
      </Head>
      <AppShell title="Projects" subtitle="Manage teams and ownership">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-heading text-lg font-bold text-ink">Create project</h2>
              <p className="mt-1 text-sm text-dim">Define a team space with ownership, color, and context.</p>
            </div>
            <span className="badge badge-accent">Team hub</span>
          </div>
          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              createProject.mutate({ name, description, color });
            }}
          >
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Project name</label>
              <input
                className="input-field"
                placeholder="Product Launch"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Theme color</label>
              <input
                className="input-field h-[3.15rem] p-2"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Preview</label>
              <div className="surface-card-tight flex h-[3.15rem] items-center gap-3 px-3">
                <span className="inline-block h-5 w-5 rounded-full border border-border" style={{ backgroundColor: color }} />
                <span className="text-sm text-dim">Applied to project cards</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Description</label>
              <textarea
                className="input-field min-h-[110px] resize-y"
                placeholder="Describe scope, goals, or the team owning this project"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button className="btn-primary" disabled={createProject.isPending} type="submit">
                {createProject.isPending ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-5 surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="section-heading text-lg font-bold text-ink">Projects</h2>
            <span className="badge badge-muted">{projects.data?.length ?? 0} total</span>
          </div>
          <ul className="mt-4 space-y-3">
            {projects.data?.length ? (
              projects.data.map((project) => (
                <li className="list-item" key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="badge badge-accent">{project.owner?.name ?? "Owner"}</span>
                        <span className="badge badge-muted">{project.members.length} members</span>
                        <span className="badge badge-warm">{project._count.tasks} tasks</span>
                      </div>
                      <p className="card-title text-lg font-bold text-ink">{project.name}</p>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-dim">{project.description ?? "No description"}</p>
                    </div>
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border shadow-sm"
                      style={{ backgroundColor: project.color }}
                    >
                      <span className="h-3 w-3 rounded-full bg-white/90" />
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-state text-sm">No projects created yet</li>
            )}
          </ul>
        </section>
      </AppShell>
    </RequireAuth>
  );
}
