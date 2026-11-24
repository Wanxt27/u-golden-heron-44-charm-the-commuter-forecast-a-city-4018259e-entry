import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One-line weather forecast for Velmora, a city that does not exist:
// 127 characters, one line, no trailing newline in the file.
const FORECAST =
  "Good morning, Velmora: light drizzle, a 90% chance of an empty seat, and the 8:04 bus is running exactly on hope. Bring a book.";

const MAX_CHARS = 140;

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(
      `forecast must be 1-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (line.trim() !== line) {
    throw new Error("forecast must not start or end with whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("forecast must be a single line");
  }
}

validate(FORECAST);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, FORECAST, "utf8");

// Read the file back and re-check it, so a silent write failure or a
// stray trailing newline can never ship as a valid-looking entry.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== FORECAST) {
  throw new Error("written entry.txt does not match the forecast");
}
validate(written);
console.log(`wrote ${[...FORECAST].length}-char forecast to ${outDir}/entry.txt`);
