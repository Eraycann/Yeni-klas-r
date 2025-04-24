import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  PetsOutlined as PetsIcon,
  People as PeopleIcon,
  Bloodtype as BloodTypeIcon,
  Category as CategoryIcon,
  Vaccines as VaccineIcon,
  LocalHospital as MedicationIcon,
  LocalShipping as ShippingIcon,
  Warning as AllergyIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const navItems = [
  { 
    title: 'Hasta Sahibi', 
    icon: <PeopleIcon />, 
    path: '/owners', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_RECEPTIONIST'] 
  },
  { 
    title: 'Kan Grubu', 
    icon: <BloodTypeIcon />, 
    path: '/blood-types', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Tür', 
    icon: <CategoryIcon />, 
    path: '/species', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Irk', 
    icon: <CategoryIcon />, 
    path: '/breeds', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Hasta', 
    icon: <PetsIcon />, 
    path: '/patients', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_RECEPTIONIST'] 
  },
  { 
    title: 'Aşı', 
    icon: <VaccineIcon />, 
    path: '/vaccines', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Alerji', 
    icon: <AllergyIcon />, 
    path: '/allergies', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'İlaç', 
    icon: <MedicationIcon />, 
    path: '/medications', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Teslimat', 
    icon: <ShippingIcon />, 
    path: '/medication-batch', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
];

const drawerWidth = 240;

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            px: [1],
          }}
        >
          {open ? (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
                Vet Klinik
              </Typography>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        
        {user && (
          <Box sx={{ p: open ? 2 : 1, display: 'flex', flexDirection: open ? 'row' : 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: open ? 0 : 1 }}>
              {user.username && user.username[0].toUpperCase()}
            </Avatar>
            {open && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.roles && user.roles.map(role => role.replace('ROLE_', '')).join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        <Divider />
        
        <List>
          {navItems
            .filter(item => user && user.roles && item.roles.some(role => user.roles.includes(role)))
            .map((item) => (
              <ListItem key={item.path} disablePadding>
                <Tooltip title={open ? '' : item.title} placement="right">
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem disablePadding>
            <Tooltip title={open ? '' : 'Çıkış Yap'} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${open ? drawerWidth : 64}px)` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar; 