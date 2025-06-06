import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
  Pets as PetsIcon
} from '@mui/icons-material';

const BreedList = ({ breeds, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, breed: null });

  const handleOpenDeleteDialog = (breed) => {
    setDeleteDialog({ open: true, breed });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, breed: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.breed) {
      onDelete(deleteDialog.breed.id);
      handleCloseDeleteDialog();
    }
  };

  // Türlerin renklerini belirlemek için basit bir fonksiyon
  const getSpeciesColor = (id) => {
    const colors = [
      theme.palette.primary.light,
      theme.palette.secondary.light,
      theme.palette.success.light,
      theme.palette.info.light,
      theme.palette.warning.light
    ];
    return colors[id % colors.length];
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderBottom: '2px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Irk Adı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Tür</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breeds.map((breed) => (
              <TableRow 
                key={breed.id} 
                hover
                sx={{
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.secondary.light,
                        color: '#fff',
                        width: 40, 
                        height: 40 
                      }}
                    >
                      <CategoryIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {breed.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {breed.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getSpeciesColor(breed.species.id),
                        color: '#fff',
                        width: 32, 
                        height: 32 
                      }}
                    >
                      <PetsIcon sx={{ fontSize: '18px' }} />
                    </Avatar>
                    <Typography variant="body2">
                      {breed.species.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => onEdit(breed)} 
                      disabled={loading}
                      color="primary"
                      size="small"
                      sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63, 81, 181, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(63, 81, 181, 0.15)',
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton 
                      onClick={() => handleOpenDeleteDialog(breed)} 
                      disabled={loading}
                      color="error"
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.15)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon />
          Irkı Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.secondary.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.breed?.name}</Typography>
              {deleteDialog.breed?.species && (
                <Typography variant="body2" color="text.secondary">
                  {deleteDialog.breed.species.name}
                </Typography>
              )}
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.breed?.name}</strong> ırkını silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu ırka bağlı hayvanlar etkilenebilir.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BreedList; 