// Copy this entry's news image to the output directory.
// The image sums up the world news of 26 November 2026: a fuel tanker
// explosion on a highway near Cairo, a drone attack on Kuwait City, a
// missile strike on a shopping centre in Kyiv, an oil tanker burning in
// the Strait of Hormuz, a storm postponing New York's Thanksgiving Day
// Parade, and an Ebola clinic in DR Congo as cases pass 12,000. It is
// stored as entry.png (a JPEG under a .png name is fine: the competition
// tells the format apart by the file's magic bytes). The copy is byte
// for byte: the image is delivered exactly as generated, with no
// re-encoding at run time.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const data = readFileSync(join(here, "entry.png"));
// The competition caps the image at 1 MiB; fail loudly instead of
// shipping a file the gate would reject. The check runs before any
// output is written, so a bad image never reaches the output directory.
if (data.length > 1024 * 1024) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB cap`);
}
const isPng = data.subarray(0, 8).equals(
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
); // PNG signature
const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff; // JPEG SOI marker
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG by its magic bytes");
}
writeFileSync(join(outDir, "entry.png"), Buffer.from(data));
console.log(`wrote ${join(outDir, "entry.png")} (${data.length} bytes, ${isPng ? "PNG" : "JPEG"})`);
