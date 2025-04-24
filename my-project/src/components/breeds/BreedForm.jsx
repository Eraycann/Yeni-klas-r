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
  FormHelperText
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Category as CategoryIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import speciesService from '../../services/speciesService';

const BreedForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    speciesId: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [species, setSpecies] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  
  useEffect(() => {
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
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
    if (name === 'name' && !value.trim()) {
      setFormErrors(prev => ({ ...prev, name: 'Irk adı boş olamaz' }));
    } else if (name === 'speciesId' && !value) {
      setFormErrors(prev => ({ ...prev, speciesId: 'Tür seçimi gerekli' }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Irk adı boş olamaz';
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
        {mode === 'add' ? 'Yeni Irk Ekle' : 'Irkı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Irk Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
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
            disabled={loading || loadingSpecies || Object.keys(formErrors).some(key => formErrors[key])}
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

export default BreedForm; 