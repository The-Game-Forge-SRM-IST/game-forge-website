'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FPSMonitor } from '@/lib/performance';

interface OptimizedParticleSystemProps {
  count?: number;
  colors?: string[];
  size?: number;
  speed?: number;
}

export function OptimizedParticleSystem({
  count = 1000,
  colors = ['#22c55e', '#3b82f6', '#ef4444'],
  size = 2,
  speed = 0.5,
}: OptimizedParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport, camera } = useThree();
  const fpsMonitor = useRef<FPSMonitor | null>(null);
  const lastFPS = useRef(60);
  const adaptiveCount = useRef(count);

  // Memoize geometry and material for performance
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(adaptiveCount.current * 3);
    const colorArray = new Float32Array(adaptiveCount.current * 3);
    const sizes = new Float32Array(adaptiveCount.current);

    // Generate random positions and colors
    for (let i = 0; i < adaptiveCount.current; i++) {
      const i3 = i * 3;
      
      // Positions
      positions[i3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Colors
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      colorArray[i3] = color.r;
      colorArray[i3 + 1] = color.g;
      colorArray[i3 + 2] = color.b;

      // Sizes
      sizes[i] = Math.random() * size + 0.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add subtle movement
          mvPosition.x += sin(time * 0.5 + position.y * 0.01) * 2.0;
          mvPosition.y += cos(time * 0.3 + position.x * 0.01) * 1.5;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    return { geometry: geo, material: mat };
  }, [adaptiveCount.current, colors, size, viewport]);

  // Performance monitoring and adaptive quality
  useEffect(() => {
    fpsMonitor.current = new FPSMonitor((fps) => {
      lastFPS.current = fps;
      
      // Adaptive quality based on FPS
      if (fps < 30 && adaptiveCount.current > 500) {
        adaptiveCount.current = Math.max(500, adaptiveCount.current * 0.8);
      } else if (fps > 50 && adaptiveCount.current < count) {
        adaptiveCount.current = Math.min(count, adaptiveCount.current * 1.1);
      }
    });

    fpsMonitor.current.start();

    return () => {
      fpsMonitor.current?.stop();
    };
  }, [count]);

  // Animation loop with performance optimization
  useFrame((state) => {
    if (!meshRef.current) return;

    const { clock } = state;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    
    // Update time uniform
    material.uniforms.time.value = clock.elapsedTime * speed;

    // Reduce update frequency on low FPS
    if (lastFPS.current < 30) {
      if (Math.floor(clock.elapsedTime * 30) % 2 === 0) return;
    }

    // Rotate the entire system slowly
    meshRef.current.rotation.y += 0.001 * speed;
    meshRef.current.rotation.x += 0.0005 * speed;
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}