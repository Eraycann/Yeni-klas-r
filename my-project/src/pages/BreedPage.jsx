import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar,
  Alert, 
  Card,
  CardContent,
  Dialog,
  useTheme,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import breedService from '../services/breedService';
import BreedList from '../components/breeds/BreedList';
import BreedForm from '../components/breeds/BreedForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

const BreedPage = () => {
  const theme = useTheme();
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Sayfalama
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedBreed, setSelectedBreed] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState([]);

  // Irkları API'den yükle
  useEffect(() => {
    fetchBreeds();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBreeds(breeds);
    } else {
      const filtered = breeds.filter(breed => 
        breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.species.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBreeds(filtered);
    }
  }, [searchTerm, breeds]);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await breedService.getBreeds(page, size);
      
      setBreeds(response.content || []);
      setFilteredBreeds(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Irklar yüklenirken hata oluştu:', error);
      setError(error.message || 'Irklar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (mode, breed = null) => {
    setDialogMode(mode);
    setSelectedBreed(breed);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBreed(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFormSubmit = async (breedData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await breedService.createBreed(breedData);
        setNotification({
          open: true,
          message: 'Irk başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await breedService.updateBreed(selectedBreed.id, breedData);
        setNotification({
          open: true,
          message: 'Irk başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchBreeds();
    } catch (error) {
      console.error('İşlem sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreed = async (id) => {
    try {
      setLoading(true);
      
      await breedService.deleteBreed(id);
      
      setNotification({
        open: true,
        message: 'Irk başarıyla silindi',
        severity: 'success'
      });
      
      fetchBreeds();
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Card 
        elevation={2} 
        className="mb-6 overflow-hidden"
        sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          className="bg-gradient-to-r from-purple-600 to-indigo-500 py-5 px-6"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.8) 0%, transparent 70%)'
            }}
          />
          
          <Box 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: '50%', 
              p: 1.5,
              display: 'flex',
              zIndex: 1
            }}
          >
            <CategoryIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" className="font-medium text-white">
              Hayvan Irkları
            </Typography>
            <Typography variant="subtitle2" className="text-blue-100">
              Sistem içindeki hayvan ırklarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <SearchBar
              placeholder="Irk veya tür adı ile ara..."
              onSearch={handleSearch}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen('add')}
              disabled={loading}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
              }}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              Yeni Irk Ekle
            </Button>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              className="mb-4"
              sx={{ borderRadius: '8px' }}
              variant="filled"
            >
              {error}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={48} />
            </Box>
          )}
          
          {!loading && filteredBreeds.length === 0 ? (
            <Paper 
              elevation={0} 
              className="py-12 px-6 text-center" 
              sx={{ 
                bgcolor: 'background.default', 
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Arama kriterine uygun ırk bulunamadı' : 'Henüz kayıtlı ırk bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Sisteme yeni ırklar eklemek için "Yeni Irk Ekle" butonuna tıklayabilirsiniz'}
              </Typography>
              
              {searchTerm ? (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setSearchTerm('')}
                  sx={{ borderRadius: '8px', px: 3 }}
                >
                  Aramayı Temizle
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen('add')}
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
                  }}
                >
                  Yeni Irk Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }} elevation={0}>
                <BreedList 
                  breeds={filteredBreeds} 
                  onEdit={(breed) => handleDialogOpen('edit', breed)} 
                  onDelete={handleDeleteBreed}
                  loading={loading}
                />
              </Paper>
              
              {totalPages > 1 && (
                <Pagination 
                  page={page}
                  count={totalPages}
                  totalElements={totalElements}
                  rowsPerPage={size}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleSizeChange}
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <BreedForm 
          mode={dialogMode}
          initialData={selectedBreed}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
          loading={loading}
        />
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BreedPage; 