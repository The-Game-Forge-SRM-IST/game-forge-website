'use client';

import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const lastEmberTime = useRef<number>(0);

  useEffect(() => {
    // Check if device is mobile/touch device
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768) {
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    // Signal CSS that custom cursor JS is active
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;

    const createEmber = (x: number, y: number) => {
      const ember = document.createElement('div');
      ember.className = 'ember-trail';
      
      const offsetX = (Math.random() - 0.5) * 12;
      const offsetY = (Math.random() - 0.5) * 12;
      
      ember.style.left = `${x + offsetX}px`;
      ember.style.top = `${y + offsetY}px`;
      
      const size = Math.random() * 3 + 2;
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;

      document.body.appendChild(ember);
      setTimeout(() => {
        ember.remove();
      }, 800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.display = 'block';
      }

      const now = Date.now();
      if (now - lastEmberTime.current > 50) {
        createEmber(e.clientX, e.clientY);
        lastEmberTime.current = now;
      }
    };

    const handleMouseLeave = () => {
      if (cursor) {
        cursor.style.display = 'none';
      }
    };

    const handleMouseEnterInteractive = () => {
      if (cursor) {
        cursor.classList.add('hovering');
      }
    };

    const handleMouseLeaveInteractive = () => {
      if (cursor) {
        cursor.classList.remove('hovering');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Attach hovers
    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .interactive');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    attachListeners();

    // Re-attach listeners when DOM changes (e.g. sections load dynamically)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .interactive');
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        .cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          display: none;
        }
        
        .cursor-target {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          width: 24px;
          height: 24px;
          border: 1.5px solid #ac012c;
          transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      height 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.25s ease, 
                      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          pointer-events: none;
        }

        /* corner notches for the precision target box */
        .cursor-target::before, .cursor-target::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-color: #ac012c;
          border-style: solid;
          transition: border-color 0.25s ease;
        }

        .cursor-target::before {
          top: -3px;
          left: -3px;
          border-width: 1px 0 0 1px;
        }

        .cursor-target::after {
          bottom: -3px;
          right: -3px;
          border-width: 0 1px 1px 0;
        }

        .cursor-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background-color: #ac012c;
          border-radius: 50%;
          box-shadow: 0 0 8px #ac012c;
          transition: background-color 0.25s ease, box-shadow 0.25s ease;
          pointer-events: none;
        }

        /* Hovering active state */
        .cursor-container.hovering .cursor-target {
          width: 36px;
          height: 36px;
          border-color: #91d78a;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .cursor-container.hovering .cursor-target::before,
        .cursor-container.hovering .cursor-target::after {
          border-color: #91d78a;
        }

        .cursor-container.hovering .cursor-dot {
          background-color: #91d78a;
          box-shadow: 0 0 12px #91d78a;
        }
      `}</style>
      <div
        ref={cursorRef}
        className="cursor-container"
      >
        <div className="cursor-target" />
        <div className="cursor-dot" />
      </div>
    </>
  );
}