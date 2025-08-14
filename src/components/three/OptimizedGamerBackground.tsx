'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Performance-optimized section themes (pre-computed)
const SECTION_THEMES = {
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

// Lightweight hexagonal grid - much fewer elements
function OptimizedHexGrid({ theme, scrollProgress }: { theme: any; scrollProgress: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    
    const { count, positions, scales } = useMemo(() => {
        const count = 30; // Reduced from 100+ to 30
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            scales[i] = 0.5 + Math.random() * 1;
        }
        
        return { count, positions, scales };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        // Update instances efficiently
        for (let i = 0; i < count; i++) {
            tempObject.position.set(
                positions[i * 3],
                positions[i * 3 + 1] + scrollProgress * -3,
                positions[i * 3 + 2]
            );
            
            // Simple rotation and scale
            tempObject.rotation.z = time * 0.1 + i;
            const scale = scales[i] * (1 + Math.sin(time * 2 + i) * 0.1);
            tempObject.scale.setScalar(scale);
            
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        }
        
        meshRef.current.instanceMatrix.needsUpdate = true;
    });
    
    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <ringGeometry args={[0.8, 1, 6]} />
            <meshBasicMaterial 
                color={theme.color}
                transparent
                opacity={0.4}
            />
        </instancedMesh>
    );
}

// Simplified particle system
function OptimizedParticles({ theme, scrollProgress }: { theme: any; scrollProgress: number }) {
    const meshRef = useRef<THREE.Points>(null);
    
    const { geometry, material } = useMemo(() => {
        const particleCount = 100; // Reduced from 200+ to 100
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
            size: 3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });
        
        return { geometry, material };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        // Simple wave motion - no complex calculations
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            positions[i] += Math.sin(time * 0.5 + particleIndex * 0.1) * 0.01;
            positions[i + 1] += Math.cos(time * 0.3 + particleIndex * 0.1) * 0.008;
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.position.y = scrollProgress * -4;
        
        // Update color efficiently
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.copy(theme.color);
        }
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

// Minimal floating orbs
function OptimizedOrbs({ theme, scrollProgress }: { theme: any; scrollProgress: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    
    const { count, positions } = useMemo(() => {
        const count = 15; // Reduced from 25 to 15
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        
        return { count, positions };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < count; i++) {
            tempObject.position.set(
                positions[i * 3] + Math.cos(time * 0.3 + i) * 0.5,
                positions[i * 3 + 1] + Math.sin(time * 0.2 + i) * 0.8 + scrollProgress * -5,
                positions[i * 3 + 2]
            );
            
            const scale = 0.3 + Math.sin(time * 1.5 + i) * 0.1;
            tempObject.scale.setScalar(scale);
            
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        }
        
        meshRef.current.instanceMatrix.needsUpdate = true;
    });
    
    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial 
                color={theme.color}
                transparent
                opacity={0.5}
            />
        </instancedMesh>
    );
}

interface OptimizedGamerBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

export default function OptimizedGamerBackground({ 
    scrollProgress = 0,
    activeSection = 'home'
}: OptimizedGamerBackgroundProps) {
    // Memoize theme to prevent recalculation
    const theme = useMemo(() => {
        return SECTION_THEMES[activeSection as keyof typeof SECTION_THEMES] || SECTION_THEMES.home;
    }, [activeSection]);
    
    // Throttle scroll updates for better performance
    const throttledScrollProgress = useMemo(() => {
        return Math.round(scrollProgress * 10) / 10; // Round to 1 decimal place
    }, [scrollProgress]);
    
    return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                gl={{ 
                    alpha: true, 
                    antialias: false, // Disable antialiasing for performance
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: false
                }}
                dpr={1} // Force 1x pixel ratio for performance
                performance={{ min: 0.5 }} // Lower performance threshold
            >
                {/* Simple ambient lighting */}
                <ambientLight intensity={0.4} />
                
                {/* Optimized components */}
                <OptimizedHexGrid theme={theme} scrollProgress={throttledScrollProgress} />
                <OptimizedParticles theme={theme} scrollProgress={throttledScrollProgress} />
                <OptimizedOrbs theme={theme} scrollProgress={throttledScrollProgress} />
            </Canvas>
        </div>
    );
}