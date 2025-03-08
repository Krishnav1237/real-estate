import { Box, Container, Typography, Button, Grid, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TokenIcon from '@mui/icons-material/Token';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ThreeBackground from '../components/ThreeBackground';
import AnimatedCard from '../components/AnimatedCard';

const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const features = [
        {
            icon: <TokenIcon sx={{ fontSize: 40 }} />,
            title: 'Tokenized Real Estate',
            description: 'Invest in fractional ownership of premium properties through blockchain technology.',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Secure & Transparent',
            description: 'All transactions and ownership records are secured on the blockchain with full transparency.',
        },
        {
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
            title: 'Easy Investment',
            description: 'Connect your wallet and start investing in real estate with any budget.',
        },
    ];

    return (
        <Box>
            <ThreeBackground />

            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    pt: { xs: 12, md: 16 },
                    pb: { xs: 8, md: 12 },
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <Typography
                            component="h1"
                            variant="h1"
                            align="center"
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
                            }}
                        >
                            Revolutionizing Real Estate
                        </Typography>

                        <Typography
                            variant="h4"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 6,
                                maxWidth: '800px',
                                mx: 'auto',
                                textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            Own fractions of premium properties and trade them with ease.
                            Join the future of real estate investment through blockchain technology.
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/marketplace')}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        fontSize: '1.2rem',
                                        background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                                        boxShadow: '0 3px 20px rgba(59, 130, 246, 0.5)',
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                        '&:hover': {
                                            boxShadow: '0 6px 30px rgba(59, 130, 246, 0.7)',
                                        },
                                    }}
                                >
                                    Explore Properties
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        fontSize: '1.2rem',
                                        borderWidth: 2,
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                        color: 'text.primary',
                                        '&:hover': {
                                            borderWidth: 2,
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                                        },
                                    }}
                                >
                                    View Dashboard
                                </Button>
                            </motion.div>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <AnimatedCard>
                                <Box sx={{ textAlign: 'center' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Box sx={{
                                            mb: 2,
                                            color: 'primary.main',
                                            background: alpha(theme.palette.primary.main, 0.1),
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        }}>
                                            {feature.icon}
                                        </Box>
                                    </motion.div>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </AnimatedCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;