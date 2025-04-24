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
  Bloodtype as BloodtypeIcon
} from '@mui/icons-material';
import bloodTypeService from '../services/bloodTypeService';
import BloodTypeList from '../components/bloodTypes/BloodTypeList';
import BloodTypeForm from '../components/bloodTypes/BloodTypeForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

const BloodTypePage = () => {
  const theme = useTheme();
  const [bloodTypes, setBloodTypes] = useState([]);
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
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBloodTypes, setFilteredBloodTypes] = useState([]);

  // Kan gruplarını API'den yükle
  useEffect(() => {
    fetchBloodTypes();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBloodTypes(bloodTypes);
    } else {
      const filtered = bloodTypes.filter(bloodType => 
        bloodType.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bloodType.species.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBloodTypes(filtered);
    }
  }, [searchTerm, bloodTypes]);

  const fetchBloodTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bloodTypeService.getBloodTypes(page, size);
      
      setBloodTypes(response.content || []);
      setFilteredBloodTypes(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Kan grupları yüklenirken hata oluştu:', error);
      setError(error.message || 'Kan grupları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (mode, bloodType = null) => {
    setDialogMode(mode);
    setSelectedBloodType(bloodType);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBloodType(null);
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

  const handleFormSubmit = async (bloodTypeData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await bloodTypeService.createBloodType(bloodTypeData);
        setNotification({
          open: true,
          message: 'Kan grubu başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await bloodTypeService.updateBloodType(selectedBloodType.id, bloodTypeData);
        setNotification({
          open: true,
          message: 'Kan grubu başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchBloodTypes();
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

  const handleDeleteBloodType = async (id) => {
    try {
      setLoading(true);
      
      await bloodTypeService.deleteBloodType(id);
      
      setNotification({
        open: true,
        message: 'Kan grubu başarıyla silindi',
        severity: 'success'
      });
      
      fetchBloodTypes();
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
          className="bg-gradient-to-r from-red-600 to-pink-500 py-5 px-6"
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
            <BloodtypeIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" className="font-medium text-white">
              Kan Grupları
            </Typography>
            <Typography variant="subtitle2" className="text-red-100">
              Hayvan türlerine göre kan gruplarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <SearchBar
              placeholder="Kan grubu veya tür adı ile ara..."
              onSearch={handleSearch}
            />
            
            <Button
              variant="contained"
              color="error"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen('add')}
              disabled={loading}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
              }}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              Yeni Kan Grubu Ekle
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
          
          {!loading && filteredBloodTypes.length === 0 ? (
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
                {searchTerm ? 'Arama kriterine uygun kan grubu bulunamadı' : 'Henüz kayıtlı kan grubu bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Sisteme yeni kan grupları eklemek için "Yeni Kan Grubu Ekle" butonuna tıklayabilirsiniz'}
              </Typography>
              
              {searchTerm ? (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setSearchTerm('')}
                  sx={{ borderRadius: '8px', px: 3 }}
                >
                  Aramayı Temizle
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen('add')}
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
                  }}
                >
                  Yeni Kan Grubu Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }} elevation={0}>
                <BloodTypeList 
                  bloodTypes={filteredBloodTypes} 
                  onEdit={(bloodType) => handleDialogOpen('edit', bloodType)} 
                  onDelete={handleDeleteBloodType}
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
        <BloodTypeForm 
          mode={dialogMode}
          initialData={selectedBloodType}
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

export default BloodTypePage; 