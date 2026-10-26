"use client";

import { useState } from "react";
import { Bus, Car, CarFront, ExternalLink, Truck, Users } from "lucide-react";
import type { Vehicle } from "@/content/site";

const icons = { van: Bus, car: Car, suv: CarFront, jeep: Truck };
const filters = [
  { id: "all", label: "All vehicles" },
  { id: "van", label: "Vans" },
  { id: "car", label: "Cars" },
  { id: "suv", label: "Luxury 4x4" },
  { id: "jeep", label: "Off road" },
] as const;

// A modern car silhouette that drives across the section.
function DrivingCar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 h-12 overflow-hidden" aria-hidden="true">
      <div className="absolute bottom-1 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <svg viewBox="0 0 120 44" className="drive absolute bottom-1 h-10 w-28">
        <path d="M6 30 L14 18 Q18 13 26 12 L62 11 Q72 11 80 17 L92 24 L108 26 Q116 27 116 33 L116 36 L6 36 Z" fill="#e9a23b" />
        <path d="M24 17 L34 14 L58 14 L66 20 L24 21 Z" fill="#0a2a20" opacity="0.85" />
        <path d="M68 15 L78 20 L70 21 Z" fill="#0a2a20" opacity="0.85" />
        <rect x="108" y="28" width="7" height="3" rx="1" fill="#fff6dc" />
        <g className="wheel"><circle cx="30" cy="36" r="7" fill="#17211d" /><circle cx="30" cy="36" r="3" fill="#d9d4c7" /><rect x="29" y="30" width="2" height="12" fill="#17211d" /></g>
        <g className="wheel"><circle cx="94" cy="36" r="7" fill="#17211d" /><circle cx="94" cy="36" r="3" fill="#d9d4c7" /><rect x="93" y="30" width="2" height="12" fill="#17211d" /></g>
        <path d="M0 26 L-14 26 M2 31 L-20 31" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Vehicles({ vehicles, bookUrl }: { vehicles: Vehicle[]; bookUrl: string }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const shown = vehicles.filter((v) => filter === "all" || v.icon === filter);

  return (
    <section id="vehicles" className="relative overflow-hidden bg-pine-dark px-4 py-20 text-white sm:py-28">
      <DrivingCar />
      <div className="pointer-events-none absolute -top-40 -right-40 size-[480px] rounded-full bg-saffron/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[480px] rounded-full bg-lake/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-saffron uppercase">Vehicles</p>
          <h2 className="text-3xl leading-tight font-semibold sm:text-5xl">The right ride for every trip</h2>
          <p className="mt-4 text-lg text-white/75">
            From family vans to luxury 4x4s, the vehicles families in AJK know and trust, with experienced drivers. Provided with our partner Friends Motors.
          </p>
        </div>

        <div className="no-scrollbar mb-10 flex justify-start gap-2 overflow-x-auto sm:justify-center">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                filter === f.id ? "bg-saffron text-ink shadow-lg shadow-saffron/20" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {shown.map((v, i) => {
            const Icon = icons[v.icon];
            return (
              <article
                key={v.name}
                style={{ animationDelay: `${i * 70}ms` }}
                className="vehicle-card group w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.06] text-center backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-saffron/60 hover:shadow-2xl hover:shadow-black/40 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="relative h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-dark via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur">{v.type}</span>
                  <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-saffron text-ink shadow-lg transition duration-500 group-hover:rotate-12">
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{v.name}</h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm">
                    <Users className="size-4 text-saffron" /> {v.seats} seats
                  </p>
                  <p className="mt-3 text-sm text-white/70">{v.best}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-4 font-semibold text-ink shadow-xl shadow-saffron/20 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Book vehicle <ExternalLink className="size-4 transition group-hover:translate-x-0.5" />
          </a>
          <p className="mt-3 text-sm text-white/60">Opens the Friends Motors booking page</p>
        </div>
      </div>
    </section>
  );
}
