// Render every clip in src/TikTok/clips.json to out/clips/<id>.mp4.
// Extra args are forwarded to `remotion render`, e.g. --props='{"layout":"crop"}'
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const clips = JSON.parse(readFileSync("src/TikTok/clips.json", "utf8"));
if (clips.length === 0) {
  console.error(
    "No clips. Run `npm run clips:split` or edit src/TikTok/clips.json first.",
  );
  process.exit(1);
}
for (const clip of clips) {
  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      "src/index.ts",
      clip.id,
      `out/clips/${clip.id}.mp4`,
      ...process.argv.slice(2),
    ],
    { stdio: "inherit" },
  );
}
