import { SessionProvider } from "@/components/admin/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-50 flex">
        {session && <AdminSidebar />}
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
