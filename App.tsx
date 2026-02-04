import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneIntro } from './components/SceneIntro';
import { SceneCandle } from './components/SceneCandle';
import { SceneTimeline } from './components/SceneTimeline';
import { SceneLetter } from './components/SceneLetter';
import { SceneGift } from './components/SceneGift';
import { LoadingScreen } from './components/LoadingScreen';
import { Scene } from './types';

// Custom hook to handle audio background (optional placeholder)
const useConcertAudio = (scene: Scene) => {
  // Placeholder for audio logic
};

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene>(Scene.Intro);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useConcertAudio(currentScene);

  const nextScene = () => {
    if (currentScene < Scene.Gift) {
      setDirection(1);
      setCurrentScene(prev => prev + 1);
    }
  };

  const handleReplay = () => {
    setDirection(-1);
    setCurrentScene(Scene.Intro);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const renderScene = () => {
    const props = { onNext: nextScene, onReplay: handleReplay, isActive: true };
    switch (currentScene) {
      case Scene.Intro: return <SceneIntro {...props} />;
      case Scene.Candle: return <SceneCandle {...props} />;
      case Scene.Timeline: return <SceneTimeline {...props} />;
      case Scene.Letter: return <SceneLetter {...props} />;
      case Scene.Gift: return <SceneGift {...props} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans select-none">
      {/* Global Grain Overlay for Cinematic Feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="w-full h-full"
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.95, transition: { duration: 0.5 } }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>

      {/* Progress / Stage Indicator */}
      <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${i === currentScene ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}