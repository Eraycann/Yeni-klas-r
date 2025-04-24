import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

// Uzmanlık alanları örnek veri - normalde API'den çekilir
const specializations = [
  { id: 1, name: 'Küçük Hayvan Hekimliği' },
  { id: 2, name: 'Büyük Hayvan Hekimliği' },
  { id: 3, name: 'Egzotik Hayvan Hekimliği' },
  { id: 4, name: 'Cerrahi' }
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    specializationId: 1 // Varsayılan değer API için zorunlu
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Kullanıcı adı kontrolü
    if (!formData.username.trim()) {
      errors.username = 'Kullanıcı adı gerekli';
      isValid = false;
    }

    // Şifre kontrolü
    if (!formData.password) {
      errors.password = 'Şifre gerekli';
      isValid = false;
    }

    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
      isValid = false;
    }

    // E-posta kontrolü (zorunlu değil ama formatı doğrulanmalı)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
      isValid = false;
    }

    // Uzmanlık alanı kontrolü
    if (!formData.specializationId) {
      errors.specializationId = 'Uzmanlık alanı gerekli';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // confirmPassword'ü API'ye göndermeden önce kaldır
    const { confirmPassword, ...registerData } = formData;
    
    const success = await register(registerData);
    if (success) {
      navigate('/login', { state: { registered: true } });
    }
  };

  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-gray-100"
      sx={{ bgcolor: 'background.default', py: 4 }}
    >
      <Paper elevation={3} className="w-full max-w-lg p-8">
        <Typography component="h1" variant="h5" className="text-center mb-6">
          Veteriner Klinik Kayıt
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Kullanıcı Adı"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Şifre Tekrar"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Ad"
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Soyad"
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-posta Adresi"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.specializationId} required>
                <InputLabel id="specialization-label">Uzmanlık Alanı</InputLabel>
                <Select
                  labelId="specialization-label"
                  id="specializationId"
                  name="specializationId"
                  value={formData.specializationId}
                  onChange={handleChange}
                  label="Uzmanlık Alanı"
                  disabled={loading}
                >
                  {specializations.map((specialization) => (
                    <MenuItem key={specialization.id} value={specialization.id}>
                      {specialization.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.specializationId && (
                  <FormHelperText>{formErrors.specializationId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="mt-6"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
          
          <Box className="text-center mt-4">
            <Typography variant="body2">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register; 