'use client';

import { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
  center = true
}: ResponsiveContainerProps) {
  const { getResponsivePadding } = useResponsive();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClass = padding === 'none' ? '' : getResponsivePadding(padding);
  const centerClass = center ? 'mx-auto' : '';

  return (
    <div className={`
      w-full ${maxWidthClasses[maxWidth]} ${centerClass} ${paddingClass} ${className}
    `}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minItemWidth?: string;
}

export function ResponsiveGrid({
  children,
  className = '',
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  autoFit = false,
  minItemWidth = '280px'
}: ResponsiveGridProps) {
  const { getColumns } = useResponsive();

  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10'
  };

  if (autoFit) {
    return (
      <div className={`
        grid grid-cols-[repeat(auto-fit,minmax(min(${minItemWidth},100%),1fr))]
        ${gapClasses[gap]} ${className}
      `}>
        {children}
      </div>
    );
  }

  const responsiveColumns = getColumns(
    columns.xs || 1,
    columns.sm || 2,
    columns.md || 3,
    columns.lg || 4,
    columns.xl
  );

  const gridColsClass = `grid-cols-${responsiveColumns}`;

  return (
    <div className={`
      grid ${gridColsClass} ${gapClasses[gap]} ${className}
    `}>
      {children}
    </div>
  );
}

interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
}

export function ResponsiveText({
  children,
  as: Component = 'p',
  size = 'base',
  className = '',
  weight = 'normal',
  color = 'primary'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm',
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    accent: 'text-green-400'
  };

  return (
    <Component className={`
      ${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}
    `}>
      {children}
    </Component>
  );
}

interface ResponsiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function ResponsiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false
}: ResponsiveButtonProps) {
  const { getTouchTargetSize } = useResponsive();

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white border-transparent',
    outline: 'bg-transparent hover:bg-white/10 text-white border-white/20 hover:border-white/30',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-transparent'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getTouchTargetSize()} ${sizeClasses[size]} ${variantClasses[variant]}
        ${disabledClasses} ${widthClass}
        font-medium rounded-lg border transition-all duration-200
        touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}