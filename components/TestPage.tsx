import React, { useState, useRef } from 'react';
import { useHoverTap } from '../hooks/useHoverTap';
import { SceneCandleTest } from './SceneCandleTest';

export const TestPage: React.FC = () => {
    const [candleActive, setCandleActive] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useHoverTap(buttonRef, { scale: 1.05 }, { scale: 0.95 });

    return (
        <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center">
            {/* Only Candle - No Header, No Fonts, No Status */}
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
                <div className="flex-1 w-full bg-transparent overflow-hidden relative flex items-center justify-center">
                    <SceneCandleTest
                        onNext={() => {}}
                        isActive={candleActive}
                    />
                </div>

                {/* Extinguish Button */}
                <div className="flex justify-center p-4">
                    <button
                        ref={buttonRef}
                        onClick={() => {
                            if (candleActive) {
                                setCandleActive(false);
                                setTimeout(() => setCandleActive(true), 5000);
                            }
                        }}
                        className={`px-6 py-2 border rounded-full text-white font-bold tracking-wider transition-colors ${
                            candleActive
                                ? 'bg-white/10 border-white/20 hover:bg-white/20'
                                : 'bg-gray-700/50 border-gray-600/50 cursor-not-allowed'
                        }`}
                        disabled={!candleActive}
                    >
                        {candleActive ? '熄灭蜡烛' : '蜡烛已熄灭'}
                    </button>
                </div>
            </div>
        </div>
    );
};
