export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          awarded_by: string | null
          category: string | null
          created_at: string | null
          date_awarded: string | null
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          awarded_by?: string | null
          category?: string | null
          created_at?: string | null
          date_awarded?: string | null
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          awarded_by?: string | null
          category?: string | null
          created_at?: string | null
          date_awarded?: string | null
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
      }
      courses: {
        Row: {
          created_at: string | null
          grade: number
          id: string
          name: string
          semester: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          grade: number
          id?: string
          name: string
          semester: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string | null
          grade?: number
          id?: string
          name?: string
          semester?: string
          user_id?: string
          year?: number
        }
      }
      extracurriculars: {
        Row: {
          created_at: string | null
          description: string | null
          hours_per_week: number | null
          id: string
          level: string | null
          title: string
          user_id: string
          years_participated: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hours_per_week?: number | null
          id?: string
          level?: string | null
          title: string
          user_id: string
          years_participated?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hours_per_week?: number | null
          id?: string
          level?: string | null
          title?: string
          user_id?: string
          years_participated?: number | null
        }
      }
      opportunities: {
        Row: {
          created_at: string | null
          description: string | null
          eligibility: Json | null
          id: string
          image_url: string | null
          link: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          eligibility?: Json | null
          id?: string
          image_url?: string | null
          link?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          eligibility?: Json | null
          id?: string
          image_url?: string | null
          link?: string | null
          title?: string
        }
      }
      personality_inputs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          user_id?: string
        }
      }
      recommendations_ai: {
        Row: {
          created_at: string | null
          id: string
          recommendation: string
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recommendation: string
          source: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recommendation?: string
          source?: string
          user_id?: string
        }
      }
      standardized_scores: {
        Row: {
          created_at: string | null
          date_taken: string | null
          id: string
          score: number
          section_scores: Json | null
          test_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_taken?: string | null
          id?: string
          score: number
          section_scores?: Json | null
          test_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_taken?: string | null
          id?: string
          score?: number
          section_scores?: Json | null
          test_type?: string
          user_id?: string
        }
      }
      universities: {
        Row: {
          acceptance_rate: number | null
          avg_act: number | null
          avg_gpa: number | null
          avg_sat: number | null
          country: string
          created_at: string | null
          extracurricular_expectations: Json | null
          id: string
          image_url: string | null
          majors_offered: string[] | null
          name: string
          tuition: number | null
        }
        Insert: {
          acceptance_rate?: number | null
          avg_act?: number | null
          avg_gpa?: number | null
          avg_sat?: number | null
          country: string
          created_at?: string | null
          extracurricular_expectations?: Json | null
          id?: string
          image_url?: string | null
          majors_offered?: string[] | null
          name: string
          tuition?: number | null
        }
        Update: {
          acceptance_rate?: number | null
          avg_act?: number | null
          avg_gpa?: number | null
          avg_sat?: number | null
          country?: string
          created_at?: string | null
          extracurricular_expectations?: Json | null
          id?: string
          image_url?: string | null
          majors_offered?: string[] | null
          name?: string
          tuition?: number | null
        }
      }
      user_targets: {
        Row: {
          created_at: string | null
          id: string
          reason_for_interest: string | null
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason_for_interest?: string | null
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason_for_interest?: string | null
          university_id?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          intended_major: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          intended_major?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          intended_major?: string | null
          name?: string | null
        }
      }
    }
  }
}

