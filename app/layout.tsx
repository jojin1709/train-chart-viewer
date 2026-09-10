import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: {
    default: "RailChart Explorer — Explore Railway Reservation Charts",
    template: "%s · RailChart Explorer",
  },
  description:
    "Explore railway reservation charts with coach, berth and journey-segment filters in a clean, easy-to-use interface.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "RailChart Explorer",
    description: "Explore reservation charts, coaches and berth availability with clarity.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
