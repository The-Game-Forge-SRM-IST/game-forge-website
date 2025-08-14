'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Beautiful white particles that float elegantly
function FloatingParticles({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles across the screen
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Varying sizes for depth
      sizes[i] = 1 + Math.random() * 3;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      color: '#ffffff',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    return { geometry, material };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        
        // Gentle floating motion
        positions[i] += Math.sin(state.clock.elapsedTime * 0.5 + particleIndex * 0.1) * 0.005;
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.3 + particleIndex * 0.1) * 0.003;
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 0.4 + particleIndex * 0.1) * 0.002;
        
        // Boundary wrapping
        if (positions[i] > 25) positions[i] = -25;
        if (positions[i] < -25) positions[i] = 25;
        if (positions[i + 1] > 15) positions[i + 1] = -15;
        if (positions[i + 1] < -15) positions[i + 1] = 15;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Slow rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.position.y = scrollProgress * -5;
    }
  });
  
  return <points ref={meshRef} geometry={geometry} material={material} />;
}

// Clean geometric shapes - wireframe only
function GeometricShapes({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      rotationSpeed: 0.1 + Math.random() * 0.2,
      type: i % 4 // 4 different shapes
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const shape = shapes[i];
        if (shape) {
          // Gentle rotation
          child.rotation.x = state.clock.elapsedTime * shape.rotationSpeed;
          child.rotation.y = state.clock.elapsedTime * shape.rotationSpeed * 0.7;
          
          // Subtle floating
          child.position.y = shape.position[1] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.5;
          child.position.x = shape.position[0] + Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.3;
        }
      });
      
      // Move with scroll
      groupRef.current.position.y = scrollProgress * -8;
    }
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <mesh 
          key={shape.id} 
          position={shape.position}
          scale={shape.scale}
        >
          {shape.type === 0 && <boxGeometry args={[1, 1, 1]} />}
          {shape.type === 1 && <sphereGeometry args={[0.6, 16, 16]} />}
          {shape.type === 2 && <octahedronGeometry args={[0.7, 0]} />}
          {shape.type === 3 && <torusGeometry args={[0.6, 0.2, 8, 16]} />}
          <meshBasicMaterial 
            color="#ffffff"
            transparent 
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

// Subtle accent particles in green
function AccentParticles({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 35;
      positions[i3 + 2] = (Math.random() - 0.5) * 25;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      color: '#22c55e', // Your brand green
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    
    return { geometry, material };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        
        // Slower, more subtle movement
        positions[i] += Math.sin(state.clock.elapsedTime * 0.2 + particleIndex * 0.2) * 0.003;
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.15 + particleIndex * 0.2) * 0.002;
        
        // Boundary wrapping
        if (positions[i] > 30) positions[i] = -30;
        if (positions[i] < -30) positions[i] = 30;
        if (positions[i + 1] > 17.5) positions[i + 1] = -17.5;
        if (positions[i + 1] < -17.5) positions[i + 1] = 17.5;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.position.y = scrollProgress * -3;
    }
  });
  
  return <points ref={meshRef} geometry={geometry} material={material} />;
}

interface CleanGameBackgroundProps {
  scrollProgress?: number;
  activeSection?: string;
}

export default function CleanGameBackground({ 
  scrollProgress = 0 
}: CleanGameBackgroundProps) {
  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'low-power'
        }}
        dpr={1}
      >
        {/* Soft ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Main white particles */}
        <FloatingParticles scrollProgress={scrollProgress} />
        
        {/* Clean geometric shapes */}
        <GeometricShapes scrollProgress={scrollProgress} />
        
        {/* Subtle green accent particles */}
        <AccentParticles scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}