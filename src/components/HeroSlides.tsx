"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/images/predator.webp", className: "hero-slide" },
  { src: "/images/robocop.webp", className: "hero-slide hero-slide--raised" },
  { src: "/images/xenomorph.webp", className: "hero-slide" },
  { src: "/images/blaidd.webp", className: "hero-slide" },
];

export function HeroSlides() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setCurrent((index) => (index + 1) % SLIDES.length),
      7000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slides" aria-hidden="true">
      {SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          className={`${slide.className}${index === current ? " active" : ""}`}
          src={slide.src}
          alt=""
          fill
          sizes="100vw"
          preload={index === 0}
        />
      ))}
    </div>
  );
}
