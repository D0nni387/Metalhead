import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

const publicFile = (src: string) => join(process.cwd(), "public", src.replace(/^\//, ""));

async function loadShareAssets(photoSrc: string) {
  "use cache";
  const { width, height } = SHARE_IMAGE_SIZE;
  const photo = await readFile(publicFile(photoSrc));

  const background = await sharp(photo)
    .resize(width, height, { fit: "cover", position: "attention" })
    .blur(28)
    .modulate({ brightness: 0.35 })
    .toBuffer();
  const foreground = await sharp(photo)
    .resize(500, height - 60, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  const canvas = await sharp(background)
    .composite([
      {
        input: foreground.data,
        top: Math.round((height - foreground.info.height) / 2),
        left: width - foreground.info.width - 40,
      },
    ])
    .png()
    .toBuffer();

  const logo = await sharp(await readFile(publicFile("/images/logo.webp")))
    .resize(300)
    .png()
    .toBuffer();
  const font = await readFile(join(process.cwd(), "src/assets/fonts/BarlowCondensed-ExtraBold.ttf"));

  return {
    canvas: `data:image/png;base64,${canvas.toString("base64")}`,
    logo: `data:image/png;base64,${logo.toString("base64")}`,
    font: font.toString("base64"),
  };
}

export async function renderShareImage({
  photoSrc,
  eyebrow,
  title,
}: {
  photoSrc: string;
  eyebrow: string;
  title: string;
}) {
  const { canvas, logo, font } = await loadShareAssets(photoSrc);
  const { width, height } = SHARE_IMAGE_SIZE;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width, height, position: "relative", background: "#0b090c" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={canvas} width={width} height={height} alt="" style={{ position: "absolute" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 580,
            height,
            padding: "56px 0 56px 64px",
            fontFamily: "Barlow Condensed",
            color: "#f1e9ed",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={300} height={143} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#ff2aa4", fontSize: 30, letterSpacing: 3, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div
              style={{
                fontSize: title.length > 24 ? 72 : 96,
                lineHeight: 0.95,
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", height: 6, width: 160, background: "#ff2aa4" }} />
        </div>
      </div>
    ),
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [{ name: "Barlow Condensed", data: Buffer.from(font, "base64"), weight: 800, style: "normal" }],
    },
  );
}
