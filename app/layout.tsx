import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CursorTrails } from "@/components/cursor-trails";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Entre as Ilhas",
  description:
    "Agência de turismo com experiências tropicais, travessias e roteiros entre mar, praias e ilhas."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakartaSans.className} min-h-screen bg-brand-foam text-slate-900 antialiased`}>
        <SmoothScroll />
        <CursorTrails />
        <div className="relative isolate flex min-h-screen flex-col">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,_rgba(20,152,213,0.20),_transparent_58%)]"
          />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
