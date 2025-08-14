'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Subtle floating particles
function SubtleParticles({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 150; // Much fewer particles
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles across a larger area
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Very subtle material
    const material = new THREE.PointsMaterial({
      size: 2,
      color: '#22c55e', // Just green
      transparent: true,
      opacity: 0.3, // Very subtle
      blending: THREE.NormalBlending, // No additive blending
    });
    
    return { geometry, material };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Very slow, gentle rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      
      // Gentle floating motion based on scroll
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.5 + scrollProgress * -2;
    }
  });
  
  return <points ref={meshRef} geometry={geometry} material={material} />;
}

// Simple geometric shapes floating around
function FloatingShapes({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.2,
      rotationSpeed: 0.1 + Math.random() * 0.2,
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const shape = shapes[i];
        if (shape) {
          child.rotation.x = state.clock.elapsedTime * shape.rotationSpeed;
          child.rotation.y = state.clock.elapsedTime * shape.rotationSpeed * 0.7;
          
          // Gentle floating
          child.position.y = shape.position[1] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.5;
        }
      });
      
      // Move with scroll
      groupRef.current.position.y = scrollProgress * -3;
    }
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh 
          key={shape.id} 
          position={shape.position}
          scale={shape.scale}
        >
          {i % 3 === 0 ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : i % 3 === 1 ? (
            <sphereGeometry args={[0.5, 8, 6]} />
          ) : (
            <octahedronGeometry args={[0.6, 0]} />
          )}
          <meshBasicMaterial 
            color="#22c55e" 
            transparent 
            opacity={0.15}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
}

interface SubtleThreeBackgroundProps {
  scrollProgress?: number;
  activeSection?: string;
}

export default function SubtleThreeBackground({ 
  scrollProgress = 0 
}: SubtleThreeBackgroundProps) {
  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ 
          alpha: true, 
          antialias: false,
          powerPreference: 'low-power'
        }}
        dpr={1}
      >
        {/* Very dim ambient light */}
        <ambientLight intensity={0.2} />
        
        {/* Subtle particles */}
        <SubtleParticles scrollProgress={scrollProgress} />
        
        {/* Floating shapes */}
        <FloatingShapes scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}