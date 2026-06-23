// src/components/ThemeRegistry.tsx
'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ColorModeProvider } from '@/context/ThemeContext';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}