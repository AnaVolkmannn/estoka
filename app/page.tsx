// src/app/page.tsx
'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useColorMode } from '@/context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function Page() {

  const { toggleColorMode } = useColorMode();
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={4}>

        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            label="MUI + Next.js"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Tudo funcionando! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Seu ambiente está pronto. Edite este componente para começar.
          </Typography>
        </Box>

        <Divider />

        {/* Checklist */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              CHECKLIST
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {[
                'Next.js App Router configurado',
                'MUI ThemeProvider ativo',
                'CssBaseline aplicado',
                'SSR com Emotion funcionando',
              ].map((item) => (
                <Stack key={item} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
          <IconButton onClick={toggleColorMode}>
          <DarkModeIcon />
        </IconButton>

        </Card>

        {/* Input de teste */}
        <TextField
          label="Teste de input"
          placeholder="Digite algo aqui..."
          fullWidth
          variant="outlined"
          helperText="Confirma que o tema e os estilos estão aplicados corretamente."
        />

        {/* Botões */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<RocketLaunchIcon />}
          >
            Começar dev
          </Button>
          <Button variant="outlined" fullWidth>
            Ver docs
          </Button>
        </Stack>

      </Stack>
    </Container>
  );
}