import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNotificationChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: event.target.checked,
      },
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Container maxWidth="md">
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ p: 4 }}
      >
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main' }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {formData.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Member since: {new Date().getFullYear()}
            </Typography>
            <Button
              variant={editMode ? 'contained' : 'outlined'}
              onClick={() => editMode ? handleSave() : setEditMode(true)}
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Personal Information */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1 }} /> Personal Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              disabled={!editMode}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Notification Settings */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} /> Notification Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.email}
                  onChange={handleNotificationChange('email')}
                  disabled={!editMode}
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange('push')}
                  disabled={!editMode}
                />
              }
              label="Push Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications.sms}
                  onChange={handleNotificationChange('sms')}
                  disabled={!editMode}
                />
              }
              label="SMS Notifications"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Security Section */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} /> Security
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
            Enable 2FA
          </Button>
          <Button variant="outlined" color="error">
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 