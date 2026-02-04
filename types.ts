export enum Scene {
  Intro = 0,
  Candle = 1,
  Timeline = 2,
  Letter = 3,
  Gift = 4
}

export interface TransitionProps {
  onNext: () => void;
  onReplay?: () => void;
  isActive: boolean;
}