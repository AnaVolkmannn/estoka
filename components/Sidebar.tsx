// src/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorMode } from '@/context/ThemeContext';
import { Handyman, Inventory, History, People, Settings, Dashboard, Menu} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, href: '/' },
  { label: 'Produtos',  icon: <Handyman />,  href: '/produtos' },
  { label: 'Fornecedores', icon: <People />, href: '/fornecedores' },
  { label: 'Lançar inventário', icon: <Inventory />, href: '/inventario' },
  { label: 'Histórico de lançamentos', icon: <History />, href: '/historico' },
  { label: 'Configurações', icon: <Settings />, href: '/configuracoes' },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleColorMode, mode } = useColorMode();
  const theme = useTheme();

  const handleNav = (href: string) => {
    router.push(href);
    onClose?.();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'main' }}
        >
          Diorana | Inventário
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {navItems.map(({ label, icon, href }) => {
          const isActive = pathname === href;
          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(href)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'background-color 0.15s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" color="text.disabled">
          {mode === 'dark' ? 'Modo escuro' : 'Modo claro'}
        </Typography>
        <Tooltip title="Alternar tema">
          <IconButton onClick={toggleColorMode} size="small">
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1300 }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}