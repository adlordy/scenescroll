export interface FrameStyle {
  top: string;
  "background-image": string;
  "background-position": string;
  "z-index": number;
}

export interface FrameInfo {
  frame: number;
  isActive: boolean;
  style: FrameStyle;
}

export interface SceneInfo {
  start: number;
  stop: number;
}

export interface ClipInfo {
  width: number;
  height: number;
  r_frame_rate: string;
  duration: string;
  nb_frames: string;
  frames: SceneInfo[];
}