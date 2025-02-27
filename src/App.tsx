import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { DrawResult } from './pages/DrawResult';

export function App() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' } 
              }}
            >
              Encontro de Noivos
            </Typography>
            
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} component={Link} to="/">Noivos</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/admin">Equipe</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/resultado">Resultado do Sorteio</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Início
                </Button>
                <Button color="inherit" component={Link} to="/admin" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Equipe
                </Button>
                <Button color="inherit" component={Link} to="/resultado" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Resultado do Sorteio
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/resultado" element={<DrawResult />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
