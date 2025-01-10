import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Box,
  IconButton,
  Paper,
  Dialog,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { TokenPurchaseModal } from '../components/TokenPurchaseModal';

// Mock data
const propertyData = {
  id: '1',
  title: 'Luxury Apartment in Downtown',
  description: 'A beautiful apartment with modern amenities...',
  price: 500000,
  tokenPrice: 100,
  totalTokens: 5000,
  availableTokens: 3000,
  images: ['/property1.jpg', '/property2.jpg', '/property3.jpg'],
  features: ['3 Bedrooms', '2 Bathrooms', 'Parking', 'Pool'],
  location: {
    address: '123 Main St, City, Country',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    nearbyAttractions: ['Park', 'Shopping Mall', 'Metro Station']
  },
  documents: ['Property Deed', 'Inspection Report', 'Title Insurance'],
  returns: {
    historical: '8.5%',
    projected: '10%'
  }
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(propertyData.images[0]);

  const handleTokenPurchase = (amount: number) => {
    console.log('Purchasing tokens:', amount);
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Images and Basic Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={selectedImage}
              alt={propertyData.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {propertyData.title}
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                {propertyData.features.map((feature, index) => (
                  <Chip key={index} label={feature} />
                ))}
              </Stack>
              <Typography variant="body1" paragraph>
                {propertyData.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Investment Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Details
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Property Value</Typography>
                  <Typography variant="h6">${propertyData.price.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Token Price</Typography>
                  <Typography variant="h6">${propertyData.tokenPrice}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Available Tokens</Typography>
                  <Typography variant="h6">{propertyData.availableTokens} / {propertyData.totalTokens}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setIsModalOpen(true)}
                >
                  Purchase Tokens
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Returns
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Historical Returns</Typography>
                  <Typography variant="h6">{propertyData.returns.historical}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Projected Returns</Typography>
                  <Typography variant="h6">{propertyData.returns.projected}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Stack direction="row" spacing={1}>
                {propertyData.documents.map((doc, index) => (
                  <Chip key={index} label={doc} onClick={() => console.log(`Downloading ${doc}`)} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TokenPurchaseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPurchase={handleTokenPurchase}
        tokenPrice={propertyData.tokenPrice}
        availableTokens={propertyData.availableTokens}
      />
    </Container>
  );
} 