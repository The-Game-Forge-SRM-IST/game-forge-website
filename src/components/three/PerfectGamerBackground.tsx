'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SECTION_COLORS = {
    home: '#00ff88',
    team: '#ff6b35', 
    projects: '#8b5cf6',
    achievements: '#ffd700',
    gallery: '#ff0088',
    events: '#0088ff',
    announcements: '#00ff88',
    apply: '#ff4444',
    contact: '#00ffff'
};

function GamerParticles({ activeSection, scrollProgress }: { activeSection: string; scrollProgress: number }) {
    const meshRef = useRef<THREE.Points>(null);
    
    const { geometry, material } = useMemo(() => {
        const count = 120;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            colors[i * 3] = Math.random();
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 4,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        });
        
        return { geometry, material };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < positions.length; i += 3) {
            const idx = i / 3;
            positions[i] += Math.sin(time * 0.5 + idx * 0.1) * 0.01;
            positions[i + 1] += Math.cos(time * 0.3 + idx * 0.1) * 0.008;
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.position.y = scrollProgress * -4;
        
        const sectionColor = SECTION_COLORS[activeSection as keyof typeof SECTION_COLORS] || SECTION_COLORS.home;
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.setHex(parseInt(sectionColor.replace('#', '0x')));
        }
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

function FloatingShapes({ activeSection, scrollProgress }: { activeSection: string; scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    
    const shapes = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15],
            scale: 0.3 + Math.random() * 0.4,
            speed: 0.1 + Math.random() * 0.2,
            type: i % 4
        }));
    }, []);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        
        const time = state.clock.elapsedTime;
        const sectionColor = SECTION_COLORS[activeSection as keyof typeof SECTION_COLORS] || SECTION_COLORS.home;
        
        groupRef.current.children.forEach((child, i) => {
            const shape = shapes[i];
            child.rotation.x = time * shape.speed;
            child.rotation.y = time * shape.speed * 0.7;
            child.position.y = shape.position[1] + Math.sin(time * 0.4 + i) * 0.8 + scrollProgress * -5;
            child.position.x = shape.position[0] + Math.cos(time * 0.3 + i) * 0.5;
            
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.setHex(parseInt(sectionColor.replace('#', '0x')));
            }
        });
    });
    
    return (
        <group ref={groupRef}>
            {shapes.map((shape, i) => (
                <mesh key={i} position={shape.position} scale={shape.scale}>
                    {shape.type === 0 && <sphereGeometry args={[0.5, 16, 16]} />}
                    {shape.type === 1 && <boxGeometry args={[0.8, 0.8, 0.8]} />}
                    {shape.type === 2 && <octahedronGeometry args={[0.6]} />}
                    {shape.type === 3 && <torusGeometry args={[0.5, 0.2, 8, 16]} />}
                    <meshBasicMaterial transparent opacity={0.3} wireframe />
                </mesh>
            ))}
        </group>
    );
}

interface PerfectGamerBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

export default function PerfectGamerBackground({ 
    scrollProgress = 0,
    activeSection = 'home'
}: PerfectGamerBackgroundProps) {
    return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                gl={{ 
                    alpha: true, 
                    antialias: true,
                    powerPreference: 'high-performance'
                }}
                dpr={1}
            >
                <ambientLight intensity={0.4} />
                <GamerParticles activeSection={activeSection} scrollProgress={scrollProgress} />
                <FloatingShapes activeSection={activeSection} scrollProgress={scrollProgress} />
            </Canvas>
        </div>
    );
}