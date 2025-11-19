/**
 * CoursesManager - Business logic for courses
 * Single responsibility: Manage CRUD operations and validation for courses
 */

import { CoursesRepository } from "@/lib/supabase/repositories/courses.repository";
import { Course, CourseTerm } from "@/lib/types";

export interface CourseFormData {
  name: string;
  grade: number;
  year: number;
  semester: CourseTerm;
}

export class CoursesManager {
  private repository: CoursesRepository;

  constructor() {
    this.repository = new CoursesRepository();
  }

  async create(userId: string, data: CourseFormData): Promise<Course> {
    this.validateFormData(data);

    return await this.repository.create({
      user_id: userId,
      name: data.name,
      grade: data.grade,
      year: data.year,
      semester: data.semester,
    });
  }

  async update(id: string, data: Partial<CourseFormData>): Promise<Course> {
    if (data.name || data.grade !== undefined) {
      this.validateFormData(data as CourseFormData);
    }

    return await this.repository.update(id, {
      name: data.name,
      grade: data.grade,
      year: data.year,
      semester: data.semester,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<Course[]> {
    return await this.repository.getByUserId(userId);
  }

  private validateFormData(data: Partial<CourseFormData>): void {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error("Course name is required");
    }

    if (data.grade !== undefined && (data.grade < 0 || data.grade > 100)) {
      throw new Error("Grade must be between 0 and 100");
    }

    if (data.year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (data.year < 1900 || data.year > currentYear + 10) {
        throw new Error("Invalid year");
      }
    }
  }

  getSemesterOptions(): Array<{ value: string; label: string }> {
    return [
      { value: CourseTerm.Fall, label: "Fall" },
      { value: CourseTerm.Spring, label: "Spring" },
      { value: CourseTerm.Summer, label: "Summer" },
      { value: CourseTerm.Winter, label: "Winter" },
    ];
  }

  getYearOptions(): Array<{ value: string; label: string }> {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear + 1; i >= currentYear - 10; i--) {
      years.push({ value: i.toString(), label: i.toString() });
    }

    return years;
  }
}
