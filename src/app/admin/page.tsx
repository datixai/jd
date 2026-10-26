import { LogOut, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getContent, listEnquiries } from "@/lib/store";
import { logoutAction } from "./actions";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const [content, enquiries] = await Promise.all([getContent(), listEnquiries()]);

  return (
    <>
      <header className="bg-pine-dark text-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <p className="font-heading text-xl font-semibold">
            Travel with <span className="text-saffron">JD</span> <span className="ml-2 text-sm font-normal text-white/60">Admin</span>
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/60 sm:inline">{admin.e}</span>
            <a href="/" target="_blank" className="inline-flex items-center gap-1 hover:text-saffron">
              View site <ExternalLink className="size-4" />
            </a>
            <form action={logoutAction}>
              <button className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-8">
        <AdminDashboard initial={content} enquiries={enquiries} />
      </main>
    </>
  );
}
