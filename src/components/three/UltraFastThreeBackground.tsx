'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLORS = {
    home: new THREE.Color('#00ff88'),
    team: new THREE.Color('#ff6b35'),
    projects: new THREE.Color('#8b5cf6'),
    achievements: new THREE.Color('#ffd700'),
    gallery: new THREE.Color('#ff0088'),
    events: new THREE.Color('#0088ff'),
    announcements: new THREE.Color('#00ff88'),
    apply: new THREE.Color('#ff4444'),
    contact: new THREE.Color('#00ffff')
};

function CoolParticles({ activeSection }: { activeSection: string }) {
    const meshRef = useRef<THREE.Points>(null);
    const targetColor = useRef(new THREE.Color('#00ff88'));
    const currentColor = useRef(new THREE.Color('#00ff88'));
    
    const { geometry, material } = useMemo(() => {
        const count = 150;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            const brightness = 0.5 + Math.random() * 0.5;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
            
            sizes[i] = 2 + Math.random() * 4;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 4,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        return { geometry, material };
    }, []);
    
    React.useEffect(() => {
        const newColor = COLORS[activeSection as keyof typeof COLORS] || COLORS.home;
        targetColor.current.copy(newColor);
    }, [activeSection]);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = meshRef.current.geometry.attributes.size.array as Float32Array;
        const time = state.clock.elapsedTime;
        
        for (let i = 0; i < positions.length; i += 3) {
            const idx = i / 3;
            positions[i] += Math.sin(time * 0.5 + idx * 0.1) * 0.01;
            positions[i + 1] += Math.cos(time * 0.3 + idx * 0.1) * 0.008;
            positions[i + 2] += Math.sin(time * 0.4 + idx * 0.1) * 0.005;
            
            sizes[idx] = (2 + (idx % 10) / 10 * 4) * (1 + Math.sin(time * 2 + idx) * 0.3);
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.geometry.attributes.size.needsUpdate = true;
        
        currentColor.current.lerp(targetColor.current, 0.03);
        if (meshRef.current.material instanceof THREE.PointsMaterial) {
            meshRef.current.material.color.copy(currentColor.current);
        }
        
        meshRef.current.rotation.y = time * 0.05;
        meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    });
    
    return <points ref={meshRef} geometry={geometry} material={material} />;
}

function FloatingShapes({ activeSection }: { activeSection: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const targetColor = useRef(new THREE.Color('#00ff88'));
    
    const shapes = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15],
            scale: 0.3 + Math.random() * 0.4,
            speed: 0.1 + Math.random() * 0.2,
            type: i % 4
        }));
    }, []);
    
    React.useEffect(() => {
        const newColor = COLORS[activeSection as keyof typeof COLORS] || COLORS.home;
        targetColor.current.copy(newColor);
    }, [activeSection]);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        groupRef.current.children.forEach((child, i) => {
            const shape = shapes[i];
            child.rotation.x = time * shape.speed;
            child.rotation.y = time * shape.speed * 0.7;
            child.rotation.z = time * shape.speed * 0.3;
            child.position.y = shape.position[1] + Math.sin(time * 0.4 + i) * 1.2;
            child.position.x = shape.position[0] + Math.cos(time * 0.3 + i) * 0.8;
            
            const pulse = 1 + Math.sin(time * 2 + i) * 0.3;
            child.scale.setScalar(shape.scale * pulse);
            
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.lerp(targetColor.current, 0.02);
                child.material.opacity = 0.2 + Math.sin(time * 1.5 + i) * 0.1;
            }
        });
        
        groupRef.current.rotation.y = time * 0.02;
    });
    
    return (
        <group ref={groupRef}>
            {shapes.map((shape, i) => (
                <mesh key={i} position={shape.position as any} scale={shape.scale as any}>
                    {shape.type === 0 && <sphereGeometry args={[0.5, 16, 16]} />}
                    {shape.type === 1 && <boxGeometry args={[0.8, 0.8, 0.8]} />}
                    {shape.type === 2 && <octahedronGeometry args={[0.6]} />}
                    {shape.type === 3 && <torusGeometry args={[0.5, 0.2, 8, 16]} />}
                    <meshBasicMaterial transparent opacity={0.25} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function EnergyOrbs({ activeSection }: { activeSection: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const targetColor = useRef(new THREE.Color('#00ff88'));
    
    const orbs = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => ({
            position: [(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
            speed: 0.3 + Math.random() * 0.5,
            radius: 3 + i * 1.5
        }));
    }, []);
    
    React.useEffect(() => {
        const newColor = COLORS[activeSection as keyof typeof COLORS] || COLORS.home;
        targetColor.current.copy(newColor);
    }, [activeSection]);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        
        const time = state.clock.elapsedTime;
        
        groupRef.current.children.forEach((child, i) => {
            const orb = orbs[i];
            child.position.x = Math.cos(time * orb.speed + i) * orb.radius;
            child.position.z = Math.sin(time * orb.speed + i) * orb.radius;
            child.position.y = orb.position[1] + Math.sin(time * 2 + i) * 2;
            
            const pulse = 1 + Math.sin(time * 3 + i) * 0.5;
            child.scale.setScalar(pulse);
            
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.lerp(targetColor.current, 0.02);
                child.material.opacity = 0.6 + Math.sin(time * 2 + i) * 0.3;
            }
        });
    });
    
    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position as any}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshBasicMaterial transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

interface UltraFastThreeBackgroundProps {
    scrollProgress?: number;
    activeSection?: string;
}

export default function UltraFastThreeBackground({ 
    activeSection = 'home'
}: UltraFastThreeBackgroundProps) {
    return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 75 }}
                gl={{ 
                    alpha: true, 
                    antialias: true,
                    powerPreference: 'high-performance'
                }}
                dpr={Math.min(window.devicePixelRatio, 2)}
            >
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.3} />
                <CoolParticles activeSection={activeSection} />
                <FloatingShapes activeSection={activeSection} />
                <EnergyOrbs activeSection={activeSection} />
            </Canvas>
        </div>
    );
}