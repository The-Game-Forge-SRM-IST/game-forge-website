'use client';

// ARIA label generators
export const generateAriaLabel = {
  button: (action: string, context?: string) => 
    `${action}${context ? ` ${context}` : ''}`,
  
  link: (destination: string, opensNewTab?: boolean) => 
    `${destination}${opensNewTab ? ', opens in new tab' : ''}`,
  
  image: (description: string, decorative?: boolean) => 
    decorative ? '' : description,
  
  form: (fieldName: string, required?: boolean, error?: string) => 
    `${fieldName}${required ? ', required' : ''}${error ? `, error: ${error}` : ''}`,
  
  navigation: (currentPage?: string) => 
    `Main navigation${currentPage ? `, current page: ${currentPage}` : ''}`,
  
  modal: (title: string) => 
    `${title} dialog`,
  
  tab: (tabName: string, isSelected?: boolean, position?: { current: number; total: number }) => 
    `${tabName}${isSelected ? ', selected' : ''}${position ? `, ${position.current} of ${position.total}` : ''}`,
  
  card: (title: string, type?: string) => 
    `${type || 'Card'}: ${title}`,
  
  status: (status: string, context?: string) => 
    `${context ? `${context} ` : ''}status: ${status}`,
};

// Keyboard event handlers
export const keyboardHandlers = {
  // Handle Enter and Space as click
  activateOnEnterOrSpace: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
  
  // Handle Escape key
  closeOnEscape: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      callback();
    }
  },
  
  // Handle arrow navigation
  arrowNavigation: (
    callback: (direction: 'up' | 'down' | 'left' | 'right' | 'home' | 'end') => void
  ) => (e: React.KeyboardEvent) => {
    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right' | 'home' | 'end'> = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'Home': 'home',
      'End': 'end',
    };
    
    if (keyMap[e.key]) {
      e.preventDefault();
      callback(keyMap[e.key]);
    }
  },
};

// Focus management utilities
export const focusUtils = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors));
  },
  
  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    if (element.hasAttribute('disabled') || element.getAttribute('tabindex') === '-1') {
      return false;
    }
    
    const focusableTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    return focusableTags.includes(element.tagName) || 
           element.hasAttribute('tabindex') || 
           element.getAttribute('contenteditable') === 'true';
  },
  
  // Move focus to next/previous focusable element
  moveFocus: (direction: 'next' | 'previous', container?: HTMLElement) => {
    const root = container || document.body;
    const focusableElements = focusUtils.getFocusableElements(root);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    }
    
    focusableElements[nextIndex]?.focus();
  },
};

// Screen reader utilities
export const screenReaderUtils = {
  // Create visually hidden text for screen readers
  createSROnlyText: (text: string): string => {
    return `<span class="sr-only">${text}</span>`;
  },
  
  // Announce dynamic content changes
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
  
  // Create accessible descriptions for complex UI
  createAccessibleDescription: (element: HTMLElement, description: string) => {
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    
    element.setAttribute('aria-describedby', descId);
    element.parentNode?.insertBefore(descElement, element.nextSibling);
    
    return descId;
  },
};

// Color and contrast utilities
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  // Calculate relative luminance
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },
  
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const lum1 = colorUtils.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = colorUtils.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  // Check if contrast meets WCAG standards
  meetsWCAGContrast: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorUtils.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
  
  // Get accessible color variant
  getAccessibleColor: (baseColor: string, backgroundColor: string, level: 'AA' | 'AAA' = 'AA'): string => {
    if (colorUtils.meetsWCAGContrast(baseColor, backgroundColor, level)) {
      return baseColor;
    }
    
    // This is a simplified version - in practice, you'd want more sophisticated color adjustment
    const rgb = colorUtils.hexToRgb(baseColor);
    if (!rgb) return baseColor;
    
    // Darken or lighten the color to meet contrast requirements
    const bgRgb = colorUtils.hexToRgb(backgroundColor);
    if (!bgRgb) return baseColor;
    
    const bgLum = colorUtils.getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const adjustment = bgLum > 0.5 ? -50 : 50; // Darken for light backgrounds, lighten for dark
    
    const adjustedRgb = {
      r: Math.max(0, Math.min(255, rgb.r + adjustment)),
      g: Math.max(0, Math.min(255, rgb.g + adjustment)),
      b: Math.max(0, Math.min(255, rgb.b + adjustment)),
    };
    
    return `rgb(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b})`;
  },
};

