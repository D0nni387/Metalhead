import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { renderShareImage, SHARE_IMAGE_SIZE } from "@/lib/share-image";

export const alt = "Painted resin statue by Metalhed";
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return renderShareImage({
    photoSrc: project.image.src,
    eyebrow: project.era === "earlier" ? "From the Metalhed archive" : "Painted by Metalhed",
    title: project.name,
  });
}
