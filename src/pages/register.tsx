import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";

import { api } from "~/utils/api";

export default function RegisterPage() {
  const router = useRouter();
  const register = api.user.register.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await register.mutateAsync({ name, email, password });
      await signIn("credentials", { email, password, redirect: false });
      await router.push("/dashboard");
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to create account");
    }
  };

  return (
    <>
      <Head>
        <title>Register | TaskFlow</title>
      </Head>
      <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
        <section className="auth-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="auth-hero flex flex-col justify-between p-8 text-white sm:p-10 lg:order-2">
            <div>
              <span className="badge badge-muted mb-5 inline-flex text-white/90">TaskFlow</span>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Create a workspace that looks and feels premium.</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/78 sm:text-base">
                Set up your account and start organizing teams, deadlines, and projects in one polished dashboard.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "Team-ready task assignment",
                "Project ownership and member roles",
                "Profile settings and password control",
              ].map((line) => (
                <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white/88 backdrop-blur-sm" key={line}>
                  {line}
                </div>
              ))}
            </div>
          </aside>

          <section className="bg-white/92 p-6 sm:p-10 lg:order-1">
            <div className="mb-8">
              <span className="badge badge-accent">Quick onboarding</span>
              <h2 className="page-title mt-4 text-3xl font-black tracking-tight text-ink">Create account</h2>
              <p className="mt-2 text-sm leading-6 text-dim">Start managing tasks with your team.</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Full name</label>
                <input
                  className="input-field"
                  placeholder="Pratik Verma"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
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
                  placeholder="Choose a secure password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error ? <div className="empty-state border-danger text-sm text-danger">{error}</div> : null}

              <button className="btn-primary w-full" disabled={register.isPending} type="submit">
                {register.isPending ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-dim">
              Already have an account?{" "}
              <Link className="font-semibold text-accent hover:text-accent-2" href="/login">
                Sign in
              </Link>
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
