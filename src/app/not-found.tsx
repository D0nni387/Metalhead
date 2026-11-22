import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="wrap">
        <div className="eyebrow">404 / Lost in the shed</div>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 108px)", marginBlock: "10px 20px" }}>
          Nothing <span className="pink">here.</span>
        </h1>
        <p>That page doesn&apos;t exist, or it&apos;s moved.</p>
        <Link className="cta" href="/#archive">
          Back to the archive ↗
        </Link>
      </div>
    </section>
  );
}
