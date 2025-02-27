import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

interface CoupleFormProps {
  onSubmit: (names: string[]) => void;
  loading?: boolean;
  error?: string | null;
}

export function CoupleForm({ onSubmit, loading = false, error = null }: CoupleFormProps) {
  const [names, setNames] = useState<string[]>(['', '', '']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledNames = names.filter(name => name.trim() !== '');
    if (filledNames.length < 2) {
      alert('Por favor, preencha pelo menos 2 nomes de casais para realizar o sorteio.');
      return;
    }
    onSubmit(filledNames);
  };

  const handleAddName = () => {
    if (names.length < 100) {
      setNames([...names, '']);
    }
  };

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit} 
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '500px', md: '600px' },
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        borderRadius: '8px'
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box 
        sx={{ 
          maxHeight: { xs: '50vh', sm: '60vh' }, 
          overflow: 'auto',
          pr: { xs: 1, sm: 2 },
          mb: 2
        }}
      >
        {names.map((name, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Nome do casal ${index + 1}...`}
              disabled={loading}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={handleAddName}
          disabled={loading || names.length >= 100}
          sx={{ 
            borderRadius: '8px',
            py: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Adicionar Casal
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ 
            borderRadius: '8px',
            py: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Enviar para Sorteio'
          )}
        </Button>
      </Box>
    </Paper>
  );
}
