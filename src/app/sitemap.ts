import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        absoluteUrl("/images/predator.webp"),
        absoluteUrl("/images/work-in-progress.webp"),
        absoluteUrl("/images/artist-portrait.webp"),
      ],
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.6,
      images: [project.image, project.process]
        .filter((image) => image !== undefined)
        .map((image) => absoluteUrl(image.src)),
    })),
  ];
}
