import { supabase } from '../client'
import { University } from '@/lib/types'

export class UniversitiesRepository {
  async getAll(): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  async getById(id: string): Promise<University | null> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return this.mapToUniversity(data)
  }

  async search(query: string): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  async getByCountry(country: string): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('country', country)
      .order('name', { ascending: true })

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  async create(university: Omit<University, 'id'>): Promise<University> {
    const { data, error } = await supabase
      .from('universities')
      .insert({
        name: university.name,
        country: university.country,
        image_url: university.image_url || null,
        avg_gpa: university.avg_gpa || 0,
        avg_sat: university.avg_sat || 0,
        avg_act: university.avg_act || 0,
        acceptance_rate: university.acceptance_rate || 0,
        tuition: university.tuition || 0,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToUniversity(data)
  }

  private mapToUniversity(row: any): University {
    return {
      id: row.id,
      name: row.name,
      country: row.country,
      image_url: row.image_url || undefined,
      avg_gpa: row.avg_gpa ? Number(row.avg_gpa) : 0,
      avg_sat: row.avg_sat ? Number(row.avg_sat) : 0,
      avg_act: row.avg_act ? Number(row.avg_act) : 0,
      acceptance_rate: row.acceptance_rate ? Number(row.acceptance_rate) : 0,
      tuition: row.tuition ? Number(row.tuition) : 0,
    }
  }
}

