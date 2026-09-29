// Fill src/TikTok/clips.json by splitting public/source.mp4 into equal parts.
// Usage: node scripts/split-clips.mjs [secondsPerClip=60]
// Edit clips.json afterwards to pick your own highlights and hook titles.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const perClip = Number(process.argv[2] ?? 60);
const out = execFileSync(
  "npx",
  [
    "remotion",
    "ffprobe",
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    "public/source.mp4",
  ],
  { encoding: "utf8" },
);
const duration = parseFloat(out.trim().split("\n").pop());
if (!Number.isFinite(duration))
  throw new Error(`Could not read duration: ${out}`);

const clips = [];
for (let start = 0, i = 1; start < duration - 5; start += perClip, i++) {
  const end = Math.min(start + perClip, duration);
  clips.push({
    id: `clip-${String(i).padStart(2, "0")}`,
    start,
    end: +end.toFixed(2),
    title: "",
  });
}
writeFileSync("src/TikTok/clips.json", JSON.stringify(clips, null, 2) + "\n");
console.log(
  `Wrote ${clips.length} clips (${duration.toFixed(1)}s source) to src/TikTok/clips.json`,
);
