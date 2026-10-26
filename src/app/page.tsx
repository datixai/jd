import { CalendarDays, Check, MapPin, MessageCircle, Phone, Plane, Users, Car, Heart, UtensilsCrossed, Smartphone, ChevronDown, Bus, CarFront, Truck, ExternalLink } from "lucide-react";
import { families, intro, photos, regions, reels, steps, vehicles, waLink as makeWaLink } from "@/content/site";
import { getContent } from "@/lib/store";
import { exists } from "@/lib/media";
import { Carousel, EnquiryForm, Header, HeroVideo, Tabs, WhatsAppFloat } from "@/components/client";
import { Vehicles } from "@/components/Vehicles";
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { Facebook, Instagram } from "@/components/SocialIcons";
import { SITE_URL } from "@/lib/site-url";
import { Media } from "@/components/Media";
import { Scene } from "@/components/Scene";
import { Flags } from "@/components/Flags";

const pointIcons = [Plane, Car, Users, UtensilsCrossed, Smartphone, Heart];

const HERO_VIDEO = "/media/reels/neelum.mp4";
const HERO_POSTER = "/media/reels/neelum.webp";

function SectionHead({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className={`mb-3 text-xs font-bold tracking-[0.2em] uppercase ${light ? "text-saffron" : "text-lake"}`}>{eyebrow}</p>
      <h2 className={`text-3xl leading-tight font-semibold sm:text-5xl ${light ? "text-white" : "text-pine"}`}>{title}</h2>
      {text && <p className={`mt-4 text-lg ${light ? "text-white/75" : "text-muted"}`}>{text}</p>}
    </Reveal>
  );
}

