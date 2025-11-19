/**
 * DashboardStats - Stat widgets section
 * Single responsibility: Display key statistics
 */
"use client";

import React, { memo } from "react";
import { StatWidget } from "./Widgets";
import { GraduationCap, BookOpen, Target, Zap } from "lucide-react";

interface DashboardStatsProps {
  gpa: number;
  satScore: number | null;
  targetCount: number;
  reachCount: number;
  hasRecommendations: boolean;
  gpaSource: "profile" | "calculated" | "not-set";
  coursesCount: number;
}

export const DashboardStats = memo<DashboardStatsProps>(
  ({ gpa, satScore, targetCount, reachCount, hasRecommendations, gpaSource, coursesCount }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatWidget
          label="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "N/A"}
          icon={<GraduationCap size={20} />}
          subtext={
            gpaSource === "profile"
              ? "From Profile"
              : coursesCount > 0
              ? "Calculated"
              : "Not Set"
          }
        />
        <StatWidget
          label="SAT Score"
          value={satScore || "N/A"}
          icon={<BookOpen size={20} />}
          subtext={satScore ? "Best Score" : "No score"}
        />
        <StatWidget
          label="Target Unis"
          value={targetCount}
          icon={<Target size={20} />}
          subtext={`${reachCount} Reach`}
        />
        <StatWidget
          label="App Strength"
          value={hasRecommendations ? "Active" : "Pending"}
          icon={<Zap size={20} />}
          subtext="AI Rating"
        />
      </div>
    );
  }
);

DashboardStats.displayName = "DashboardStats";

