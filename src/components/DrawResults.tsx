import { useEffect, useState } from 'react';
import { supabaseApi } from '../lib/supabase';

interface AdminCouple {
  name: string;
  numberOfCouples: number;
  assignedCouples?: string[];
}

interface DrawResultsProps {
  adminCouples: AdminCouple[];
  onDrawAgain: () => void;
}

interface MatchResult {
  id: string;
  engaged_couples: {
    couple_name: string;
  };
  mentor_couples: {
    mentor_couples_name: string;
  };
}

export function DrawResults({ onDrawAgain }: DrawResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    saveAndLoadResults();
  }, []);

  const saveAndLoadResults = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar os matches existentes
      const allMatches = await supabaseApi.getMentorshipMatches();
      setMatches(allMatches);
    } catch (err) {
      console.error('Erro ao carregar resultados:', err);
      setError('Erro ao carregar os resultados do sorteio. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-[#1a1d24] text-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processando resultados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-[#1a1d24] text-white rounded-lg shadow-xl p-6">
        <div className="text-red-400 text-center">
          <p>{error}</p>
          <button
            onClick={saveAndLoadResults}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Agrupar matches por mentor
  const matchesByMentor: Record<string, MatchResult[]> = {};
  matches.forEach(match => {
    const mentorName = match.mentor_couples.mentor_couples_name;
    if (!matchesByMentor[mentorName]) {
      matchesByMentor[mentorName] = [];
    }
    matchesByMentor[mentorName].push(match);
  });

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-[#1a1d24] text-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">       
        <h2 className="text-2xl font-semibold">Resultado do sorteio</h2>
      </div>

      <div className="flex flex-col gap-2 mb-6 text-gray-300">
        <div>
          Total de casais mentores: {Object.keys(matchesByMentor).length}
        </div>
        <div>
          Total de casais de noivos: {matches.length}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(matchesByMentor).map(([mentorName, mentorMatches], index) => (
          <div key={index} className="bg-[#262a33] rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-400">{mentorName}</h3>
              <p className="text-gray-400">Casais designados: {mentorMatches.length}</p>
            </div>
            <div className="space-y-2">
              {mentorMatches.map((match, idx) => (
                <div key={match.id} className="text-white">
                  {idx + 1}º casal - {match.engaged_couples.couple_name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={onDrawAgain}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Realizar novo sorteio
        </button>
      </div>
    </div>
  );
};
