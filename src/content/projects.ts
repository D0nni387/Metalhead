export type ProjectImage = {
  src: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  era: "recent" | "earlier";
  featured: boolean;
  description: string;
  image: ProjectImage;
  process?: ProjectImage;
};

const image = (file: string, width: number, height: number): ProjectImage => ({
  src: `/images/${file}`,
  width,
  height,
});

export const projects: Project[] = [
  {
    slug: "biomechanical-xenomorph",
    name: "Biomechanical Xenomorph",
    era: "recent",
    featured: false,
    description:
      "A distinct biomechanical Xenomorph sculpt, finished with high-contrast colour.",
    image: image("biomechanical-xenomorph.webp", 845, 1500),
    process: image("work-in-progress.webp", 845, 1500),
  },
  {
    slug: "predator",
    name: "Predator",
    era: "recent",
    featured: true,
    description: "Painted collectible figure.",
    image: image("predator.webp", 852, 1500),
    process: image("predator-process.webp", 844, 1500),
  },
  {
    slug: "stone-cold-steve-austin",
    name: "Stone Cold Steve Austin",
    era: "recent",
    featured: true,
    description: "A larger-scale Attitude Era collectible.",
    image: image("stone-cold-steve-austin.webp", 1125, 1500),
  },
  {
    slug: "max-payne",
    name: "Max Payne",
    era: "recent",
    featured: false,
    description: "Painted collectible inspired by Max Payne.",
    image: image("max-payne.webp", 845, 1500),
  },
  {
    slug: "hornet",
    name: "Hornet",
    era: "recent",
    featured: true,
    description: "Hornet collectible statue — painted and finished by Metalhed.",
    image: image("hornet.webp", 1125, 1500),
    process: image("hornet-process.webp", 1500, 845),
  },
  {
    slug: "blaidd",
    name: "Blaidd",
    era: "recent",
    featured: true,
    description: "Blaidd collectible statue — painted and finished by Metalhed.",
    image: image("blaidd.webp", 844, 1500),
  },
  {
    slug: "gordon-freeman",
    name: "Gordon Freeman",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    image: image("gordon-freeman.webp", 844, 1500),
  },
  {
    slug: "cubone",
    name: "Cubone",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    image: image("cubone.webp", 843, 1500),
  },
  {
    slug: "john-constantine",
    name: "John Constantine",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    image: image("john-constantine.webp", 845, 1500),
  },
  {
    slug: "great-unclean",
    name: "Great Unclean",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    image: image("great-unclean.webp", 845, 1500),
  },
  {
    slug: "fighting-monkey",
    name: "Metalhed Original — Fighting Monkey",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    image: image("metalhed-original-fighting-monkey.webp", 1500, 845),
  },
  {
    slug: "rebecca-from-edgerunners",
    name: "Rebecca from Edgerunners",
    era: "recent",
    featured: false,
    description: "A newer Rebecca from Cyberpunk: Edgerunners.",
    image: image("rebecca-from-edgerunners.webp", 692, 1500),
  },
  {
    slug: "xenomorph",
    name: "Xenomorph",
    era: "recent",
    featured: true,
    description:
      "Finished Xenomorph statue — a separate sculpt from the biomechanical interpretation.",
    image: image("xenomorph.webp", 845, 1500),
  },
  {
    slug: "old-man-logan",
    name: "Old Man Logan",
    era: "recent",
    featured: false,
    description:
      "Old Man Logan collectible figure, painted and finished by Metalhed.",
    image: image("old-man-logan.webp", 844, 1500),
  },
  {
    slug: "libra",
    name: "Libra",
    era: "recent",
    featured: false,
    description: "Painted fantasy figure.",
    image: image("libra.webp", 1500, 1499),
  },
  {
    slug: "first-rebecca",
    name: "1st Rebecca",
    era: "earlier",
    featured: false,
    description: "The first Rebecca painting — part of the earlier work archive.",
    image: image("1st-rebecca.webp", 1125, 1500),
  },
  {
    slug: "robocop",
    name: "RoboCop",
    era: "recent",
    featured: true,
    description:
      "RoboCop collectible statue with a metallic blue-silver armour finish.",
    image: image("robocop.webp", 864, 1536),
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
};

export const projectTitle = (project: Project) =>
  `${project.name} — painted resin statue`;

const GENERIC_ARCHIVE_DESCRIPTION = "Earlier work from the archive.";

export const projectSummary = (project: Project) => {
  if (project.era === "earlier")
    return project.description === GENERIC_ARCHIVE_DESCRIPTION
      ? `${project.name} — an earlier piece from the Metalhed archive, by a UK collectible statue painter.`
      : `${project.name} — an earlier piece from the Metalhed archive. ${project.description}`;
  return `${project.name} by Metalhed, a UK collectible statue painter. ${project.description}`;
};
