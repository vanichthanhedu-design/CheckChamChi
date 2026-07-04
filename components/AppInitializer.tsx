'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function AppInitializer() {
  const initializeData = useAppStore((state) => state.initializeData);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return null;
}

