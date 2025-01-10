import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaEthereum,
  FaChartLine,
  FaHistory,
  FaExchangeAlt,
  FaWallet,
  FaChartBar,
  FaGlobe,
  FaBitcoin,
  FaPercentage,
} from 'react-icons/fa';
import { SiPolygon } from 'react-icons/si';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import AnimatedCard from '../components/AnimatedCard';

interface TokenBalance {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  icon: React.ReactNode;
}

interface Property {
  id: number;
  name: string;
  imageUrl: string;
  tokens: {
    [key: string]: number; // symbol: amount
  };
  value: number;
  performance: number;
  monthlyYield: number;
  occupancyRate: number;
  tokenDistribution: {
    symbol: string;
    percentage: number;
  }[];
}

// Mock data
const tokenBalances: TokenBalance[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1.5,
    value: 15000,
    icon: <FaEthereum />,
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    amount: 2500,
    value: 8000,
    icon: <SiPolygon />,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.12,
    value: 2000,
    icon: <FaBitcoin />,
  },
];

const portfolioData = {
  totalValue: 25000,
  totalTokens: 150,
  totalProperties: 5,
  monthlyIncome: 1200,
  portfolioGrowth: 15.8,
  availableRewards: {
    ETH: 0.25,
    MATIC: 100,
    BTC: 0.001,
  },
  properties: [
    {
      id: 1,
      name: 'Luxury Penthouse in Miami',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      tokens: {
        ETH: 0.5,
        MATIC: 1000,
      },
      value: 5000,
      performance: 12.5,
      monthlyYield: 450,
      occupancyRate: 95,
      tokenDistribution: [
        { symbol: 'ETH', percentage: 60 },
        { symbol: 'MATIC', percentage: 40 },
      ],
    },
    {
      id: 2,
      name: 'Modern Office Tower NYC',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      tokens: {
        ETH: 1,
        BTC: 0.12,
      },
      value: 20000,
      performance: -2.3,
      monthlyYield: 750,
      occupancyRate: 88,
      tokenDistribution: [
        { symbol: 'ETH', percentage: 70 },
        { symbol: 'BTC', percentage: 30 },
      ],
    },
    {
      id: 3,
      name: 'Beachfront Villa Malibu',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      tokens: {
        ETH: 0.8,
        BTC: 0.05,
      },
      value: 15000,
      performance: 18.7,
      monthlyYield: 620,
      occupancyRate: 92,
      tokenDistribution: [
        { symbol: 'ETH', percentage: 75 },
        { symbol: 'BTC', percentage: 25 },
      ],
    },
    {
      id: 4,
      name: 'Downtown Luxury Lofts',
      imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      tokens: {
        ETH: 0.3,
        MATIC: 1500,
      },
      value: 8000,
      performance: 9.4,
      monthlyYield: 380,
      occupancyRate: 96,
      tokenDistribution: [
        { symbol: 'ETH', percentage: 45 },
        { symbol: 'MATIC', percentage: 55 },
      ],
    },
    {
      id: 5,
      name: 'Silicon Valley Tech Campus',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      tokens: {
        ETH: 1.2,
        BTC: 0.08,
        MATIC: 2000,
      },
      value: 25000,
      performance: 15.2,
      monthlyYield: 980,
      occupancyRate: 98,
      tokenDistribution: [
        { symbol: 'ETH', percentage: 50 },
        { symbol: 'BTC', percentage: 20 },
        { symbol: 'MATIC', percentage: 30 },
      ],
    },
  ],
};

