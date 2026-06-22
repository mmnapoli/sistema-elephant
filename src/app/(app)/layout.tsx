import { requireUser } from "@/lib/auth-helpers";
import { Sidebar } from "@/components/sidebar";
import { logout } from "./actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar user={user} logoutAction={logout} />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