export default async function Home() {
  const { hero, contact, trips, faqs } = await getContent();
  const waLink = (text: string) => makeWaLink(contact.whatsapp, text);
  const heroVideo = exists(HERO_VIDEO);
  const reelList = reels.filter((r) => exists(`/media/${r.file}.mp4`));
  const photoList = photos.filter((p) => exists(`/media/${p.file}.webp`));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "JD Travels",
      alternateName: "Travel with JD",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/opengraph-image.jpg`,
      description: hero.text,
      telephone: contact.phoneDisplay.replace(/\s/g, ""),
      founder: { "@type": "Person", name: contact.name },
      sameAs: [contact.instagram, contact.facebook],
      areaServed: ["Azad Jammu Kashmir", "Gilgit-Baltistan", "Khyber Pakhtunkhwa", "Kotli", "Khuiratta", "Dadyal", "Mirpur", "Bolton", "United Kingdom"],
      knowsAbout: ["Neelum Valley", "Arang Kel", "Toli Pir", "Hunza", "Skardu", "Swat", "Naran", "Family tours", "Car rental"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\" + "u003c") }} />
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-pine-dark text-white">
          <div className="absolute inset-0">
            {heroVideo ? (
              <HeroVideo src={HERO_VIDEO} poster={HERO_POSTER} alt="Neelum Valley, Azad Jammu Kashmir" />
            ) : (
              <Scene name="river" className="h-full w-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/50" />
          </div>
          <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-32 pb-20 text-center sm:pb-28">
            <div className="hero-in">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
                <MapPin className="size-3.5 text-saffron" /> {hero.eyebrow}
              </p>
              <h1 className="mx-auto max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-7xl">{hero.title}</h1>
              <p className="font-heading mt-4 text-2xl text-saffron italic sm:text-3xl">{hero.tagline}</p>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{hero.text}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={waLink("Assalam o Alaikum JD, I would like to plan a family trip.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 font-semibold text-ink transition hover:brightness-110">
                  <MessageCircle className="size-5" /> WhatsApp JD
                </a>
                <a href="#trips" className="rounded-full border border-white/60 px-7 py-3.5 font-semibold transition hover:bg-white hover:text-ink">
                  See trips
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="px-4 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl leading-tight font-semibold text-pine sm:text-5xl">{intro.title}</h2>
            <div className="mt-8">
              {intro.text.map((t) => (
                <p key={t} className="mb-4 text-lg text-muted">{t}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="font-heading grid size-14 place-items-center rounded-full bg-pine text-xl font-semibold text-saffron">JD</div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-muted">Trip organiser, JD Travels</p>
            </div>
          </Reveal>
        </section>

        {/* Destinations */}
        <section id="destinations" className="bg-white px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="Destinations" title="Where would your family like to go?" text="From a weekend in Poonch to two weeks in the Karakoram, or a few days in the big cities." />
            <Tabs
              labels={regions.map((r) => r.label)}
              panels={regions.map((r) => (
                <div key={r.id}>
                  <p className="mx-auto mb-8 max-w-2xl text-center text-muted">{r.intro}</p>
                  <div className="flex flex-wrap justify-center gap-5">
                    {r.places.map((p) => (
                      <article key={p.name} className="group relative aspect-[3/4] w-full overflow-hidden rounded-[18px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                        <Media image={p.image} scene={p.scene} alt={p.name} className="transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white">
                          <h3 className="text-2xl font-semibold">{p.name}</h3>
                          <p className="mt-1 text-sm text-white/80">{p.text}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            />
          </div>
        </section>

        {/* Trips */}
        <section id="trips" className="px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="Trips" title="Popular family trips" text="Every trip can be changed to suit your dates, group and budget." />
            <Carousel>
              {trips.map((t) => (
                <article key={t.title} className="flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] bg-white text-center shadow-[0_10px_30px_rgba(15,61,46,0.08)] sm:w-[340px]">
                  <div className="relative h-52 overflow-hidden">
                    <Media image={t.image} scene={t.scene} alt={t.title} />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-pine">
                      <CalendarDays className="size-3.5" /> {t.days}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold tracking-wider text-lake uppercase">{t.region}</p>
                    <h3 className="mt-1 text-xl font-semibold">{t.title}</h3>
                    <ul className="mt-4 mb-6 space-y-2 text-sm text-muted">
                      {t.highlights.map((h) => (
                        <li key={h} className="flex items-center justify-center gap-2">
                          <Check className="size-4 text-pine" /> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto grid gap-2">
                      {t.slug && (
                        <a href={`/trips/${t.slug}`} className="rounded-full bg-pine py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-125">
                          See full day by day plan
                        </a>
                      )}
                      <a href={waLink(`Assalam o Alaikum JD, please send me details and price for: ${t.title}`)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-pine py-2.5 text-center text-sm font-semibold text-pine transition hover:bg-pine hover:text-white">
                        Ask for price
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </Carousel>
            <div className="mt-8 text-center">
              <a href="/trips" className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 font-semibold text-ink transition hover:brightness-110">
                See all trips with full plans
              </a>
            </div>
          </div>
        </section>

        <Vehicles vehicles={vehicles} bookUrl={contact.vehiclesUrl} />

        {/* Families */}
        <section id="families" className="bg-pine px-4 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHead light eyebrow="For UK and overseas families" title={families.title} text={families.text} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {families.points.map((p, i) => {
                const Icon = pointIcons[i];
                return (
                  <Reveal key={p.title} delay={i * 80} className="rounded-[18px] border border-white/10 bg-white/5 p-7 text-center">
                    <Icon className="mx-auto mb-4 size-8 text-saffron" />
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <p className="mt-2 text-white/70">{p.text}</p>
                  </Reveal>
                );
              })}
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {families.pickups.map((p) => (
                <span key={p} className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  <MapPin className="mr-1 inline size-4 text-saffron" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="How it works" title="From one message to the mountains" />
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 100}>
                  <p className="font-heading text-6xl font-semibold text-saffron">0{i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-pine">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery (JD's reels) */}
        <section id="gallery" className="bg-white px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow={contact.instagramHandle} title="Moments from our trips" text="Videos and photos from JD's trips across Azad Jammu Kashmir, Gilgit-Baltistan and Swat. Tap a video to play it." />
            <Gallery reels={reelList} photos={photoList} />
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 font-semibold text-white transition hover:brightness-125">
                <Instagram className="size-5" /> Follow on Instagram
              </a>
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-pine px-6 py-3 font-semibold text-pine transition hover:bg-pine hover:text-white">
                <Facebook className="size-5" /> Facebook page
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <SectionHead eyebrow="FAQ" title="Questions families ask" />
            <div className="divide-y divide-line rounded-[18px] border border-line bg-white">
              {faqs.map((f) => (
                <details key={f.q} className="group p-6 text-center">
                  <summary className="relative flex cursor-pointer list-none items-center justify-center px-8 text-lg font-semibold text-pine">
                    {f.q}
                    <ChevronDown className="absolute right-0 size-5 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Plan / enquiry */}
        <section id="plan" className="relative overflow-hidden bg-pine-dark px-4 py-20 text-white sm:py-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/ig/minimarg.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-pine-dark/85 via-pine-dark/75 to-pine-dark/90" />
          <div className="relative mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="mb-3 text-xs font-bold tracking-[0.2em] text-saffron uppercase">Plan my trip</p>
              <h2 className="text-3xl leading-tight font-semibold sm:text-5xl">Coming home soon? Let&apos;s plan the trip.</h2>
              <p className="mt-4 text-lg text-white/75">Fill in a few details and the message opens in WhatsApp, ready to send to JD. Or call him directly.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
                <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-2 font-semibold hover:text-saffron">
                  <Phone className="size-5 text-saffron" /> {contact.phoneDisplay}
                </a>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-saffron">
                  <Instagram className="size-5 text-saffron" /> {contact.instagramHandle}
                </a>
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-saffron">
                  <Facebook className="size-5 text-saffron" /> Facebook
                </a>
              </div>
            </Reveal>
            <Reveal delay={150} className="mt-10 rounded-[22px] border border-white/15 bg-white/5 p-6 text-left backdrop-blur sm:p-8">
              <EnquiryForm whatsapp={contact.whatsapp} firstName={contact.name.split(" ")[0]} />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter contact={contact} />

      <WhatsAppFloat whatsapp={contact.whatsapp} />
    </>
  );
}
