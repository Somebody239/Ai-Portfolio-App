"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CoursesManager, CourseFormData } from "@/managers/CoursesManager";
import { CourseTerm } from "@/lib/types";

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  formId?: string;
}

export function CourseForm({ initialData, onSubmit, isSubmitting, formId = "course-form" }: CourseFormProps) {
  const manager = new CoursesManager();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<CourseFormData>({
    name: initialData?.name || "",
    grade: initialData?.grade || 0,
    year: initialData?.year || currentYear,
    semester: initialData?.semester || CourseTerm.Fall,
  });

  const handleChange = (field: keyof CourseFormData, value: string | number | CourseTerm) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Course Name"
        placeholder="e.g., AP Calculus BC"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        required
        disabled={isSubmitting}
      />

      <Input
        label="Grade"
        type="number"
        min="0"
        max="100"
        step="0.1"
        placeholder="95"
        value={formData.grade}
        onChange={(e) => handleChange("grade", parseFloat(e.target.value) || 0)}
        error={errors.grade}
        helperText="Enter grade on a 0-100 scale"
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Year"
          options={manager.getYearOptions()}
          value={formData.year.toString()}
          onChange={(e) => handleChange("year", parseInt(e.target.value))}
          error={errors.year}
          required
          disabled={isSubmitting}
        />

        <Select
          label="Semester"
          options={manager.getSemesterOptions()}
          value={formData.semester}
          onChange={(e) => handleChange("semester", e.target.value as CourseTerm)}
          error={errors.semester}
          required
          disabled={isSubmitting}
        />
      </div>

      {errors.general && (
        <p className="text-sm text-rose-400">{errors.general}</p>
      )}
    </form>
  );
}
