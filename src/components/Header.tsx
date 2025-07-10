// src/components/Header.tsx

import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Add as AddIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import TaskForm from './TaskForm';

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ToDo App
          </Typography>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Add New Task
            </Button>
            <IconButton
              color="primary"
              onClick={() => setIsFormOpen(true)}
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <TaskForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
};

export default Header;
