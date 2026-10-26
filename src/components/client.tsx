"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Send } from "lucide-react";
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
