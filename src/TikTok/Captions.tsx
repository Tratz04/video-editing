import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import captionsJson from "./captions.json";

const captions: Caption[] = captionsJson;

// Words spoken within this many ms of each other are shown on the same page.
const COMBINE_WITHIN_MS = 1200;

export const Captions: React.FC<{ readonly startSec: number }> = ({
  startSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: COMBINE_WITHIN_MS,
      }),
    [],
  );

  // Captions are timed against the full source video.
  const nowMs = startSec * 1000 + (frame / fps) * 1000;
  const page = pages.find(
    (p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs,
  );
  if (!page) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 flex justify-center px-20 text-center"
      style={{ top: 1380 }}
    >
      <div
        className="font-sans text-[84px] font-black uppercase leading-tight"
        style={{
          WebkitTextStroke: "14px black",
          paintOrder: "stroke",
          textShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        {page.tokens.map((token) => {
          const active = nowMs >= token.fromMs && nowMs < token.toMs;
          return (
            <span
              key={token.fromMs}
              style={{
                color: active ? "#ffe500" : "white",
                whiteSpace: "pre",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
