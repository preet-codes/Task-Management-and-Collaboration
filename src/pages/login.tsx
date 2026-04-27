import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      void router.replace("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    void router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Login | TaskFlow</title>
      </Head>
      <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
        <section className="auth-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
          <aside className="auth-hero flex flex-col justify-between p-8 text-white sm:p-10">
            <div>
              <span className="badge badge-muted mb-5 inline-flex text-white/90">TaskFlow</span>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Task management that feels built for a real team.</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/78 sm:text-base">
                Login to a polished workspace for tasks, projects, deadlines, and team collaboration.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Tasks", "Track execution"],
                ["Projects", "Own the roadmap"],
                ["Profile", "Manage preferences"],
              ].map(([titleText, desc]) => (
                <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm" key={titleText}>
                  <p className="text-sm font-semibold">{titleText}</p>
                  <p className="mt-1 text-xs text-white/72">{desc}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="bg-white/92 p-6 sm:p-10">
            <div className="mb-8">
              <span className="badge badge-accent">Secure sign in</span>
              <h2 className="page-title mt-4 text-3xl font-black tracking-tight text-ink">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-dim">Login with your email and password to continue.</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Email</label>
                <input
                  className="input-field"
                  placeholder="you@company.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Password</label>
                <input
                  className="input-field"
                  placeholder="Your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? <div className="empty-state border-danger text-sm text-danger">{error}</div> : null}

              <button className="btn-primary w-full" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-dim">
              New here?{" "}
              <Link className="font-semibold text-accent hover:text-accent-2" href="/register">
                Create account
              </Link>
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
