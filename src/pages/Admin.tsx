import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { AdminCoupleForm } from '../components/AdminCoupleForm';
import { DrawResults } from '../components/DrawResults';
import { supabaseApi } from '../lib/supabase';
import capaMentores from '../assets/CapaMentores.jpg';
import { performDraw } from '../utils/draw';

interface AdminCouple {
  name: string;
  numberOfCouples: number;
  assignedCouples?: string[];
}

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminCouples, setAdminCouples] = useState<AdminCouple[]>([]);
  const [couples, setCouples] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'results'>('form');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCouples = async () => {
      try {
        const data = await supabaseApi.getEngagedCouples();
        setCouples(data.map(c => c.couple_name));
      } catch (err) {
        console.error('Erro ao buscar casais:', err);
        setError('Erro ao carregar casais de noivos.');
      }
    };

    fetchCouples();
  }, []);

  const handleAdminSubmit = async (submittedAdminCouples: AdminCouple[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const drawnResults = performDraw(couples, submittedAdminCouples);
      
      try {
        await supabaseApi.clearAllMatches();
        console.log('Matches antigos desativados com sucesso');
        
        await supabaseApi.clearAllMentorCouples();
        console.log('Casais mentores antigos desativados com sucesso');
      } catch (err) {
        console.error('Erro ao desativar dados antigos:', err);
        throw new Error('Erro ao desativar dados antigos. Por favor, tente novamente.');
      }

      const createdMentors = [];
      
      for (const admin of drawnResults) {
        try {
          console.log('Tentando criar casal mentor:', admin.name);
          
          const mentorCouple = await supabaseApi.createMentorCouple({
            mentor_couples_name: admin.name,
            mentee_quantity: admin.numberOfCouples,
            active: true
          });
          
          console.log('Casal mentor criado com sucesso:', mentorCouple);
          createdMentors.push(mentorCouple);

          if (admin.assignedCouples) {
            for (const coupleName of admin.assignedCouples) {
              const engagedCouple = await supabaseApi.findEngagedCoupleByName(coupleName);
              if (engagedCouple) {
                await supabaseApi.createMentorshipMatch({
                  engaged_couple_id: engagedCouple.id,
                  mentor_couple_id: mentorCouple.id,
                  match_date: new Date().toISOString(),
                  active: true
                });
                console.log('Match criado com sucesso para:', coupleName);
              } else {
                console.warn('Casal de noivos não encontrado:', coupleName);
              }
            }
          }
        } catch (err) {
          console.error('Erro ao processar casal mentor:', admin.name, err);
          throw new Error(`Erro ao processar casal mentor ${admin.name}. Por favor, tente novamente.`);
        }
      }
      
      setAdminCouples(drawnResults);
      setStep('results');
      navigate('/resultado');
    } catch (err) {
      console.error('Erro ao processar o sorteio:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar o sorteio. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawAgain = () => {
    setStep('form');
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
          <Box maxWidth="xl">
            {step === 'form' ? (
              <AdminCoupleForm 
                onSubmit={handleAdminSubmit}
                onBack={() => navigate('/')}
                totalEngagedCouples={couples.length}
                loading={loading}
                error={error}
              />
            ) : (
              <DrawResults
                adminCouples={adminCouples}
                onDrawAgain={handleDrawAgain}
              />
            )}
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
            src={capaMentores} 
            alt="Casais mentores" 
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
