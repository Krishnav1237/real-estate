import {ReactNode, useState} from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, useTheme, alpha } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './ThreeBackground';
import { useWallet } from '../hooks/useWallet'; // Add this import
import { Snackbar, Alert } from '@mui/material';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { address, isConnected, connect, disconnect } = useWallet(); // Add this
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Marketplace', path: '/marketplace' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Admin', path: '/admin' },
    ];

    const isActiveRoute = (path: string) => location.pathname === path;

    // Add this function to handle wallet connection
    const handleWalletAction = async () => {
        try {
            if (isConnected) {
                disconnect();
                setSnackbarMessage("Wallet disconnected successfully");
                setSnackbarSeverity("success");
            } else {
                await connect();
                setSnackbarMessage("Wallet connected successfully");
                setSnackbarSeverity("success");
            }
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Wallet action failed:", error);
            setSnackbarMessage("Failed to connect wallet. The testnet faucet may be temporarily unavailable.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {snackbarMessage}
        </Alert>
    </Snackbar>

    return (
        <>
            <ThreeBackground />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    isolation: 'isolate',
                }}
            >
                <AppBar position="fixed">
                    <Container maxWidth="xl">
                        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Typography
                                    variant="h5"
                                    component="div"
                                    onClick={() => navigate('/')}
                                    sx={{
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 0 20px rgba(124, 77, 255, 0.2)',
                                    }}
                                >
                                    TokenEstate
                                </Typography>
                            </motion.div>

                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <motion.div
                                        key={item.path}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            color="inherit"
                                            onClick={() => navigate(item.path)}
                                            sx={{
                                                position: 'relative',
                                                px: 2,
                                                '&:before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: isActiveRoute(item.path)
                                                        ? `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 30%, ${alpha(theme.palette.secondary.main, 0.1)} 90%)`
                                                        : 'transparent',
                                                    borderRadius: 1,
                                                    transition: 'all 0.3s ease-in-out',
                                                },
                                                '&:hover:before': {
                                                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 30%, ${alpha(theme.palette.secondary.main, 0.1)} 90%)`,
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </motion.div>
                                ))}

                                {/* Add Wallet Connect Button */}
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={handleWalletAction}
                                        sx={{
                                            px: 3,
                                            fontWeight: 600,
                                            background: isConnected
                                                ? alpha(theme.palette.error.main, 0.9)
                                                : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            '&:hover': {
                                                background: isConnected
                                                    ? alpha(theme.palette.error.dark, 0.9)
                                                    : `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                            }
                                        }}
                                    >
                                        {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
                                    </Button>
                                </motion.div>

                                {/* Display wallet address when connected */}
                                {isConnected && address && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            ml: 1,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        }}
                                    >
                                        {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                                    </Typography>
                                )}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: '64px', // Height of AppBar
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.2),
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                fontWeight: 500,
                letterSpacing: 0.5,
                textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
              }}
            >
              © {new Date().getFullYear()} TokenEstate. Revolutionizing Real Estate Investment
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Layout;