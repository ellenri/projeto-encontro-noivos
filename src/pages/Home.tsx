import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import { CoupleForm } from '../components/CoupleForm';
import { supabaseApi } from '../lib/supabase';
import capaNoivos from '../assets/capaNoivos.jpg';

export function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCouplesSubmit = async (couples: string[]) => {
    setLoading(true);
    setError(null);
    try {
      for (const coupleName of couples) {
        await supabaseApi.createEngagedCouple({ couple_name: coupleName });
      }
      navigate('/admin');
    } catch (err) {
      console.error('Erro ao salvar casais:', err);
      setError('Erro ao salvar os casais. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          minHeight: '80vh',
          py: { xs: 2, md: 4 }
        }}
      >
        {/* Content Column */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            order: { xs: 2, md: 1 }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
            }}
          >
            Itinerário de formação para o Sacramento do matrimônio
          </Typography>
          
          <Box sx={{ mt: { xs: 2, md: 4 } }}>
            <Typography 
              variant="h5" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Quais os nomes dos noivos para sorteio?
            </Typography>
            <CoupleForm 
              onSubmit={handleCouplesSubmit} 
              loading={loading}
              error={error}
            />
          </Box>
        </Box>
        
        {/* Image Column */}
        <Box
          sx={{
            flex: 1,
            order: { xs: 1, md: 2 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: '200px', sm: '250px', md: 'auto' },
            maxHeight: { xs: '250px', sm: '300px', md: '500px' },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            mx: { xs: 'auto', md: 0 },
            width: { xs: '100%', md: 'auto' },
            maxWidth: '100%'
          }}
        >
          <img 
            src={capaNoivos} 
            alt="Casal de noivos" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
