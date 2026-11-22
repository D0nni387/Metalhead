export const site = {
  name: "Metalhed",
  tagline: "Resin. Paint. Obsession.",
  url: "https://metalhed.co.uk",
  locale: "en_GB",
  description:
    "Metalhed is a UK-based independent painter of resin collectible statues and figures — monsters, sci-fi, wrestling icons and fantasy — taking commissions for custom pet statues and collectible painting.",
  shortDescription:
    "UK resin collectible statue and figure painting portfolio, open for commissions.",
  email: "metalhed@metalhed.co.uk",
  linktree: "https://linktr.ee/Metalhed",
  country: "GB",
} as const;

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
