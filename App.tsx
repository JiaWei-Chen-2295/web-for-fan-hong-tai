import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { SceneIntro } from './components/SceneIntro';
import { SceneCandle } from './components/SceneCandle';
import { SceneTimeline } from './components/SceneTimeline';
import { SceneLetter } from './components/SceneLetter';
import { SceneGift } from './components/SceneGift';
import { LoadingScreen } from './components/LoadingScreen';
import { TestPage } from './components/TestPage';
import { Scene } from './types';

// Custom hook to handle audio background (optional placeholder)
const useConcertAudio = (scene: Scene) => {
  // Placeholder for audio logic
};

export default function App() {
  // Check for test mode via query param OR environment variable
  const searchParams = new URLSearchParams(window.location.search);
  const isTestMode = searchParams.get('test') === 'true' || import.meta.env.VITE_APP_MODE === 'test';

  if (isTestMode) {
    return <TestPage />;
  }

  const [currentScene, setCurrentScene] = useState<Scene>(Scene.Intro);
  const [displayedScene, setDisplayedScene] = useState<Scene>(Scene.Intro);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sceneContainerRef = useRef<HTMLDivElement>(null);

  useConcertAudio(currentScene);

  const nextScene = useCallback(() => {
    if (currentScene < Scene.Gift && !isTransitioning) {
      setDirection(1);
      setCurrentScene(prev => prev + 1);
    }
  }, [currentScene, isTransitioning]);

  const handleReplay = useCallback(() => {
    if (!isTransitioning) {
      setDirection(-1);
      setCurrentScene(Scene.Intro);
    }
  }, [isTransitioning]);

  // Scene transition via GSAP (replaces AnimatePresence mode="wait")
  useEffect(() => {
    if (currentScene === displayedScene) return;
    if (!sceneContainerRef.current) return;

    setIsTransitioning(true);

    // Exit animation
    gsap.to(sceneContainerRef.current, {
      opacity: 0,
      filter: 'blur(20px)',
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        // Swap the scene content
        setDisplayedScene(currentScene);

        // Enter animation (needs a frame for React to render new content)
        requestAnimationFrame(() => {
          gsap.fromTo(sceneContainerRef.current,
            { opacity: 0, filter: 'blur(10px)', scale: 1.05 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
              duration: 0.8,
              ease: 'expo.out',
              onComplete: () => setIsTransitioning(false),
            },
          );
        });
      },
    });
  }, [currentScene, displayedScene]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const renderScene = () => {
    const props = { onNext: nextScene, onReplay: handleReplay, isActive: true };
    switch (displayedScene) {
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

      <div
        ref={sceneContainerRef}
        className="w-full h-full"
      >
        {renderScene()}
      </div>

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
