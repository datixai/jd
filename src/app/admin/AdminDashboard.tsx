"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, Inbox, FileText } from "lucide-react";
import type { SiteContent, Trip, Faq, Scene } from "@/content/site";
import type { Enquiry } from "@/lib/store";
import { deleteEnquiryAction, saveContentAction } from "./actions";

const scenes: Scene[] = ["valley", "lake", "peaks", "forest", "meadow", "river"];
const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-pine";
const label = "mb-1 block text-xs font-semibold tracking-wide text-muted uppercase";

function Field({ name, value, onChange, area = false }: { name: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <label className="block">
      <span className={label}>{name}</span>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={input} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      )}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-[18px] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-pine">{title}</h2>
      {children}
    </section>
  );
}

export function AdminDashboard({ initial, enquiries }: { initial: SiteContent; enquiries: Enquiry[] }) {
  const [tab, setTab] = useState<"content" | "enquiries">("enquiries");
  const [c, setC] = useState<SiteContent>(initial);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const setHero = (k: keyof SiteContent["hero"]) => (v: string) => setC({ ...c, hero: { ...c.hero, [k]: v } });
  const setContact = (k: keyof SiteContent["contact"]) => (v: string) => setC({ ...c, contact: { ...c.contact, [k]: v } });
  const setTrip = (i: number, patch: Partial<Trip>) => setC({ ...c, trips: c.trips.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const setFaq = (i: number, patch: Partial<Faq>) => setC({ ...c, faqs: c.faqs.map((f, j) => (j === i ? { ...f, ...patch } : f)) });

  const save = () =>
    start(async () => {
      setMsg("");
      try {
        await saveContentAction(c);
        setMsg("Saved. The website is updated.");
      } catch {
        setMsg("Could not save. Please sign in again.");
      }
    });

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab("enquiries")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${tab === "enquiries" ? "bg-pine text-white" : "bg-white"}`}>
          <Inbox className="size-4" /> Enquiries ({enquiries.length})
        </button>
        <button onClick={() => setTab("content")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${tab === "content" ? "bg-pine text-white" : "bg-white"}`}>
          <FileText className="size-4" /> Website content
        </button>
      </div>

      {tab === "enquiries" ? (
        <Card title="Trip enquiries">
          {enquiries.length === 0 ? (
            <p className="text-muted">No enquiries yet. They appear here when someone sends the form on the website.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-muted uppercase">
                  <tr>
                    {["Date", "Name", "From", "People", "Dates", "Where", ""].map((h) => (
                      <th key={h} className="px-2 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e.id} className="border-t border-line">
                      <td className="px-2 py-2 whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
                      <td className="px-2 py-2 font-semibold">{e.name}</td>
                      <td className="px-2 py-2">{e.from}</td>
                      <td className="px-2 py-2">{e.people}</td>
                      <td className="px-2 py-2">{e.dates}</td>
                      <td className="px-2 py-2">{e.where}</td>
                      <td className="px-2 py-2">
                        <button
                          aria-label="Delete enquiry"
                          onClick={() => confirm("Delete this enquiry?") && start(() => deleteEnquiryAction(e.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <>
          <Card title="Hero (top of the page)">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="Small line" value={c.hero.eyebrow} onChange={setHero("eyebrow")} />
              <Field name="Tagline" value={c.hero.tagline} onChange={setHero("tagline")} />
              <div className="sm:col-span-2"><Field name="Title" value={c.hero.title} onChange={setHero("title")} /></div>
              <div className="sm:col-span-2"><Field name="Text" value={c.hero.text} onChange={setHero("text")} area /></div>
            </div>
          </Card>

          <Card title="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="Name" value={c.contact.name} onChange={setContact("name")} />
              <Field name="Phone (shown)" value={c.contact.phoneDisplay} onChange={setContact("phoneDisplay")} />
              <Field name="WhatsApp number (digits, with 92)" value={c.contact.whatsapp} onChange={setContact("whatsapp")} />
              <Field name="Instagram handle" value={c.contact.instagramHandle} onChange={setContact("instagramHandle")} />
              <Field name="Instagram link" value={c.contact.instagram} onChange={setContact("instagram")} />
              <Field name="Facebook link" value={c.contact.facebook} onChange={setContact("facebook")} />
            </div>
          </Card>

          <Card title="Trips">
            <div className="space-y-4">
              {c.trips.map((t, i) => (
                <div key={i} className="rounded-xl border border-line p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field name="Title" value={t.title} onChange={(v) => setTrip(i, { title: v })} />
                    <Field name="Days" value={t.days} onChange={(v) => setTrip(i, { days: v })} />
                    <Field name="Region" value={t.region} onChange={(v) => setTrip(i, { region: v })} />
                    <div className="sm:col-span-2">
                      <Field name="Highlights (comma separated)" value={t.highlights.join(", ")} onChange={(v) => setTrip(i, { highlights: v.split(",").map((x) => x.trim()) })} />
                    </div>
                    <label className="block">
                      <span className={label}>Drawing if no photo</span>
                      <select value={t.scene} onChange={(e) => setTrip(i, { scene: e.target.value as Scene })} className={input}>
                        {scenes.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </label>
                    <div className="sm:col-span-2">
                      <Field name="Photo path (e.g. /media/trips/neelum.jpg)" value={t.image ?? ""} onChange={(v) => setTrip(i, { image: v })} />
                    </div>
                    <div className="flex items-end justify-end">
                      <button onClick={() => setC({ ...c, trips: c.trips.filter((_, j) => j !== i) })} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                        <Trash2 className="size-4" /> Remove trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setC({ ...c, trips: [...c.trips, { title: "New trip", days: "3 days", region: "Azad Kashmir", highlights: [], scene: "valley" }] })}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine px-4 py-2 text-sm font-semibold text-pine hover:bg-pine hover:text-white"
            >
              <Plus className="size-4" /> Add trip
            </button>
          </Card>

          <Card title="FAQ">
            <div className="space-y-4">
              {c.faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-line p-4">
                  <Field name="Question" value={f.q} onChange={(v) => setFaq(i, { q: v })} />
                  <div className="mt-3"><Field name="Answer" value={f.a} onChange={(v) => setFaq(i, { a: v })} area /></div>
                  <button onClick={() => setC({ ...c, faqs: c.faqs.filter((_, j) => j !== i) })} className="mt-2 inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setC({ ...c, faqs: [...c.faqs, { q: "", a: "" }] })} className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine px-4 py-2 text-sm font-semibold text-pine hover:bg-pine hover:text-white">
              <Plus className="size-4" /> Add question
            </button>
          </Card>

          <div className="sticky bottom-4 flex items-center justify-end gap-4 rounded-full bg-white/90 p-2 pl-6 shadow-lg backdrop-blur">
            {msg && <p className="text-sm text-pine">{msg}</p>}
            <button onClick={save} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 font-semibold text-ink hover:brightness-110 disabled:opacity-60">
              <Save className="size-4" /> {pending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
