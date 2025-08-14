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

function SmoothParticles({ activeSection }: { activeSection: string }) {
    const meshRef = useRef<THREE.Points>(null);
    
    const { geometry, material } = useMemo(() => {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
            
            const brightness = 0.7 + Math.random() * 0.3;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
            
            sizes[i] = 1.5 + Math.random() * 3;
        }
        
        // Create smooth circular texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 4,
            map: texture,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.001
        });
        
        return { geometry, material };
    }, []);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = meshRef.current.geometry.attributes.size.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < positions.length; i += 3) {
            const idx = i / 3;
            positions[i] += Math.sin(time * 0.4 + idx * 0.1) * 0.012;
            positions[i + 1] += Math.cos(time * 0.3 + idx * 0.1) * 0.01;
            positions[i + 2] += Math.sin(time * 0.5 + idx * 0.1) * 0.008;
            
            const originalSize = 1.5 + (idx % 100) / 100 * 3;
            sizes[idx] = originalSize * (1 + Math.sin(time * 2.5 + idx) * 0.4);
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.geometry.attributes.size.needsUpdate = true;
        
        const sectionColor = SECTION_COLORS[activeSection as keyof typeof SECTION_COLORS] || SECTION_COLORS.home;
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.setHex(parseInt(sectionColor.replace('#', '0x')));
        }
        
        meshRef.current.rotation.y = time * 0.08;
        meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

function GeometricShapes({ activeSection }: { activeSection: string }) {
    const groupRef = useRef<THREE.Group>(null);
    
    const shapes = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            position: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20],
            scale: 0.4 + Math.random() * 0.6,
            speed: 0.2 + Math.random() * 0.4,
            type: i % 5,
            pulseSpeed: 1 + Math.random() * 2
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
            child.rotation.z = time * shape.speed * 0.3;
            
            child.position.y = shape.position[1] + Math.sin(time * 0.6 + i) * 1.5;
            child.position.x = shape.position[0] + Math.cos(time * 0.4 + i) * 1;
            child.position.z = shape.position[2] + Math.sin(time * 0.3 + i) * 0.5;
            
            const pulse = 1 + Math.sin(time * shape.pulseSpeed + i) * 0.4;
            child.scale.setScalar(shape.scale * pulse);
            
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.setHex(parseInt(sectionColor.replace('#', '0x')));
                child.material.opacity = 0.3 + Math.sin(time * 1.8 + i) * 0.15;
            }
        });
        
        groupRef.current.rotation.y = time * 0.03;
    });
    
    return (
        <group ref={groupRef}>
            {shapes.map((shape, i) => (
                <mesh key={i} position={shape.position} scale={shape.scale}>
                    {shape.type === 0 && <sphereGeometry args={[0.6, 32, 32]} />}
                    {shape.type === 1 && <boxGeometry args={[1, 1, 1]} />}
                    {shape.type === 2 && <octahedronGeometry args={[0.7, 2]} />}
                    {shape.type === 3 && <torusGeometry args={[0.6, 0.25, 16, 32]} />}
                    {shape.type === 4 && <coneGeometry args={[0.5, 1.2, 16]} />}
                    <meshBasicMaterial transparent opacity={0.3} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function EnergyOrbs({ activeSection }: { activeSection: string }) {
    const groupRef = useRef<THREE.Group>(null);
    
    const orbs = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15],
            speed: 0.4 + Math.random() * 0.6,
            radius: 4 + i * 1.8,
            pulseSpeed: 2 + Math.random() * 3
        }));
    }, []);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        
        const time = state.clock.elapsedTime;
        const sectionColor = SECTION_COLORS[activeSection as keyof typeof SECTION_COLORS] || SECTION_COLORS.home;
        
        groupRef.current.children.forEach((child, i) => {
            const orb = orbs[i];
            child.position.x = Math.cos(time * orb.speed + i) * orb.radius;
            child.position.z = Math.sin(time * orb.speed + i) * orb.radius;
            child.position.y = orb.position[1] + Math.sin(time * 1.5 + i) * 2.5;
            
            const pulse = 1 + Math.sin(time * orb.pulseSpeed + i) * 0.6;
            child.scale.setScalar(pulse);
            
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.setHex(parseInt(sectionColor.replace('#', '0x')));
                child.material.opacity = 0.7 + Math.sin(time * 2.5 + i) * 0.3;
            }
        });
    });
    
    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshBasicMaterial transparent opacity={0.7} />
                </mesh>
            ))}
        </group>
    );
}

interface GameBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

export default function GameBackground({ 
    activeSection = 'home'
}: GameBackgroundProps) {
    return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
                camera={{ position: [0, 0, 18], fov: 75 }}
                gl={{ 
                    alpha: true, 
                    antialias: true,
                    powerPreference: 'high-performance'
                }}
                dpr={Math.min(window.devicePixelRatio, 2)}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[15, 15, 8]} intensity={0.4} />
                <SmoothParticles activeSection={activeSection} />
                <GeometricShapes activeSection={activeSection} />
                <EnergyOrbs activeSection={activeSection} />
            </Canvas>
        </div>
    );
}