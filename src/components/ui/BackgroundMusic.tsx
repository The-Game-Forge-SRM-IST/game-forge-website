'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;

        const startOnInteraction = async () => {
            // "Autoplay" strategy:
            // Browser policy prevents automatic audio without interaction.
            // We listen for the FIRST user interaction anywhere to trigger the music.

            if (audio && audio.paused) {
                console.log('User interacted, attempting to start music...');
                try {
                    // Lazy load if needed
                    if (!audio.src) {
                        audio.src = "/C418  - Sweden - Minecraft Volume Alpha.mp3";
                        audio.load();
                    }

                    // Try to play
                    await audio.play();
                    setIsPlaying(true);
                    console.log('🎵 Autoplay success after interaction');
                } catch (error) {
                    console.log("Autoplay prevented even after interaction (rare):", error);
                }
            }

            // Remove the listener immediately to essentially "run once"
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };

        // Add listeners for any interaction
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);

        // Attempt "true" autoplay just in case the browser allows it (e.g. user already interacted with domain previously)
        const attemptInstantPlay = async () => {
            if (audio && audio.paused) {
                try {
                    if (!audio.src) audio.src = "/C418  - Sweden - Minecraft Volume Alpha.mp3";
                    await audio.play();
                    setIsPlaying(true);
                } catch (e) {
                    // Expected failure, wait for interaction
                }
            }
        };
        attemptInstantPlay();

        return () => {
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
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

        console.log('📱 MANUAL PLAY BUTTON CLICKED');

        try {
            // Mobile-optimized play sequence

            // LAZY LOAD: Only set source when user clicks play
            if (!audio.src) {
                console.log('📥 Lazy loading audio...');
                audio.src = "/C418  - Sweden - Minecraft Volume Alpha.mp3";
            }

            audio.load(); // Force reload

            // Start muted for mobile compatibility
            audio.muted = true;
            audio.volume = 0.3;

            console.log('▶️ Starting muted play...');
            await audio.play();

            // Unmute after successful start
            setTimeout(() => {
                audio.muted = false;
                console.log('🔊 Audio unmuted');
            }, 200);

            setIsPlaying(true);
            console.log('✅ Manual music started successfully!');
        } catch (error) {
            console.error('❌ Manual play failed:', error);

            // Fallback: try direct unmuted play
            try {
                audio.muted = false;
                await audio.play();
                setIsPlaying(true);
                console.log('✅ Fallback play succeeded!');
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 md:p-3 flex items-center gap-1 md:gap-2 shadow-lg border border-white/10">
                <audio
                    ref={audioRef}
                    preload="none"
                    loop
                >
                    {/* Source will be added dynamically when play is requested to prevent initial download */}
                </audio>

                {!isPlaying && (
                    <button
                        onClick={manualPlay}
                        onTouchStart={manualPlay}
                        className="text-white hover:text-green-400 active:text-green-300 transition-colors p-1 md:p-1 bg-green-600/20 hover:bg-green-600/30 rounded-full animate-pulse"
                        aria-label="Start background music"
                        title="Tap to start music"
                        style={{ touchAction: 'manipulation' }}
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                )}

                <button
                    onClick={toggleMute}
                    className="text-white hover:text-green-400 transition-colors p-0.5 md:p-1"
                    aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
                    title={isMuted ? 'Unmute music' : 'Mute music'}
                >
                    {isMuted ? (
                        <VolumeX className="w-3 h-3 md:w-5 md:h-5" />
                    ) : (
                        <Volume2 className="w-3 h-3 md:w-5 md:h-5" />
                    )}
                </button>

                <div className="text-white/70 text-xs md:text-xs font-medium">
                    {!isPlaying ? (
                        <span className="hidden sm:inline">Click ▶️ for music</span>
                    ) : (
                        <span className="hidden sm:inline">C418 - Sweden</span>
                    )}
                    {/* Mobile: Show shorter text */}
                    {!isPlaying ? (
                        <span className="sm:hidden animate-pulse">Tap ▶️</span>
                    ) : (
                        <span className="sm:hidden">Sweden</span>
                    )}
                </div>
            </div>
        </div>
    );
}