"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Send, Play } from "lucide-react";
import { nav, waLink } from "@/content/site";
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
        <a href="#top" className="font-heading text-2xl font-semibold tracking-tight">
          Travel with <span className="text-saffron">JD</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="opacity-90 transition hover:text-saffron hover:opacity-100">
              {n.label}
            </a>
          ))}
          <a href="#plan" className="rounded-full bg-saffron px-5 py-2.5 font-semibold text-ink transition hover:brightness-110">
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
          <a href="#plan" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-saffron px-5 py-3 text-center font-semibold text-ink">
            Plan my trip
          </a>
        </nav>
      )}
    </header>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
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
  const [f, setF] = useState({ name: "", from: "UK", people: "", dates: "", where: "Neelum Valley", website: "" });
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
        {["UK", "Europe", "Middle East", "USA or Canada", "Already in Pakistan"].map((o) => (
          <option key={o} className="text-ink">{o}</option>
        ))}
      </select>
      <input placeholder="How many people (adults, kids)" value={f.people} onChange={set("people")} className={input} />
      <input placeholder="Travel dates" value={f.dates} onChange={set("dates")} className={input} />
      <select value={f.where} onChange={set("where")} className={`${input} sm:col-span-2`}>
        {["Neelum Valley", "Poonch and Banjosa", "Hunza and Skardu", "Swat and Kalam", "Naran and Kaghan", "Not sure, please suggest"].map((o) => (
          <option key={o} className="text-ink">{o}</option>
        ))}
      </select>
      <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-saffron px-6 py-3.5 font-semibold text-ink transition hover:brightness-110 sm:col-span-2">
        <Send className="size-4" /> Send on WhatsApp to {firstName}
      </button>
    </form>
  );
}

export const WHATSAPP_PATH =
  "M16.004 3.2c-7.06 0-12.79 5.73-12.793 12.786a12.74 12.74 0 0 0 1.745 6.436L3.2 28.8l6.53-1.712a12.78 12.78 0 0 0 6.27 1.597h.005c7.055 0 12.786-5.73 12.79-12.787A12.71 12.71 0 0 0 25.05 6.94a12.71 12.71 0 0 0-9.046-3.74Zm0 23.35h-.004a10.62 10.62 0 0 1-5.41-1.48l-.388-.23-4.026 1.056 1.074-3.926-.253-.403a10.6 10.6 0 0 1-1.625-5.66c.002-5.866 4.774-10.637 10.636-10.637a10.56 10.56 0 0 1 7.517 3.117 10.56 10.56 0 0 1 3.11 7.527c-.002 5.866-4.774 10.636-10.63 10.636Zm5.83-7.965c-.32-.16-1.89-.932-2.183-1.039-.293-.107-.506-.16-.72.16-.212.32-.825 1.039-1.012 1.252-.186.213-.373.24-.692.08-.32-.16-1.35-.498-2.57-1.586-.95-.847-1.592-1.894-1.778-2.213-.187-.32-.02-.492.14-.651.144-.143.32-.373.48-.56.16-.186.213-.32.32-.532.107-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.852.4-.293.32-1.119 1.093-1.119 2.667s1.146 3.094 1.305 3.307c.16.213 2.253 3.44 5.46 4.824.763.33 1.358.527 1.822.674.766.244 1.463.21 2.014.127.614-.092 1.89-.773 2.157-1.52.266-.746.266-1.386.186-1.52-.08-.133-.293-.213-.612-.373Z";

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
