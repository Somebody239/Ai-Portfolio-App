import { Course, University, UserTarget, StandardizedScore, TestType } from "@/lib/types";

export class StatsService {

  // Singleton instance (optional, but good for managers)
  private static instance: StatsService;


  public static getInstance(): StatsService {

    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }

    return StatsService.instance;
  }


  /**
   * Calculates unweighted GPA on a 4.0 scale from 0-100 grades.
   */
  public calculateGPA(courses: Course[]): number {

    if (courses.length === 0) return 0.0;

    let totalPoints = 0;

    courses.forEach((course) => {

      let gpaPoints = 0;

      if (course.grade >= 93) gpaPoints = 4.0;
      else if (course.grade >= 90) gpaPoints = 3.7;
      else if (course.grade >= 87) gpaPoints = 3.3;
      else if (course.grade >= 83) gpaPoints = 3.0;
      else if (course.grade >= 80) gpaPoints = 2.7;
      else if (course.grade >= 70) gpaPoints = 2.0;
      else if (course.grade >= 60) gpaPoints = 1.0;

      totalPoints += gpaPoints;
    });

    return parseFloat((totalPoints / courses.length).toFixed(2));
  }


  /**
   * Determines if a university is a Safety, Target, or Reach.
   */
  public calculateAdmissionsRisk(

    userGpa: number,

    userSat: number | null,

    uni: University

  ): "Safety" | "Target" | "Reach" | "High Reach" {

    let score = 0;

    // GPA Check
    if (userGpa >= uni.avg_gpa + 0.2) score += 2;
    else if (userGpa >= uni.avg_gpa - 0.1) score += 1;
    else score -= 2;

    // SAT Check (if available)
    if (userSat) {
      if (userSat >= uni.avg_sat + 50) score += 2;
      else if (userSat >= uni.avg_sat - 30) score += 1;
      else score -= 2;
    }

    // Acceptance Rate Weighting
    if (uni.acceptance_rate < 15) score -= 2; // Ivy logic

    if (score >= 3) return "Safety";
    if (score >= 0) return "Target";
    if (score >= -2) return "Reach";
    return "High Reach";
  }


  public getBestScore(scores: StandardizedScore[], type: TestType): number | null {

    const specificScores = scores.filter((s) => s.test_type === type);

    if (specificScores.length === 0) return null;

    return Math.max(...specificScores.map((s) => s.score));
  }
}


