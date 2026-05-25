import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getTownData } from "@/lib/towns";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const town = await getTownData();
  return {
    title: {
      template: `%s | ${town.meta.name} Info`,
      default: `${town.meta.name}, NJ - Town Information`,
    },
    description: town.overview.tagline,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const town = await getTownData();
  return (
    <html
      lang="en"
      style={
        {
          "--town-primary": town.meta.themeColor,
          "--town-accent": town.meta.accentColor,
        } as React.CSSProperties
      }
    >
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Header town={town.meta} />
        <Nav townName={town.meta.name} />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <Footer town={town.meta} />
      </body>
    </html>
  );
}
