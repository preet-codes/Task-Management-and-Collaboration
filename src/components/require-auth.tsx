import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect } from "react";

type RequireAuthProps = PropsWithChildren<{
  fallback?: JSX.Element;
}>;

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      fallback ?? (
        <main className="flex min-h-screen items-center justify-center bg-page text-ink">
          Loading your workspace...
        </main>
      )
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
