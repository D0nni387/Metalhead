import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, site } from "@/content/site";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const body = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0b090c",
  colorScheme: "dark",
};

const organizationId = absoluteUrl("/#organization");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": organizationId,
                name: site.name,
                slogan: site.tagline,
                description: site.description,
                url: site.url,
                logo: absoluteUrl("/images/logo.webp"),
                email: site.email,
                sameAs: [site.linktree],
                areaServed: { "@type": "Country", name: "United Kingdom" },
                knowsAbout: [
                  "Resin statue painting",
                  "Collectible figure painting",
                  "Resin 3D printing",
                  "Airbrushing",
                  "Custom pet statues",
                ],
              },
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: site.name,
                url: site.url,
                inLanguage: "en-GB",
                publisher: { "@id": organizationId },
              },
            ],
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <div className="wrap">
            <span>
              © {site.name} · {site.tagline}
            </span>
            <span className="footer-links">
              <a href={`mailto:${site.email}`}>Email</a>
              <a href={site.linktree} target="_blank" rel="noopener">
                Linktree ↗<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </span>
            <span className="footer-tag">Made with noise.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
