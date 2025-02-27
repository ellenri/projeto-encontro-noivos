import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress, InputLabel, Grid } from '@mui/material';

interface AdminCouple {
  name: string;
  numberOfCouples: number;
}

interface AdminCoupleFormProps {
  onSubmit: (adminCouples: AdminCouple[]) => void;
  onBack: () => void;
  totalEngagedCouples: number;
  loading?: boolean;
  error?: string | null;
}

export function AdminCoupleForm({ onSubmit, onBack, totalEngagedCouples, loading = false, error = null }: AdminCoupleFormProps) {
  const [adminCouples, setAdminCouples] = useState<AdminCouple[]>([
    { name: '', numberOfCouples: 1 }
  ]);

  const handleNameChange = (index: number, value: string) => {
    const newAdminCouples = [...adminCouples];
    newAdminCouples[index].name = value;
    setAdminCouples(newAdminCouples);
  };

  const handleNumberChange = (index: number, value: number) => {
    const newAdminCouples = [...adminCouples];
    newAdminCouples[index].numberOfCouples = value;
    setAdminCouples(newAdminCouples);
  };

  const getTotalRequestedCouples = () => {
    return adminCouples.reduce((sum, admin) => sum + (admin.numberOfCouples || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledAdminCouples = adminCouples.filter(couple => couple.name.trim() !== '');
    
    if (filledAdminCouples.length < 1) {
      alert('Por favor, adicione pelo menos 1 casal administrador.');
      return;
    }

    const totalRequestedCouples = getTotalRequestedCouples();
    
    if (totalRequestedCouples < totalEngagedCouples) {
      alert(`Erro: Os casais administradores solicitaram ${totalRequestedCouples} casais, mas há ${totalEngagedCouples} casais de noivos para serem distribuídos. Todos os casais de noivos precisam ser sorteados.`);
      return;
    }

    if (totalRequestedCouples > totalEngagedCouples) {
      alert(`Erro: Os casais administradores solicitaram ${totalRequestedCouples} casais, mas só há ${totalEngagedCouples} casais de noivos disponíveis.`);
      return;
    }

    onSubmit(filledAdminCouples);
  };

  const handleAddCouple = () => {
    if (adminCouples.length < 10) {
      setAdminCouples([...adminCouples, { name: '', numberOfCouples: 1 }]);
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

      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom
        sx={{ 
          mb: 2,
          fontSize: { xs: '1rem', sm: '1.25rem' } 
        }}
      >
        Casais da Equipe
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 3,
          fontSize: { xs: '0.75rem', sm: '0.875rem' } 
        }}
      >
        Total de casais de noivos para distribuir: {totalEngagedCouples}
      </Typography>

      <Box 
        sx={{ 
          maxHeight: { xs: '50vh', sm: '60vh' }, 
          overflow: 'auto',
          pr: { xs: 1, sm: 2 },
          mb: 2
        }}
      >
        {adminCouples.map((couple, index) => (
          <Paper 
            key={index} 
            variant="outlined"
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              mb: 2,
              borderRadius: '8px'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nome do casal administrador"
                  value={couple.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InputLabel 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: 'max-content'
                    }}
                  >
                    Número de casais:
                  </InputLabel>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 1, max: totalEngagedCouples }}
                    value={couple.numberOfCouples}
                    onChange={(e) => handleNumberChange(index, parseInt(e.target.value) || 0)}
                    disabled={loading}
                    sx={{ 
                      width: '80px',
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={handleAddCouple}
          disabled={loading || adminCouples.length >= 10}
          sx={{ 
            borderRadius: '8px',
            py: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Adicionar Casal da Equipe
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onBack}
            disabled={loading}
            sx={{ 
              flex: 1,
              borderRadius: '8px',
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Voltar
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              flex: 1,
              borderRadius: '8px',
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Realizar Sorteio'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
