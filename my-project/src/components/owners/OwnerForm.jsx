import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const OwnerForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    if (name === 'fullName' && !value.trim()) {
      setFormErrors(prev => ({ ...prev, fullName: 'Ad Soyad boş olamaz' }));
    } else if (name === 'phone' && !value.trim()) {
      setFormErrors(prev => ({ ...prev, phone: 'Telefon numarası boş olamaz' }));
    } else if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      setFormErrors(prev => ({ ...prev, email: 'Geçerli bir e-posta adresi girin' }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Ad Soyad boş olamaz';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Telefon numarası boş olamaz';
      isValid = false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 0
      }}>
        {mode === 'add' ? <AddIcon /> : <EditIcon />}
        {mode === 'add' ? 'Yeni Hasta Sahibi Ekle' : 'Hasta Sahibini Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="fullName"
                label="Ad Soyad"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleChange}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Telefon"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="E-posta"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Adres"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
          
          {Object.keys(formErrors).some(key => formErrors[key]) && (
            <Box mt={2}>
              <Alert 
                severity="error"
                variant="filled"
                sx={{ borderRadius: '8px' }}
              >
                Lütfen form hatalarını düzeltin
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={onCancel} 
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || Object.keys(formErrors).some(key => formErrors[key])}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
            }}
          >
            {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default OwnerForm; 