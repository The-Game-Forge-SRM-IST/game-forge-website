'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // IMMEDIATE scroll detection setup
        let hasTriggered = false;

        const immediateScrollStart = () => {
            if (hasTriggered) return;
            hasTriggered = true;

            console.log('🎵 SCROLL TRIGGERED - Calling manualPlay logic!');
            
            // Just call the same function that works for manual play
            manualPlay();
        };

        // Add scroll listeners IMMEDIATELY (desktop + mobile)
        window.addEventListener('scroll', immediateScrollStart, { passive: true });
        document.addEventListener('scroll', immediateScrollStart, { passive: true });
        window.addEventListener('wheel', immediateScrollStart, { passive: true });
        document.addEventListener('wheel', immediateScrollStart, { passive: true });
        // Mobile touch scroll
        window.addEventListener('touchmove', immediateScrollStart, { passive: true });
        document.addEventListener('touchmove', immediateScrollStart, { passive: true });

        console.log('🔧 Scroll listeners added immediately');

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', immediateScrollStart);
            document.removeEventListener('scroll', immediateScrollStart);
            window.removeEventListener('wheel', immediateScrollStart);
            document.removeEventListener('wheel', immediateScrollStart);
            window.removeEventListener('touchmove', immediateScrollStart);
            document.removeEventListener('touchmove', immediateScrollStart);
        };
    }, []);

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const newMutedState = !isMuted;
        audio.muted = newMutedState;
        setIsMuted(newMutedState);
    };

    const manualPlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            audio.volume = 0.3;
            audio.muted = false;
            await audio.play();
            setIsPlaying(true);
            console.log('🎵 Music started successfully!');
        } catch (error) {
            console.error('Play failed:', error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 shadow-lg border border-white/10">
                <audio
                    ref={audioRef}
                    preload="auto"
                    loop
                >
                    <source src="/C418  - Sweden - Minecraft Volume Alpha.mp3" type="audio/mpeg" />
                    <source src="/C418%20-%20Sweden%20-%20Minecraft%20Volume%20Alpha.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>

                {!isPlaying && (
                    <button
                        onClick={manualPlay}
                        className="text-white hover:text-green-400 transition-colors p-1"
                        aria-label="Start background music"
                        title="Click to start music"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                )}

                <button
                    onClick={toggleMute}
                    className="text-white hover:text-green-400 transition-colors p-1"
                    aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
                    title={isMuted ? 'Unmute music' : 'Mute music'}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </button>

                <div className="text-white/70 text-xs font-medium">
                    C418 - Sweden
                </div>
            </div>
        </div>
    );
}