'use client';

import {
  Box,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

export default function Page() {

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
            Tudo funcionando!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Seu ambiente está pronto. Edite este componente para começar.
          </Typography>
        </Box>

        <Divider />

      </Stack>
    </Container>
  );
}