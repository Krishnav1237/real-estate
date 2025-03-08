import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaEthereum,
  FaChartLine,
  FaHistory,
  FaExchangeAlt,
} from 'react-icons/fa';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import AnimatedCard from '../components/AnimatedCard';

// Mock data - replace with actual data from your smart contract
const mockInvestments = [
  {
    id: '1',
    propertyTitle: 'Luxury Penthouse in Miami',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    tokenAmount: 200,
    purchasePrice: 0.15,
    currentPrice: 0.19,
    totalValue: 38,
    profitLoss: 8,
    profitLossPercentage: 26.7,
    lastTransaction: '2024-02-15',
    monthlyYield: 450,
    occupancyRate: 95,
  },
  {
    id: '2',
    propertyTitle: 'Modern Office Tower NYC',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tokenAmount: 150,
    purchasePrice: 0.2,
    currentPrice: 0.18,
    totalValue: 27,
    profitLoss: -3,
    profitLossPercentage: -10,
    lastTransaction: '2024-02-10',
    monthlyYield: 380,
    occupancyRate: 88,
  },
  {
    id: '3',
    propertyTitle: 'Beachfront Villa Malibu',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    tokenAmount: 300,
    purchasePrice: 0.18,
    currentPrice: 0.22,
    totalValue: 66,
    profitLoss: 12,
    profitLossPercentage: 22.2,
    lastTransaction: '2024-02-08',
    monthlyYield: 620,
    occupancyRate: 92,
  },
];

const mockTransactions = [
  {
    id: '1',
    type: 'BUY',
    propertyTitle: 'Luxury Penthouse in Miami',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    amount: 200,
    price: 0.15,
    total: 30,
    date: '2024-02-15',
  },
  {
    id: '2',
    type: 'SELL',
    propertyTitle: 'Silicon Valley Tech Campus',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    amount: 100,
    price: 0.25,
    total: 25,
    date: '2024-02-12',
  },
  {
    id: '3',
    type: 'BUY',
    propertyTitle: 'Beachfront Villa Malibu',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    amount: 300,
    price: 0.18,
    total: 54,
    date: '2024-02-08',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`portfolio-tabpanel-${index}`}
          aria-labelledby={`portfolio-tab-${index}`}
          {...other}
      >
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
  );
}

const Portfolio = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalPortfolioValue = mockInvestments.reduce(
      (sum, investment) => sum + investment.totalValue,
      0
  );

  const totalProfitLoss = mockInvestments.reduce(
      (sum, investment) => sum + investment.profitLoss,
      0
  );

  const averageROI =
      (mockInvestments.reduce(
              (sum, investment) => sum + investment.profitLossPercentage,
              0
          ) /
          mockInvestments.length) ||
      0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClaimRewards = async () => {
    setIsLoading(true);
    try {
      // Implement reward claiming logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      // Show success message
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container maxWidth="xl">
        {/* Portfolio Overview */}
        <Box sx={{ mb: 6 }}>
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                }}
            >
              My Portfolio
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {/* Portfolio Stats */}
            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Portfolio Value
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaEthereum size={24} color={theme.palette.primary.main} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {totalPortfolioValue.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Profit/Loss
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaEthereum size={24} color={totalProfitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main} />
                    <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: totalProfitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        }}
                    >
                      {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <AnimatedCard>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average ROI
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {averageROI >= 0 ? (
                        <IoTrendingUp size={24} color={theme.palette.success.main} />
                    ) : (
                        <IoTrendingDown size={24} color={theme.palette.error.main} />
                    )}
                    <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: averageROI >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        }}
                    >
                      {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>
        </Box>

        {/* Rewards Section */}
        <Box sx={{ mb: 6 }}>
          <AnimatedCard>
            <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Rewards
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaEthereum size={20} color={theme.palette.primary.main} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    0.25
                  </Typography>
                </Box>
              </Box>
              <Button
                  variant="contained"
                  onClick={handleClaimRewards}
                  disabled={isLoading}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    px: 4,
                  }}
              >
                {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Claim Rewards'
                )}
              </Button>
            </Box>
          </AnimatedCard>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="portfolio tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
          >
            <Tab
                icon={<FaChartLine />}
                iconPosition="start"
                label="Investments"
            />
            <Tab
                icon={<FaHistory />}
                iconPosition="start"
                label="Transaction History"
            />
          </Tabs>
        </Box>

        {/* Investments Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {mockInvestments.map((investment) => (
                <Grid item xs={12} key={investment.id}>
                  <AnimatedCard>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <Box sx={{ position: 'relative', mb: 2 }}>
                            <Box
                                component="img"
                                src={investment.imageUrl}
                                alt={investment.propertyTitle}
                                sx={{
                                  width: '100%',
                                  height: 200,
                                  objectFit: 'cover',
                                  borderRadius: 2,
                                }}
                            />
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            {investment.propertyTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {investment.tokenAmount} Tokens
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Total Value
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <FaEthereum size={16} color={theme.palette.primary.main} />
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                  {investment.totalValue}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Performance
                              </Typography>
                              <Typography
                                  sx={{
                                    color: investment.profitLoss >= 0
                                        ? theme.palette.success.main
                                        : theme.palette.error.main,
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                              >
                                {investment.profitLoss >= 0 ? <IoTrendingUp /> : <IoTrendingDown />}
                                {investment.profitLoss >= 0 ? '+' : ''}{investment.profitLossPercentage}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Monthly Yield
                              </Typography>
                              <Typography sx={{ color: theme.palette.text.primary }}>
                                ${investment.monthlyYield}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Occupancy
                              </Typography>
                              <Typography sx={{ color: theme.palette.text.primary }}>
                                {investment.occupancyRate}%
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </AnimatedCard>
                </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Recent Activity Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ width: '100%' }}>
            {mockTransactions.map((transaction, index) => (
                <Box key={transaction.id}>
                  <AnimatedCard>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaExchangeAlt
                                size={16}
                                color={
                                  transaction.type === 'BUY'
                                      ? theme.palette.success.main
                                      : theme.palette.error.main
                                }
                            />
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                              {transaction.date}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={transaction.imageUrl}
                                alt={transaction.propertyTitle}
                                sx={{ width: 40, height: 40, borderRadius: 1 }}
                            />
                            <Box>
                              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                {transaction.propertyTitle}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {transaction.amount} Tokens
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Price per Token
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaEthereum size={16} color={theme.palette.primary.main} />
                            <Typography sx={{ color: theme.palette.text.primary }}>
                              {transaction.price}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Value
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaEthereum size={16} color={theme.palette.primary.main} />
                            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              {transaction.total}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </AnimatedCard>
                  {index < mockTransactions.length - 1 && (
                      <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />
                  )}
                </Box>
            ))}
          </Box>
        </TabPanel>
      </Container>
  );
};

export default Portfolio;