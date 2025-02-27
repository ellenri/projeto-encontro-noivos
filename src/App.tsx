import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { DrawResult } from './pages/DrawResult';

export function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Encontro de Noivos
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Início
            </Button>
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
            <Button color="inherit" component={Link} to="/resultado">
              Resultado do Sorteio
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
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
