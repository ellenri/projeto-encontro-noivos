import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos baseados nas suas tabelas
export type EngagedCouple = {
  id: string
  couple_name: string
  created_at: string
}

export type MentorCouple = {
  id: string
  mentor_couples_name: string
  mentee_quantity: number
  active: boolean
  created_at: string
}

export type MentorshipMatch = {
  id: string
  engaged_couple_id: string
  mentor_couple_id: string
  match_date: string
  active: boolean
  created_at: string
}

interface MatchWithEngagedCouple {
  engaged_couple_id: string;
  engaged_couples: {
    couple_name: string;
  };
}

// Funções para interagir com o Supabase
export const supabaseApi = {
  // Casais de Noivos
  async createEngagedCouple(couple: Omit<EngagedCouple, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('engaged_couples')
      .insert(couple)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findEngagedCoupleByName(coupleName: string) {
    const { data, error } = await supabase
      .from('engaged_couples')
      .select('*')
      .eq('couple_name', coupleName)
      .single()
    
    if (error) throw error
    return data
  },

  async getEngagedCouples() {
    const { data, error } = await supabase
      .from('engaged_couples')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Casais Mentores
  async clearAllMentorCouples() {
    // Apenas desativa todos os casais mentores existentes
    const { error } = await supabase
      .from('mentor_couples')
      .update({ active: false })
      .eq('active', true); // Atualiza apenas os que estão ativos
    
    if (error) {
      console.error('Erro ao desativar casais mentores:', error);
      throw error;
    }
  },

  async createMentorCouple(couple: Omit<MentorCouple, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('mentor_couples')
      .insert(couple)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar casal mentor:', couple, error);
      throw error;
    }
    return data;
  },

  async getMentorCouples() {
    const { data, error } = await supabase
      .from('mentor_couples')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Sorteios
  async clearAllMatches() {
    // Apenas desativa todos os matches existentes
    const { error } = await supabase
      .from('mentorship_matches')
      .update({ active: false })
      .eq('active', true); // Atualiza apenas os que estão ativos
    
    if (error) {
      console.error('Erro ao desativar matches:', error);
      throw error;
    }
  },

  async createMentorshipMatch(match: Omit<MentorshipMatch, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('mentorship_matches')
      .insert(match)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getMentorshipMatches() {
    const { data, error } = await supabase
      .from('mentorship_matches')
      .select(`
        *,
        engaged_couples (*),
        mentor_couples (*)
      `)
    
    if (error) throw error
    return data
  },

  // Nova função para realizar o sorteio
  async realizarSorteio(engagedCoupleId: string) {
    // 1. Buscar um casal mentor disponível (active = true)
    const { data: mentorCouples, error: mentorError } = await supabase
      .from('mentor_couples')
      .select('*')
      .eq('active', true)
      .limit(1)
      .single()

    if (mentorError) throw mentorError
    if (!mentorCouples) throw new Error('Nenhum casal mentor disponível')

    // 2. Criar o match
    const match = {
      engaged_couple_id: engagedCoupleId,
      mentor_couple_id: mentorCouples.id,
      active: true
    }

    const { data, error } = await supabase
      .from('mentorship_matches')
      .insert(match)
      .select(`
        *,
        engaged_couples (*),
        mentor_couples (*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Buscar resultado do último sorteio
  async getLatestDrawResult() {
    // Buscar casais mentores ativos
    const { data: mentorCouples, error: mentorError } = await supabase
      .from('mentor_couples')
      .select('id, mentor_couples_name, mentee_quantity')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (mentorError) {
      console.error('Erro ao buscar casais mentores:', mentorError);
      throw mentorError;
    }

    // Para cada casal mentor, buscar seus casais de noivos
    const result = await Promise.all(
      mentorCouples.map(async (mentor) => {
        const { data: matches, error: matchError } = await supabase
          .from('mentorship_matches')
          .select(`
            engaged_couple_id,
            engaged_couples (
              couple_name
            )
          `)
          .eq('mentor_couple_id', mentor.id)
          .eq('active', true);

        if (matchError) {
          console.error('Erro ao buscar matches:', matchError);
          throw matchError;
        }

        // Garantir que matches é um array e cada item tem a estrutura esperada
        const typedMatches = matches as unknown as MatchWithEngagedCouple[];
        
        return {
          mentorName: mentor.mentor_couples_name,
          menteeQuantity: mentor.mentee_quantity,
          assignedCouples: typedMatches.map(match => match.engaged_couples.couple_name)
        };
      })
    );

    return result;
  },
}
