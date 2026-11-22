import { site } from "@/content/site";
import { renderShareImage, SHARE_IMAGE_SIZE } from "@/lib/share-image";

export const alt = `${site.name} — ${site.tagline}`;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderShareImage({
    photoSrc: "/images/predator.webp",
    eyebrow: "UK figure & statue painter",
    title: site.tagline,
  });
}
