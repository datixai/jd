import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel with JD | Family trips to Kashmir, GB and Swat",
  description:
    "Family and group trips to Azad Kashmir, Gilgit-Baltistan and Swat, organised by Junaid Shazad for families from Kotli, Khuiratta, Dadyal and Mirpur living in the UK and abroad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
