import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { FullScreenButton } from "@/components/ProjectViewer";
import {
  getAdjacentProjects,
  getProject,
  projects,
  projectSummary,
  projectTitle,
} from "@/content/projects";
import { absoluteUrl, site } from "@/content/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = projectTitle(project);
  const description = projectSummary(project);
  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      url: `/work/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);
  const url = absoluteUrl(`/work/${project.slug}`);
  const alt = `${project.name}, painted by Metalhed`;

  return (
    <article className="project-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "VisualArtwork",
              "@id": `${url}#artwork`,
              name: project.name,
              description: projectSummary(project),
              url,
              image: {
                "@type": "ImageObject",
                contentUrl: absoluteUrl(project.image.src),
                width: { "@type": "QuantitativeValue", value: project.image.width, unitCode: "E37" },
                height: { "@type": "QuantitativeValue", value: project.image.height, unitCode: "E37" },
                caption: alt,
                creator: { "@id": absoluteUrl("/#organization") },
                creditText: site.name,
                copyrightNotice: `© ${site.name}`,
              },
              artform: "Painted collectible statue",
              artMedium: "Painted resin",
              creator: { "@id": absoluteUrl("/#organization") },
              isPartOf: { "@id": absoluteUrl("/#webpage") },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                { "@type": "ListItem", position: 2, name: "Archive", item: absoluteUrl("/#archive") },
                { "@type": "ListItem", position: 3, name: project.name, item: url },
              ],
            },
          ],
        }}
      />
      <div className="wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#archive">Archive</Link>
            </li>
            <li aria-current="page">{project.name}</li>
          </ol>
        </nav>

        <div className="project-layout">
          <Image
            className="project-photo"
            src={project.image.src}
            alt={alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(max-width: 900px) 100vw, 55vw"
            preload
          />
          <div className="project-copy">
            <div className="eyebrow">
              Metalhed / {project.era === "earlier" ? "Earlier work" : "Project"}
            </div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <FullScreenButton image={project.image} alt={alt} />
            {project.process && (
              <details className="process">
                <summary>Behind the scenes / WIP</summary>
                <p>Process photography — not the finished piece.</p>
                <Image
                  src={project.process.src}
                  alt={`${project.name} work in progress`}
                  width={project.process.width}
                  height={project.process.height}
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </details>
            )}
            <p className="project-credit">
              Original sculpts credited to their respective creators where known. Metalhed
              showcases printing, preparation and painting.
            </p>
            <Link className="cta" href="/#commissions">
              Commission something like this ↗
            </Link>
          </div>
        </div>

        {previous && next && (
          <nav className="project-pager" aria-label="More work">
            <Link href={`/work/${previous.slug}`} rel="prev">
              <span>← Previous</span>
              <strong>{previous.name}</strong>
            </Link>
            <Link href={`/work/${next.slug}`} rel="next">
              <span>Next →</span>
              <strong>{next.name}</strong>
            </Link>
          </nav>
        )}
      </div>
    </article>
  );
}
