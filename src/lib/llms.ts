import { projects, projectSummary } from "@/content/projects";
import { absoluteUrl, site } from "@/content/site";
import { ENQUIRY_TYPES, FILE_LIMITS, formatBytes } from "@/lib/contact/rules";

const workLink = (slug: string) => absoluteUrl(`/work/${slug}`);

const intro = () => `# ${site.name}

> ${site.description}

${site.name} is a one-person studio in the United Kingdom. The work covers resin 3D printing, preparation, airbrushing and hand painting of collectible statues and figures, mostly monsters, sci-fi, wrestling icons and fantasy characters. Original sculpts belong to their respective creators; ${site.name} showcases the printing, preparation and painting.

Commissions: ${ENQUIRY_TYPES.slice(0, 2).join(" and ").toLowerCase()} are taken through the enquiry form at ${absoluteUrl("/#commissions")}, which accepts up to ${FILE_LIMITS.maxFiles} reference photos or PDFs (${formatBytes(FILE_LIMITS.maxFileBytes)} each). Contact: ${site.email}. Socials: ${site.linktree}.`;

export const buildLlmsTxt = () => `${intro()}

## Recent work

${projects
  .filter((project) => project.era === "recent")
  .map((project) => `- [${project.name}](${workLink(project.slug)}): ${project.description}`)
  .join("\n")}

## Contact

- [Commission enquiry form](${absoluteUrl("/#commissions")}): Pet statues, collectible painting and anything else
- [Email](mailto:${site.email})
- [Linktree](${site.linktree}): Socials

## Optional

${projects
  .filter((project) => project.era === "earlier")
  .map((project) => `- [${project.name}](${workLink(project.slug)}): Earlier work from the archive`)
  .join("\n")}
- [Full text for LLMs](${absoluteUrl("/llms-full.txt")}): Every piece with its description and image
`;

export const buildLlmsFullTxt = () => `${intro()}

## Pieces

${projects
  .map(
    (project) => `### ${project.name}

- URL: ${workLink(project.slug)}
- Image: ${absoluteUrl(project.image.src)}${project.process ? `\n- Work-in-progress photo: ${absoluteUrl(project.process.src)}` : ""}
- Period: ${project.era === "earlier" ? "Earlier work" : "Recent work"}${project.featured ? " (featured)" : ""}

${projectSummary(project)}`,
  )
  .join("\n\n")}
`;
