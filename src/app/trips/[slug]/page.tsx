import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, CalendarDays, Car, Check, Clock, Coffee, MapPin, Moon, Sun, Users, Utensils, X, Backpack, Info, MessageCircle } from "lucide-react";
import { getTripPlan, tripPlans } from "@/content/trip-plans";
import { waLink } from "@/content/site";
import { getContent } from "@/lib/store";
import { SITE_URL } from "@/lib/site-url";
import { Header, WhatsAppFloat } from "@/components/client";
import { SiteFooter } from "@/components/SiteFooter";

export function generateStaticParams() {
  return tripPlans.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTripPlan((await params).slug);
  if (!t) return {};
  return {
    title: `${t.title}: ${t.days} day plan`,
    description: `${t.overview} Day by day plan with stays, meals and what to bring.`,
    alternates: { canonical: `/trips/${t.slug}` },
    openGraph: { images: [t.image] },
  };
}

function List({ items, icon: Icon, tone }: { items: string[]; icon: typeof Check; tone: string }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-muted">
          <Icon className={`mt-0.5 size-4 shrink-0 ${tone}`} /> {i}
        </li>
      ))}
    </ul>
  );
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTripPlan((await params).slug);
  if (!t) notFound();
  const { contact } = await getContent();
  const ask = waLink(contact.whatsapp, `Assalam o Alaikum JD, please send me the price and dates for: ${t.title} (${t.days} days). We are __ people.`);

  const facts = [
    { icon: CalendarDays, label: "Duration", value: `${t.days} days, ${t.nights} ${t.nights === 1 ? "night" : "nights"}` },
    { icon: Users, label: "Group size", value: t.groupSize },
    { icon: Sun, label: "Best time", value: t.bestTime },
    { icon: MapPin, label: "Starts from", value: t.startFrom },
    { icon: Car, label: "Vehicle", value: t.vehicle },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t.title,
    description: t.overview,
    url: `${SITE_URL}/trips/${t.slug}`,
    image: `${SITE_URL}${t.image}`,
    touristType: "Families",
    provider: { "@type": "TravelAgency", name: "JD Travels", url: SITE_URL },
    itinerary: {
      "@type": "ItemList",
      itemListElement: t.itinerary.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `Day ${i + 1}: ${d.title}`, description: d.route })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\" + "u003c") }} />
      <Header />
      <main>
        <section className="relative flex min-h-[65vh] items-end overflow-hidden bg-pine-dark text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.image} alt={t.title} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/40" />
          <div className="relative mx-auto w-full max-w-[1100px] px-4 pt-32 pb-14 text-center">
            <a href="/trips" className="text-sm text-white/70 hover:text-saffron">All trips</a>
            <p className="mt-3 text-xs font-bold tracking-[0.2em] text-saffron uppercase">{t.region}</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-6xl">{t.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{t.overview}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={ask} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 font-semibold text-ink transition hover:brightness-110">
                <MessageCircle className="size-5" /> Ask for price and dates
              </a>
              <a href="#plan" className="rounded-full border border-white/60 px-7 py-3.5 font-semibold transition hover:bg-white hover:text-ink">Day by day plan</a>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-[1100px] gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="rounded-[18px] bg-white p-5 text-center shadow-sm">
                <f.icon className="mx-auto mb-2 size-6 text-saffron" />
                <p className="text-xs font-bold tracking-wider text-lake uppercase">{f.label}</p>
                <p className="mt-1 text-sm text-ink">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-[1100px] flex-wrap justify-center gap-2">
            {t.highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-sm text-white">
                <Check className="size-4 text-saffron" /> {h}
              </span>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section id="plan" className="bg-white px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-10 text-center text-3xl font-semibold text-pine sm:text-4xl">Day by day plan</h2>
            <ol className="relative space-y-8 border-l-2 border-line pl-8">
              {t.itinerary.map((d, i) => (
                <li key={d.title} className="relative">
                  <span className="font-heading absolute top-0 -left-[49px] grid size-10 place-items-center rounded-full bg-saffron text-sm font-semibold text-ink">{i + 1}</span>
                  <div className="rounded-[18px] border border-line bg-snow p-6">
                    <p className="text-xs font-bold tracking-wider text-lake uppercase">Day {i + 1}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-pine">{d.title}</h3>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="inline-flex items-center gap-1"><MapPin className="size-4 text-saffron" /> {d.route}</span>
                      {d.drive && <span className="inline-flex items-center gap-1"><Clock className="size-4 text-saffron" /> {d.drive}</span>}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {d.activities.map((a) => (
                        <li key={a} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-pine" /> {a}</li>
                      ))}
                    </ul>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white p-4">
                        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-lake uppercase"><BedDouble className="size-4" /> Stay</p>
                        <p className="text-sm">{d.stay}</p>
                      </div>
                      <div className="rounded-xl bg-white p-4">
                        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-lake uppercase"><Utensils className="size-4" /> Meals</p>
                        <p className="text-sm"><Coffee className="mr-1 inline size-3.5 text-saffron" /> {d.meals.breakfast}</p>
                        <p className="text-sm"><Sun className="mr-1 inline size-3.5 text-saffron" /> {d.meals.lunch}</p>
                        <p className="text-sm"><Moon className="mr-1 inline size-3.5 text-saffron" /> {d.meals.dinner}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Photos */}
        {t.photos.length > 0 && (
          <section className="px-4 py-16">
            <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-4 sm:grid-cols-4">
              {t.photos.map((p) => (
                <div key={p} className="aspect-[4/5] overflow-hidden rounded-[18px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt={t.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        <section className="bg-white px-4 py-16">
          <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-2">
            <div className="rounded-[18px] border border-line p-6">
              <h3 className="mb-4 text-xl font-semibold text-pine">Included</h3>
              <List items={t.included} icon={Check} tone="text-pine" />
            </div>
            <div className="rounded-[18px] border border-line p-6">
              <h3 className="mb-4 text-xl font-semibold text-pine">Not included</h3>
              <List items={t.notIncluded} icon={X} tone="text-red-600" />
            </div>
            <div className="rounded-[18px] border border-line p-6">
              <h3 className="mb-4 text-xl font-semibold text-pine">What to bring</h3>
              <List items={t.bring} icon={Backpack} tone="text-saffron" />
            </div>
            <div className="rounded-[18px] border border-line p-6">
              <h3 className="mb-4 text-xl font-semibold text-pine">Good to know</h3>
              <List items={t.goodToKnow} icon={Info} tone="text-lake" />
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="text-muted">Prices depend on your dates, group size and hotels. Every plan can be changed for your family.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={ask} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 font-semibold text-ink transition hover:brightness-110">
                <MessageCircle className="size-5" /> Ask for price and dates
              </a>
              <a href={contact.vehiclesUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-pine px-7 py-3.5 font-semibold text-pine transition hover:bg-pine hover:text-white">
                Book a vehicle
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter contact={contact} />
      <WhatsAppFloat whatsapp={contact.whatsapp} />
    </>
  );
}
