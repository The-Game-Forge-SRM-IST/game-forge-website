'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleTransitionsProps {
  activeSection: string;
  isTransitioning: boolean;
}

export default function ParticleTransitions({ activeSection, isTransitioning }: ParticleTransitionsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const transitionStartTime = useRef(0);
  
  // Section-specific colors
  const sectionColors = useMemo(() => ({
    home: '#22c55e',
    team: '#3b82f6', 
    projects: '#ef4444',
    achievements: '#f59e0b',
    gallery: '#8b5cf6',
    events: '#06b6d4',
    alumni: '#10b981',
    apply: '#f97316',
    contact: '#ec4899',
  }), []);
  
  // Generate transition particles
  const [positions, colors, velocities] = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 100 : 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    const sectionColor = new THREE.Color(sectionColors[activeSection as keyof typeof sectionColors] || '#22c55e');
    
    for (let i = 0; i < particleCount; i++) {
      // Start particles from center and spread outward
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.random() * 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      
      // Set color based on active section
      colors[i * 3] = sectionColor.r;
      colors[i * 3 + 1] = sectionColor.g;
      colors[i * 3 + 2] = sectionColor.b;
      
      // Random velocities for explosion effect
      const speed = 0.1 + Math.random() * 0.2;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.sin(angle) * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return [positions, colors, velocities];
  }, [activeSection, sectionColors]);
  
  // Reset transition when section changes
  React.useEffect(() => {
    if (isTransitioning) {
      transitionStartTime.current = Date.now();
    }
  }, [isTransitioning, activeSection]);
  
  useFrame((state) => {
    if (!pointsRef.current || !isTransitioning) return;
    
    const time = state.clock.getElapsedTime();
    const transitionTime = (Date.now() - transitionStartTime.current) / 1000;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    
    // Transition duration
    const duration = 2.0;
    const progress = Math.min(transitionTime / duration, 1);
    
    for (let i = 0; i < positions.length; i += 3) {
      const particleIndex = i / 3;
      
      // Apply velocities with decay
      const decay = 1 - progress * 0.8;
      positions[i] += velocities[particleIndex * 3] * decay;
      positions[i + 1] += velocities[particleIndex * 3 + 1] * decay;
      positions[i + 2] += velocities[particleIndex * 3 + 2] * decay;
      
      // Add gravity effect
      positions[i + 1] -= progress * 0.02;
      
      // Fade out particles over time
      const alpha = 1 - progress;
      colors[particleIndex * 3] *= alpha;
      colors[particleIndex * 3 + 1] *= alpha;
      colors[particleIndex * 3 + 2] *= alpha;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    
    // Add rotation for dynamic effect
    pointsRef.current.rotation.z = time * 0.5;
  });
  
  if (!isTransitioning) return null;
  
  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}