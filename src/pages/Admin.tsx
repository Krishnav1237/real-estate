// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Grid,
    Paper
} from '@mui/material';
import aptosService from '../services/aptosService';
import { useWallet } from '../hooks/useWallet';

const Admin = () => {
    const [feePercentage, setFeePercentage] = useState<number>(100); // 1% as basis points
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const [result, setResult] = useState<{success: boolean, message: string} | null>(null);
    const [checkingMarketplace, setCheckingMarketplace] = useState<boolean>(true);
    const [marketplaceExists, setMarketplaceExists] = useState<boolean | null>(null);
    const [networkType, setNetworkType] = useState<string>('');
    const { address, isConnected, connect } = useWallet();

    // Check if the marketplace is already initialized
    useEffect(() => {
        const checkMarketplace = async () => {
            try {
                // Try to get the fee percentage as a way to check if marketplace exists
                await aptosService.getFeePercentage();
                setMarketplaceExists(true);
            } catch (error) {
                console.error("Error checking marketplace:", error);
                setMarketplaceExists(false);
            } finally {
                setCheckingMarketplace(false);
            }
        };

        // Get the network we're connected to
        const getNetwork = async () => {
            try {
                if (window.aptos) {
                    const network = await window.aptos.network?.();
                    setNetworkType(network || 'Unknown');
                }
            } catch (error) {
                console.error("Error getting network:", error);
            }
        };

        checkMarketplace();
        getNetwork();
    }, []);

    const handleInitializeMarketplace = async () => {
        if (!isConnected) {
            try {
                await connect();
            } catch (error) {
                setResult({
                    success: false,
                    message: "Please connect your wallet first."
                });
                return;
            }
        }

        setIsInitializing(true);
        setResult(null);

        try {
            // Use Petra wallet to initialize marketplace
            const txHash = await aptosService.initializeMarketplaceWithPetra(feePercentage);
            setResult({
                success: true,
                message: `Marketplace initialized successfully! Transaction hash: ${txHash}`
            });
            setMarketplaceExists(true);
        } catch (error) {
            console.error("Failed to initialize marketplace:", error);
            setResult({
                success: false,
                message: `Failed to initialize marketplace: ${error instanceof Error ? error.message : String(error)}`
            });
        } finally {
            setIsInitializing(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Marketplace Administration
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Status Information
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography>
                                <strong>Connected Wallet:</strong> {isConnected ? address : 'Not connected'}
                            </Typography>
                            <Typography>
                                <strong>Network:</strong> {networkType}
                            </Typography>
                            <Typography>
                                <strong>Contract Address:</strong> {aptosService.getMarketplaceAddress()}
                            </Typography>
                        </Box>

                        {!isConnected && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                Please connect your wallet to manage the marketplace.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Initialize Marketplace
                </Typography>

                {checkingMarketplace ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    marketplaceExists ? (
                        <Alert severity="info">
                            Marketplace is already initialized.
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body1" paragraph>
                                Initialize the marketplace with your connected wallet as the admin account.
                                Set the fee percentage below (in basis points, 100 = 1%).
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <TextField
                                    label="Fee Percentage (basis points)"
                                    type="number"
                                    value={feePercentage}
                                    onChange={(e) => setFeePercentage(parseInt(e.target.value))}
                                    InputProps={{
                                        inputProps: { min: 0, max: 1000 }
                                    }}
                                    sx={{ width: 250 }}
                                    helperText="1% = 100 basis points (Max 10%)"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleInitializeMarketplace}
                                    disabled={isInitializing || !isConnected}
                                >
                                    {isInitializing ? <CircularProgress size={24} /> : "Initialize Marketplace"}
                                </Button>
                            </Box>
                        </>
                    )
                )}

                {result && (
                    <Alert severity={result.success ? "success" : "error"} sx={{ mt: 2 }}>
                        {result.message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default Admin;