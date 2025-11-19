"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { AchievementsManager, AchievementFormData } from "@/managers/AchievementsManager";

interface AchievementFormProps {
  initialData?: Partial<AchievementFormData>;
  onSubmit: (data: AchievementFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  formId?: string;
}

export function AchievementForm({ initialData, onSubmit, isSubmitting, formId = "achievement-form" }: AchievementFormProps) {
  const manager = new AchievementsManager();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Academic",
    awarded_by: initialData?.awarded_by || "",
    date_awarded: initialData?.date_awarded || "",
  });

  const handleChange = (field: keyof AchievementFormData, value: string) => {
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
        label="Achievement Title"
        placeholder="e.g., National Merit Scholar"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        required
        disabled={isSubmitting}
      />

      <Textarea
        label="Description"
        placeholder="Describe what you achieved..."
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        rows={3}
        disabled={isSubmitting}
      />

      <Select
        label="Category"
        options={manager.getCategoryOptions()}
        value={formData.category}
        onChange={(e) => handleChange("category", e.target.value)}
        error={errors.category}
        disabled={isSubmitting}
      />

      <Input
        label="Awarded By"
        placeholder="e.g., College Board"
        value={formData.awarded_by}
        onChange={(e) => handleChange("awarded_by", e.target.value)}
        error={errors.awarded_by}
        disabled={isSubmitting}
      />

      <Input
        label="Date Awarded"
        type="date"
        value={formData.date_awarded}
        onChange={(e) => handleChange("date_awarded", e.target.value)}
        error={errors.date_awarded}
        disabled={isSubmitting}
      />

      {errors.general && (
        <p className="text-sm text-rose-400">{errors.general}</p>
      )}
    </form>
  );
}
