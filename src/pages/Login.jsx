import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kayıt başarılı mesajını kontrol et
    if (location.state?.registered) {
      setNotification({
        open: true,
        message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
        severity: 'success'
      });
    }
  }, [location.state]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Kullanıcı adı gerekli';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Şifre gerekli';
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
    
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-gray-100"
      sx={{ bgcolor: 'background.default' }}
    >
      <Paper elevation={3} className="w-full max-w-md p-8">
        <Typography component="h1" variant="h5" className="text-center mb-6">
          Veteriner Klinik Giriş
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            id="username"
            label="Kullanıcı Adı"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!formErrors.username}
            helperText={formErrors.username}
            disabled={loading}
            required
          />
          
          <TextField
            fullWidth
            id="password"
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="mt-4"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
          
          <Box className="text-center mt-4">
            <Typography variant="body2">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Kayıt Ol
              </Link>
            </Typography>
          </Box>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login; 