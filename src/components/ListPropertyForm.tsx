// src/components/ListPropertyForm.tsx
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    IconButton,
    InputAdornment,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import { MdClose } from 'react-icons/md';
import aptosService from '../services/aptosService';

interface ListPropertyFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ListPropertyForm = ({ open, onClose, onSuccess }: ListPropertyFormProps) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // For demo purposes, create a new account
            // In production, you would use the user's connected wallet
            const account = await aptosService.createAccount();

            // Convert price to octas (APT * 10^8)
            const priceInOctas = Math.floor(Number(formData.price) * 100000000);

            await aptosService.listProperty(
                account,
                priceInOctas,
                formData.name,
                formData.description,
                formData.imageUrl
            );

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error listing property:", error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.name && formData.description && formData.price && formData.imageUrl;

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
            ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>List New Property</Typography>
                <IconButton onClick={onClose} disabled={loading}>
                    <MdClose />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                label="Property Name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                                required
                                margin="normal"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                fullWidth
                                value={formData.description}
                                onChange={handleChange}
                                required
                                margin="normal"
                                multiline
                                rows={4}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                fullWidth
                                value={formData.price}
                                onChange={handleChange}
                                required
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">APT</InputAdornment>
                                    ),
                                }}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="imageUrl"
                                label="Image URL"
                                fullWidth
                                value={formData.imageUrl}
                                onChange={handleChange}
                                required
                                margin="normal"
                                placeholder="https://example.com/image.jpg"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    variant="contained"
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : "List Property"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ListPropertyForm;