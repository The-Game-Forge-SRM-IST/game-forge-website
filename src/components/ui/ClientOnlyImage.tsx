'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientOnlyImageProps extends ImageProps {
  fallback?: React.ReactNode;
}

export default function ClientOnlyImage({ fallback, ...props }: ClientOnlyImageProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || <div className="animate-pulse bg-gray-700 w-full h-full" />;
  }

  const { alt, ...rest } = props as any;
  return <Image {...(rest as ImageProps)} alt={alt ?? ''} />;
}