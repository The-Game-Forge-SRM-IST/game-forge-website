'use client';

import React, { useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import ClientOnly from '@/components/ui/ClientOnly';

// Club colors from the design document
const CLUB_COLORS = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

interface ParticleSystemProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  activeSection: string;
}

// Gaming-inspired Interactive 3D elements with light optimization
function Interactive3DElements({ scrollProgress, activeSection }: { scrollProgress: number; activeSection: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  
  // Optimized mouse tracking with throttling
  const lastMouseUpdate = useRef(0);
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate.current > 16) { // 60fps throttling
        setMousePos({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1
        });
        lastMouseUpdate.current = now;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Gaming-inspired 3D shapes with enhanced properties
  const shapes = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const shapeCount = isMobile ? 6 : 12;
    const gameShapes = ['box', 'sphere', 'octahedron', 'tetrahedron'] as const;
    
    return Array.from({ length: shapeCount }, (_, i) => ({
      id: i,
      type: gameShapes[i % gameShapes.length],
      position: [
        (Math.random() - 0.5) * viewport.width * 0.8,
        (Math.random() - 0.5) * viewport.height * 0.8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.4,
      rotationSpeed: 0.5 + Math.random() * 1.0,
      color: CLUB_COLORS[Math.floor(Math.random() * CLUB_COLORS.length)],
      wireframe: Math.random() > 0.5,
    }));
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth group transformations based on scroll
    groupRef.current.position.y = scrollProgress * viewport.height * 0.3;
    groupRef.current.rotation.z = scrollProgress * Math.PI * 0.1;
    
    // Update individual shapes with mouse interaction
    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      if (shape) {
        // Rotation animation
        child.rotation.x = time * shape.rotationSpeed * 0.5;
        child.rotation.y = time * shape.rotationSpeed * 0.3;
        child.rotation.z = time * shape.rotationSpeed * 0.2;
        
        // Mouse interaction with smooth falloff
        const dx = child.position.x - mousePos.x * viewport.width / 4;
        const dy = child.position.y - mousePos.y * viewport.height / 4;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 4) {
          const force = (4 - distance) / 4;
          child.scale.setScalar(shape.scale * (1 + force * 0.5));
          
          // Add some magnetic attraction
          child.position.x += (mousePos.x * viewport.width / 4 - child.position.x) * force * 0.02;
          child.position.y += (mousePos.y * viewport.height / 4 - child.position.y) * force * 0.02;
        } else {
          child.scale.setScalar(shape.scale);
        }
        
        // Floating animation
        child.position.y += Math.sin(time + i) * 0.01;
        child.position.x += Math.cos(time * 0.5 + i) * 0.005;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape) => {
        const geometry = shape.type === 'box' ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : shape.type === 'sphere' ? (
          <sphereGeometry args={[0.5, 16, 16]} />
        ) : shape.type === 'octahedron' ? (
          <octahedronGeometry args={[0.5, 0]} />
        ) : (
          <tetrahedronGeometry args={[0.6, 0]} />
        );

        return (
          <mesh key={shape.id} position={shape.position} scale={shape.scale}>
            {geometry}
            <meshBasicMaterial 
              color={shape.color} 
              wireframe={shape.wireframe}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Enhanced particle system with beautiful effects
function ParticleSystem({ mousePosition, scrollProgress, activeSection }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  // Adaptive particle count based on device performance
  const particleCount = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isLowEnd = typeof window !== 'undefined' && window.navigator.hardwareConcurrency <= 4;
    
    if (isMobile) return 800;
    if (isLowEnd) return 1200;
    return 2000;
  }, []);

  // Generate particle positions and colors
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorObjects = CLUB_COLORS.map(color => new THREE.Color(color));
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles in a more organic pattern
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * Math.min(viewport.width, viewport.height) * 0.6;
      
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * viewport.width * 0.3;
      positions[i3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * viewport.height * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Assign colors
      const colorIndex = Math.floor(Math.random() * colorObjects.length);
      const color = colorObjects[colorIndex];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, [particleCount, viewport.width, viewport.height]);

  // Animation loop with smooth effects
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Update particle positions with beautiful animations
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Mouse interaction
      const mouseX = (mousePosition.x / window.innerWidth) * viewport.width - viewport.width / 2;
      const mouseY = -(mousePosition.y / window.innerHeight) * viewport.height + viewport.height / 2;
      
      const dx = positions[i3] - mouseX;
      const dy = positions[i3 + 1] - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        positions[i3] += dx * force * 0.01;
        positions[i3 + 1] += dy * force * 0.01;
      }
      
      // Floating animation
      positions[i3 + 1] += Math.sin(time * 0.5 + positions[i3] * 0.01) * 0.02;
      positions[i3] += Math.cos(time * 0.3 + positions[i3 + 1] * 0.01) * 0.01;
      
      // Scroll-based movement
      positions[i3 + 1] -= scrollProgress * 0.1;
      
      // Boundary wrapping
      if (positions[i3] > viewport.width / 2) positions[i3] = -viewport.width / 2;
      if (positions[i3] < -viewport.width / 2) positions[i3] = viewport.width / 2;
      if (positions[i3 + 1] > viewport.height / 2) positions[i3 + 1] = -viewport.height / 2;
      if (positions[i3 + 1] < -viewport.height / 2) positions[i3 + 1] = viewport.height / 2;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Gentle rotation
    pointsRef.current.rotation.z += 0.001;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial 
        size={2} 
        sizeAttenuation 
        transparent 
        alphaTest={0.001}
        vertexColors
      />
    </Points>
  );
}

