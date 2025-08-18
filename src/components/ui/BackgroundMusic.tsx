'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Use preloaded audio if available
        const preloadedAudio = (window as any).__preloadedAudio;
        if (preloadedAudio && audioRef.current) {
            console.log('🎵 Using preloaded audio from loading screen');
            audioRef.current.src = preloadedAudio.src;
            audioRef.current.load();
        }

        let hasTriggered = false;

        // Mobile-optimized audio starter
        const startOnInteraction = async (event: Event) => {
            if (hasTriggered) return;
            hasTriggered = true;

            console.log('📱 MOBILE INTERACTION DETECTED:', event.type, 'isTrusted:', event.isTrusted);

            const audio = audioRef.current;
            if (audio) {
                console.log('🔍 Audio state before play:', {
                    readyState: audio.readyState,
                    paused: audio.paused,
                    src: audio.src,
                    currentSrc: audio.currentSrc
                });

                try {
                    // Mobile-specific: Start with muted play first
                    audio.muted = true;
                    audio.volume = 0.3;

                    // Ensure audio is loaded
                    if (audio.readyState < 2) {
                        console.log('⏳ Audio not ready, loading...');
                        audio.load();
                        await new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => reject(new Error('Load timeout')), 5000);
                            const onCanPlay = () => {
                                clearTimeout(timeout);
                                audio.removeEventListener('canplay', onCanPlay);
                                audio.removeEventListener('error', onError);
                                resolve(true);
                            };
                            const onError = (e: Event) => {
                                clearTimeout(timeout);
                                audio.removeEventListener('canplay', onCanPlay);
                                audio.removeEventListener('error', onError);
                                reject(e);
                            };
                            audio.addEventListener('canplay', onCanPlay);
                            audio.addEventListener('error', onError);
                        });
                    }

                    console.log('▶️ Starting muted play for mobile...');
                    await audio.play();

                    // Unmute after successful start
                    setTimeout(() => {
                        audio.muted = false;
                        console.log('🔊 Unmuted audio');
                    }, 100);

                    setIsPlaying(true);
                    console.log('✅ Mobile music started from', event.type);
                } catch (error) {
                    console.error('❌ Mobile music failed:', error);
                    console.log('🔍 Final audio state:', {
                        readyState: audio.readyState,
                        paused: audio.paused,
                        error: audio.error,
                        networkState: audio.networkState
                    });
                }
            } else {
                console.error('❌ Audio element not found!');
            }
        };

        // Add multiple mobile-friendly event listeners
        const events = [
            { type: 'click', options: { once: true } },
            { type: 'touchstart', options: { once: true, passive: false } },
            { type: 'touchend', options: { once: true, passive: false } },
            { type: 'touchmove', options: { once: true, passive: false } },
            { type: 'pointerdown', options: { once: true } },
            { type: 'keydown', options: { once: true } }
        ];

        events.forEach(({ type, options }) => {
            document.addEventListener(type, startOnInteraction, options);
        });

        console.log('🔧 Click-anywhere music enabled');

        return () => {
            events.forEach(({ type }) => {
                document.removeEventListener(type, startOnInteraction);
            });
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