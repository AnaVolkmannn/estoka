// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/Theme/ThemeRegistry';
import Sidebar from '@/components/Sidebar';
import Box from '@mui/material/Box';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Diorana | Estoka',
};

const DRAWER_WIDTH = 240;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  ml: { md: `${DRAWER_WIDTH}px` },
                  p: 3,
                }}
              >
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}