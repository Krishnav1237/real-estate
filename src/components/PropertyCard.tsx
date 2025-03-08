import React from 'react';
import { Box, Typography, Chip, useTheme, alpha, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FaEthereum } from 'react-icons/fa';
import { BiArea, BiTime } from 'react-icons/bi';
import { MdLocationOn, MdVerified, MdShoppingCart } from 'react-icons/md';
import { IoTrendingUp } from 'react-icons/io5';
import AnimatedCard from './AnimatedCard';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    area: number;
    imageUrl: string;
    tokenPrice: number;
    totalTokens: number;
    availableTokens: number;
    verified: boolean;
    expectedReturn?: number;
    investmentPeriod?: string;
  };
  onClick: () => void;
  onPurchaseClick: (event: React.MouseEvent) => void;
}

const PropertyCard = ({ property, onClick, onPurchaseClick }: PropertyCardProps) => {
  const theme = useTheme();

  return (
    <AnimatedCard>
      <Box
        onClick={onClick}
        sx={{ 
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Property Image */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '66.67%', // 3:2 aspect ratio
            overflow: 'hidden',
            borderRadius: 2,
            mb: 2,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Box
              component="img"
              src={property.imageUrl}
              alt={property.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </motion.div>

          {/* Price Tag */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: 2,
              py: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <FaEthereum size={20} color={theme.palette.primary.main} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {property.price}
            </Typography>
          </Box>

          {/* Status Tags */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {property.verified && (
              <Chip
                icon={<MdVerified />}
                label="Verified"
                size="small"
                sx={{
                  background: alpha(theme.palette.success.main, 0.9),
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            )}
            {property.expectedReturn && (
              <Chip
                icon={<IoTrendingUp />}
                label={`${property.expectedReturn}% ROI`}
                size="small"
                sx={{
                  background: alpha(theme.palette.primary.main, 0.9),
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Property Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            {property.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MdLocationOn color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary">
              {property.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BiArea color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                {property.area} m²
              </Typography>
            </Box>
            {property.investmentPeriod && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BiTime color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary">
                  {property.investmentPeriod}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Token Information */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Token Price
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaEthereum size={16} color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {property.tokenPrice}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Available Tokens
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {property.availableTokens}/{property.totalTokens}
              </Typography>
            </Box>
          </Box>

          {/* Purchase Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={onPurchaseClick}
            startIcon={<MdShoppingCart />}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
              },
            }}
          >
            Purchase Tokens
          </Button>
        </Box>
      </Box>
    </AnimatedCard>
  );
};

export default PropertyCard; 