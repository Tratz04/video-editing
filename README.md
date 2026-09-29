# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## TikTok clips

Turn a long 16:9 video into vertical 1080x1920 clips. Each clip gets burned-in captions, a hook title, a "Part X/N" badge and a progress bar.

1. Download the source video to `public/source.mp4`. This needs `yt-dlp` (`pip install yt-dlp`). You can also copy any mp4 there yourself.

   ```console
   npm run clips:fetch -- "https://youtu.be/K7LeSv9RzVw"
   ```

2. Auto-caption it (optional). This needs `pip install faster-whisper`. The Whisper model is downloaded from huggingface.co the first time. Pass a model size and a language if you want, e.g. `-- medium en`:

   ```console
   npm run clips:captions
   ```

   This writes word-level timings to `src/TikTok/captions.json`. Every clip then shows TikTok-style captions with the spoken word highlighted. To turn them off, pass `--props='{"showCaptions":false}'` when rendering.

3. Split it into clips. The default is 60 seconds each; pass another length if you want one:

   ```console
   npm run clips:split -- 45
   ```

   Then edit `src/TikTok/clips.json` to keep only the best moments. Change the `start`/`end` seconds and add a hook `title` to each clip. Preview them with `npm run dev`.

4. Render every clip to `out/clips/<id>.mp4`:

   ```console
   npm run clips:render
   ```

   By default the whole frame sits on a blurred background. To fill the screen by cropping the sides instead, run `npm run clips:render -- --props='{"layout":"crop","cropFocus":50}'`.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
