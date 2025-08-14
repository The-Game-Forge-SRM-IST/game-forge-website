'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pre-computed section themes for performance
const THEMES = {
    home: { color: new THREE.Color('#00ff88'), intensity: 1.0 },
    team: { color: new THREE.Color('#ff6b35'), intensity: 1.1 },
    projects: { color: new THREE.Color('#8b5cf6'), intensity: 1.2 },
    achievements: { color: new THREE.Color('#ffd700'), intensity: 1.3 },
    gallery: { color: new THREE.Color('#ff0088'), intensity: 1.1 },
    events: { color: new THREE.Color('#0088ff'), intensity: 1.2 },
    announcements: { color: new THREE.Color('#00ff88'), intensity: 1.0 },
    apply: { color: new THREE.Color('#ff4444'), intensity: 1.4 },
    contact: { color: new THREE.Color('#00ffff'), intensity: 1.2 }
};

// Smooth floating particles with custom texture
function SmoothParticles({ theme, scrollProgress }: { theme: { color: THREE.Color; intensity: number }; scrollProgress: number }) {
    const meshRef = useRef<THREE.Points>(null);
    
    const { geometry, material } = useMemo(() => {
        // Create smooth circular texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        // Fewer particles for better performance
        const particleCount = 80;
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 40;
            positions[i3 + 1] = (Math.random() - 0.5) * 25;
            positions[i3 + 2] = (Math.random() - 0.5) * 15;
            sizes[i] = 2 + Math.random() * 4;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 3,
            map: texture,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.001
        });
        
        return { geometry, material };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        // Smooth wave motion - optimized
        for (let i = 0; i < positions.length; i += 9) { // Update every 3rd particle for performance
            const particleIndex = i / 3;
            positions[i] += Math.sin(time * 0.3 + particleIndex * 0.1) * 0.008;
            positions[i + 1] += Math.cos(time * 0.2 + particleIndex * 0.1) * 0.006;
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.position.y = scrollProgress * -3;
        
        // Smooth color transition
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.lerp(theme.color, 0.05);
        }
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

// Smooth geometric shapes with high-quality rendering
function SmoothShapes({ theme, scrollProgress }: { theme: { color: THREE.Color; intensity: number }; scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    
    const shapes = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            id: i,
            position: [
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            scale: 0.4 + Math.random() * 0.3,
            rotationSpeed: 0.05 + Math.random() * 0.1,
            type: i % 3
        }));
    }, []);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        groupRef.current.children.forEach((child, i) => {
            const shape = shapes[i];
            if (shape && child instanceof THREE.Mesh) {
                // Smooth rotation
                child.rotation.x = time * shape.rotationSpeed;
                child.rotation.y = time * shape.rotationSpeed * 0.7;
                
                // Gentle floating
                child.position.y = shape.position[1] + Math.sin(time * 0.3 + i) * 0.5 + scrollProgress * -4;
                child.position.x = shape.position[0] + Math.cos(time * 0.2 + i) * 0.3;
                
                // Smooth color transition
                if (child.material instanceof THREE.MeshBasicMaterial) {
                    child.material.color.lerp(theme.color, 0.03);
                }
            }
        });
    });
    
    return (
        <group ref={groupRef}>
            {shapes.map((shape) => (
                <mesh 
                    key={shape.id} 
                    position={shape.position}
                    scale={shape.scale}
                >
                    {shape.type === 0 && <sphereGeometry args={[0.5, 32, 32]} />}
                    {shape.type === 1 && <octahedronGeometry args={[0.6, 2]} />}
                    {shape.type === 2 && <torusGeometry args={[0.5, 0.15, 16, 32]} />}
                    <meshBasicMaterial 
                        transparent 
                        opacity={0.15}
                        wireframe
                    />
                </mesh>
            ))}
        </group>
    );
}

// Subtle accent orbs
function AccentOrbs({ theme, scrollProgress }: { theme: { color: THREE.Color; intensity: number }; scrollProgress: number }) {
    const meshRef = useRef<THREE.Points>(null);
    
    const { geometry, material } = useMemo(() => {
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 30;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            size: 4,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });
        
        return { geometry, material };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        // Very slow, smooth movement
        for (let i = 0; i < positions.length; i += 6) { // Update every other particle
            const particleIndex = i / 3;
            positions[i] += Math.sin(time * 0.1 + particleIndex * 0.3) * 0.003;
            positions[i + 1] += Math.cos(time * 0.08 + particleIndex * 0.3) * 0.002;
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.position.y = scrollProgress * -2;
        
        // Smooth color transition
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.lerp(theme.color, 0.02);
        }
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

interface SmoothPerformantBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

export default function SmoothPerformantBackground({ 
    scrollProgress = 0,
    activeSection = 'home'
}: SmoothPerformantBackgroundProps) {
    // Memoize theme with smooth transitions
    const theme = useMemo(() => {
        return THEMES[activeSection as keyof typeof THEMES] || THEMES.home;
    }, [activeSection]);
    
    // Throttle scroll for performance
    const throttledScroll = useMemo(() => {
        return Math.round(scrollProgress * 20) / 20;
    }, [scrollProgress]);
    
    return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                gl={{ 
                    alpha: true, 
                    antialias: true, // Keep antialiasing for smoothness
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true
                }}
                dpr={Math.min(window.devicePixelRatio, 2)} // Cap at 2x for performance
                performance={{ min: 0.8 }} // Higher performance threshold
                frameloop="demand" // Only render when needed
            >
                {/* Soft lighting */}
                <ambientLight intensity={0.3} />
                
                {/* Smooth components */}
                <SmoothParticles theme={theme} scrollProgress={throttledScroll} />
                <SmoothShapes theme={theme} scrollProgress={throttledScroll} />
                <AccentOrbs theme={theme} scrollProgress={throttledScroll} />
            </Canvas>
        </div>
    );
}