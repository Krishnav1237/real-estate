import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Container,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MdSearch } from 'react-icons/md';
import PropertyCard from '../components/PropertyCard';
import TokenPurchaseModal from '../components/TokenPurchaseModal';

// Mock data - replace with actual data from your smart contract
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Penthouse in Miami',
    location: 'Miami Beach, FL',
    price: 250,
    area: 450,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    tokenPrice: 0.15,
    totalTokens: 1000,
    availableTokens: 750,
    verified: true,
    expectedReturn: 12.5,
    investmentPeriod: '36 months',
  },
  {
    id: '2',
    title: 'Modern Office Tower NYC',
    location: 'Manhattan, NY',
    price: 480,
    area: 800,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tokenPrice: 0.2,
    totalTokens: 2000,
    availableTokens: 1500,
    verified: true,
    expectedReturn: 9.8,
    investmentPeriod: '48 months',
  },
  {
    id: '3',
    title: 'Beachfront Villa Malibu',
    location: 'Malibu, CA',
    price: 350,
    area: 600,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    tokenPrice: 0.18,
    totalTokens: 1500,
    availableTokens: 1200,
    verified: true,
    expectedReturn: 11.2,
    investmentPeriod: '24 months',
  },
  {
    id: '4',
    title: 'Downtown Luxury Lofts',
    location: 'Chicago, IL',
    price: 180,
    area: 320,
    imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    tokenPrice: 0.08,
    totalTokens: 1000,
    availableTokens: 800,
    verified: true,
    expectedReturn: 8.5,
    investmentPeriod: '36 months',
  },
  {
    id: '5',
    title: 'Silicon Valley Tech Campus',
    location: 'Palo Alto, CA',
    price: 620,
    area: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    tokenPrice: 0.25,
    totalTokens: 2500,
    availableTokens: 2000,
    verified: true,
    expectedReturn: 14.2,
    investmentPeriod: '60 months',
  },
  {
    id: '6',
    title: 'Waterfront Apartments Seattle',
    location: 'Seattle, WA',
    price: 280,
    area: 420,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tokenPrice: 0.12,
    totalTokens: 1200,
    availableTokens: 900,
    verified: true,
    expectedReturn: 10.8,
    investmentPeriod: '36 months',
  },
];

const Marketplace = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handlePurchaseClick = (property: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedProperty(property);
    setPurchaseModalOpen(true);
  };

  const handlePurchase = async (amount: number) => {
    try {
      // Implement your token purchase logic here
      console.log(`Purchasing ${amount} tokens for property ${selectedProperty.id}`);
      // Call your smart contract method
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const filteredProperties = mockProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
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
              textAlign: 'center',
              mb: 2,
            }}
          >
            Discover Tokenized Properties
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          >
            Invest in premium real estate properties through fractional ownership
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search properties by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: '600px',
              background: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch size={24} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>
      </Box>

      {/* Property Grid */}
      <Grid container spacing={3}>
        {filteredProperties.map((property, index) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Purchase Modal */}
      {selectedProperty && (
        <TokenPurchaseModal
          open={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          property={selectedProperty}
          onPurchase={handlePurchase}
        />
      )}
    </Container>
  );
};

export default Marketplace; 