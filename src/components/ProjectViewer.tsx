"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProjectImage } from "@/content/projects";

export function FullScreenButton({ image, alt }: { image: ProjectImage; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="view-full"
        onClick={() => dialogRef.current?.showModal()}
      >
        View image full screen ↗
      </button>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Full screen image"
        onClose={() => buttonRef.current?.focus()}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
      >
        <button
          type="button"
          className="close"
          aria-label="Close full screen image"
          onClick={() => dialogRef.current?.close()}
        >
          ✕ Close
        </button>
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          quality={90}
        />
      </dialog>
    </>
  );
}
