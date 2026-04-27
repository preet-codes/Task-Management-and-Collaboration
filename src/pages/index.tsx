import Head from "next/head";
import Link from "next/link";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";

type HomeProps = {
  isAuthenticated: boolean;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isAuthenticated: false,
    },
  };
};

export default function HomePage(_: HomeProps) {
  return (
    <>
      <Head>
        <title>TaskFlow | Modern task management for teams</title>
        <meta
          name="description"
          content="TaskFlow helps teams manage tasks, projects, deadlines, and personal workflow in one polished workspace."
        />
      </Head>

      <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <section className="hero-panel workspace-shell overflow-hidden rounded-[2rem]">
            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="brand-mark inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black">TF</span>
                    <span className="badge badge-success">Designed for serious teams</span>
                    <span className="badge badge-muted">TaskFlow</span>
                  </div>

                  <p className="kicker text-[0.72rem] font-semibold text-accent">Task management, refined</p>
                  <h1 className="page-title mt-3 max-w-2xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
                    A cleaner way to run tasks, projects, and daily execution.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-dim sm:text-base">
                    TaskFlow gives your team a focused workspace for deadlines, ownership, and progress tracking. It feels calm,
                    organized, and ready for real work.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link className="btn-primary" href="/register">
                      Create account
                    </Link>
                    <Link className="btn-secondary" href="/login">
                      Sign in
                    </Link>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Tasks", "Track execution end-to-end"],
                      ["Projects", "Organize team ownership"],
                      ["Profile", "Keep settings in sync"],
                    ].map(([title, description]) => (
                      <article className="surface-card-tight p-4" key={title}>
                        <p className="text-sm font-bold text-ink">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-dim">{description}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="surface-card w-full max-w-md p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="kicker text-[0.68rem] font-semibold text-dim">Workspace snapshot</p>
                      <h2 className="panel-title mt-1 text-xl font-black text-ink">A dashboard that feels intentional.</h2>
                    </div>
                    <span className="badge badge-accent">Live</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {[
                      ["Daily focus", "See what needs attention first."],
                      ["Team context", "Projects, people, and progress in one place."],
                      ["Clear action", "Add, update, and close work without friction."],
                    ].map(([title, description]) => (
                      <div className="list-item flex items-start gap-3" key={title}>
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                        <div>
                          <p className="font-semibold text-ink">{title}</p>
                          <p className="mt-1 text-sm leading-6 text-dim">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[1.4rem] border border-border bg-soft p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Built for</p>
                    <p className="mt-2 text-lg font-black text-ink">Small teams that want structure without clutter.</p>
                    <p className="mt-2 text-sm leading-6 text-dim">Simple onboarding, clear navigation, and a polished interface from day one.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="surface-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="kicker text-[0.68rem] font-semibold text-dim">Why it works</p>
                  <h2 className="panel-title mt-1 text-2xl font-black text-ink">A product that looks like a product, not a template.</h2>
                </div>
                <span className="badge badge-muted">Focused</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Clean hierarchy", "Important actions stay visible without visual noise."],
                  ["Professional polish", "Soft depth, controlled color, and stronger spacing."],
                  ["Team-ready flows", "Tasks and projects are easy to move through."],
                  ["Fast navigation", "Everything important is one click away."],
                ].map(([title, description]) => (
                  <div className="list-item" key={title}>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-dim">{description}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="surface-card p-6 sm:p-7">
              <p className="kicker text-[0.68rem] font-semibold text-dim">Getting started</p>
              <h2 className="panel-title mt-1 text-2xl font-black text-ink">Three steps to start using TaskFlow.</h2>

              <ol className="mt-5 space-y-3">
                {[
                  ["1", "Create your account and set up your profile."],
                  ["2", "Add tasks and projects with clear ownership."],
                  ["3", "Track progress from the dashboard every day."],
                ].map(([step, description]) => (
                  <li className="list-item flex items-start gap-4" key={step}>
                    <span className="badge badge-accent mt-0.5">{step}</span>
                    <p className="text-sm leading-6 text-dim">{description}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="btn-primary" href="/register">
                  Start now
                </Link>
                <Link className="btn-soft" href="/login">
                  Access account
                </Link>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}