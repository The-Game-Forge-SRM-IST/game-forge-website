'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple particle system for testing
function SimpleParticles() {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Bright colors for visibility
      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    return { geometry, material };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  
  return <points ref={meshRef} geometry={geometry} material={material} />;
}

interface SimpleThreeBackgroundProps {
  className?: string;
}

export default function SimpleThreeBackground({ className = '' }: SimpleThreeBackgroundProps) {
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ alpha: true, antialias: false }}
        dpr={1}
      >
        <ambientLight intensity={0.5} />
        <SimpleParticles />
      </Canvas>
    </div>
  );
}