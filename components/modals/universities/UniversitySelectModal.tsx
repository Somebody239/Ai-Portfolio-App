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
import { Textarea } from "@/components/ui/Textarea";
import { UniversitySearchForm } from "./UniversitySearchForm";
import { UniversityTargetsManager } from "@/managers/UniversityTargetsManager";
import { University, UserTarget } from "@/lib/types";

interface UniversitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (target: UserTarget) => void;
  userId: string;
  excludeUniversityIds?: string[];
}

export function UniversitySelectModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  excludeUniversityIds = [],
}: UniversitySelectModalProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [reasonForInterest, setReasonForInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manager = new UniversityTargetsManager();

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedUniversity) {
      setError("Please select a university");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await manager.create(userId, {
        university_id: selectedUniversity.id,
        reason_for_interest: reasonForInterest || undefined,
      });

      onSuccess(result);
      onClose();
      setSelectedUniversity(null);
      setReasonForInterest("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUniversity(null);
    setReasonForInterest("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Target University</DialogTitle>
          <DialogDescription>
            Select a university to add to your target list.
          </DialogDescription>
        </DialogHeader>

        {!selectedUniversity ? (
          <UniversitySearchForm
            onSelect={handleUniversitySelect}
            excludeIds={excludeUniversityIds}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <h4 className="text-base font-medium text-white">{selectedUniversity.name}</h4>
              <p className="text-sm text-zinc-400 mt-1">{selectedUniversity.country}</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-zinc-500">Avg GPA</p>
                  <p className="text-sm font-medium text-white">{selectedUniversity.avg_gpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Acceptance Rate</p>
                  <p className="text-sm font-medium text-white">{selectedUniversity.acceptance_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <Textarea
              label="Why are you interested in this university? (Optional)"
              placeholder="Describe what draws you to this school..."
              value={reasonForInterest}
              onChange={(e) => setReasonForInterest(e.target.value)}
              rows={4}
            />

            <button
              type="button"
              onClick={() => setSelectedUniversity(null)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Choose a different university
            </button>
          </div>
        )}

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {selectedUniversity && (
            <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
              Add University
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
