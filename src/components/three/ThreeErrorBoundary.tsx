'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThreeErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
  retryCount: number;
}

interface ThreeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
}

export default class ThreeErrorBoundary extends React.Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  private retryTimer?: NodeJS.Timeout;

  constructor(props: ThreeErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ThreeErrorBoundaryState> {
    return { 
      hasError: true,
      errorMessage: error.message 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, showErrorDetails = false } = this.props;
    
    // Log error details
    console.warn('Three.js component error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Log additional context for debugging
    if (showErrorDetails) {
      console.group('Three.js Error Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error Boundary:', this.constructor.name);
      console.groupEnd();
    }

    // Attempt automatic retry for certain recoverable errors
    this.attemptRecovery(error);
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private attemptRecovery = (error: Error) => {
    const { maxRetries = 2 } = this.props;
    const { retryCount } = this.state;

    // Check if error is recoverable
    const recoverableErrors = [
      'WebGL context lost',
      'WebGL context creation failed',
      'Failed to compile shader',
      'Texture loading failed'
    ];

    const isRecoverable = recoverableErrors.some(recoverable => 
      error.message.includes(recoverable)
    );

    if (isRecoverable && retryCount < maxRetries) {
      console.log(`Attempting to recover from Three.js error (attempt ${retryCount + 1}/${maxRetries})`);
      
      this.retryTimer = setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          errorMessage: undefined,
          retryCount: prevState.retryCount + 1
        }));
      }, 2000 * (retryCount + 1)); // Exponential backoff
    }
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      errorMessage: undefined,
      retryCount: 0
    });
  };

  render() {
    const { hasError, errorMessage, retryCount } = this.state;
    const { fallback, maxRetries = 2, showErrorDetails = false } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default enhanced fallback with retry option
      return (
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
          {/* Animated gradient background fallback */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-red-900/20"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2), rgba(239, 68, 68, 0.2))',
                'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(239, 68, 68, 0.2), rgba(34, 197, 94, 0.2))',
                'linear-gradient(225deg, rgba(239, 68, 68, 0.2), rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))',
                'linear-gradient(315deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2), rgba(239, 68, 68, 0.2))'
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Floating particles fallback */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => {
              // Use index-based positioning for consistent results
              const x = (i * 37) % 100; // Pseudo-random but consistent
              const y = (i * 73) % 100;
              const duration = 3 + (i % 3);
              const delay = (i * 0.2) % 2;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-500/30 rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>

          {/* Error notification (only show if enabled and retries exhausted) */}
          {showErrorDetails && retryCount >= maxRetries && (
            <motion.div
              className="fixed top-4 right-4 bg-red-900/80 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 max-w-md z-50"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-200">
                    3D Graphics Unavailable
                  </h3>
                  <p className="text-xs text-red-300 mt-1">
                    Using fallback animation. The site remains fully functional.
                  </p>
                  {errorMessage && (
                    <p className="text-xs text-red-400 mt-2 font-mono">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    onClick={this.handleManualRetry}
                    className="mt-2 text-xs text-red-200 hover:text-white underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}