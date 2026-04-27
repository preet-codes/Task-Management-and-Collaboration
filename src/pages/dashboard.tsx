import Head from "next/head";

import { AppShell } from "~/components/app-shell";
import { RequireAuth } from "~/components/require-auth";
import { api } from "~/utils/api";

export default function DashboardPage() {
  const stats = api.dashboard.stats.useQuery();
  const activity = api.dashboard.recentActivity.useQuery();
  const upcoming = api.dashboard.upcomingTasks.useQuery();

  return (
    <RequireAuth>
      <Head>
        <title>Dashboard | TaskFlow</title>
      </Head>
      <AppShell title="Dashboard" subtitle="Overview of your work and deadlines">
        <section className="surface-card overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="badge badge-accent">Workspace pulse</span>
              <h2 className="page-title mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                Keep the team moving without losing sight of deadlines.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-dim sm:text-base">
                See the current throughput, recent activity, and urgent work in one polished place.
              </p>
            </div>
            <div className="surface-card-tight flex items-center gap-3 px-4 py-3 text-sm">
              <span className="badge badge-warm">{stats.data?.overdue ?? 0} overdue</span>
              <span className="text-dim">Completion rate</span>
              <span className="text-lg font-black text-ink">{stats.data?.completionRate ?? 0}%</span>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Tasks" value={stats.data?.total ?? 0} accent="bg-accent" helper="All active items" />
          <StatCard label="Completed" value={stats.data?.completed ?? 0} accent="bg-highlight" helper="Finished work" />
          <StatCard label="In Progress" value={stats.data?.inProgress ?? 0} accent="bg-success" helper="Currently moving" />
          <StatCard label="Overdue" value={stats.data?.overdue ?? 0} accent="bg-danger" helper="Needs attention" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-heading text-lg font-bold text-ink">Upcoming deadlines</h2>
              <span className="badge badge-muted">Next 8</span>
            </div>
            <ul className="mt-4 space-y-3">
              {upcoming.data?.length ? (
                upcoming.data.map((task) => (
                  <li className="list-item flex items-center justify-between gap-3" key={task.id}>
                    <div>
                      <p className="font-semibold text-ink">{task.title}</p>
                      <p className="mt-1 text-xs text-dim">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline set"}
                      </p>
                    </div>
                    <span className="badge badge-accent">{task.priority}</span>
                  </li>
                ))
              ) : (
                <li className="empty-state text-sm">No upcoming tasks</li>
              )}
            </ul>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-heading text-lg font-bold text-ink">Recent activity</h2>
              <span className="badge badge-muted">Live feed</span>
            </div>
            <ul className="mt-4 space-y-3">
              {activity.data?.length ? (
                activity.data.map((item) => (
                  <li className="list-item" key={item.id}>
                    <p className="font-semibold text-ink">{item.message}</p>
                    <p className="mt-2 text-xs text-dim">{new Date(item.createdAt).toLocaleString()}</p>
                  </li>
                ))
              ) : (
                <li className="empty-state text-sm">No activity yet</li>
              )}
            </ul>
          </section>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

function StatCard({ label, value, helper, accent }: { label: string; value: number; helper: string; accent: string }) {
  return (
    <article className="stat-card">
      <div className={`mb-4 h-1.5 w-16 rounded-full ${accent}`} />
      <p className="kicker text-[0.68rem] font-semibold text-dim">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-xs text-dim">{helper}</p>
    </article>
  );
}
