import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

async function loadDisplayFont() {
  "use cache";
  const font = await readFile(join(process.cwd(), "src/assets/fonts/BarlowCondensed-ExtraBold.ttf"));
  return font.toString("base64");
}

export async function renderBrandIcon(size: number) {
  const font = await loadDisplayFont();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0b090c",
          color: "#ff2aa4",
          fontFamily: "Barlow Condensed",
          fontSize: size * 0.82,
          lineHeight: 1,
          paddingBottom: size * 0.04,
        }}
      >
        M
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Barlow Condensed", data: Buffer.from(font, "base64"), weight: 800, style: "normal" }],
    },
  );
}
