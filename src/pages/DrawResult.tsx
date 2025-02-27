import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import { supabaseApi } from '../lib/supabase';

interface DrawResultItem {
  mentorName: string;
  menteeQuantity: number;
  assignedCouples: string[];
}

export function DrawResult() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DrawResultItem[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await supabaseApi.getLatestDrawResult();
        setResults(data);
      } catch (err) {
        setError('Erro ao carregar os resultados do sorteio.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography color="error" align="center" variant="h6" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (results.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography align="center" variant="h6" sx={{ mt: 4 }}>
          Nenhum resultado de sorteio encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mb: { xs: 3, md: 4 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        Resultado do Sorteio
      </Typography>

      <Box sx={{ px: { xs: 1, md: 0 } }}>
        {results.map((result, index) => (
          <Paper 
            key={index} 
            elevation={3} 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              p: { xs: 2, md: 3 },
              borderRadius: '8px'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <PeopleAlt sx={{ mr: 2, color: 'primary.main' }} />
              <Typography 
                variant="h6" 
                component="h2"
                sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' } }}
              >
                {result.mentorName}
              </Typography>
            </Box>

            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Quantidade de casais: {result.menteeQuantity}
            </Typography>

            <Typography 
              variant="subtitle1" 
              sx={{ 
                mt: { xs: 1.5, md: 2 }, 
                mb: { xs: 0.5, md: 1 },
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              Casais de noivos acompanhados:
            </Typography>

            <List dense sx={{ pl: { xs: 1, md: 2 } }}>
              {result.assignedCouples.map((couple, idx) => (
                <ListItem key={idx} sx={{ py: { xs: 0.5, md: 1 } }}>
                  <ListItemText 
                    primary={couple} 
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: '0.875rem', md: '1rem' } }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
