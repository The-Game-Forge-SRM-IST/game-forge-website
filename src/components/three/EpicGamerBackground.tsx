'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Hexagonal grid pattern like in sci-fi games
function HexGrid({ scrollProgress = 0, theme, activeSection }: {
    scrollProgress?: number;
    theme: any;
    activeSection: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    const hexagons = useMemo(() => {
        const hexes = [];
        const gridSize = 8;
        const hexRadius = 1.5;

        for (let q = -gridSize; q <= gridSize; q++) {
            for (let r = -gridSize; r <= gridSize; r++) {
                if (Math.abs(q + r) <= gridSize) {
                    // Hexagonal grid coordinates
                    const x = hexRadius * (3 / 2 * q);
                    const y = hexRadius * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
                    const z = (Math.random() - 0.5) * 5;

                    hexes.push({
                        position: [x, y, z] as [number, number, number],
                        opacity: 0.1 + Math.random() * 0.15, // Dimmed base opacity
                        pulseSpeed: 1 + Math.random() * 2, // Faster pulsing
                        delay: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        return hexes;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const hex = hexagons[i];
                if (hex && child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                    // Dimmed section-reactive pulsing for better readability
                    const pulse = Math.sin(state.clock.elapsedTime * hex.pulseSpeed * theme.intensity + hex.delay);
                    child.material.opacity = Math.min(0.15, (hex.opacity * 0.4 + pulse * 0.1) * theme.intensity);

                    // Dynamic color change based on section
                    child.material.color.setHex(parseInt(theme.primary.replace('#', '0x')));

                    // Faster rotation for more intense sections
                    child.rotation.z = state.clock.elapsedTime * 0.2 * theme.intensity + hex.delay;

                    // More dramatic scale pulsing
                    const scalePulse = 1 + Math.sin(state.clock.elapsedTime * 4 + hex.delay) * 0.25 * theme.intensity;
                    child.scale.setScalar(scalePulse);
                }
            });

            // Move with scroll
            groupRef.current.position.y = scrollProgress * -3;
            groupRef.current.position.z = -8;
        }
    });

    return (
        <group ref={groupRef}>
            {hexagons.map((hex, i) => (
                <mesh key={i} position={hex.position}>
                    <ringGeometry args={[0.8, 1, 6]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        transparent
                        opacity={hex.opacity}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Digital rain effect like Matrix but cooler
function DigitalRain({ scrollProgress = 0, theme, activeSection }: {
    scrollProgress?: number;
    theme: any;
    activeSection: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    const rainDrops = useMemo(() => {
        const drops = [];
        const symbols = ['0', '1', '{', '}', '<', '>', '/', '\\', '+', '-', '=', '*'];

        for (let i = 0; i < 30; i++) {
            drops.push({
                x: (Math.random() - 0.5) * 60,
                y: Math.random() * 40 - 20,
                z: (Math.random() - 0.5) * 20,
                speed: 0.1 + Math.random() * 0.2,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                opacity: 0.15 + Math.random() * 0.1 // Dimmed digital rain
            });
        }

        return drops;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const drop = rainDrops[i];
                if (drop) {
                    // Move down faster based on section intensity
                    child.position.y -= drop.speed * theme.intensity;

                    // Reset to top when off screen
                    if (child.position.y < -25) {
                        child.position.y = 25;
                        child.position.x = (Math.random() - 0.5) * 60;
                    }

                    // Dimmed section-reactive flickering and color
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                        child.material.opacity = Math.min(0.2, drop.opacity * (0.15 + Math.sin(state.clock.elapsedTime * 8 * theme.intensity + i) * 0.08));
                        child.material.color.setHex(parseInt(theme.secondary.replace('#', '0x')));

                        // Scale based on intensity
                        const scale = 1 + Math.sin(state.clock.elapsedTime * 4 + i) * 0.3 * theme.intensity;
                        child.scale.setScalar(scale);
                    }
                }
            });

            // Parallax with scroll
            groupRef.current.position.y = scrollProgress * -2;
        }
    });

    return (
        <group ref={groupRef}>
            {rainDrops.map((drop, i) => (
                <mesh key={i} position={[drop.x, drop.y, drop.z]}>
                    <planeGeometry args={[0.5, 0.8]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        transparent
                        opacity={drop.opacity}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Glowing circuit board patterns
function CircuitBoard({ scrollProgress = 0, theme, activeSection }: {
    scrollProgress?: number;
    theme: any;
    activeSection: string;
}) {
    const linesRef = useRef<THREE.Group>(null);

    const circuits = useMemo(() => {
        const lines = [];

        // Create circuit-like line patterns
        for (let i = 0; i < 15; i++) {
            const startX = (Math.random() - 0.5) * 40;
            const startY = (Math.random() - 0.5) * 25;
            const startZ = (Math.random() - 0.5) * 15;

            // Create L-shaped or straight lines like circuit traces
            const points = [];
            points.push(new THREE.Vector3(startX, startY, startZ));

            if (Math.random() > 0.5) {
                // L-shaped
                const midX = startX + (Math.random() - 0.5) * 8;
                points.push(new THREE.Vector3(midX, startY, startZ));
                points.push(new THREE.Vector3(midX, startY + (Math.random() - 0.5) * 8, startZ));
            } else {
                // Straight line
                points.push(new THREE.Vector3(
                    startX + (Math.random() - 0.5) * 10,
                    startY + (Math.random() - 0.5) * 10,
                    startZ
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lines.push({
                geometry,
                opacity: 0.12 + Math.random() * 0.12, // Dimmed circuit lines
                pulseSpeed: 0.5 + Math.random() * 2
            });
        }

        return lines;
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.children.forEach((child, i) => {
                const circuit = circuits[i];
                if (circuit && child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
                    // Dimmed pulsing glow effect
                    const pulse = Math.sin(state.clock.elapsedTime * circuit.pulseSpeed * theme.intensity + i);
                    child.material.opacity = Math.min(0.15, (circuit.opacity * 0.3 + pulse * 0.1) * theme.intensity);
                }
            });

            // Move with scroll
            linesRef.current.position.y = scrollProgress * -4;
        }
    });

    return (
        <group ref={linesRef}>
            {circuits.map((circuit, i) => {
                const material = new THREE.LineBasicMaterial({
                    color: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
                    transparent: true,
                    opacity: circuit.opacity * theme.intensity
                });

                return (
                    <primitive
                        key={i}
                        object={new THREE.Line(circuit.geometry, material)}
                    />
                );
            })}
        </group>
    );
}

// Floating HUD elements like in games
function HUDElements({ scrollProgress = 0, theme, activeSection }: {
    scrollProgress?: number;
    theme: any;
    activeSection: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    const hudElements = useMemo(() => {
        const elements = [];

        for (let i = 0; i < 8; i++) {
            elements.push({
                position: [
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20
                ] as [number, number, number],
                scale: 0.3 + Math.random() * 0.5,
                rotationSpeed: 0.2 + Math.random() * 0.4,
                type: i % 4, // Different HUD element types
                color: ['#00ff88', '#0088ff', '#ff0088', '#ffaa00'][i % 4]
            });
        }

        return elements;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const element = hudElements[i];
                if (element) {
                    // Rotation
                    child.rotation.z = state.clock.elapsedTime * element.rotationSpeed;

                    // Floating motion
                    child.position.y = element.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 1;
                    child.position.x = element.position[0] + Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.5;

                    // Pulsing scale
                    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
                    child.scale.setScalar(element.scale * pulse);
                }
            });

            // Parallax scrolling
            groupRef.current.position.y = scrollProgress * -6;
        }
    });

    return (
        <group ref={groupRef}>
            {hudElements.map((element, i) => (
                <mesh
                    key={i}
                    position={element.position}
                    scale={element.scale}
                >
                    {element.type === 0 && (
                        // Crosshair
                        <>
                            <ringGeometry args={[0.8, 1, 32]} />
                            <meshBasicMaterial
                                color={element.color}
                                transparent
                                opacity={0.12}
                                wireframe
                            />
                        </>
                    )}
                    {element.type === 1 && (
                        // Target reticle
                        <>
                            <ringGeometry args={[0.5, 0.7, 8]} />
                            <meshBasicMaterial
                                color={element.color}
                                transparent
                                opacity={0.1}
                            />
                        </>
                    )}
                    {element.type === 2 && (
                        // Radar sweep
                        <>
                            <ringGeometry args={[0.6, 0.8, 16]} />
                            <meshBasicMaterial
                                color={element.color}
                                transparent
                                opacity={0.08}
                                wireframe
                            />
                        </>
                    )}
                    {element.type === 3 && (
                        // HUD bracket
                        <>
                            <boxGeometry args={[1.2, 1.2, 0.1]} />
                            <meshBasicMaterial
                                color={element.color}
                                transparent
                                opacity={0.12}
                                wireframe
                            />
                        </>
                    )}
                </mesh>
            ))}
        </group>
    );
}

// Floating energy orbs to fill empty space
function FloatingOrbs({ scrollProgress = 0, theme, activeSection }: { 
    scrollProgress?: number; 
    theme: any; 
    activeSection: string;
}) {
    const orbsRef = useRef<THREE.Group>(null);
    
    const orbs = useMemo(() => {
        const orbArray = [];
        
        for (let i = 0; i < 20; i++) {
            orbArray.push({
                position: [
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 30
                ] as [number, number, number],
                scale: 0.2 + Math.random() * 0.4,
                speed: 0.3 + Math.random() * 0.7,
                color: Math.random() > 0.5 ? theme.primary : theme.accent,
                pulseSpeed: 1 + Math.random() * 3
            });
        }
        
        return orbArray;
    }, [theme]);
    
    useFrame((state) => {
        if (orbsRef.current) {
            orbsRef.current.children.forEach((child, i) => {
                const orb = orbs[i];
                if (orb) {
                    // Floating motion
                    child.position.y = orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + i) * 2;
                    child.position.x = orb.position[0] + Math.cos(state.clock.elapsedTime * orb.speed * 0.7 + i) * 1.5;
                    child.position.z = orb.position[2] + Math.sin(state.clock.elapsedTime * orb.speed * 0.5 + i) * 1;
                    
                    // Pulsing scale
                    const pulse = 1 + Math.sin(state.clock.elapsedTime * orb.pulseSpeed + i) * 0.5 * theme.intensity;
                    child.scale.setScalar(orb.scale * pulse);
                    
                    // Update material opacity and color (dimmed)
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                        child.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.06;
                        child.material.color.setHex(parseInt(orb.color.replace('#', '0x')));
                    }
                }
            });
            
            // Move with scroll
            orbsRef.current.position.y = scrollProgress * -7;
        }
    });
    
    return (
        <group ref={orbsRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position}>
                    <sphereGeometry args={[orb.scale, 16, 16]} />
                    <meshBasicMaterial 
                        color={orb.color}
                        transparent
                        opacity={0.12}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Energy waves that pulse outward
function EnergyWaves({ scrollProgress = 0, theme, activeSection }: {
    scrollProgress?: number;
    theme: any;
    activeSection: string;
}) {
    const wavesRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (wavesRef.current) {
            wavesRef.current.children.forEach((child, i) => {
                // Expanding waves
                const time = state.clock.elapsedTime;
                const wavePhase = (time * 0.5 + i * 2) % (Math.PI * 2);
                const scale = 1 + Math.sin(wavePhase) * 2;

                child.scale.setScalar(Math.max(0.1, scale));

                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                    child.material.opacity = Math.max(0, (0.12 - scale * 0.04) * theme.intensity);
                    child.material.color.setHex(parseInt(theme.primary.replace('#', '0x')));
                }
            });

            // Move with scroll
            wavesRef.current.position.y = scrollProgress * -1;
        }
    });

    return (
        <group ref={wavesRef}>
            {Array.from({ length: 3 }, (_, i) => (
                <mesh key={i} position={[0, i * 10 - 10, -5]}>
                    <ringGeometry args={[3, 4, 32]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        transparent
                        opacity={0.06}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

interface EpicGamerBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

// Section-based color themes for reactive background
const getSectionTheme = (section: string) => {
    const themes = {
        home: { primary: '#00ff88', secondary: '#0088ff', accent: '#ff0088', intensity: 1.0 },
        team: { primary: '#ff6b35', secondary: '#f7931e', accent: '#ffaa00', intensity: 1.2 },
        projects: { primary: '#8b5cf6', secondary: '#a855f7', accent: '#c084fc', intensity: 1.5 },
        achievements: { primary: '#ffd700', secondary: '#ffed4e', accent: '#fbbf24', intensity: 1.8 },
        gallery: { primary: '#ff0088', secondary: '#ec4899', accent: '#f472b6', intensity: 1.3 },
        events: { primary: '#0088ff', secondary: '#3b82f6', accent: '#60a5fa', intensity: 1.4 },
        announcements: { primary: '#00ff88', secondary: '#22c55e', accent: '#4ade80', intensity: 1.1 },
        apply: { primary: '#ff4444', secondary: '#ef4444', accent: '#f87171', intensity: 2.0 },
        contact: { primary: '#00ffff', secondary: '#06b6d4', accent: '#67e8f9', intensity: 1.6 }
    };

    return themes[section as keyof typeof themes] || themes.home;
};

export default function EpicGamerBackground({
    scrollProgress = 0,
    activeSection = 'home'
}: EpicGamerBackgroundProps) {
    const theme = getSectionTheme(activeSection);
    return (
        <div className="fixed inset-0">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 75 }}
                gl={{
                    alpha: true,
                    antialias: false, // Disable for better performance
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: false
                }}
                dpr={1} // Force 1x pixel ratio for performance
                performance={{ min: 0.5 }}
            >
                {/* Dimmed ambient lighting for better text readability */}
                <ambientLight intensity={0.1 + theme.intensity * 0.05} />
                
                {/* Subtle directional light */}
                <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={0.08 + theme.intensity * 0.02}
                    color={theme.primary}
                />

                {/* Hexagonal grid */}
                <HexGrid scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />

                {/* Digital rain */}
                <DigitalRain scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />

                {/* Circuit board patterns */}
                <CircuitBoard scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />

                {/* HUD elements */}
                <HUDElements scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />

                {/* Energy waves */}
                <EnergyWaves scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />
                
                {/* Floating energy orbs to fill space */}
                <FloatingOrbs scrollProgress={scrollProgress} theme={theme} activeSection={activeSection} />
            </Canvas>
        </div>
    );
}