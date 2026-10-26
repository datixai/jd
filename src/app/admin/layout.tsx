import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Travel with JD",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f2efe7]">{children}</div>;
}
