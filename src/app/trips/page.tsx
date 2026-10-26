import type { Metadata } from "next";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { tripPlans } from "@/content/trip-plans";
import { getContent } from "@/lib/store";
import { Header, WhatsAppFloat } from "@/components/client";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Trips and day by day plans",
  description:
    "Full day by day plans for JD Travels family trips: Neelum Valley, Poonch, Hunza and Skardu, Swat and Kalam, Naran, Islamabad, Lahore and Karachi. Days, group size, stays, meals and what to bring.",
  alternates: { canonical: "/trips" },
};

export default async function TripsPage() {
  const { contact } = await getContent();
  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-pine-dark text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/ig/kachura.webp" alt="Upper Kachura Lake, Skardu" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/40" />
          <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-32 pb-14 text-center">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-saffron uppercase">Trips</p>
            <h1 className="text-4xl font-semibold sm:text-6xl">Every trip, day by day</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
              How many days, who it suits, where you stay each night, what you eat and what to bring. Every plan can be changed for your family.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tripPlans.map((t) => (
              <a key={t.slug} href={`/trips/${t.slug}`} className="group flex flex-col overflow-hidden rounded-[18px] bg-white text-center shadow-[0_10px_30px_rgba(15,61,46,0.08)] transition hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-pine">
                    <CalendarDays className="size-3.5" /> {t.days} days, {t.nights} {t.nights === 1 ? "night" : "nights"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold tracking-wider text-lake uppercase">{t.region}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-pine">{t.title}</h2>
                  <p className="mt-3 text-sm text-muted">{t.overview}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-snow px-3 py-1"><Users className="size-3.5" /> Families and groups</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-snow px-3 py-1"><MapPin className="size-3.5" /> {t.highlights.length} highlights</span>
                  </div>
                  <span className="mt-auto inline-flex items-center justify-center gap-2 pt-6 font-semibold text-pine group-hover:text-lake">
                    See the full plan <ArrowRight className="size-4" />
                  </span>
                </div>
              </a>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-2xl text-center text-muted">
            Want something different? Tell JD your dates and where you would like to go, and he will build a custom family trip.
          </p>
        </section>
      </main>
      <SiteFooter contact={contact} />
      <WhatsAppFloat whatsapp={contact.whatsapp} />
    </>
  );
}
