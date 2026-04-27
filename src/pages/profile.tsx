import Head from "next/head";
import { useEffect, useState, type FormEvent } from "react";

import { AppShell } from "~/components/app-shell";
import { RequireAuth } from "~/components/require-auth";
import { api } from "~/utils/api";

export default function ProfilePage() {
  const utils = api.useUtils();
  const profile = api.user.me.useQuery();
  const updateProfile = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
    },
  });
  const changePassword = api.user.changePassword.useMutation();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!profile.data) return;
    setName(profile.data.name ?? "");
    setTitle(profile.data.title ?? "");
    setBio(profile.data.bio ?? "");
    setTimezone(profile.data.timezone ?? "Asia/Kolkata");
    setEmailAlerts(profile.data.emailAlerts);
  }, [profile.data]);

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile.mutate({
      name,
      title,
      bio,
      timezone,
      emailAlerts,
    });
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password updated successfully");
    } catch {
      setPasswordMessage("Unable to update password. Check current password.");
    }
  };

  return (
    <RequireAuth>
      <Head>
        <title>Profile | TaskFlow</title>
      </Head>
      <AppShell title="Profile" subtitle="Manage your info and preferences">
        <section className="surface-card overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="badge badge-accent">User settings</span>
              <h2 className="page-title mt-3 text-3xl font-black tracking-tight text-ink">Personal information</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">
                Keep your display details, preferences, and notification behavior current.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-muted">Assigned {profile.data?._count.assignedTasks ?? 0}</span>
              <span className="badge badge-warm">Projects {profile.data?._count.ownedProjects ?? 0}</span>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitProfile}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Name</label>
              <input className="input-field" placeholder="Nirdesh Jain" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Title</label>
              <input className="input-field" placeholder="Product Designer" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Bio</label>
              <textarea
                className="input-field min-h-[120px] resize-y"
                placeholder="A short profile summary"
                rows={3}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Timezone</label>
              <input className="input-field" placeholder="Asia/Kolkata" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
            </div>
            <div className="flex items-end">
              <label className="surface-card-tight flex w-full items-center justify-between gap-3 px-4 py-3 text-sm text-ink">
                <span>
                  <span className="block font-semibold">Email notifications</span>
                  <span className="block text-xs text-dim">Receive updates and reminders</span>
                </span>
                <input checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} type="checkbox" />
              </label>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button className="btn-primary" disabled={updateProfile.isPending} type="submit">
                {updateProfile.isPending ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-5 surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-heading text-lg font-bold text-ink">Change password</h2>
              <p className="mt-1 text-sm text-dim">Rotate your login credentials from the same workspace.</p>
            </div>
            <span className="badge badge-warm">Security</span>
          </div>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submitPassword}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">Current password</label>
              <input
                className="input-field"
                placeholder="Current password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dim">New password</label>
              <input
                className="input-field"
                placeholder="New password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button className="btn-primary" disabled={changePassword.isPending} type="submit">
                {changePassword.isPending ? "Updating..." : "Update password"}
              </button>
              {passwordMessage ? <p className="text-sm text-dim">{passwordMessage}</p> : null}
            </div>
          </form>
        </section>
      </AppShell>
    </RequireAuth>
  );
}
