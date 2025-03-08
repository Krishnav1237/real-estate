import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaChartPie,
  FaGlobe,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import AnimatedCard from '../components/AnimatedCard';

// Mock data for charts
const marketTrendData = [
  { date: 'Jan', volume: 1000, price: 0.1 },
  { date: 'Feb', volume: 1200, price: 0.12 },
  { date: 'Mar', volume: 1100, price: 0.11 },
  { date: 'Apr', volume: 1400, price: 0.14 },
  { date: 'May', volume: 1300, price: 0.13 },
  { date: 'Jun', volume: 1600, price: 0.16 },
];

// Mock data - replace with actual data from your API/smart contract
const mockMarketStats = {
  totalVolume: 1250.5,
  activeProperties: 45,
  averageTokenPrice: 0.12,
  marketGrowth: 23.5,
};

const mockTopPerformers = [
  {
    id: '1',
    propertyTitle: 'Luxury Villa with Pool',
    priceChange: 35.8,
    volume: 125.4,
    location: 'Miami, FL',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    propertyTitle: 'Modern Downtown Apartment',
    priceChange: 28.4,
    volume: 98.2,
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    propertyTitle: 'Beachfront Condo',
    priceChange: 22.1,
    volume: 87.5,
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1669071192880-0a94316e6e09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

const mockRegionalData = [
  { region: 'North America', marketShare: 45 },
  { region: 'Europe', marketShare: 30 },
  { region: 'Asia', marketShare: 15 },
  { region: 'Others', marketShare: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define proper types for tooltips and charts
interface LineChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface PieChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      fill: string;
    };
  }>;
}

interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

// Custom tooltip component for the line chart
const CustomLineChartTooltip = ({ active, payload, label }: LineChartTooltipProps) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
        <Box
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              p: 2,
              borderRadius: 1,
              boxShadow: theme.shadows[3],
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
            {label}
          </Typography>
          {payload.map((entry, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: entry.color,
                    }}
                />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {entry.name}: {entry.value} {entry.name === 'volume' ? 'ETH' : 'ETH/Token'}
                </Typography>
              </Box>
          ))}
        </Box>
    );
  }
  return null;
};

// Custom tooltip component for the pie chart
const CustomPieChartTooltip = ({ active, payload }: PieChartTooltipProps) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
        <Box
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              p: 2,
              borderRadius: 1,
              boxShadow: theme.shadows[3],
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
            {payload[0].name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: payload[0].payload.fill,
                }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Market Share: {payload[0].value}%
            </Typography>
          </Box>
        </Box>
    );
  }
  return null;
};

