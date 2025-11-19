import { supabase } from '../client'
import { UserTarget, University } from '@/lib/types'

export interface UserTargetWithUniversity extends UserTarget {
  university: University
}

export class UserTargetsRepository {
  async getByUserId(userId: string): Promise<UserTargetWithUniversity[]> {
    const { data, error } = await supabase
      .from('user_targets')
      .select(`
        *,
        universities (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToUserTargetWithUniversity)
  }

  async create(userId: string, universityId: string, reason?: string): Promise<UserTarget> {
    const { data, error } = await supabase
      .from('user_targets')
      .insert({
        user_id: userId,
        university_id: universityId,
        reason_for_interest: reason || null,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToUserTarget(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_targets')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async deleteByUserAndUniversity(userId: string, universityId: string): Promise<void> {
    const { error } = await supabase
      .from('user_targets')
      .delete()
      .eq('user_id', userId)
      .eq('university_id', universityId)

    if (error) throw error
  }

  private mapToUserTarget(row: any): UserTarget {
    return {
      id: row.id,
      user_id: row.user_id,
      university_id: row.university_id,
      reason_for_interest: row.reason_for_interest || undefined,
    }
  }

  private mapToUserTargetWithUniversity(row: any): UserTargetWithUniversity {
    const university: University = {
      id: row.universities.id,
      name: row.universities.name,
      country: row.universities.country,
      image_url: row.universities.image_url || undefined,
      avg_gpa: row.universities.avg_gpa ? Number(row.universities.avg_gpa) : 0,
      avg_sat: row.universities.avg_sat ? Number(row.universities.avg_sat) : 0,
      avg_act: row.universities.avg_act ? Number(row.universities.avg_act) : 0,
      acceptance_rate: row.universities.acceptance_rate ? Number(row.universities.acceptance_rate) : 0,
      tuition: row.universities.tuition ? Number(row.universities.tuition) : 0,
    }

    return {
      id: row.id,
      user_id: row.user_id,
      university_id: row.university_id,
      university,
      reason_for_interest: row.reason_for_interest || undefined,
    }
  }
}

