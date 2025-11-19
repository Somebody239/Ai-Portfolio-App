# Database Schema Overview

## Core Tables

### users
- `id` (uuid, PK, auth.uid())
- `name` (text, nullable)
- `email` (text, unique, nullable)
- `intended_major` (text, nullable)
- `current_gpa` (numeric, 0-4.0, nullable)
- `created_at` (timestamp, default now())

### courses
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `name` (text)
- `grade` (numeric, 0-100)
- `year` (int)
- `semester` (text: Fall/Spring/Summer/Winter)
- `created_at` (timestamp)

**Indexes:** user_id, (year, semester)

### standardized_scores
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `test_type` (text: SAT/ACT/AP/IB/TOEFL/IELTS/Other)
- `score` (numeric)
- `section_scores` (jsonb, nullable)
- `date_taken` (date, nullable)
- `created_at` (timestamp)

**Indexes:** user_id, test_type

### extracurriculars
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `title` (text)
- `description` (text, nullable)
- `level` (text: Local/State/National/International/School/Community)
- `hours_per_week` (numeric, >= 0)
- `years_participated` (numeric, >= 0)
- `created_at` (timestamp)

**Indexes:** user_id

### achievements
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `title` (text)
- `description` (text, nullable)
- `category` (text, nullable)
- `awarded_by` (text, nullable)
- `date_awarded` (date, nullable)
- `created_at` (timestamp)

**Indexes:** user_id

### personality_inputs
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `question` (text)
- `answer` (text)
- `created_at` (timestamp)

**Indexes:** user_id

### universities
- `id` (uuid, PK)
- `name` (text, unique)
- `country` (text)
- `image_url` (text, nullable)
- `avg_gpa` (numeric, 0-4.5)
- `avg_sat` (numeric, 400-1600)
- `avg_act` (numeric, 1-36)
- `acceptance_rate` (numeric, 0-100)
- `majors_offered` (text[])
- `extracurricular_expectations` (jsonb, nullable)
- `tuition` (numeric, >= 0)
- `created_at` (timestamp)

**Indexes:** name, country

### user_targets
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `university_id` (uuid, FK → universities)
- `reason_for_interest` (text, nullable)
- `created_at` (timestamp)

**Unique Constraint:** (user_id, university_id)
**Indexes:** user_id, university_id

### opportunities
- `id` (uuid, PK)
- `title` (text)
- `description` (text, nullable)
- `eligibility` (jsonb, nullable)
- `image_url` (text, nullable)
- `link` (text, nullable)
- `created_at` (timestamp)

### recommendations_ai
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `source` (text)
- `recommendation` (text)
- `created_at` (timestamp)

**Indexes:** user_id

## Security

All tables have Row Level Security (RLS) enabled.

**User-owned tables (users, courses, standardized_scores, extracurriculars, achievements, personality_inputs, user_targets, recommendations_ai):**
- Users can only SELECT/INSERT/UPDATE/DELETE their own data (via auth.uid() = user_id)

**Public read tables:**
- `universities`: Anyone can SELECT
- `opportunities`: Anyone can SELECT

## Relationships

- All user data tables reference `users.id` with CASCADE delete
- `user_targets` links users to universities (many-to-many)

## Computed Fields (Backend Logic)

- **GPA**: Calculated from `courses.grade` (backend computation required)

