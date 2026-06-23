'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('GF_STATUS: INITIALIZING');
  const { resolvedTheme } = useTheme();

  const loadingSteps = [
    { target: 15, text: 'GF_STATUS: BOOTING_CORE_SYSTEM' },
    { target: 35, text: 'GF_STATUS: LOADING_SYSTEM_ASSETS' },
    { target: 55, text: 'GF_STATUS: SYNCING_CONCLAVE_TIMELINE' },
    { target: 80, text: 'GF_STATUS: COALESCING_SMITH_COORDINATES' },
    { target: 95, text: 'GF_STATUS: TEMPERING_LAYOUT' },
    { target: 100, text: 'GF_STATUS: FORGE_ACTIVE' },
  ];

  useEffect(() => {
    let currentStepIndex = 0;
    let timer: NodeJS.Timeout;

    const runStep = () => {
      if (currentStepIndex < loadingSteps.length) {
        const step = loadingSteps[currentStepIndex];
        setProgress(step.target);
        setStatusText(step.text);
        currentStepIndex++;
        
        const delay = 150 + Math.random() * 200;
        timer = setTimeout(runStep, delay);
      } else {
        setProgress(100);
        setStatusText('GF_STATUS: FORGE_ACTIVE');
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
      }
    };

    timer = setTimeout(runStep, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  // Segmented progress blocks (20 blocks total)
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center font-mono select-none px-6 bg-background`}>
      <div className="w-full max-w-md border border-outline-variant p-8 relative bg-surface-container-low">
        {/* Technical Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-tertiary" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-tertiary" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-secondary" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-secondary" />

        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
            {/* Industrial Spinning Frames */}
            <div className="absolute inset-0 border border-outline-variant/60 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-2 border border-dashed border-tertiary/30 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            
            {/* The Logo */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxZVETh4X_svRmDPTcf37f6591KVsra3YltQfjDIZnk6WwJN5OBr5S4psWyUOTZOFomUQzUQP6YlPaTlgA9t5DFSelaS_WZpN7OvrdNzc_HQKvhkFPXT9a6vKa8mJWezThEyq-9C4GFYddiiGXOXmuIUNZ85JvW_To-XdebYjdI5raZQm7SkN3Lbf0SGahVLV9el8ILOVSEm0676lNvJHhtR-bF4OS8HLzOCOoxP_EFH6sjOnlcyeX4dZnFYkJnJf4FXx4DYHs70Q"
              alt="The Game Forge Anvil Logo"
              className="w-11 h-11 object-contain pixelated relative z-10 animate-pulse"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <h2 className="text-white text-lg font-bold tracking-widest uppercase">THE GAME FORGE</h2>
          <p className="text-on-surface-variant text-[9px] tracking-wider mt-1">[ SYSTEM_INITIATION_SEQUENCE ]</p>
        </div>

        {/* Status Code Block */}
        <div className="bg-surface-container-lowest border border-outline-variant/35 p-4 mb-6">
          <div className="text-[10px] text-on-surface-variant flex justify-between mb-2">
            <span>LOADER_DAEMON: v2.6.23</span>
            <span className="text-tertiary font-bold">{progress}%</span>
          </div>
          <div className="text-xs text-white uppercase tracking-wide whitespace-normal break-words">
            {statusText}
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="flex gap-1 justify-between mb-3">
          {Array.from({ length: totalBlocks }).map((_, idx) => (
            <div
              key={idx}
              className={`h-4 flex-1 border transition-all duration-300 ${
                idx < filledBlocks
                  ? 'bg-secondary border-secondary shadow-[0_0_8px_rgba(172,1,44,0.5)]'
                  : 'bg-transparent border-outline-variant/30'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-[8px] text-on-surface-variant uppercase tracking-widest">
          <span>COAST_GRID_STABLE</span>
          <span>EST_HEAT: TEMPERATE</span>
        </div>
      </div>
    </div>
  );
}