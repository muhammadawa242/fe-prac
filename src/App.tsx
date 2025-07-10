import { Container, CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import Header from './components/Header';
import TaskList from './components/TaskList';

function App() {
  return (
    <CustomThemeProvider>
      <TaskProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // This will center the Container horizontally
            pt: 4, // Add some padding-top for spacing from the browser edge
            minHeight: '100vh',
            bgcolor: 'background.default', // Use theme's background color
          }}
        >
          <Container maxWidth="md">
            <Header />
            <TaskList />
          </Container>
        </Box>
      </TaskProvider>
    </CustomThemeProvider>
  );
}

export default App;
