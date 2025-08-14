'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import ParticleTransitions from './ParticleTransitions';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import ExtremeOptimizedThreeBackground from './ExtremeOptimizedThreeBackground';
import { useWebGLCapabilities, setupWebGLContextMonitoring, createFallbackAnimation } from '@/utils/webglDetection';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import ClientOnly from '@/components/ui/ClientOnly';

// Club colors from the design document
const CLUB_COLORS = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#ef4444', // Red
];

interface ParticleSystemProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  activeSection: string;
}

// Gaming-inspired Interactive 3D elements
function Interactive3DElements({ scrollProgress }: { scrollProgress: number; activeSection: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  
  // Track mouse for 3D element interactions
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Gaming-inspired 3D shapes with enhanced properties
  const shapes = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    let shapeCount = 8;
    if (isMobile) {
      shapeCount = 4;
    }
    
    const gameShapes = ['box', 'sphere', 'octahedron', 'tetrahedron', 'torus', 'cone'] as const;
    
    return Array.from({ length: shapeCount }, (_, i) => ({
      id: i,
      type: gameShapes[i % gameShapes.length],
      position: [
        (Math.random() - 0.5) * viewport.width * 0.9,
        (Math.random() - 0.5) * viewport.height * 0.9,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      color: CLUB_COLORS[i % CLUB_COLORS.length],
      scale: 0.15 + Math.random() * 0.25,
      rotationSpeed: 0.8 + Math.random() * 2.0,
      gameType: ['power-up', 'collectible', 'obstacle', 'bonus'][i % 4],
      originalPosition: [0, 0, 0] as [number, number, number],
    }));
  }, [viewport.width, viewport.height]);
  
  // Store original positions
  React.useEffect(() => {
    shapes.forEach((shape) => {
      shape.originalPosition = [...shape.position];
    });
  }, [shapes]);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Enhanced parallax effect
    groupRef.current.position.y = scrollProgress * viewport.height * 0.4;
    groupRef.current.rotation.z = scrollProgress * Math.PI * 0.15;
    
    // Mouse influence on the entire group
    const mouseInfluence = 0.1;
    groupRef.current.position.x = mousePos.x * mouseInfluence;
    groupRef.current.rotation.y = mousePos.x * 0.05;
    
    // Animate individual shapes with gaming behaviors
    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      if (child) {
        // Gaming-inspired rotation patterns
        if (shape.gameType === 'power-up') {
          // Power-ups spin fast and bob up and down
          child.rotation.x = time * shape.rotationSpeed * 2;
          child.rotation.y = time * shape.rotationSpeed * 1.5;
          child.position.y = shape.originalPosition[1] + Math.sin(time * 3 + i) * 0.3;
        } else if (shape.gameType === 'collectible') {
          // Collectibles rotate smoothly and pulse
          child.rotation.x = time * shape.rotationSpeed;
          child.rotation.z = time * shape.rotationSpeed * 0.8;
          const pulse = 1 + Math.sin(time * 4 + i) * 0.3;
          child.scale.setScalar(shape.scale * pulse);
        } else if (shape.gameType === 'obstacle') {
          // Obstacles have menacing movement
          child.rotation.x = time * shape.rotationSpeed * 0.5;
          child.rotation.y = time * shape.rotationSpeed * -0.7;
          child.position.x = shape.originalPosition[0] + Math.sin(time * 2 + i) * 0.2;
        } else {
          // Bonus items have complex rotation
          child.rotation.x = time * shape.rotationSpeed + scrollProgress * Math.PI;
          child.rotation.y = time * shape.rotationSpeed * 0.7 + scrollProgress * Math.PI * 0.5;
          child.rotation.z = Math.sin(time + i) * 0.5;
        }
        
        // Mouse interaction with individual shapes
        const mouseWorldX = mousePos.x * viewport.width / 2;
        const mouseWorldY = mousePos.y * viewport.height / 2;
        const dx = child.position.x - mouseWorldX;
        const dy = child.position.y - mouseWorldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 4) { // Increased interaction radius
          // Enhanced shapes reaction to mouse proximity
          const force = (4 - distance) / 4;
          const interactionStrength = 0.8; // Increased interaction strength
          
          // Different interaction behaviors based on game type
          let pushX, pushY, mouseScale;
          
          switch (shape.gameType) {
            case 'power-up':
              // Power-ups are attracted to mouse with bobbing motion
              pushX = -(dx / distance) * force * interactionStrength * 0.6;
              pushY = -(dy / distance) * force * interactionStrength * 0.6 + Math.sin(time * 4 + i) * force * 0.3;
              mouseScale = 1 + force * 0.8 + Math.sin(time * 6 + i) * 0.2;
              break;
            case 'collectible':
              // Collectibles orbit around the mouse
              const orbitAngle = Math.atan2(dy, dx) + time * 3 + i;
              const orbitRadius = distance * 0.7;
              pushX = Math.cos(orbitAngle) * orbitRadius - shape.originalPosition[0];
              pushY = Math.sin(orbitAngle) * orbitRadius - shape.originalPosition[1];
              mouseScale = 1 + force * 0.6;
              break;
            case 'obstacle':
              // Obstacles repel strongly and shake
              const shakeX = Math.sin(time * 15 + i) * force * 0.2;
              const shakeY = Math.cos(time * 12 + i) * force * 0.2;
              pushX = (dx / distance) * force * interactionStrength * 1.2 + shakeX;
              pushY = (dy / distance) * force * interactionStrength * 1.2 + shakeY;
              mouseScale = 1 + force * 0.4;
              break;
            case 'bonus':
              // Bonus items create a magnetic field effect
              const magneticAngle = Math.atan2(dy, dx) + Math.sin(time * 2 + i) * 0.5;
              pushX = Math.cos(magneticAngle) * force * interactionStrength * 0.7;
              pushY = Math.sin(magneticAngle) * force * interactionStrength * 0.7;
              mouseScale = 1 + force * 1.0 + Math.sin(time * 8 + i) * 0.3;
              break;
            default:
              pushX = (dx / distance) * force * interactionStrength;
              pushY = (dy / distance) * force * interactionStrength;
              mouseScale = 1 + force * 0.5;
          }
          
          child.position.x = shape.originalPosition[0] + pushX;
          child.position.y = shape.originalPosition[1] + pushY;
          child.scale.setScalar(shape.scale * mouseScale);
          
          // Add rotation based on mouse interaction
          const rotationSpeed = force * 2;
          child.rotation.x += rotationSpeed * 0.02;
          child.rotation.y += rotationSpeed * 0.03;
          child.rotation.z += rotationSpeed * 0.01;
          
        } else {
          // Smooth return to original position and scale
          child.position.x = THREE.MathUtils.lerp(child.position.x, shape.originalPosition[0], 0.08);
          child.position.y = THREE.MathUtils.lerp(child.position.y, shape.originalPosition[1], 0.08);
          child.scale.setScalar(THREE.MathUtils.lerp(child.scale.x, shape.scale, 0.08));
        }
        
        // Gaming-inspired material effects
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (material) {
          let intensity = 0.8;
          let wireframe = true;
          
          // Different visual styles based on game type
          switch (shape.gameType) {
            case 'power-up':
              intensity = 1.2 + Math.sin(time * 8 + i) * 0.3;
              wireframe = false;
              break;
            case 'collectible':
              intensity = 1.0 + Math.sin(time * 6 + i) * 0.2;
              break;
            case 'obstacle':
              intensity = 0.6 + Math.sin(time * 4 + i) * 0.4;
              material.color.setHex(0xff4444); // Red tint for obstacles
              break;
            case 'bonus':
              intensity = 1.1 + Math.sin(time * 10 + i) * 0.4;
              // Rainbow effect for bonus items
              const hue = (time * 0.5 + i * 0.2) % 1;
              material.color.setHSL(hue, 0.8, 0.6);
              break;
          }
          
          material.opacity = intensity * 0.9;
          material.wireframe = wireframe;
        }
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape) => {
        const commonProps = {
          position: shape.position,
          scale: shape.scale,
        };
        
        // Gaming-inspired materials based on type
        const gameMaterial = (
          <meshBasicMaterial
            color={shape.color}
            transparent
            opacity={0.9}
            wireframe={shape.gameType !== 'power-up'}
          />
        );
        
        switch (shape.type) {
          case 'box':
            return (
              <Box key={shape.id} {...commonProps}>
                {gameMaterial}
              </Box>
            );
          case 'sphere':
            return (
              <Sphere key={shape.id} {...commonProps} args={[1, 12, 8]}>
                {gameMaterial}
              </Sphere>
            );
          case 'octahedron':
            return (
              <mesh key={shape.id} {...commonProps}>
                <octahedronGeometry args={[1, 0]} />
                {gameMaterial}
              </mesh>
            );
          case 'tetrahedron':
            return (
              <mesh key={shape.id} {...commonProps}>
                <tetrahedronGeometry args={[1, 0]} />
                {gameMaterial}
              </mesh>
            );
          case 'torus':
            return (
              <mesh key={shape.id} {...commonProps}>
                <torusGeometry args={[0.8, 0.3, 8, 16]} />
                {gameMaterial}
              </mesh>
            );
          case 'cone':
            return (
              <mesh key={shape.id} {...commonProps}>
                <coneGeometry args={[0.8, 1.5, 8]} />
                {gameMaterial}
              </mesh>
            );
          default:
            return null;
        }
      })}
    </group>
  );
}

