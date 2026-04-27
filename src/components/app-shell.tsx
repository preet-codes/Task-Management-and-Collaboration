import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { type PropsWithChildren } from "react";

type ShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function AppShell({ title, subtitle, children }: ShellProps) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tasks" },
    { href: "/projects", label: "Projects" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="hero-panel workspace-shell overflow-hidden rounded-[2rem]">
          <div className="relative z-10 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="brand-mark inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black">TF</span>
                  <span className="badge badge-success">Live workspace</span>
                  <span className="badge badge-muted">Secure auth</span>
                </div>
                <p className="kicker text-[0.7rem] font-semibold text-accent">TaskFlow workspace</p>
                <h1 className="page-title mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h1>
                {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-6 text-dim sm:text-base">{subtitle}</p> : null}
              </div>

              <div className="surface-card-tight w-full max-w-md px-4 py-4 text-sm lg:min-w-[19rem]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="kicker text-[0.68rem] font-semibold text-dim">Signed in as</p>
                    <p className="mt-1 font-semibold text-ink">{sessionData?.user?.email}</p>
                  </div>
                  <span className="badge badge-accent">Active</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-soft px-3 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-dim">Focus</p>
                    <p className="mt-1 text-sm font-bold text-ink">Tasks</p>
                  </div>
                  <div className="rounded-2xl bg-soft px-3 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-dim">Mode</p>
                    <p className="mt-1 text-sm font-bold text-ink">Team</p>
                  </div>
                  <div className="rounded-2xl bg-soft px-3 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-dim">Status</p>
                    <p className="mt-1 text-sm font-bold text-success">Online</p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-6 flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-border bg-white/60 p-2 backdrop-blur-sm">
              {navItems.map((item) => {
                const active = router.pathname === item.href;

                return (
                  <Link className={`nav-pill ${active ? "nav-pill-active" : ""}`} href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                );
              })}
              <button className="btn-danger ml-0 sm:ml-auto" onClick={() => void signOut({ callbackUrl: "/login" })} type="button">
                Sign out
              </button>
            </nav>
          </div>
        </header>

        <section className="animate-rise">{children}</section>
      </div>
    </main>
  );
}
