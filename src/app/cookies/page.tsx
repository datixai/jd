import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { Header, WhatsAppFloat } from "@/components/client";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Cookies",
  description: "How the JD Travels website uses cookies.",
  alternates: { canonical: "/cookies" },
};

export default async function CookiesPage() {
  const { contact } = await getContent();
  return (
    <>
      <Header />
      <main className="bg-pine-dark px-4 pt-32 pb-6 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Cookies</h1>
          <p className="mt-3 text-white/70">How this website uses cookies</p>
        </div>
      </main>
      <div className="px-4 py-16">
        <article className="mx-auto max-w-3xl space-y-6 text-muted">
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-pine">The short version</h2>
            <p>
              The JD Travels website does not use advertising, tracking or analytics cookies. Visiting the site and reading about our trips does not store any cookie in
              your browser.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-pine">Cookies we do use</h2>
            <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-snow text-xs text-pine uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <td className="px-4 py-3 font-mono">jd_admin</td>
                    <td className="px-4 py-3">Keeps the JD Travels team signed in to the private admin area. Only set when an admin logs in. Strictly necessary.</td>
                    <td className="px-4 py-3">8 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">Strictly necessary cookies do not need your consent under UK and EU rules, which is why the site does not show a cookie banner.</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-pine">Other websites</h2>
            <p>
              Links to WhatsApp, Instagram, Facebook and our partner Friends Motors open their own websites, which have their own cookie policies. The trip form opens
              WhatsApp with your message, so your details are shared with WhatsApp only when you press send.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-pine">Managing cookies</h2>
            <p>You can clear or block cookies at any time in your browser settings. Blocking cookies does not affect browsing this website.</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-pine">Questions</h2>
            <p>
              Message JD on WhatsApp at {contact.phoneDisplay} if you have any questions. If the website starts using other cookies in future, this page will be
              updated first.
            </p>
          </section>
        </article>
      </div>
      <SiteFooter contact={contact} />
      <WhatsAppFloat whatsapp={contact.whatsapp} />
    </>
  );
}