function ParticleSystem({ mousePosition, scrollProgress, activeSection }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const mouseWorldPosition = useRef(new THREE.Vector3());
  const { capabilities } = useWebGLCapabilities();
  
  // Generate particle positions and colors
  const [positions, colors, originalColors, velocities] = useMemo(() => {
    // Use WebGL capabilities to determine particle count
    const particleCount = capabilities?.recommendedSettings.maxParticles || 300;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalColors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Gaming-inspired particle distribution
      const layer = Math.floor(i / (particleCount / 3)); // 3 layers for depth
      const layerDepth = (layer - 1) * 5; // -5, 0, 5 depth layers
      
      // Cluster some particles for gaming effect
      if (Math.random() < 0.3) {
        // Clustered particles (like power-up effects)
        const clusterX = (Math.random() - 0.5) * viewport.width * 0.6;
        const clusterY = (Math.random() - 0.5) * viewport.height * 0.6;
        positions[i * 3] = clusterX + (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = clusterY + (Math.random() - 0.5) * 2;
      } else {
        // Scattered particles
        positions[i * 3] = (Math.random() - 0.5) * viewport.width;
        positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height;
      }
      positions[i * 3 + 2] = layerDepth + (Math.random() - 0.5) * 3;
      
      // Gaming-inspired color system
      const particleType = i % 4;
      let color: THREE.Color;
      
      if (particleType === 0) {
        // Standard particles - club colors
        color = new THREE.Color(CLUB_COLORS[Math.floor(Math.random() * CLUB_COLORS.length)]);
      } else if (particleType === 1) {
        // Special particles - brighter, more saturated
        color = new THREE.Color(CLUB_COLORS[Math.floor(Math.random() * CLUB_COLORS.length)]);
        color.multiplyScalar(1.5);
      } else if (particleType === 2) {
        // Energy particles - cyan/electric blue
        color = new THREE.Color('#00ffff');
      } else {
        // Rare particles - gold/yellow
        color = new THREE.Color('#ffff00');
      }
      
      // Add gaming-style variation
      const variation = 0.7 + Math.random() * 0.6;
      color.multiplyScalar(variation);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Store original colors for effects
      originalColors[i * 3] = color.r;
      originalColors[i * 3 + 1] = color.g;
      originalColors[i * 3 + 2] = color.b;
      
      // Gaming-inspired velocities
      if (particleType === 1) {
        // Fast-moving particles
        velocities[i * 3] = (Math.random() - 0.5) * 0.04;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      } else {
        // Standard velocities
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      }
    }
    
    return [positions, colors, originalColors, velocities];
  }, [viewport.width, viewport.height, capabilities?.recommendedSettings.maxParticles]);
  
  // Animation loop with enhanced effects
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    
    // Convert mouse position to world coordinates
    const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
    
    // Update mouse world position
    mouseWorldPosition.current.set(
      mouseX * viewport.width / 2,
      mouseY * viewport.height / 2,
      0
    );
    
    // Refined interaction settings for more natural effects
    const mouseInfluence = 6; // Reduced radius for more localized effects
    const pushStrength = 0.08; // Moderate push strength
    const attractStrength = 0.03; // Subtle attraction
    const magneticStrength = 0.04; // Gentle magnetic effects
    
    // Performance optimization: reduce update frequency on slower devices
    const updateFrequency = delta > 0.02 ? 2 : 1;
    
    // Parallax effect based on scroll
    const parallaxStrength = 0.5;
    const scrollOffset = scrollProgress * viewport.height * parallaxStrength;
    
    for (let i = 0; i < positions.length; i += 3 * updateFrequency) {
      const particleIndex = i / 3;
      
      // Enhanced floating animation with scroll influence
      const floatSpeed = 0.5 + (particleIndex % 100) * 0.01;
      const scrollWave = Math.sin(scrollProgress * Math.PI * 2 + particleIndex * 0.1) * 0.5;
      
      // Apply velocities for organic movement
      positions[i] += velocities[i] + scrollWave * 0.01;
      positions[i + 1] += velocities[i + 1] + Math.sin(time * floatSpeed + positions[i] * 0.01) * 0.003;
      positions[i + 2] += velocities[i + 2] * 0.5;
      
      // Parallax scrolling effect - different layers move at different speeds
      const depth = (positions[i + 2] + 7.5) / 15; // Normalize depth to 0-1
      positions[i + 1] -= scrollOffset * depth * 0.1;
      
      // Gaming-inspired particle trails based on scroll speed
      const scrollSpeed = Math.abs(scrollProgress - (scrollProgress || 0));
      if (scrollSpeed > 0.001) {
        // Create trail effect during scroll
        const trailIntensity = Math.min(scrollSpeed * 100, 1);
        positions[i + 2] += (Math.random() - 0.5) * trailIntensity * 0.1;
      }
      
      // Enhanced mouse interaction with gaming effects
      const particleX = positions[i];
      const particleY = positions[i + 1];
      const mouseWorldX = mouseWorldPosition.current.x;
      const mouseWorldY = mouseWorldPosition.current.y;
      
      const dx = particleX - mouseWorldX;
      const dy = particleY - mouseWorldY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseInfluence && distance > 0) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Create wave-like disturbance instead of direct beam following
        const wavePhase = time * 2 + particleIndex * 0.1;
        const distanceWave = Math.sin(distance * 0.5 + time * 3) * 0.5 + 0.5;
        const forceMultiplier = force * distanceWave;
        
        // Enhanced gaming-style particle behavior based on particle type
        const particleType = particleIndex % 5;
        
        if (particleType === 0) {
          // Ripple effect particles - create expanding waves from mouse
          const ripplePhase = time * 4 - distance * 0.3;
          const rippleStrength = Math.sin(ripplePhase) * forceMultiplier * 0.08;
          const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
          
          positions[i] += Math.cos(perpAngle) * rippleStrength;
          positions[i + 1] += Math.sin(perpAngle) * rippleStrength;
          positions[i] += normalizedDx * forceMultiplier * pushStrength * 0.3;
          positions[i + 1] += normalizedDy * forceMultiplier * pushStrength * 0.3;
          
        } else if (particleType === 1) {
          // Vortex particles - create swirling motion around mouse area
          const vortexAngle = Math.atan2(dy, dx) + time * 2 + distance * 0.1;
          const vortexStrength = forceMultiplier * 0.06;
          const vortexRadius = distance * 0.8;
          
          positions[i] += Math.cos(vortexAngle) * vortexStrength - normalizedDx * forceMultiplier * attractStrength * 0.5;
          positions[i + 1] += Math.sin(vortexAngle) * vortexStrength - normalizedDy * forceMultiplier * attractStrength * 0.5;
          
        } else if (particleType === 2) {
          // Turbulence particles - chaotic but controlled movement
          const turbulence1 = Math.sin(time * 3 + particleIndex * 0.2 + distance * 0.1) * 0.04;
          const turbulence2 = Math.cos(time * 2.3 + particleIndex * 0.15 + distance * 0.08) * 0.04;
          const dampening = 1 - force * 0.7; // Reduce effect closer to mouse
          
          positions[i] += turbulence1 * forceMultiplier * dampening;
          positions[i + 1] += turbulence2 * forceMultiplier * dampening;
          positions[i] += normalizedDx * forceMultiplier * pushStrength * 0.2;
          positions[i + 1] += normalizedDy * forceMultiplier * pushStrength * 0.2;
          
        } else if (particleType === 3) {
          // Pulse particles - expand and contract in waves
          const pulsePhase = time * 5 + particleIndex * 0.3;
          const pulseStrength = Math.sin(pulsePhase) * forceMultiplier * 0.1;
          const radialDirection = force > 0.5 ? 1 : -1; // Switch direction based on proximity
          
          positions[i] += normalizedDx * pulseStrength * radialDirection;
          positions[i + 1] += normalizedDy * pulseStrength * radialDirection;
          
        } else {
          // Ambient particles - subtle floating motion influenced by mouse presence
          const ambientPhase = time * 1.5 + particleIndex * 0.05;
          const ambientStrength = forceMultiplier * 0.03;
          const floatDirection = Math.sin(ambientPhase + distance * 0.2);
          
          positions[i] += Math.sin(ambientPhase) * ambientStrength;
          positions[i + 1] += Math.cos(ambientPhase * 0.8) * ambientStrength * floatDirection;
          positions[i] += normalizedDx * forceMultiplier * pushStrength * 0.1;
          positions[i + 1] += normalizedDy * forceMultiplier * pushStrength * 0.1;
        }
        
        // Subtle and organic visual effects near mouse
        const colorIndex = particleIndex;
        const brightness = 1 + force * 0.8; // More subtle brightness increase
        const organicPulse = 1 + Math.sin(time * 3 + particleIndex * 0.1 + distance * 0.2) * 0.3; // Slower, more organic pulsing
        const proximityGlow = 1 + (1 - force) * 0.3; // Gentler glow
        
        // More natural color effects based on particle type
        if (particleType === 1) {
          // Vortex particles - soft blue with gentle shimmer
          const shimmerEffect = Math.sin(time * 4 + particleIndex * 0.2) * 0.2 + 0.8;
          colors[colorIndex * 3] = Math.min(1, 0.4 * brightness * shimmerEffect);
          colors[colorIndex * 3 + 1] = Math.min(1, 0.7 * brightness * shimmerEffect);
          colors[colorIndex * 3 + 2] = Math.min(1, 0.9 * brightness * proximityGlow);
        } else if (particleType === 2) {
          // Turbulence particles - shifting green-blue
          const colorShift = Math.sin(time * 2 + particleIndex * 0.15) * 0.3 + 0.7;
          colors[colorIndex * 3] = Math.min(1, 0.3 * brightness * colorShift);
          colors[colorIndex * 3 + 1] = Math.min(1, 0.8 * brightness * organicPulse);
          colors[colorIndex * 3 + 2] = Math.min(1, 0.6 * brightness * colorShift);
        } else if (particleType === 3) {
          // Pulse particles - warm orange with gentle pulsing
          const warmPulse = Math.sin(time * 5 + particleIndex * 0.3) * 0.3 + 0.7;
          colors[colorIndex * 3] = Math.min(1, 0.9 * brightness * warmPulse);
          colors[colorIndex * 3 + 1] = Math.min(1, 0.5 * brightness * warmPulse);
          colors[colorIndex * 3 + 2] = Math.min(1, 0.2 * brightness * proximityGlow);
        } else if (particleType === 4) {
          // Ambient particles - soft purple with gentle breathing
          const breathingEffect = Math.sin(time * 1.5 + particleIndex * 0.05) * 0.2 + 0.8;
          colors[colorIndex * 3] = Math.min(1, 0.6 * brightness * breathingEffect);
          colors[colorIndex * 3 + 1] = Math.min(1, 0.3 * brightness * breathingEffect);
          colors[colorIndex * 3 + 2] = Math.min(1, 0.8 * brightness * proximityGlow);
        } else {
          // Ripple particles - enhanced original colors with subtle waves
          const rippleEffect = Math.sin(time * 4 + distance * 0.3) * 0.2 + 0.8;
          colors[colorIndex * 3] = Math.min(1, originalColors[colorIndex * 3] * brightness * organicPulse * rippleEffect);
          colors[colorIndex * 3 + 1] = Math.min(1, originalColors[colorIndex * 3 + 1] * brightness * organicPulse * rippleEffect);
          colors[colorIndex * 3 + 2] = Math.min(1, originalColors[colorIndex * 3 + 2] * brightness * organicPulse * rippleEffect);
        }
      } else {
        // Section-based color variations
        const colorIndex = particleIndex;
        let sectionMultiplier = 1;
        
        switch (activeSection) {
          case 'team':
            sectionMultiplier = 1.2;
            break;
          case 'projects':
            sectionMultiplier = 1.1;
            break;
          case 'achievements':
            sectionMultiplier = 1.3;
            break;
          default:
            sectionMultiplier = 1;
        }
        
        // Subtle pulsing based on section
        const sectionPulse = 1 + Math.sin(time * 0.5 + particleIndex * 0.1) * 0.1 * sectionMultiplier;
        
        colors[colorIndex * 3] = originalColors[colorIndex * 3] * sectionPulse;
        colors[colorIndex * 3 + 1] = originalColors[colorIndex * 3 + 1] * sectionPulse;
        colors[colorIndex * 3 + 2] = originalColors[colorIndex * 3 + 2] * sectionPulse;
      }
      
      // Enhanced boundary wrapping with smooth transitions
      const margin = viewport.width * 0.15;
      if (positions[i] > viewport.width / 2 + margin) {
        positions[i] = -viewport.width / 2 - margin;
        // Reset velocity for smooth re-entry
        velocities[i] = (Math.random() - 0.5) * 0.02;
      }
      if (positions[i] < -viewport.width / 2 - margin) {
        positions[i] = viewport.width / 2 + margin;
        velocities[i] = (Math.random() - 0.5) * 0.02;
      }
      if (positions[i + 1] > viewport.height / 2 + margin) {
        positions[i + 1] = -viewport.height / 2 - margin;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      }
      if (positions[i + 1] < -viewport.height / 2 - margin) {
        positions[i + 1] = viewport.height / 2 + margin;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      }
      
      // Z-axis boundaries for depth effect
      if (positions[i + 2] > 7.5) positions[i + 2] = -7.5;
      if (positions[i + 2] < -7.5) positions[i + 2] = 7.5;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    
    // Enhanced rotation with scroll influence
    pointsRef.current.rotation.z = time * 0.02 + scrollProgress * 0.1;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05 + scrollProgress * 0.05;
    pointsRef.current.rotation.y = scrollProgress * 0.02;
  });
  
  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={1.0}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </Points>
  );
}

