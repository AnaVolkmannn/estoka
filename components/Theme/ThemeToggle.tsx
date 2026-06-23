import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorMode } from '@/context/ThemeContext';

export function ThemeToggleButton() {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton onClick={toggleColorMode}>
      <DarkModeIcon />
    </IconButton>
  );
}