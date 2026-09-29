import { z } from "zod";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const tikTokClipSchema = z.object({
  src: z.string(),
  start: z.number(),
  end: z.number(),
  title: z.string(),
  // "blur": whole 16:9 frame centered over a blurred copy of itself.
  // "crop": fill the 9:16 frame by cropping the sides.
  layout: z.enum(["blur", "crop"]),
  // Horizontal focus for "crop", 0 = left edge, 50 = center, 100 = right edge.
  cropFocus: z.number().min(0).max(100),
  partLabel: z.string(),
});

export type TikTokClipProps = z.infer<typeof tikTokClipSchema>;

const fill: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const Hook: React.FC<{ title: string; partLabel: string }> = ({
  title,
  partLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div
      className="absolute left-0 right-0 flex flex-col items-center px-16"
      style={{ top: 220, transform: `scale(${pop})` }}
    >
      {title ? (
        <div
          className="rounded-3xl bg-white px-10 py-6 text-center font-sans text-[64px] font-extrabold leading-tight text-black"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
        >
          {title}
        </div>
      ) : null}
      {partLabel ? (
        <div className="mt-6 rounded-full bg-[#fe2c55] px-8 py-3 font-sans text-[40px] font-bold text-white">
          {partLabel}
        </div>
      ) : null}
    </div>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/25">
      <div className="h-full bg-[#25f4ee]" style={{ width: `${progress}%` }} />
    </div>
  );
};

export const TikTokClip: React.FC<TikTokClipProps> = ({
  src,
  start,
  end,
  title,
  layout,
  cropFocus,
  partLabel,
}) => {
  const { fps } = useVideoConfig();
  const videoSrc = src.startsWith("http") ? src : staticFile(src);
  const trimBefore = Math.round(start * fps);
  const trimAfter = Math.round(end * fps);

  return (
    <AbsoluteFill className="bg-black">
      {layout === "blur" ? (
        <>
          <AbsoluteFill>
            <OffthreadVideo
              src={videoSrc}
              trimBefore={trimBefore}
              trimAfter={trimAfter}
              muted
              style={{
                ...fill,
                filter: "blur(40px) brightness(0.55)",
                transform: "scale(1.15)",
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill className="items-center justify-center">
            <OffthreadVideo
              src={videoSrc}
              trimBefore={trimBefore}
              trimAfter={trimAfter}
              style={{ width: "100%" }}
            />
          </AbsoluteFill>
        </>
      ) : (
        <AbsoluteFill>
          <OffthreadVideo
            src={videoSrc}
            trimBefore={trimBefore}
            trimAfter={trimAfter}
            style={{ ...fill, objectPosition: `${cropFocus}% 50%` }}
          />
        </AbsoluteFill>
      )}
      <Hook title={title} partLabel={partLabel} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
