import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  useTheme,
  alpha,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEthereum, FaInfoCircle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface TokenPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    tokenPrice: number;
    availableTokens: number;
    totalTokens: number;
    expectedReturn?: number;
    investmentPeriod?: string;
  };
  onPurchase: (amount: number) => Promise<void>;
}

const steps = ['Select Amount', 'Review Details', 'Confirm Purchase'];

const TokenPurchaseModal = ({ open, onClose, property, onPurchase }: TokenPurchaseModalProps) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      await onPurchase(tokenAmount);
      handleNext();
    } catch (error) {
      console.error('Purchase failed:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = tokenAmount * property.tokenPrice;
  const ownership = (tokenAmount / property.totalTokens) * 100;

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select number of tokens
            </Typography>
            
            <Box sx={{ px: 1, mb: 4 }}>
              <Slider
                value={tokenAmount}
                onChange={(_, value) => setTokenAmount(value as number)}
                min={1}
                max={property.availableTokens}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Cost
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaEthereum size={20} color={theme.palette.primary.main} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {totalCost.toFixed(4)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ownership
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {ownership.toFixed(2)}%
                </Typography>
              </Box>
            </Box>

            {property.expectedReturn && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaInfoCircle size={16} />
                  Expected Returns
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {property.expectedReturn}% ROI
                </Typography>
                {property.investmentPeriod && (
                  <Typography variant="body2" color="text.secondary">
                    Investment Period: {property.investmentPeriod}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Purchase Summary
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography color="text.secondary">Number of Tokens</Typography>
                <Typography sx={{ fontWeight: 600 }}>{tokenAmount}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography color="text.secondary">Price per Token</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaEthereum size={16} color={theme.palette.primary.main} />
                  <Typography sx={{ fontWeight: 600 }}>{property.tokenPrice}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography color="text.secondary">Ownership Percentage</Typography>
                <Typography sx={{ fontWeight: 600 }}>{ownership.toFixed(2)}%</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  mt: 2,
                }}
              >
                <Typography variant="h6">Total Cost</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaEthereum size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {totalCost.toFixed(4)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaInfoCircle size={16} />
                Please review the details carefully before proceeding with the purchase.
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
              Purchase Successful!
            </Typography>
            <Typography color="text.secondary">
              You have successfully purchased {tokenAmount} tokens of {property.title}.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={activeStep === 2 ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
            ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Purchase Property Tokens
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.title}
          </Typography>
        </Box>
        {activeStep !== 2 && (
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <MdClose />
          </IconButton>
        )}
      </DialogTitle>

      <Box sx={{ px: 3, py: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep === 2 ? (
          <Button
            fullWidth
            onClick={onClose}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            }}
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              onClick={activeStep === 0 ? onClose : handleBack}
              variant="outlined"
              disabled={isProcessing}
              sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={activeStep === 1 ? handlePurchase : handleNext}
              variant="contained"
              disabled={isProcessing}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                px: 4,
              }}
            >
              {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === 1 ? (
                'Confirm Purchase'
              ) : (
                'Next'
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TokenPurchaseModal; 