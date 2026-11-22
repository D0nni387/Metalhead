"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/#selected", label: "The work" },
  { href: "/#archive", label: "Archive" },
  { href: "/#workshop", label: "Workshop" },
  { href: "/#about", label: "About" },
  { href: "/#commissions", label: "Commissions" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const setMenu = useCallback((next: boolean) => {
    setOpen(next);
    document.documentElement.classList.toggle("menu-open", next);
    for (const region of document.querySelectorAll<HTMLElement>("main, footer"))
      region.inert = next;
    if (next) navRef.current?.querySelector("a")?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenu(false);
      toggleRef.current?.focus();
    };
    const wide = window.matchMedia("(min-width: 901px)");
    const onWide = (event: MediaQueryListEvent) => event.matches && setMenu(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, setMenu]);

  useEffect(() => () => setMenu(false), [setMenu]);

  const closeIfOpen = () => open && setMenu(false);

  return (
    <header className="site-header">
      <Link href="/" aria-label="Metalhed home" onClick={closeIfOpen}>
        <Image
          className="logo"
          src="/images/logo.webp"
          width={820}
          height={391}
          alt="Metalhed"
          preload
        />
      </Link>
      <div className="header-actions">
        <nav
          ref={navRef}
          className={`site-nav${open ? " open" : ""}`}
          id="site-nav"
          aria-label="Primary navigation"
        >
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeIfOpen}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="cta header-cta" href="/#commissions" onClick={closeIfOpen}>
          Contact<span className="header-cta-arrow" aria-hidden="true">↗</span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setMenu(!open)}
        >
          <span className="menu-toggle-label">{open ? "Close" : "Menu"}</span>
          <span className="menu-toggle-bars" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
