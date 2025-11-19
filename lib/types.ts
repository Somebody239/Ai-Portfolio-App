export type UUID = string;

export enum TestType {
  SAT = "SAT",
  ACT = "ACT",
  AP = "AP",
  IB = "IB",
  TOEFL = "TOEFL",
  IELTS = "IELTS",
  OTHER = "Other",
}

export enum CourseTerm {
  Fall = "Fall",
  Spring = "Spring",
  Summer = "Summer",
  Winter = "Winter",
}

// --- Database Models ---

export interface User {
  id: UUID;
  name: string | null;
  email: string | null;
  intended_major: string | null;
  current_gpa: number | null;
  created_at?: string | null;
}

export interface Course {
  id: UUID;
  user_id: UUID;
  name: string;
  grade: number; // 0-100
  year: number;
  semester: CourseTerm;
  created_at?: string | null;
}

export interface StandardizedScore {
  id: UUID;
  user_id: UUID;
  test_type: TestType;
  score: number;
  section_scores?: Record<string, number>;
  date_taken?: string | null;
  created_at?: string | null;
}

export interface University {
  id: UUID;
  name: string;
  country: string;
  image_url?: string | null;
  avg_gpa: number; // 4.0 scale
  avg_sat: number;
  avg_act: number;
  acceptance_rate: number; // 0-100
  tuition: number;
  majors_offered?: string[] | null;
  extracurricular_expectations?: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface UserTarget {
  id: UUID;
  user_id: UUID;
  university_id: UUID;
  university?: University; // Joined data
  reason_for_interest?: string | null;
  created_at?: string | null;
}

export interface AIRecommendation {
  id: UUID;
  user_id: UUID;
  source: string; // e.g., "GPA Analyzer"
  recommendation: string;
  created_at?: string | null;
}

export interface Extracurricular {
  id: UUID;
  user_id: UUID;
  title: string;
  description?: string | null;
  level: string; // Local/State/National/International/School/Community
  hours_per_week: number;
  years_participated: number;
  created_at?: string | null;
}

export interface Achievement {
  id: UUID;
  user_id: UUID;
  title: string;
  description?: string | null;
  category?: string | null;
  awarded_by?: string | null;
  date_awarded?: string | null;
  created_at?: string | null;
}

export interface PersonalityInput {
  id: UUID;
  user_id: UUID;
  question: string;
  answer: string;
  created_at?: string | null;
}

export interface Opportunity {
  id: UUID;
  title: string;
  description?: string | null;
  eligibility?: Record<string, unknown> | null;
  image_url?: string | null;
  link?: string | null;
  created_at?: string | null;
}