// Lighting system
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
    </>
  );
}

// Main scene component
function Scene({ mousePosition, scrollProgress, activeSection }: {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  activeSection: string;
}) {
  React.useEffect(() => {
    console.log('🎮 Three.js Scene: Rendering with props', { mousePosition, scrollProgress, activeSection });
  }, [mousePosition, scrollProgress, activeSection]);

  return (
    <>
      <Lighting />
      <ParticleSystem 
        mousePosition={mousePosition} 
        scrollProgress={scrollProgress} 
        activeSection={activeSection}
      />
      <Interactive3DElements scrollProgress={scrollProgress} activeSection={activeSection} />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

// Main component
interface OptimizedThreeBackgroundProps {
  className?: string;
  scrollProgress?: number;
  activeSection?: string;
}

export default function OptimizedThreeBackground({ 
  className = '', 
  scrollProgress = 0, 
  activeSection = 'home' 
}: OptimizedThreeBackgroundProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Get device performance info with fallback
  const deviceTier = useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    // Simple device detection
    const isMobile = window.innerWidth < 768;
    const isLowEnd = window.navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) return 'low';
    return 'high';
  }, []);

  // Set loaded state after component mounts
  React.useEffect(() => {
    console.log('🎮 OptimizedThreeBackground: Component mounting...');
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    console.log('🎮 OptimizedThreeBackground: Props updated', { scrollProgress, activeSection });
  }, [scrollProgress, activeSection]);
  
  // Optimized mouse tracking
  const lastMouseUpdate = useRef(0);
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    if (now - lastMouseUpdate.current > 16) { // 60fps throttling
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
      lastMouseUpdate.current = now;
    }
  }, []);

  // Touch handling for mobile
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

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  // Adaptive canvas settings based on device performance
  const canvasSettings = useMemo(() => {
    const isLowEnd = deviceTier === 'low';
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    
    return {
      dpr: isLowEnd ? 1 : Math.min(devicePixelRatio, 2),
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: isLowEnd ? 'low-power' as const : 'high-performance' as const,
    };
  }, [deviceTier]);

  if (!isLoaded) {
    return <LoadingFallback />;
  }

  return (
    <ClientOnly>
      <ThreeErrorBoundary fallback={<LoadingFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="fixed inset-0" style={{ zIndex: -1 }}>
            <Canvas
              className={`w-full h-full ${className}`}
              gl={canvasSettings}
              camera={{ position: [0, 0, 5], fov: 75 }}
              performance={{ min: 0.5 }}
            >
              <Scene
                mousePosition={mousePosition}
                scrollProgress={scrollProgress}
                activeSection={activeSection}
              />
            </Canvas>
          </div>
        </Suspense>
      </ThreeErrorBoundary>
    </ClientOnly>
  );
}