// Animation utilities for accessibility
export const animationUtils = {
  // Get reduced motion safe animation properties
  getReducedMotionSafeAnimation: (
    normalAnimation: Record<string, unknown>,
    reducedAnimation?: Record<string, unknown>
  ) => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return reducedAnimation || {
        ...normalAnimation,
        transition: { duration: 0.01 },
        animate: { 
          ...(normalAnimation.animate as Record<string, unknown>), 
          scale: 1, 
          rotate: 0, 
          x: 0, 
          y: 0 
        },
      };
    }
    
    return normalAnimation;
  },
  
  // Create accessible loading animation
  createAccessibleLoadingAnimation: (prefersReducedMotion: boolean) => {
    if (prefersReducedMotion) {
      return {
        opacity: [0.5, 1, 0.5],
        transition: { duration: 2, repeat: Infinity, ease: 'linear' },
      };
    }
    
    return {
      rotate: [0, 360],
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    };
  },
};

// Form accessibility utilities
export const formUtils = {
  // Generate form field IDs and associate labels
  createFieldAssociation: (fieldName: string) => {
    const id = `field-${fieldName}-${Math.random().toString(36).substr(2, 9)}`;
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;
    
    return { id, labelId, errorId, helpId };
  },
  
  // Create accessible error message
  createErrorMessage: (fieldName: string, error: string) => ({
    id: `error-${fieldName}`,
    role: 'alert',
    'aria-live': 'polite' as const,
    children: error,
  }),
  
  // Create accessible form validation
  getFieldValidationProps: (
    fieldName: string,
    isValid: boolean,
    error?: string,
    helpText?: string
  ) => {
    const { id, labelId, errorId, helpId } = formUtils.createFieldAssociation(fieldName);
    
    const describedBy = [
      helpText && helpId,
      error && errorId,
    ].filter(Boolean).join(' ');
    
    return {
      id,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy || undefined,
      'aria-invalid': !isValid,
      'aria-required': true,
    };
  },
};

// Modal and dialog utilities
export const modalUtils = {
  // Create accessible modal props
  createModalProps: (title: string, isOpen: boolean) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`,
    'aria-hidden': !isOpen,
    tabIndex: -1,
  }),
  
  // Create backdrop props
  createBackdropProps: (onClose: () => void) => ({
    role: 'presentation',
    onClick: onClose,
    onKeyDown: keyboardHandlers.closeOnEscape(onClose),
  }),
};

// Navigation utilities
export const navigationUtils = {
  // Create accessible navigation props
  createNavProps: (label: string, currentPage?: string) => ({
    role: 'navigation',
    'aria-label': generateAriaLabel.navigation(currentPage),
  }),
  
  // Create breadcrumb props
  createBreadcrumbProps: () => ({
    'aria-label': 'Breadcrumb navigation',
    role: 'navigation',
  }),
  
  // Create skip link props
  createSkipLinkProps: (targetId: string, label: string = 'Skip to main content') => ({
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded',
    children: label,
  }),
};

// Table utilities
export const tableUtils = {
  // Create accessible table props
  createTableProps: (caption: string) => ({
    role: 'table',
    'aria-label': caption,
  }),
  
  // Create sortable column header props
  createSortableHeaderProps: (
    columnName: string,
    sortDirection?: 'asc' | 'desc' | 'none',
    onSort?: () => void
  ) => ({
    role: 'columnheader',
    'aria-sort': sortDirection || 'none',
    tabIndex: 0,
    onClick: onSort,
    onKeyDown: onSort ? keyboardHandlers.activateOnEnterOrSpace(onSort) : undefined,
    'aria-label': `${columnName}, ${sortDirection === 'asc' ? 'sorted ascending' : sortDirection === 'desc' ? 'sorted descending' : 'not sorted'}`,
  }),
};

// Export all utilities
export const a11yUtils = {
  generateAriaLabel,
  keyboardHandlers,
  focusUtils,
  screenReaderUtils,
  colorUtils,
  animationUtils,
  formUtils,
  modalUtils,
  navigationUtils,
  tableUtils,
};

export default a11yUtils;