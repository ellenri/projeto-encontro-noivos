import { useEffect, useState } from 'react'
import { supabaseApi, MentorshipMatch } from '../lib/supabase'

type MatchWithDetails = MentorshipMatch & {
  engaged_couples: {
    couple_name: string
  }
  mentor_couples: {
    mentor_couples_name: string
  }
}

export function SorteioResultado() {
  const [matches, setMatches] = useState<MatchWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [])

  async function loadMatches() {
    try {
      setLoading(true)
      const data = await supabaseApi.getMentorshipMatches()
      setMatches(data)
    } catch (err) {
      setError('Erro ao carregar os resultados do sorteio')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando resultados...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Resultado do Sorteio
      </h1>

      {matches.length === 0 ? (
        <div className="text-center text-gray-600">
          Nenhum resultado de sorteio encontrado.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Casal de Noivos:</h3>
                  <p className="text-gray-700">
                    {match.engaged_couples.couple_name}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1">Casal Mentor:</h3>
                  <p className="text-gray-700">
                    {match.mentor_couples.mentor_couples_name}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1">Data do Sorteio:</h3>
                  <p className="text-gray-700">
                    {new Date(match.match_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="pt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      match.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {match.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
