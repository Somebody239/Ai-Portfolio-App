import { supabase } from '../client'
import { AIRecommendation } from '@/lib/types'

export class RecommendationsRepository {
  async getByUserId(userId: string): Promise<AIRecommendation[]> {
    const { data, error } = await supabase
      .from('recommendations_ai')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToRecommendation)
  }

  async create(recommendation: Omit<AIRecommendation, 'id'>): Promise<AIRecommendation> {
    const { data, error } = await supabase
      .from('recommendations_ai')
      .insert({
        user_id: recommendation.user_id,
        source: recommendation.source,
        recommendation: recommendation.recommendation,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToRecommendation(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations_ai')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private mapToRecommendation(row: any): AIRecommendation {
    return {
      id: row.id,
      user_id: row.user_id,
      source: row.source,
      recommendation: row.recommendation,
      created_at: row.created_at || null,
    }
  }
}

