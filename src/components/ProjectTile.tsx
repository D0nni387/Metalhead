import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectTile({ project }: { project: Project }) {
  return (
    <Link className="tile" href={`/work/${project.slug}`}>
      <figure>
        <Image
          src={project.image.src}
          alt={`${project.name}, painted by Metalhed`}
          width={project.image.width}
          height={project.image.height}
          sizes="(max-width: 900px) 50vw, 33vw"
        />
      </figure>
      <strong>{project.name}</strong>
    </Link>
  );
}
