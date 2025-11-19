"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { CourseForm } from "./CourseForm";
import { CoursesManager, CourseFormData } from "@/managers/CoursesManager";
import { Course } from "@/lib/types";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
  userId: string;
  initialData?: Course;
  mode?: "create" | "edit";
}

export function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  initialData,
  mode = "create",
}: CourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = new CoursesManager();
  const formId = "course-form";

  const handleSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result: Course;

      if (mode === "edit" && initialData) {
        result = await manager.update(initialData.id, data);
      } else {
        result = await manager.create(userId, data);
      }

      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your course details."
              : "Add a new course to calculate your GPA."}
          </DialogDescription>
        </DialogHeader>

        <CourseForm
          formId={formId}
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isSubmitting}
          >
            {mode === "edit" ? "Save Changes" : "Add Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
