import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { clips, SOURCE_VIDEO } from "./TikTok/clips";
import { TikTokClip, tikTokClipSchema } from "./TikTok/TikTokClip";

const TIKTOK_FPS = 30;

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />

      {/* One vertical 1080x1920 composition per entry in src/TikTok/clips.json */}
      {clips.map((clip, i) => (
        <Composition
          key={clip.id}
          id={clip.id}
          component={TikTokClip}
          schema={tikTokClipSchema}
          durationInFrames={Math.max(
            1,
            Math.round((clip.end - clip.start) * TIKTOK_FPS),
          )}
          fps={TIKTOK_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            src: SOURCE_VIDEO,
            start: clip.start,
            end: clip.end,
            title: clip.title,
            layout: "blur" as const,
            cropFocus: 50,
            partLabel: clips.length > 1 ? `Part ${i + 1}/${clips.length}` : "",
          }}
        />
      ))}
    </>
  );
};
