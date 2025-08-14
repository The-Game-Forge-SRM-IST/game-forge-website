// Verification script to ensure all dependencies are working
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Verify Three.js
export const verifyThreeJS = () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return scene.children.length > 0;
};

// Verify form validation setup
const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export const verifyFormSetup = () => {
  try {
    const resolver = zodResolver(testSchema);
    return typeof resolver === 'function';
  } catch {
    return false;
  }
};

// Export verification results
export const setupVerification = {
  threeJS: verifyThreeJS(),
  formValidation: verifyFormSetup(),
  dependencies: {
    three: typeof THREE !== 'undefined',
    framerMotion: typeof motion !== 'undefined',
    reactThreeFiber: typeof Canvas !== 'undefined',
    intersectionObserver: typeof useInView !== 'undefined',
    reactHookForm: typeof useForm !== 'undefined',
    zod: typeof z !== 'undefined',
  },
};