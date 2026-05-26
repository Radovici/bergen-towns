import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getTownData } from "@/lib/towns";
import { getActiveSponsors } from "@/lib/sponsor-loader";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NeighborLinks from "@/components/NeighborLinks";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  const sponsors = await getActiveSponsors(town.meta.slug);
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
        <Header town={town.meta} sponsors={sponsors} />
        <Nav townName={town.meta.name} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <NeighborLinks currentSlug={town.meta.slug} />
          {children}
        </main>
        <Footer town={town.meta} sponsors={sponsors} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
