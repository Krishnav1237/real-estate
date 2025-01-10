import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './styles/theme';

// Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </Router>
        </QueryClientProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
