import { useState, useEffect } from 'react';

interface WebGLCapabilities {
  supported: boolean;
  version: string;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  maxVaryingVectors: number;
  isLowEnd: boolean;
  recommendedSettings: {
    maxParticles: number;
    enableComplexEffects: boolean;
    enableShadows: boolean;
    enablePostProcessing: boolean;
    antialias: boolean;
    powerPreference: 'default' | 'high-performance' | 'low-power';
    precision: 'highp' | 'mediump' | 'lowp';
  };
}

function detectWebGLCapabilities(): WebGLCapabilities | null {
  if (typeof window === 'undefined') return null;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) {
    return {
      supported: false,
      version: 'Not supported',
      renderer: 'Unknown',
      vendor: 'Unknown',
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      maxVaryingVectors: 0,
      isLowEnd: true,
      recommendedSettings: {
        maxParticles: 100,
        enableComplexEffects: false,
        enableShadows: false,
        enablePostProcessing: false,
        antialias: false,
        powerPreference: 'low-power',
        precision: 'lowp',
      },
    };
  }

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
  const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
  
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
  const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);

  // Determine device tier based on capabilities
  const isHighEnd = maxTextureSize >= 4096 && maxVertexUniforms >= 256;
  const isMidRange = maxTextureSize >= 2048 && maxVertexUniforms >= 128;
  const isLowEnd = !isHighEnd && !isMidRange;

  const recommendedSettings = {
    maxParticles: isHighEnd ? 2000 : isMidRange ? 1000 : 500,
    enableComplexEffects: isHighEnd,
    enableShadows: isHighEnd,
    enablePostProcessing: isHighEnd || isMidRange,
    antialias: isHighEnd,
    powerPreference: (isHighEnd ? 'high-performance' : isLowEnd ? 'low-power' : 'default') as 'default' | 'high-performance' | 'low-power',
    precision: (isHighEnd ? 'highp' : isMidRange ? 'mediump' : 'lowp') as 'highp' | 'mediump' | 'lowp',
  };

  // Clean up
  canvas.remove();

  return {
    supported: true,
    version: gl.getParameter(gl.VERSION),
    renderer,
    vendor,
    maxTextureSize,
    maxVertexUniforms,
    maxFragmentUniforms,
    maxVaryingVectors,
    isLowEnd,
    recommendedSettings,
  };
}

export function useWebGLCapabilities() {
  const [capabilities, setCapabilities] = useState<WebGLCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Delay detection to avoid blocking initial render
    const timer = setTimeout(() => {
      const caps = detectWebGLCapabilities();
      setCapabilities(caps);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { capabilities, isLoading };
}

export function getWebGLTier(): 'low' | 'medium' | 'high' {
  const capabilities = detectWebGLCapabilities();
  
  if (!capabilities?.supported) return 'low';
  
  if (capabilities.maxTextureSize >= 4096 && capabilities.maxVertexUniforms >= 256) {
    return 'high';
  }
  
  if (capabilities.maxTextureSize >= 2048 && capabilities.maxVertexUniforms >= 128) {
    return 'medium';
  }
  
  return 'low';
}
export
 function setupWebGLContextMonitoring(canvas: HTMLCanvasElement, onContextLost: () => void, onContextRestored: () => void) {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };

  const handleContextRestored = () => {
    onContextRestored();
  };

  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  return () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}

export function createFallbackAnimation() {
  // Simple CSS-based fallback animation for when WebGL is not available
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes fallbackFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes fallbackPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    .fallback-animation {
      animation: fallbackFloat 6s ease-in-out infinite, fallbackPulse 3s ease-in-out infinite;
    }
  `;

  const animationElement = document.createElement('div');
  animationElement.className = 'fallback-animation';
  animationElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, #22c55e, #3b82f6, #ef4444);
    border-radius: 50%;
    z-index: -1;
    pointer-events: none;
  `;

  return {
    styleElement,
    animationElement,
    cleanup: () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
      if (animationElement.parentNode) {
        animationElement.parentNode.removeChild(animationElement);
      }
    }
  };
}