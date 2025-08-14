'use client';

import React, { useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Removed unused imports
import * as THREE from 'three';
import { useExtremePerformance, useComponentPerformance } from '@/hooks/useExtremePerformance';
import ExtremeOptimizedParticleSystem from './ExtremeOptimizedParticleSystem';
import { smartResourceManager } from '@/lib/advancedCaching';
import { QualitySettings } from '@/lib/extremeOptimization';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import ClientOnly from '@/components/ui/ClientOnly';

// Optimized 3D elements with LOD (Level of Detail)
function OptimizedInteractive3DElements({ 
  scrollProgress, 
  qualitySettings 
}: { 
  scrollProgress: number; 
  activeSection: string;
  qualitySettings: QualitySettings;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const { trackRender } = useComponentPerformance('Interactive3DElements');
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  
  // Optimized mouse tracking with throttling
  const lastMouseUpdate = useRef(0);
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate.current > 32) { // 30fps throttling for mouse
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
  
  // Cached geometries and materials
  const { shapes, materials } = useMemo(() => {
    const shapeCount = Math.floor(qualitySettings.maxParticles / 150); // More shapes for richer visuals
    const gameShapes = ['box', 'sphere', 'octahedron', 'tetrahedron', 'dodecahedron'] as const;
    
    const shapes = Array.from({ length: shapeCount }, (_, i) => ({
      id: i,
      type: gameShapes[i % gameShapes.length],
      position: [
        (Math.random() - 0.5) * viewport.width * 0.8,
        (Math.random() - 0.5) * viewport.height * 0.8,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.3,
      rotationSpeed: 0.3 + Math.random() * 0.8,
    }));

    // Cache materials for reuse with beautiful colors
    const materials = {
      wireframe: smartResourceManager.getMaterial('wireframe_gaming', () => 
        new THREE.MeshBasicMaterial({
          color: '#22c55e',
          wireframe: true,
          transparent: true,
          opacity: 0.7
        })
      ),
      solid: smartResourceManager.getMaterial('solid_gaming', () =>
        new THREE.MeshBasicMaterial({
          color: '#3b82f6',
          transparent: true,
          opacity: 0.8
        })
      ),
      glowing: smartResourceManager.getMaterial('glowing_gaming', () =>
        new THREE.MeshBasicMaterial({
          color: '#f59e0b',
          transparent: true,
          opacity: 0.9
        })
      ),
      purple: smartResourceManager.getMaterial('purple_gaming', () =>
        new THREE.MeshBasicMaterial({
          color: '#8b5cf6',
          transparent: true,
          opacity: 0.8
        })
      )
    };

    return { shapes, materials };
  }, [viewport.width, viewport.height, qualitySettings.maxParticles]);

  useFrame((state) => {
    trackRender();
    
    if (!groupRef.current || !qualitySettings.enableComplexEffects) return;
    
    const time = state.clock.getElapsedTime();
    
    // Optimized group transformations
    groupRef.current.position.y = scrollProgress * viewport.height * 0.2;
    groupRef.current.rotation.z = scrollProgress * Math.PI * 0.1;
    
    // Update only visible children with LOD
    groupRef.current.children.forEach((child, i) => {
      if (!child.visible) return;
      
      const shape = shapes[i];
      if (shape) {
        // Simplified rotation for performance
        child.rotation.x = time * shape.rotationSpeed * 0.5;
        child.rotation.y = time * shape.rotationSpeed * 0.3;
        
        // Mouse interaction with distance culling
        const dx = child.position.x - mousePos.x * viewport.width / 4;
        const dy = child.position.y - mousePos.y * viewport.height / 4;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 3) {
          const force = (3 - distance) / 3;
          child.scale.setScalar(shape.scale * (1 + force * 0.3));
        } else {
          child.scale.setScalar(shape.scale);
        }
      }
    });
  });
  
  if (!qualitySettings.enableComplexEffects) return null;
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape) => {
        const geometry = smartResourceManager.getGeometry(`${shape.type}_geo`, () => {
          switch (shape.type) {
            case 'box':
              return new THREE.BoxGeometry(1, 1, 1);
            case 'sphere':
              return new THREE.SphereGeometry(0.5, 8, 6);
            case 'octahedron':
              return new THREE.OctahedronGeometry(0.5, 0);
            case 'tetrahedron':
              return new THREE.TetrahedronGeometry(0.6, 0);
            case 'dodecahedron':
              return new THREE.DodecahedronGeometry(0.4, 0);
            default:
              return new THREE.BoxGeometry(1, 1, 1);
          }
        });

        return (
          <mesh 
            key={shape.id} 
            position={shape.position}
            scale={shape.scale}
            geometry={geometry}
            material={
              shape.id % 4 === 0 ? materials.wireframe :
              shape.id % 4 === 1 ? materials.solid :
              shape.id % 4 === 2 ? materials.glowing :
              materials.purple
            }
          />
        );
      })}
    </group>
  );
}

