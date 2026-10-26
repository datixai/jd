import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

const description =
  "JD Travels plans family trips to Neelum Valley, Poonch, Hunza, Skardu, Swat and more for Kotli, Khuiratta, Dadyal and Mirpur families living in Bolton, the UK and abroad. Pickup from home, family vans, halal food and trusted hotels.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JD Travels | Family trips to Azad Jammu Kashmir, GB and Swat",
    template: "%s | JD Travels",
  },
  description,
  applicationName: "JD Travels",
  keywords: [
    "JD Travels",
    "Travel with JD",
    "Azad Jammu Kashmir tours",
    "AJK family trips",
    "Neelum Valley tour",
    "Arang Kel",
    "Toli Pir",
    "Poonch trip",
    "Hunza Skardu tour",
    "Swat Kalam trip",
    "Kotli",
    "Khuiratta",
    "Dadyal",
    "Mirpur",
    "Bolton Pakistani families",
    "UK families visiting Pakistan",
    "rent a car Kotli Mirpur",
  ],
  authors: [{ name: "Junaid Shazad" }],
  creator: "Datix AI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "JD Travels",
    title: "JD Travels | Family trips to Azad Jammu Kashmir, GB and Swat",
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "JD Travels | Family trips to Azad Jammu Kashmir, GB and Swat",
    description,
  },
  robots: { index: true, follow: true },
  category: "travel",
};

export const viewport: Viewport = {
  themeColor: "#0f3d2e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${jakarta.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
