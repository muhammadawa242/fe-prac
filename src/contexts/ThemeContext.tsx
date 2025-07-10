// src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- THIS IS THE FIX ---
// Change 'import' to 'import type' for PaletteMode
import type { PaletteMode } from '@mui/material';
// --- END OF FIX ---

import { useLocalStorage } from '../hooks/useLocalStorage';

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode; // This is a type annotation, so `import type` is correct
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a CustomThemeProvider');
  return context;
};

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  // Here, PaletteMode is used as a generic type parameter, which is also a type-only context
  const [mode, setMode] = useLocalStorage<PaletteMode>('themeMode', 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [setMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
