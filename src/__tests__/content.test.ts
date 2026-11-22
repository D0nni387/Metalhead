import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { getAdjacentProjects, projects } from "@/content/projects";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms";

describe("projects", () => {
  it("have unique URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("point at images that exist with the declared dimensions", async () => {
    const images = projects.flatMap((p) => [p.image, p.process].filter((i) => i !== undefined));
    for (const image of images) {
      const meta = await sharp(readFileSync(join(process.cwd(), "public", image.src))).metadata();
      expect([image.src, meta.width, meta.height]).toEqual([image.src, image.width, image.height]);
    }
  });

  it("wrap around for previous and next", () => {
    const first = projects[0].slug;
    expect(getAdjacentProjects(first).previous?.slug).toBe(projects.at(-1)?.slug);
  });
});

describe("llms.txt", () => {
  it("follows the llms.txt shape and links every piece", () => {
    const text = buildLlmsTxt();
    expect(text).toMatch(/^# Metalhed\n\n> /);
    for (const project of projects) expect(text).toContain(`https://metalhed.co.uk/work/${project.slug}`);
  });

  it("puts every piece and image in the full version", () => {
    const text = buildLlmsFullTxt();
    for (const project of projects) {
      expect(text).toContain(`### ${project.name}`);
      expect(text).toContain(`https://metalhed.co.uk${project.image.src}`);
    }
  });
});
