export type UUID = string;


export enum TestType {

  SAT = "SAT",

  ACT = "ACT",

  AP = "AP",

  IB = "IB",
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

}


export interface Course {

  id: UUID;

  user_id: UUID;

  name: string;

  grade: number; // 0-100

  year: number;

  semester: CourseTerm;

}


export interface StandardizedScore {

  id: UUID;

  user_id: UUID;

  test_type: TestType;

  score: number;

  section_scores?: Record<string, number>;

  date_taken?: string;

}


export interface University {

  id: UUID;

  name: string;

  country: string;

  image_url?: string;

  avg_gpa: number; // 4.0 scale

  avg_sat: number;

  avg_act: number;

  acceptance_rate: number; // 0-100

  tuition: number;

}


export interface UserTarget {

  id: UUID;

  user_id: UUID;

  university_id: UUID;

  university?: University; // Joined data

  reason_for_interest?: string;

}


export interface AIRecommendation {

  id: UUID;

  source: string; // e.g., "GPA Analyzer"

  recommendation: string;

}


export interface Extracurricular {

  id: UUID;

  user_id: UUID;

  title: string;

  description?: string | null;

  level: string; // Local/State/National/International/School/Community

  hours_per_week: number;

  years_participated: number;

}


export interface Achievement {

  id: UUID;

  user_id: UUID;

  title: string;

  description?: string | null;

  category?: string | null;

  awarded_by?: string | null;

  date_awarded?: string | null;

}


