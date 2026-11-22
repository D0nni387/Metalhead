"use client";

import { useState, type ReactNode } from "react";

type Filter = "all" | "recent" | "earlier";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "recent", label: "Recent" },
  { value: "earlier", label: "Earlier work" },
];

export function ArchiveGrid({
  items,
}: {
  items: { slug: string; era: "recent" | "earlier"; tile: ReactNode }[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [announced, setAnnounced] = useState("");
  const shown = items.filter((item) => filter === "all" || item.era === filter);

  const choose = (value: Filter) => {
    setFilter(value);
    const count = items.filter((item) => value === "all" || item.era === value).length;
    setAnnounced(`Showing ${count} ${count === 1 ? "piece" : "pieces"}`);
  };

  return (
    <>
      <div className="filters" role="group" aria-label="Filter archive">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`filter${filter === value ? " active" : ""}`}
            aria-pressed={filter === value}
            onClick={() => choose(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {announced}
      </p>
      <div className="grid">
        {shown.map((item) => (
          <div key={item.slug} style={{ display: "contents" }}>
            {item.tile}
          </div>
        ))}
      </div>
    </>
  );
}
