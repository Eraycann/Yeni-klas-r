import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Chip
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Bloodtype as BloodtypeIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import speciesService from '../../services/speciesService';

const BloodTypeForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    type: '',
    speciesId: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [species, setSpecies] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  
  // Yaygın kan grupları
  const commonBloodTypes = {
    "Kedi": ["A", "B", "AB"],
    "Köpek": ["DEA 1.1+", "DEA 1.1-", "DEA 3", "DEA 4", "DEA 5", "DEA 7"],
    "default": ["A", "B", "AB", "O"]
  };
  
  useEffect(() => {
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        type: initialData.type || '',
        speciesId: initialData.species?.id || ''
      });
    }
  }, [mode, initialData]);

  const fetchSpecies = async () => {
    try {
      setLoadingSpecies(true);
      const response = await speciesService.getSpecies(0, 100);
      setSpecies(response.content || []);
      
      // İlk tür varsa ve form boşsa, ilk türü seç
      if (response.content && response.content.length > 0 && !formData.speciesId) {
        setFormData(prev => ({
          ...prev,
          speciesId: response.content[0].id
        }));
      }
    } catch (error) {
      console.error('Türler yüklenirken hata oluştu:', error);
    } finally {
      setLoadingSpecies(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    if (name === 'type' && !value.trim()) {
      setFormErrors(prev => ({ ...prev, type: 'Kan grubu tipi boş olamaz' }));
    } else if (name === 'speciesId' && !value) {
      setFormErrors(prev => ({ ...prev, speciesId: 'Tür seçimi gerekli' }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.type.trim()) {
      errors.type = 'Kan grubu tipi boş olamaz';
      isValid = false;
    }

    if (!formData.speciesId) {
      errors.speciesId = 'Tür seçimi gerekli';
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

  // Seçilen türe göre yaygın kan gruplarını getir
  const getBloodTypesBySpecies = () => {
    const selectedSpecies = species.find(s => s.id === formData.speciesId);
    if (!selectedSpecies) return commonBloodTypes.default;
    
    return commonBloodTypes[selectedSpecies.name] || commonBloodTypes.default;
  };

  return (
    <>
      <DialogTitle sx={{ 
        bgcolor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 0
      }}>
        {mode === 'add' ? <AddIcon /> : <EditIcon />}
        {mode === 'add' ? 'Yeni Kan Grubu Ekle' : 'Kan Grubunu Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                required
                error={!!formErrors.speciesId}
                disabled={loading || loadingSpecies}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="species-label">Tür</InputLabel>
                <Select
                  labelId="species-label"
                  name="speciesId"
                  value={formData.speciesId}
                  onChange={handleChange}
                  label="Tür"
                  startAdornment={
                    <InputAdornment position="start">
                      <PetsIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {loadingSpecies ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Türler yükleniyor...
                    </MenuItem>
                  ) : (
                    species.map((species) => (
                      <MenuItem key={species.id} value={species.id}>
                        {species.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {formErrors.speciesId && <FormHelperText>{formErrors.speciesId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  autoFocus
                  name="type"
                  label="Kan Grubu Tipi"
                  fullWidth
                  required
                  value={formData.type}
                  onChange={handleChange}
                  error={!!formErrors.type}
                  helperText={formErrors.type}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BloodtypeIcon color="error" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                {formData.speciesId && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Yaygın Kan Grupları:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {getBloodTypesBySpecies().map((type) => (
                        <Chip 
                          key={type} 
                          label={type} 
                          size="small"
                          color={formData.type === type ? "primary" : "default"}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, type }));
                            setFormErrors(prev => ({ ...prev, type: null }));
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </FormControl>
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
            color="error" 
            disabled={loading || loadingSpecies || Object.keys(formErrors).some(key => formErrors[key])}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
            }}
          >
            {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default BloodTypeForm; 