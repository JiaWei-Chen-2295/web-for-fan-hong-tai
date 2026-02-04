export enum Scene {
  Intro = 0,
  Candle = 1,
  Timeline = 2,
  BirdNest = 3,
  Letter = 4,
  Gift = 5
}

export interface TransitionProps {
  onNext: () => void;
  onReplay?: () => void;
  isActive: boolean;
}