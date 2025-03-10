// src/components/PropertyActionMenu.tsx
import { useState } from 'react';
import {
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import aptosService from '../services/aptosService';

interface PropertyActionMenuProps {
    propertyId: string;
    isOwner: boolean;
    onCanceled: () => void;
}

const PropertyActionMenu = ({ propertyId, isOwner, onCanceled }: PropertyActionMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCancelListing = async () => {
        setLoading(true);
        try {
            // For demo, create account - in production use connected wallet
            const account = await aptosService.createAccount();
            await aptosService.cancelListing(account, parseInt(propertyId));
            onCanceled();
        } catch (error) {
            console.error("Error canceling listing:", error);
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            handleClose();
        }
    };

    if (!isOwner) return null;

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls={open ? 'property-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="property-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'property-actions-button',
                }}
            >
                <MenuItem onClick={() => { handleClose(); setShowDeleteConfirm(true); }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Cancel Listing</ListItemText>
                </MenuItem>
            </Menu>

            {/* Cancel Listing Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => !loading && setShowDeleteConfirm(false)}
            >
                <DialogTitle>Cancel Property Listing</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this listing? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                        No, Keep Listed
                    </Button>
                    <Button
                        onClick={handleCancelListing}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Yes, Cancel Listing"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PropertyActionMenu;