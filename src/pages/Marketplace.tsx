import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    Select,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PropertyCard from '../components/PropertyCard';
import TokenPurchaseModal from '../components/TokenPurchaseModal';
import aptosService from '../services/aptosService';
import { useWallet } from '../hooks/useWallet';

// Interface for property data structure
interface Property {
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
    description?: string;
    seller?: string;
    source?: 'blockchain' | 'mock';  // New property to identify listing source
}

// Interface for the listing form
interface ListingFormData {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    location: string;
    area: number;
    totalTokens: number;
    tokenPrice: number;
}

const Marketplace = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { address, isConnected, connect } = useWallet();

    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filterType, setFilterType] = useState('all');

    // States for modals
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [listingModalOpen, setListingModalOpen] = useState(false);

    // States for notifications
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

    // State for the new listing form
    const [listingForm, setListingForm] = useState<ListingFormData>({
        name: '',
        description: '',
        imageUrl: '',
        price: 0,
        location: '',
        area: 0,
        totalTokens: 1000,
        tokenPrice: 0.01,
    });

    // Fetch properties from the smart contract
    useEffect(() => {
        fetchProperties();
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        if (properties.length > 0) {
            let filtered = [...properties];

            // Apply search filter
            if (searchQuery) {
                filtered = filtered.filter(property =>
                    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Apply type filter
            if (filterType !== 'all') {
                // This is a placeholder. In a real app, you'd have property types
                filtered = filtered.filter(property => property.verified === (filterType === 'verified'));
            }

            // Apply sorting
            switch (sortBy) {
                case 'price_low':
                    filtered.sort((a, b) => a.tokenPrice - b.tokenPrice);
                    break;
                case 'price_high':
                    filtered.sort((a, b) => b.tokenPrice - a.tokenPrice);
                    break;
                case 'return':
                    filtered.sort((a, b) => (b.expectedReturn || 0) - (a.expectedReturn || 0));
                    break;
                case 'newest':
                default:
                    // In a real app, you would sort by date
                    break;
            }

            setFilteredProperties(filtered);
        }
    }, [properties, searchQuery, sortBy, filterType]);

    // In the fetchProperties function
    const fetchProperties = async () => {
        setLoading(true);
        try {
            // Get real listings from blockchain
            const realListings = await aptosService.getAllListings();

            // Also get mock listings
            const mockListings = await aptosService.getMockListings(1);

            // Add source property and ensure unique IDs
            const realWithSource = realListings.map(listing => ({
                ...listing,
                source: 'blockchain' as const
            }));

            const mockWithSource = mockListings.map(listing => ({
                ...listing,
                id: `mock-${listing.id}`,  // Prefix mock listing IDs to make them unique
                source: 'mock' as const
            }));

            // Combine both sets of listings
            const combinedListings = [...realWithSource, ...mockWithSource];

            console.log(`Displaying ${realListings.length} real and ${mockListings.length} mock listings`);

            setProperties(combinedListings);
            setFilteredProperties(combinedListings);
        } catch (error) {
            console.error("Error fetching properties:", error);
            showSnackbar('Failed to load properties', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyClick = (property: Property) => {
        navigate(`/property/${property.id}`);
    };

    const handlePurchaseClick = (property: Property) => (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isConnected) {
            showSnackbar('Please connect your wallet to purchase tokens', 'info');
            return;
        }
        setSelectedProperty(property);
        setPurchaseModalOpen(true);
    };

    const handleListProperty = async () => {
        if (!isConnected) {
            try {
                await connect();
            } catch (error) {
                showSnackbar('Failed to connect wallet', 'error');
                return;
            }
        }

        setListingModalOpen(true);
    };

    const handleSubmitListing = async () => {
        try {
            // Use Petra wallet instead of creating a test account
            await aptosService.listItemWithPetra(
                listingForm.price,
                listingForm.name,
                listingForm.description,
                listingForm.imageUrl
            );

            showSnackbar('Property listed successfully!', 'success');
            setListingModalOpen(false);

            // Reset form and refresh listings
            setListingForm({
                name: '',
                description: '',
                imageUrl: '',
                price: 0,
                location: '',
                area: 0,
                totalTokens: 1000,
                tokenPrice: 0.01,
            });

            fetchProperties();
        } catch (error) {
            console.error('Error listing property:', error);
            showSnackbar('Failed to list property', 'error');
        }
    };

    const handlePurchaseConfirm = async (tokenAmount: number) => {
        if (!selectedProperty || !isConnected) return;

        try {
            // Use Petra wallet instead of creating a test account
            await aptosService.buyItemWithPetra(Number(selectedProperty.id));

            showSnackbar(`Successfully purchased ${tokenAmount} tokens!`, 'success');
            fetchProperties();
        } catch (error) {
            console.error('Purchase failed:', error);
            showSnackbar('Failed to complete purchase', 'error');
        }
    };

    const handleCancelListing = async (propertyId: string, event: React.MouseEvent) => {
        event.stopPropagation();

        if (!isConnected) {
            showSnackbar('Please connect your wallet', 'info');
            return;
        }

        try {
            // Skip cancellation for mock listings
            if (propertyId.startsWith('mock-')) {
                showSnackbar('Cannot cancel mock listings', 'info');
                return;
            }

            // Use Petra wallet directly instead of creating a new account
            await aptosService.cancelListingWithPetra(Number(propertyId));

            // Remove the cancelled listing from local state rather than fetching again
            setProperties(prevProperties =>
                prevProperties.filter(property => property.id !== propertyId)
            );
            setFilteredProperties(prevFiltered =>
                prevFiltered.filter(property => property.id !== propertyId)
            );

            showSnackbar('Listing cancelled successfully', 'success');
        } catch (error) {
            console.error('Error cancelling listing:', error);
            showSnackbar('Failed to cancel listing', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="xl">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Real Estate Marketplace
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 4,
                        color: alpha(theme.palette.text.primary, 0.7),
                        maxWidth: '800px',
                    }}
                >
                    Discover tokenized real estate properties and invest in fractional ownership with cryptocurrency.
                </Typography>
            </motion.div>

            {/* Filters Section */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 3 },
                    mb: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Left Section - Search and Filters */}
                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <TextField
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 250 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl
                        size="small"
                        variant="outlined"
                        sx={{
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                            },
                        }}
                    >
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as string)}
                            displayEmpty
                        >
                            <MenuItem value="all">All Properties</MenuItem>
                            <MenuItem value="verified">Verified Only</MenuItem>
                            <MenuItem value="unverified">Unverified</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        size="small"
                        variant="outlined"
                        sx={{
                            minWidth: 150,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                            },
                        }}
                    >
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as string)}
                            displayEmpty
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="price_low">Price: Low to High</MenuItem>
                            <MenuItem value="price_high">Price: High to Low</MenuItem>
                            <MenuItem value="return">Highest Returns</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Right Section - Add Property Button */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleListProperty}
                    sx={{
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        },
                    }}
                >
                    List Property
                </Button>
            </Box>

            {/* Properties Grid */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredProperties.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredProperties.map((property) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                                <Box sx={{ height: '100%', position: 'relative' }}>
                                    <PropertyCard
                                        property={property}
                                        onClick={() => handlePropertyClick(property)}
                                        onPurchaseClick={handlePurchaseClick(property)}
                                    />

                                    {/* Show cancel button if user is the seller */}
                                    {property.seller === address && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={(e) => handleCancelListing(property.id, e)}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 2,
                                            }}
                                        >
                                            Cancel Listing
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 8,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            No properties found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search criteria or add a new property.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Purchase Modal */}
            {selectedProperty && (
                <TokenPurchaseModal
                    open={purchaseModalOpen}
                    onClose={() => setPurchaseModalOpen(false)}
                    property={{
                        id: selectedProperty.id,
                        title: selectedProperty.title,
                        tokenPrice: selectedProperty.tokenPrice,
                        availableTokens: selectedProperty.availableTokens,
                        totalTokens: selectedProperty.totalTokens,
                        expectedReturn: selectedProperty.expectedReturn,
                        investmentPeriod: selectedProperty.investmentPeriod,
                    }}
                    onPurchase={handlePurchaseConfirm}
                />
            )}

            {/* New Property Listing Modal */}
            <Dialog
                open={listingModalOpen}
                onClose={() => setListingModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>List New Property</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Property Name"
                                fullWidth
                                value={listingForm.name}
                                onChange={(e) => setListingForm({...listingForm, name: e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Location"
                                fullWidth
                                value={listingForm.location}
                                onChange={(e) => setListingForm({...listingForm, location: e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={listingForm.description}
                                onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Image URL"
                                fullWidth
                                value={listingForm.imageUrl}
                                onChange={(e) => setListingForm({...listingForm, imageUrl: e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price (APT)"
                                type="number"
                                fullWidth
                                value={listingForm.price}
                                onChange={(e) => setListingForm({...listingForm, price: Number(e.target.value)})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Area (sq ft)"
                                type="number"
                                fullWidth
                                value={listingForm.area}
                                onChange={(e) => setListingForm({...listingForm, area: Number(e.target.value)})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Total Tokens"
                                type="number"
                                fullWidth
                                value={listingForm.totalTokens}
                                onChange={(e) => setListingForm({...listingForm, totalTokens: Number(e.target.value)})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Token Price (APT)"
                                type="number"
                                fullWidth
                                value={listingForm.tokenPrice}
                                onChange={(e) => setListingForm({...listingForm, tokenPrice: Number(e.target.value)})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setListingModalOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitListing}
                        variant="contained"
                        disabled={!listingForm.name || !listingForm.description || !listingForm.imageUrl || !listingForm.price}
                    >
                        List Property
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Marketplace;