// Custom label for pie chart
const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieChartLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
      <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ fontSize: '12px', fontWeight: 500 }}
      >
        {name} ({(percent * 100).toFixed(0)}%)
      </text>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('24h');
  const [metricType, setMetricType] = useState('volume');

  return (
      <Box
          sx={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            bgcolor: 'transparent',
          }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
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
                    color: theme.palette.text.primary,
                  }}
              >
                Market Analytics
              </Typography>
            </motion.div>

            {/* Controls */}
            <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 4,
                  flexWrap: 'wrap',
                }}
            >
              <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiButton-root': {
                      color: theme.palette.text.primary,
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                  }}
              >
                <Button
                    onClick={() => setTimeframe('24h')}
                    variant={timeframe === '24h' ? 'contained' : 'outlined'}
                >
                  24H
                </Button>
                <Button
                    onClick={() => setTimeframe('7d')}
                    variant={timeframe === '7d' ? 'contained' : 'outlined'}
                >
                  7D
                </Button>
                <Button
                    onClick={() => setTimeframe('30d')}
                    variant={timeframe === '30d' ? 'contained' : 'outlined'}
                >
                  30D
                </Button>
                <Button
                    onClick={() => setTimeframe('1y')}
                    variant={timeframe === '1y' ? 'contained' : 'outlined'}
                >
                  1Y
                </Button>
              </ButtonGroup>

              <FormControl
                  size="small"
                  sx={{
                    minWidth: 120,
                    '& .MuiInputBase-root': {
                      color: theme.palette.text.primary,
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                    },
                  }}
              >
                <InputLabel>Metric</InputLabel>
                <Select
                    value={metricType}
                    label="Metric"
                    onChange={(e) => setMetricType(e.target.value)}
                >
                  <MenuItem value="volume">Volume</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="tokens">Tokens</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Market Overview Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AnimatedCard>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaChartBar size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" color="text.secondary">
                        Total Volume
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {mockMarketStats.totalVolume} ETH
                    </Typography>
                  </Box>
                </AnimatedCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AnimatedCard>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaMapMarkerAlt size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" color="text.secondary">
                        Active Properties
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {mockMarketStats.activeProperties}
                    </Typography>
                  </Box>
                </AnimatedCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AnimatedCard>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaChartPie size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" color="text.secondary">
                        Average Token Price
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {mockMarketStats.averageTokenPrice} ETH
                    </Typography>
                  </Box>
                </AnimatedCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AnimatedCard>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaGlobe size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" color="text.secondary">
                        Market Growth
                      </Typography>
                    </Box>
                    <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: mockMarketStats.marketGrowth >= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                    >
                      {mockMarketStats.marketGrowth >= 0 ? '+' : ''}
                      {mockMarketStats.marketGrowth}%
                    </Typography>
                  </Box>
                </AnimatedCard>
              </Grid>
            </Grid>
          </Box>

          {/* Market Trend Chart */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
              Market Trend
            </Typography>
            <AnimatedCard>
              <Box sx={{ p: 3, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                      data={marketTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={alpha(theme.palette.divider, 0.1)}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                    />
                    <YAxis
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                        tickFormatter={(value) => `${value} ${metricType === 'price' ? 'ETH' : ''}`}
                    />
                    <Tooltip content={<CustomLineChartTooltip />} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span style={{ color: theme.palette.text.primary, fontSize: '14px' }}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </span>
                        )}
                    />
                    <Line
                        type="monotone"
                        dataKey="volume"
                        name="Volume"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        dot={{ fill: theme.palette.primary.main, strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        name="Price"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={3}
                        dot={{ fill: theme.palette.secondary.main, strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </AnimatedCard>
          </Box>

          {/* Top Performers Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
              Top Performing Properties
            </Typography>
            <Grid container spacing={3}>
              {mockTopPerformers.map((property) => (
                  <Grid item xs={12} md={4} key={property.id}>
                    <AnimatedCard>
                      <Box sx={{ p: 3 }}>
                        <Box
                            component="img"
                            src={property.imageUrl}
                            alt={property.propertyTitle}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 2,
                              mb: 2,
                            }}
                        />
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                          {property.propertyTitle}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                          {property.location}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Price Change
                            </Typography>
                            <Typography
                                sx={{
                                  color: property.priceChange >= 0
                                      ? theme.palette.success.main
                                      : theme.palette.error.main,
                                  fontWeight: 600,
                                }}
                            >
                              {property.priceChange >= 0 ? '+' : ''}
                              {property.priceChange}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Volume
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              {property.volume} ETH
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </AnimatedCard>
                  </Grid>
              ))}
            </Grid>
          </Box>

          {/* Regional Distribution */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
              Regional Distribution
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <AnimatedCard>
                  <Box sx={{ p: 3, height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                            data={mockRegionalData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedPieLabel}
                            outerRadius={150}
                            innerRadius={75}
                            paddingAngle={4}
                            dataKey="marketShare"
                        >
                          {mockRegionalData.map((_entry, index) => (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke={theme.palette.background.paper}
                                  strokeWidth={2}
                              />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </AnimatedCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedCard>
                  <Box sx={{ p: 3, height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          data={mockRegionalData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={alpha(theme.palette.divider, 0.1)}
                            horizontal={true}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="region"
                            stroke={theme.palette.text.secondary}
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            cursor={{ fill: alpha(theme.palette.primary.main, 0.1) }}
                            content={<CustomPieChartTooltip />}
                        />
                        <Bar
                            dataKey="marketShare"
                            radius={[4, 4, 0, 0]}
                        >
                          {mockRegionalData.map((_entry, index) => (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                              />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </AnimatedCard>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
  );
};

export default Analytics;