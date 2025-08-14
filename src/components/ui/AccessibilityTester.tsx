'use client';

import { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { colorUtils } from '@/utils/accessibility';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion?: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passedChecks: string[];
}

export function AccessibilityTester() {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { preferences } = useAccessibility();

  const runAccessibilityAudit = async () => {
    setIsRunning(true);
    const issues: AccessibilityIssue[] = [];
    const passedChecks: string[] = [];

    try {
      // Check for missing alt text on images
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-hidden')) {
          issues.push({
            type: 'error',
            message: `Image ${index + 1} is missing alt text`,
            element: `img[src="${img.src}"]`,
            suggestion: 'Add descriptive alt text or aria-hidden="true" for decorative images'
          });
        } else {
          passedChecks.push(`Image ${index + 1} has proper alt text`);
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          issues.push({
            type: 'warning',
            message: `Heading level skipped: ${heading.tagName} after h${lastLevel}`,
            element: `${heading.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
            suggestion: 'Use proper heading hierarchy (h1 → h2 → h3, etc.)'
          });
        } else {
          passedChecks.push(`Heading ${index + 1} follows proper hierarchy`);
        }
        lastLevel = level;
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const hasAccessibleName = button.textContent?.trim() || 
                                 button.getAttribute('aria-label') || 
                                 button.getAttribute('aria-labelledby');
        if (!hasAccessibleName) {
          issues.push({
            type: 'error',
            message: `Button ${index + 1} lacks accessible name`,
            element: `button:nth-of-type(${index + 1})`,
            suggestion: 'Add text content, aria-label, or aria-labelledby attribute'
          });
        } else {
          passedChecks.push(`Button ${index + 1} has accessible name`);
        }
      });

      // Check for links without accessible names
      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        const hasAccessibleName = link.textContent?.trim() || 
                                 link.getAttribute('aria-label') || 
                                 link.getAttribute('aria-labelledby');
        if (!hasAccessibleName) {
          issues.push({
            type: 'error',
            message: `Link ${index + 1} lacks accessible name`,
            element: `a:nth-of-type(${index + 1})`,
            suggestion: 'Add descriptive text content or aria-label'
          });
        } else {
          passedChecks.push(`Link ${index + 1} has accessible name`);
        }
      });

      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach((input, index) => {
        const hasLabel = input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby') ||
                        document.querySelector(`label[for="${input.id}"]`);
        if (!hasLabel) {
          issues.push({
            type: 'error',
            message: `Form input ${index + 1} lacks proper label`,
            element: `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
            suggestion: 'Add associated label element or aria-label attribute'
          });
        } else {
          passedChecks.push(`Form input ${index + 1} has proper label`);
        }
      });

      // Check for proper focus indicators
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      let focusIndicatorIssues = 0;
      focusableElements.forEach((element) => {
        const styles = window.getComputedStyle(element, ':focus');
        if (styles.outline === 'none' && !styles.boxShadow.includes('rgb')) {
          focusIndicatorIssues++;
        }
      });

      if (focusIndicatorIssues > 0) {
        issues.push({
          type: 'warning',
          message: `${focusIndicatorIssues} elements lack visible focus indicators`,
          suggestion: 'Add outline or box-shadow styles for :focus state'
        });
      } else {
        passedChecks.push('All focusable elements have focus indicators');
      }

      // Check for color contrast (simplified check)
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
      let contrastIssues = 0;
      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          try {
            const ratio = colorUtils.getContrastRatio(color, backgroundColor);
            if (ratio < 4.5) {
              contrastIssues++;
            }
          } catch {
            // Skip elements where contrast can't be calculated
          }
        }
      });

      if (contrastIssues > 0) {
        issues.push({
          type: 'warning',
          message: `${contrastIssues} elements may have insufficient color contrast`,
          suggestion: 'Ensure text has at least 4.5:1 contrast ratio with background'
        });
      } else {
        passedChecks.push('Color contrast appears adequate');
      }

      // Check for ARIA attributes
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
      if (elementsWithAria.length > 0) {
        passedChecks.push(`${elementsWithAria.length} elements use ARIA attributes`);
      }

      // Check for skip links
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      if (skipLinks.length > 0) {
        passedChecks.push('Skip links are present');
      } else {
        issues.push({
          type: 'info',
          message: 'No skip links found',
          suggestion: 'Consider adding skip links for keyboard navigation'
        });
      }

      // Check for live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      if (liveRegions.length > 0) {
        passedChecks.push('Live regions are present for dynamic content');
      }

      // Calculate score
      const totalChecks = issues.length + passedChecks.length;
      const score = totalChecks > 0 ? Math.round((passedChecks.length / totalChecks) * 100) : 100;

      setReport({
        score,
        issues,
        passedChecks
      });

    } catch (error) {
      console.error('Accessibility audit failed:', error);
      issues.push({
        type: 'error',
        message: 'Accessibility audit encountered an error',
        suggestion: 'Check console for details'
      });
      setReport({
        score: 0,
        issues,
        passedChecks
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  // Only show in development mode or when explicitly enabled
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isEnabled = process.env.NEXT_PUBLIC_SHOW_ACCESSIBILITY_TESTER === 'true';
  
  if (!isDevelopment && !isEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Accessibility Audit</h3>
            <button
              onClick={runAccessibilityAudit}
              disabled={isRunning}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded text-sm transition-colors"
            >
              {isRunning ? 'Running...' : 'Run Audit'}
            </button>
          </div>
          
          {/* User Preferences Display */}
          <div className="mt-2 text-xs text-gray-400">
            <div>Motion: {preferences.prefersReducedMotion ? 'Reduced' : 'Normal'}</div>
            <div>Contrast: {preferences.prefersHighContrast ? 'High' : 'Normal'}</div>
            <div>Theme: {preferences.colorScheme}</div>
          </div>
        </div>

        {report && (
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Accessibility Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
                  {report.score}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    report.score >= 90 ? 'bg-green-400' : 
                    report.score >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${report.score}%` }}
                />
              </div>
            </div>

            {report.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Issues ({report.issues.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {report.issues.map((issue, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0">{getIssueIcon(issue.type)}</span>
                        <div>
                          <div className="text-white">{issue.message}</div>
                          {issue.element && (
                            <div className="text-gray-400 font-mono">{issue.element}</div>
                          )}
                          {issue.suggestion && (
                            <div className="text-blue-300 mt-1">{issue.suggestion}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-white font-medium mb-2">Passed Checks ({report.passedChecks.length})</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {report.passedChecks.slice(0, 5).map((check, index) => (
                  <div key={index} className="text-xs text-green-300 flex items-center gap-2">
                    <span>✅</span>
                    <span>{check}</span>
                  </div>
                ))}
                {report.passedChecks.length > 5 && (
                  <div className="text-xs text-gray-400">
                    +{report.passedChecks.length - 5} more checks passed
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessibilityTester;