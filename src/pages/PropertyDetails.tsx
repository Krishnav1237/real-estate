import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import TokenIcon from '@mui/icons-material/Token';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PercentIcon from '@mui/icons-material/Percent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import SpaIcon from '@mui/icons-material/Spa';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PetsIcon from '@mui/icons-material/Pets';
import TerraceIcon from '@mui/icons-material/Terrain';
import WindowIcon from '@mui/icons-material/Window';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SmartHomeIcon from '@mui/icons-material/Router';
import ElevatorIcon from '@mui/icons-material/Elevator';
import KingBedIcon from '@mui/icons-material/KingBed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';

// Mock property data (in a real app, this would come from an API/blockchain)
const mockProperty = {
  id: 1,
  title: 'Luxury Penthouse in Miami',
  locationName: 'Miami Beach, FL',
  price: 2500000,
  tokenPrice: 0.15,
  totalTokens: 1000,
  availableTokens: 750,
  type: 'Residential',
  squareFootage: 4500,
  yearBuilt: 2022,
  description: 'An extraordinary penthouse offering breathtaking ocean views, featuring premium finishes and state-of-the-art amenities. This luxurious residence combines modern design with unparalleled comfort.',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
    'https://images.unsplash.com/photo-1600607687644-aaa4e2c8e50c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  ],
  features: [
    'Private rooftop terrace with infinity pool',
    'Floor-to-ceiling windows with ocean views',
    'Gourmet kitchen with premium appliances',
    'Smart home automation system',
    'Private elevator access',
    'Master suite with spa-like bathroom',
    '24/7 concierge service',
    'Private beach access',
    'State-of-the-art fitness center',
    'Wine cellar and tasting room',
  ],
  amenities: [
    'Valet parking',
    'Resort-style pool deck',
    'Full-service spa',
    'Private cinema',
    'Business center',
    'Pet grooming station',
  ],
  performance: {
    expectedReturn: 12.5,
    occupancyRate: 95,
    monthlyYield: 450,
    annualAppreciation: 8.2,
  },
  documents: [
    { name: 'Property Deed', url: '#', type: 'PDF' },
    { name: 'Financial Reports', url: '#', type: 'PDF' },
    { name: 'Token Agreement', url: '#', type: 'PDF' },
    { name: 'Property Inspection Report', url: '#', type: 'PDF' },
    { name: 'Market Analysis', url: '#', type: 'PDF' },
  ],
  location: {
    address: '100 South Pointe Dr, Miami Beach, FL 33139',
    coordinates: {
      lat: 25.7617,
      lng: -80.1318
    },
    nearbyAttractions: [
      'South Beach (0.5 miles)',
      'Ocean Drive (1 mile)',
      'Miami Beach Marina (0.2 miles)',
      'Lincoln Road Mall (1.5 miles)',
    ],
  },
};

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TokenizationInfoCard = ({ title, value, icon, subtitle }: { title: string; value: string | number; icon: React.ReactNode; subtitle?: string }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color: theme.palette.primary.main }}>
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

const MapComponent = ({ coordinates }: { coordinates: { lat: number; lng: number } }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([coordinates.lat, coordinates.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      L.marker([coordinates.lat, coordinates.lng]).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div id="map" style={{ height: '100%', width: '100%' }} />
  );
};

const PropertyDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [tokenAmount, setTokenAmount] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const handlePurchase = () => {
    // Implement token purchase logic here
    console.log(`Purchasing ${tokenAmount} tokens`);
  };

  // Format location data
  const formattedLocation = mockProperty.location.address || mockProperty.locationName;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {mockProperty.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Chip
            icon={<LocationOnIcon />}
            label={formattedLocation}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiChip-icon': { color: theme.palette.primary.main },
            }}
          />
          <Chip
            icon={<BusinessIcon />}
            label={mockProperty.type}
            sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              '& .MuiChip-icon': { color: theme.palette.secondary.main },
            }}
          />
          <Chip
            icon={<SquareFootIcon />}
            label={`${mockProperty.squareFootage.toLocaleString()} sq ft`}
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1),
              '& .MuiChip-icon': { color: theme.palette.info.main },
            }}
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`Built ${mockProperty.yearBuilt}`}
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              '& .MuiChip-icon': { color: theme.palette.success.main },
            }}
          />
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Left Column - Images and Details */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Main Image */}
            <Card 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: theme.shadows[5],
              }}
            >
              <CardMedia
                component="img"
                height="500"
                image={mockProperty.images[activeImage]}
                alt={mockProperty.title}
                sx={{
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              />
            </Card>

            {/* Thumbnail Images */}
            <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
              {mockProperty.images.map((image, index) => (
                <Card
                  key={index}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  sx={{
                    width: 100,
                    cursor: 'pointer',
                    border: activeImage === index ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                  }}
                  onClick={() => setActiveImage(index)}
                >
                  <CardMedia
                    component="img"
                    height="60"
                    image={image}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </Card>
              ))}
            </Box>

            {/* Performance Metrics */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Investment Performance
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {mockProperty.performance.expectedReturn}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expected Return
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ApartmentIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {mockProperty.performance.occupancyRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Occupancy Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AttachMoneyIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      ${mockProperty.performance.monthlyYield}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Yield
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PercentIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {mockProperty.performance.annualAppreciation}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Annual Appreciation
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                About this Property
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {mockProperty.description}
              </Typography>
            </Paper>

            {/* Features and Amenities */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Features & Amenities
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                    Property Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { icon: <TerraceIcon />, text: 'Private rooftop terrace with infinity pool' },
                      { icon: <WindowIcon />, text: 'Floor-to-ceiling windows with ocean views' },
                      { icon: <KitchenIcon />, text: 'Gourmet kitchen with premium appliances' },
                      { icon: <SmartHomeIcon />, text: 'Smart home automation system' },
                      { icon: <ElevatorIcon />, text: 'Private elevator access' },
                      { icon: <KingBedIcon />, text: 'Master suite with spa-like bathroom' },
                      { icon: <SupportAgentIcon />, text: '24/7 concierge service' },
                      { icon: <BeachAccessIcon />, text: 'Private beach access' },
                      { icon: <FitnessCenterIcon />, text: 'State-of-the-art fitness center' },
                      { icon: <LocalBarIcon />, text: 'Wine cellar and tasting room' },
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <Box sx={{ color: theme.palette.primary.main }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="body2">
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                    Building Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { icon: <LocalParkingIcon />, text: 'Valet parking' },
                      { icon: <PoolIcon />, text: 'Resort-style pool deck' },
                      { icon: <SpaIcon />, text: 'Full-service spa' },
                      { icon: <LocalMoviesIcon />, text: 'Private cinema' },
                      { icon: <BusinessCenterIcon />, text: 'Business center' },
                      { icon: <PetsIcon />, text: 'Pet grooming station' },
                    ].map((amenity, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          },
                        }}
                      >
                        <Box sx={{ color: theme.palette.secondary.main }}>
                          {amenity.icon}
                        </Box>
                        <Typography variant="body2">
                          {amenity.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Location Details */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Location & Accessibility
              </Typography>
              
              {/* Map Preview */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  mb: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                }}
              >
                <MapComponent coordinates={mockProperty.location.coordinates} />
                <Box
                  component="a"
                  href={`https://www.openstreetmap.org/?mlat=${mockProperty.location.coordinates.lat}&mlon=${mockProperty.location.coordinates.lng}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'transparent',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.black, 0.3),
                      '& .map-button': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <Button
                    className="map-button"
                    variant="contained"
                    startIcon={<MapIcon />}
                    sx={{
                      opacity: 0,
                      transform: 'translateY(20px)',
                      transition: 'all 0.3s ease-in-out',
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.common.white,
                      },
                    }}
                  >
                    View on OpenStreetMap
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                  Address
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body1">
                    {mockProperty.location.address}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                Nearby Attractions
              </Typography>
              <Grid container spacing={2}>
                {mockProperty.location.nearbyAttractions.map((attraction, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        height: '100%',
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ color: theme.palette.secondary.main }} />
                      <Typography variant="body2">
                        {attraction}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        {/* Right Column - Token Purchase */}
        <Grid item xs={12} md={4}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            elevation={3}
            sx={{ 
              p: 3,
              borderRadius: 2,
              position: 'sticky',
              top: 24,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                Tokenization Details
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Invest in this property through tokenization. Each token represents a fractional ownership of the property.
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TokenizationInfoCard
                  title="Property Value"
                  value={`$${mockProperty.price.toLocaleString()}`}
                  icon={<AttachMoneyIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <TokenizationInfoCard
                  title="Token Price"
                  value={`$${mockProperty.tokenPrice}`}
                  icon={<TokenIcon />}
                  subtitle="per token"
                />
              </Grid>
              <Grid item xs={6}>
                <TokenizationInfoCard
                  title="Total Tokens"
                  value={mockProperty.totalTokens.toLocaleString()}
                  icon={<BusinessIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <TokenizationInfoCard
                  title="Available"
                  value={mockProperty.availableTokens.toLocaleString()}
                  icon={<TrendingUpIcon />}
                  subtitle={`${((mockProperty.availableTokens / mockProperty.totalTokens) * 100).toFixed(1)}% remaining`}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                Investment Highlights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, fontSize: '0.9rem' }} />
                  <Typography variant="body2">Expected Annual Return: {mockProperty.performance.expectedReturn}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, fontSize: '0.9rem' }} />
                  <Typography variant="body2">Monthly Yield: ${mockProperty.performance.monthlyYield}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, fontSize: '0.9rem' }} />
                  <Typography variant="body2">Property Appreciation: {mockProperty.performance.annualAppreciation}% annually</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Purchase Tokens
              </Typography>
              <TextField
                fullWidth
                type="number"
                label="Number of Tokens"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: alpha(theme.palette.common.white, 0.9),
                  },
                }}
              />
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Investment
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  ${(Number(tokenAmount) * mockProperty.tokenPrice).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Number(tokenAmount)} tokens at ${mockProperty.tokenPrice} each
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handlePurchase}
                disabled={!tokenAmount || Number(tokenAmount) <= 0}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Purchase Tokens
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Documents Section */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Property Documents
            </Typography>
            <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
              {mockProperty.documents.map((doc, index) => (
                <ListItem
                  key={index}
                  component="a"
                  href={doc.url}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <PictureAsPdfIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                  <ListItemText 
                    primary={doc.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetails; 