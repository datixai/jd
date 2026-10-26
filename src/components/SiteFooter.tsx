import { Phone } from "lucide-react";
import { nav, waLink as makeWaLink, type Contact } from "@/content/site";
import { WHATSAPP_PATH } from "@/lib/whatsapp";
import { Flags } from "./Flags";
import { Logo } from "./Logo";
import { Facebook, Instagram, Social } from "./SocialIcons";

export function SiteFooter({ contact }: { contact: Contact }) {
  const waLink = (text: string) => makeWaLink(contact.whatsapp, text);
  return (
    <footer className="bg-[#061c15] px-4 pt-16 pb-8 text-center text-white">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <Logo light />
            <p className="mt-3 max-w-xs text-white/60">Family trips to Azad Jammu Kashmir, Gilgit-Baltistan, Swat and the big cities, organised by {contact.name}.</p>
            <div className="mt-5 flex justify-center gap-2">
              <Social href={waLink("Assalam o Alaikum JD")} label="WhatsApp">
                <svg viewBox="0 0 32 32" className="size-4 fill-current" aria-hidden="true"><path d={WHATSAPP_PATH} /></svg>
              </Social>
              <Social href={contact.instagram} label="Instagram"><Instagram className="size-4" /></Social>
              <Social href={contact.facebook} label="Facebook"><Facebook className="size-4" /></Social>
              <Social href={`tel:${contact.phoneTel}`} label="Call" external={false}><Phone className="size-4" /></Social>
            </div>
          </div>
          <div>
            <p className="mb-3 font-semibold">Explore</p>
            <ul className="space-y-2 text-white/70">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-saffron">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold">Contact</p>
            <ul className="space-y-2 text-white/70">
              <li><a href={`tel:${contact.phoneTel}`} className="hover:text-saffron">{contact.phoneDisplay}</a></li>
              <li><a href={waLink("Assalam o Alaikum JD")} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">WhatsApp</a></li>
              <li><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">Instagram</a></li>
              <li><a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">Facebook</a></li>
              <li><a href={contact.vehiclesUrl} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">Book vehicle</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-left text-sm text-white/60 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Flags />
          </div>
          <p>
            Developed by{" "}
            <a href="https://datixai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron hover:underline">
              Datix AI
            </a>
            <span className="mx-2">|</span>
            <a href="/cookies" className="hover:text-saffron">Cookies</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
