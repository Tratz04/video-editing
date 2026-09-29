import clipsJson from "./clips.json";

export type ClipDef = {
  /** Used as the composition id and output file name. Letters, numbers and dashes only. */
  readonly id: string;
  /** Start time in the source video, in seconds. */
  readonly start: number;
  /** End time in the source video, in seconds. */
  readonly end: number;
  /** Hook text shown at the top of the clip. Leave empty to hide. */
  readonly title: string;
};

export const SOURCE_VIDEO = "source.mp4";

export const clips: ClipDef[] = clipsJson;
