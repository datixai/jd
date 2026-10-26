"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Send, Play } from "lucide-react";
import { nav, waLink } from "@/content/site";
import { Logo } from "./Logo";
import { WHATSAPP_PATH } from "@/lib/whatsapp";
import { submitEnquiry } from "@/app/actions";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = solid || open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? "bg-pine-dark/95 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-4 py-4 text-white">
        <a href="/" aria-label="JD Travels home">
          <Logo light />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="opacity-90 transition hover:text-saffron hover:opacity-100">
              {n.label}
            </a>
          ))}
          <a href="/#plan" className="rounded-full bg-saffron px-5 py-2.5 font-semibold text-ink transition hover:brightness-110">
            Plan my trip
          </a>
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-5 text-white lg:hidden">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5">
              {n.label}
            </a>
          ))}
          <a href="/#plan" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-saffron px-5 py-3 text-center font-semibold text-ink">
            Plan my trip
          </a>
        </nav>
      )}
    </header>
  );
}

export function Tabs({ labels, panels }: { labels: string[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="no-scrollbar mb-10 flex justify-start gap-2 overflow-x-auto sm:justify-center" role="tablist">
        {labels.map((l, i) => (
          <button
            key={l}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              active === i ? "border-pine bg-pine text-white" : "border-line bg-white text-ink hover:border-pine"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} hidden={active !== i}>
          {p}
        </div>
      ))}
    </div>
  );
}

export function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        <button onClick={() => scroll(-1)} aria-label="Previous trips" className="grid size-11 place-items-center rounded-full border border-line bg-white transition hover:border-pine">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => scroll(1)} aria-label="Next trips" className="grid size-11 place-items-center rounded-full bg-pine text-white transition hover:brightness-125">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

export function EnquiryForm({ whatsapp, firstName }: { whatsapp: string; firstName: string }) {
  const [f, setF] = useState({ name: "", from: "Bolton", people: "", dates: "", where: "Neelum Valley", website: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const message = `Assalam o Alaikum JD, I would like to plan a trip.
Name: ${f.name}
Coming from: ${f.from}
People: ${f.people}
Dates: ${f.dates}
Where: ${f.where}`;

  const input = "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 outline-none focus:border-saffron";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Open WhatsApp first (popup blockers allow it only straight after the click), then save a copy for the admin.
        window.open(waLink(whatsapp, message), "_blank", "noopener,noreferrer");
        submitEnquiry(f).catch(() => {});
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} className="hidden" />
      <input required maxLength={80} placeholder="Your name" value={f.name} onChange={set("name")} className={input} />
      <select value={f.from} onChange={set("from")} className={input}>
        {["Bolton", "Elsewhere in the UK", "Europe", "Middle East", "USA or Canada", "Already in Pakistan"].map((o) => (
          <option key={o} className="text-ink">{o}</option>
        ))}
      </select>
      <input placeholder="How many people (adults, kids)" value={f.people} onChange={set("people")} className={input} />
      <input placeholder="Travel dates" value={f.dates} onChange={set("dates")} className={input} />
      <select value={f.where} onChange={set("where")} className={`${input} sm:col-span-2`}>
        {["Neelum Valley", "Poonch and Banjosa", "Hunza and Skardu", "Swat and Kalam", "Naran and Kaghan", "Islamabad, Lahore or Karachi", "Not sure, please suggest"].map((o) => (
          <option key={o} className="text-ink">{o}</option>
        ))}
      </select>
      <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-saffron px-6 py-3.5 font-semibold text-ink transition hover:brightness-110 sm:col-span-2">
        <Send className="size-4" /> Send on WhatsApp to {firstName}
      </button>
    </form>
  );
}


export function WhatsAppFloat({ whatsapp }: { whatsapp: string }) {
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 2500);
    const t2 = setTimeout(() => setNudge(false), 9000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex items-center gap-3 sm:right-7 sm:bottom-7">
      <div
        className={`hidden overflow-hidden rounded-full bg-white shadow-xl ring-1 ring-pine/10 transition-all duration-500 sm:block ${
          nudge ? "max-w-[240px] px-4 py-2.5 opacity-100" : "max-w-0 px-0 py-0 opacity-0"
        }`}
      >
        <span className="block text-sm font-medium whitespace-nowrap text-pine">Plan your trip on WhatsApp</span>
      </div>
      <a
        href={waLink(whatsapp, "Assalam o Alaikum JD, I would like to plan a trip.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Travel with JD on WhatsApp"
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <span className="wa-ring absolute inset-0 rounded-full bg-[#25D366]" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative size-8 fill-white" aria-hidden>
          <path d={WHATSAPP_PATH} />
        </svg>
      </a>
    </div>
  );
}

export function ReelCard({ video, poster, title }: { video: string; poster: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] bg-pine-dark">
      {playing ? (
        <video src={video} poster={poster} className="h-full w-full object-cover" controls autoPlay playsInline />
      ) : (
        <button onClick={() => setPlaying(true)} className="group block h-full w-full" aria-label={`Play reel: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-pine shadow-lg transition group-hover:scale-110">
            <Play className="ml-1 size-6 fill-current" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-center font-semibold text-white">{title}</span>
        </button>
      )}
    </div>
  );
}

// Shows the poster straight away and only fetches the video after the page has loaded,
// and never on data saver or 2G connections.
export function HeroVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => setTimeout(() => setLoad(true), 300);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      {load && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </>
  );
}