// Optimized lighting system
function OptimizedLighting({ qualitySettings }: { qualitySettings: any }) {
  const { trackRender } = useComponentPerformance('OptimizedLighting');
  
  useFrame(() => {
    trackRender();
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      {qualitySettings.enableShadows && (
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )}
    </>
  );
}

// Main optimized scene
function OptimizedScene({ 
  mousePosition, 
  scrollProgress, 
  activeSection,
  onPerformanceUpdate 
}: {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  activeSection: string;
  onPerformanceUpdate?: (metrics: any) => void;
}) {
  const { qualitySettings, shouldRender } = useExtremePerformance({
    targetFPS: 120,
    enableAdaptiveQuality: true,
    enableMemoryManagement: true,
    enableCaching: true,
  });

  const { trackRender } = useComponentPerformance('OptimizedScene');
  
  useFrame(() => {
    trackRender();
    
    // Skip rendering if frame rate limiter says no
    if (!shouldRender()) return;
  });

  return (
    <>
      <OptimizedLighting qualitySettings={qualitySettings} />
      
      <ExtremeOptimizedParticleSystem
        colors={['#22c55e', '#3b82f6', '#ef4444']}
        mousePosition={mousePosition}
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        onPerformanceUpdate={onPerformanceUpdate}
      />
      
      <OptimizedInteractive3DElements
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        qualitySettings={qualitySettings}
      />
    </>
  );
}

// Loading fallback component
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

interface ExtremeOptimizedThreeBackgroundProps {
  className?: string;
  scrollProgress?: number;
  activeSection?: string;
  onPerformanceUpdate?: (metrics: any) => void;
}

export default function ExtremeOptimizedThreeBackground({ 
  className = '', 
  scrollProgress = 0, 
  activeSection = 'home',
  onPerformanceUpdate
}: ExtremeOptimizedThreeBackgroundProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { trackRender } = useComponentPerformance('ExtremeOptimizedThreeBackground');
  
  // Extreme performance monitoring
  const { 
    qualitySettings, 
    summary, 
    triggerOptimization,
    preloadResources 
  } = useExtremePerformance({
    targetFPS: 120,
    enableAdaptiveQuality: true,
    enableMemoryManagement: true,
    enableCaching: true,
    optimizationThreshold: 0.8
  });

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

  // Event listeners
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  // Preload resources on mount
  React.useEffect(() => {
    preloadResources();
  }, [preloadResources]);

  // Performance monitoring
  React.useEffect(() => {
    if (summary && onPerformanceUpdate) {
      onPerformanceUpdate(summary);
    }
  }, [summary, onPerformanceUpdate]);

  // Manual optimization trigger for critical performance
  React.useEffect(() => {
    if (summary?.overall === 'poor') {
      triggerOptimization();
    }
  }, [summary?.overall, triggerOptimization]);

  const canvasProps = useMemo(() => ({
    ref: canvasRef,
    className: `fixed inset-0 ${className}`,
    style: { zIndex: -1 },
    gl: {
      antialias: qualitySettings.antialias,
      alpha: true,
      powerPreference: qualitySettings.enableComplexEffects ? 'high-performance' as const : 'low-power' as const,
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false,
      precision: qualitySettings.enableComplexEffects ? 'highp' as const : 'mediump' as const,
    },
    dpr: qualitySettings.pixelRatio,
    performance: { min: 0.8 },
    frameloop: 'always' as const,
    resize: { scroll: false, debounce: { scroll: 50, resize: 0 } },
  }), [qualitySettings, className]);

  React.useEffect(() => {
    trackRender();
  });

  return (
    <ClientOnly>
      <ThreeErrorBoundary fallback={<LoadingFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas {...canvasProps}>
            <OptimizedScene
              mousePosition={mousePosition}
              scrollProgress={scrollProgress}
              activeSection={activeSection}
              onPerformanceUpdate={onPerformanceUpdate}
            />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </ClientOnly>
  );
}