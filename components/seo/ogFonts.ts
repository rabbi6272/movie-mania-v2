import { readFile } from "node:fs/promises";
import path from "node:path";

type FontFile = "Nunito-Regular.ttf" | "Nunito-ExtraBold.ttf";

const OG_FONT_FILES: FontFile[] = ["Nunito-Regular.ttf", "Nunito-ExtraBold.ttf"];
const cache = new Map<FontFile, Promise<ArrayBuffer>>();

function loadFont(file: FontFile) {
  let pending = cache.get(file);
  if (!pending) {
    pending = readFile(path.join(process.cwd(), "public/fonts", file)).then((buffer) =>
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer,
    );
    cache.set(file, pending);
  }
  return pending;
}

export interface OgFont {
  name: "Nunito";
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 800;
}

/**
 * Nunito ships as a variable font, which satori cannot parse. These are static
 * fontTools instances (subset to latin) generated from public/fonts/Nunito.ttf.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [regular, extraBold] = await Promise.all(OG_FONT_FILES.map(loadFont));
  return [
    { name: "Nunito", data: regular, style: "normal", weight: 400 },
    { name: "Nunito", data: extraBold, style: "normal", weight: 800 },
  ];
}