const transactionHistory = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Purchase',
    property: 'Luxury Penthouse in Miami',
    tokens: { ETH: 0.2, MATIC: 500 },
    amount: 3500,
  },
  {
    id: 2,
    date: '2024-01-12',
    type: 'Sale',
    property: 'Modern Office Tower NYC',
    tokens: { ETH: 0.15, BTC: 0.02 },
    amount: 4200,
  },
  {
    id: 3,
    date: '2024-01-10',
    type: 'Purchase',
    property: 'Beachfront Villa Malibu',
    tokens: { ETH: 0.3, BTC: 0.01 },
    amount: 5100,
  },
  {
    id: 4,
    date: '2024-01-08',
    type: 'Reward',
    property: 'Monthly Dividend - All Properties',
    tokens: { ETH: 0.05, MATIC: 100, BTC: 0.001 },
    amount: 850,
  },
  {
    id: 5,
    date: '2024-01-05',
    type: 'Purchase',
    property: 'Silicon Valley Tech Campus',
    tokens: { ETH: 0.4, MATIC: 800, BTC: 0.03 },
    amount: 7200,
  },
  {
    id: 6,
    date: '2024-01-03',
    type: 'Sale',
    property: 'Downtown Luxury Lofts',
    tokens: { ETH: 0.1, MATIC: 300 },
    amount: 2100,
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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClaimRewards = async () => {
    setIsLoading(true);
    try {
      // Implement reward claiming logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error claiming rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case 'ETH':
        return <FaEthereum />;
      case 'MATIC':
        return <SiPolygon />;
      case 'BTC':
        return <FaBitcoin />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
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
            Dashboard
          </Typography>
        </motion.div>

        {/* Token Balances */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
            Token Balances
          </Typography>
          <Grid container spacing={3}>
            {tokenBalances.map((token) => (
              <Grid item xs={12} sm={6} md={4} key={token.symbol}>
                <AnimatedCard>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>
                        {token.icon}
                      </Box>
                      <Typography variant="body1" color="text.secondary">
                        {token.name}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {token.amount} {token.symbol}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                      ${token.value.toLocaleString()}
                    </Typography>
                  </Box>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Portfolio Overview */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <AnimatedCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaWallet size={20} color={theme.palette.primary.main} />
                  <Typography variant="body2" color="text.secondary">
                    Portfolio Value
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  ${portfolioData.totalValue.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <IoTrendingUp size={16} color={theme.palette.success.main} />
                  <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                    +{portfolioData.portfolioGrowth}% this month
                  </Typography>
                </Box>
              </Box>
            </AnimatedCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <AnimatedCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaChartBar size={20} color={theme.palette.primary.main} />
                  <Typography variant="body2" color="text.secondary">
                    Monthly Income
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  ${portfolioData.monthlyIncome.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  From {portfolioData.totalProperties} properties
                </Typography>
              </Box>
            </AnimatedCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <AnimatedCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaGlobe size={20} color={theme.palette.primary.main} />
                  <Typography variant="body2" color="text.secondary">
                    Properties
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  {portfolioData.properties.length}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <AvatarGroup max={3}>
                    {portfolioData.properties.map((property) => (
                      <Avatar
                        key={property.id}
                        src={property.imageUrl}
                        alt={property.name}
                        sx={{ width: 24, height: 24 }}
                      />
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
            </AnimatedCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <AnimatedCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaEthereum size={20} color={theme.palette.primary.main} />
                  <Typography variant="body2" color="text.secondary">
                    Available Rewards
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(portfolioData.availableRewards).map(([symbol, amount]) => (
                    <Box key={symbol} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: theme.palette.primary.main }}>
                        {getTokenIcon(symbol)}
                      </Box>
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        {amount} {symbol}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleClaimRewards}
                  disabled={isLoading}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Claim All Rewards'}
                </Button>
              </Box>
            </AnimatedCard>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ width: '100%', bgcolor: 'transparent' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
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
            label="Properties"
          />
          <Tab
            icon={<FaHistory />}
            iconPosition="start"
            label="Recent Activity"
          />
        </Tabs>

        {/* Properties Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {portfolioData.properties.map((property) => (
              <Grid item xs={12} key={property.id}>
                <AnimatedCard>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <Box
                            component="img"
                            src={property.imageUrl}
                            alt={property.name}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                          {property.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(property.tokens).map(([symbol, amount]) => (
                            <Chip
                              key={symbol}
                              icon={<Box sx={{ color: 'inherit' }}>{getTokenIcon(symbol)}</Box>}
                              label={`${amount} ${symbol}`}
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Value
                            </Typography>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                              ${property.value.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Performance
                            </Typography>
                            <Typography
                              sx={{
                                color: property.performance >= 0
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              {property.performance >= 0 ? <IoTrendingUp /> : <IoTrendingDown />}
                              {property.performance >= 0 ? '+' : ''}{property.performance}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Monthly Yield
                            </Typography>
                            <Typography sx={{ color: theme.palette.text.primary }}>
                              ${property.monthlyYield}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Occupancy
                            </Typography>
                            <Typography sx={{ color: theme.palette.text.primary }}>
                              {property.occupancyRate}%
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Token Distribution
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            {property.tokenDistribution.map(({ symbol, percentage }) => (
                              <Box key={symbol} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ color: theme.palette.primary.main }}>
                                  {getTokenIcon(symbol)}
                                </Box>
                                <Typography sx={{ color: theme.palette.text.primary }}>
                                  {percentage}%
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
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
            {transactionHistory.map((transaction, index) => (
              <Box key={transaction.id}>
                <AnimatedCard>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaExchangeAlt
                            size={16}
                            color={
                              transaction.type === 'Purchase'
                                ? theme.palette.success.main
                                : transaction.type === 'Sale'
                                ? theme.palette.error.main
                                : theme.palette.primary.main
                            }
                          />
                          <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                            {transaction.date}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Chip
                          label={transaction.type}
                          size="small"
                          color={
                            transaction.type === 'Purchase'
                              ? 'success'
                              : transaction.type === 'Sale'
                              ? 'error'
                              : 'primary'
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {transaction.property}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {Object.entries(transaction.tokens || {}).map(([symbol, amount]) => (
                            <Box key={symbol} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: theme.palette.primary.main }}>
                                {getTokenIcon(symbol)}
                              </Box>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {amount} {symbol}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                          ${transaction.amount.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </AnimatedCard>
                {index < transactionHistory.length - 1 && (
                  <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />
                )}
              </Box>
            ))}
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Dashboard; 