interface ThreeBackgroundProps {
  className?: string;
  scrollProgress?: number;
  activeSection?: string;
}

export default function ThreeBackground({ 
  className = '', 
  scrollProgress = 0, 
  activeSection = 'home' 
}: ThreeBackgroundProps) {
  // Temporarily disabled extreme optimization to fix visibility issues
  // if (process.env.NODE_ENV === 'production') {
  //   return (
  //     <ExtremeOptimizedThreeBackground
  //       className={className}
  //       scrollProgress={scrollProgress}
  //       activeSection={activeSection}
  //     />
  //   );
  // }
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const isVisible = useRef(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const previousSection = useRef(activeSection);
  const { deviceTier } = usePerformanceMonitor();
  const { capabilities, isLoading: webglLoading } = useWebGLCapabilities();
  const [contextLost, setContextLost] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track mouse/touch position with throttling for performance
  const lastMouseUpdate = useRef(0);
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    if (now - lastMouseUpdate.current > 16) { // ~60fps throttling
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
      lastMouseUpdate.current = now;
    }
  }, []);

  // Handle touch events for mobile devices
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const now = Date.now();
      if (now - lastMouseUpdate.current > 16) {
        setMousePosition({
          x: touch.clientX,
          y: touch.clientY,
        });
        lastMouseUpdate.current = now;
      }
    }
  }, []);
  
  // Performance optimization: pause animation when tab is not visible
  const handleVisibilityChange = useCallback(() => {
    isVisible.current = !document.hidden;
  }, []);

  // Fallback animation effect
  React.useEffect(() => {
    if (!capabilities?.supported || contextLost) {
      // Create fallback animation
      const fallback = createFallbackAnimation();
      fallback.animationElement.className += ` ${className}`;
      document.head.appendChild(fallback.styleElement);
      document.body.appendChild(fallback.animationElement);

      return () => {
        fallback.cleanup();
      };
    }
  }, [capabilities?.supported, contextLost, className]);

  // WebGL context monitoring
  React.useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = setupWebGLContextMonitoring(
      canvasRef.current,
      () => {
        console.warn('WebGL context lost, switching to fallback');
        setContextLost(true);
      },
      () => {
        console.log('WebGL context restored');
        setContextLost(false);
      }
    );

    return cleanup;
  }, []);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle section transitions
  React.useEffect(() => {
    if (previousSection.current !== activeSection) {
      setIsTransitioning(true);
      previousSection.current = activeSection;
      
      // Stop transition after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  // Set up event listeners
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleMouseMove, handleTouchMove, handleVisibilityChange]);


  // Show loading state while detecting WebGL capabilities
  if (webglLoading) {
    return (
      <div className={`fixed inset-0 ${className}`} style={{ zIndex: -10 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-red-900/20 animate-pulse" />
      </div>
    );
  }

  // Fallback for unsupported devices or context loss
  if (!capabilities?.supported || contextLost) {
    return (
      <div className={`fixed inset-0 ${className}`} style={{ zIndex: -10 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-red-900/20" />
      </div>
    );
  }
  
  console.log('🎮 ThreeBackground: Rendering with props', { scrollProgress, activeSection, className });
  
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: -10, background: 'radial-gradient(circle at center, rgba(34,197,94,0.1) 0%, transparent 50%)' }}>
      <ClientOnly
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-red-900/20" />
        }
      >
        <ThreeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Three.js Error:', error);
            console.error('Error Info:', errorInfo);
            // Could send to error reporting service here
          }}
          showErrorDetails={process.env.NODE_ENV === 'development'}
          maxRetries={2}
        >
          <Canvas
          ref={canvasRef}
          camera={{ 
            position: [0, 0, 5], 
            fov: isMobile ? 85 : 75,
            near: 0.1,
            far: capabilities.isLowEnd ? 500 : 1000
          }}
          dpr={capabilities.isLowEnd ? [0.5, 1] : isMobile ? [1, 1.5] : [1, 2]}
          performance={{ 
            min: capabilities.recommendedSettings.enableComplexEffects ? 0.5 : 0.1,
            max: capabilities.recommendedSettings.enableComplexEffects ? 1 : 0.5
          }}
          gl={{ 
            antialias: capabilities.recommendedSettings.antialias,
            alpha: true,
            powerPreference: capabilities.recommendedSettings.powerPreference,
            precision: capabilities.recommendedSettings.precision,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false,
            preserveDrawingBuffer: false, // Better performance
            failIfMajorPerformanceCaveat: false, // Allow fallback
          }}
          onCreated={({ gl, scene }) => {
            // Store canvas reference for context monitoring
            if (gl.domElement instanceof HTMLCanvasElement) {
              canvasRef.current = gl.domElement;
            }

            // Enhanced WebGL optimizations based on capabilities
            gl.setClearColor(0x000000, 0);
            
            // Apply capability-based optimizations
            if (capabilities.isLowEnd) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
              scene.fog = null;
              gl.shadowMap.enabled = false;
            } else if (isMobile) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              gl.shadowMap.enabled = false;
            }
            
            // Set texture filtering based on capabilities
            if (capabilities.maxTextureSize < 2048) {
              // Use lower quality texture filtering for low-end devices
              const context = gl.getContext();
              if (context) {
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
              }
            }
          }}
          frameloop={isVisible.current ? 'always' : 'never'}
          onError={(error) => {
            console.error('Canvas error:', error);
            setContextLost(true);
          }}
        >
          <ParticleSystem 
            mousePosition={mousePosition} 
            scrollProgress={scrollProgress}
            activeSection={activeSection}
          />
          {capabilities.recommendedSettings.enableComplexEffects && (
            <Interactive3DElements 
              scrollProgress={scrollProgress}
              activeSection={activeSection}
            />
          )}
          {capabilities.recommendedSettings.enableComplexEffects && !isMobile && (
            <ParticleTransitions 
              activeSection={activeSection}
              isTransitioning={isTransitioning}
            />
          )}
        </Canvas>
      </ThreeErrorBoundary>
    </ClientOnly>
    </div>
  );
}