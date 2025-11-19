/**
 * DashboardView - Main dashboard container
 * Single responsibility: Orchestrate dashboard using ViewModel pattern
 */
"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UniversityRow, RecommendationCard } from "@/components/dashboard/Widgets";
import { Card, ActionButton } from "@/components/ui/Atoms";
import { Zap, TrendingUp } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUniversities } from "@/hooks/useUniversities";
import { useUser } from "@/hooks/useUser";
import { useDashboardViewModel } from "@/viewmodels/DashboardViewModel";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTestScores } from "@/components/dashboard/DashboardTestScores";
import { UniversitySelectModal } from "@/components/modals/universities/UniversitySelectModal";

export default function DashboardView() {
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const {
    courses,
    scores,
    targets,
    recommendations,
    extracurriculars,
    loading: portfolioLoading,
    refetch: refetchPortfolio,
  } = usePortfolio();
  const { universities, loading: universitiesLoading } = useUniversities();
  const { user, loading: userLoading } = useUser();

  const {
    gpa,
    satScore,
    actScore,
    targetUniversities,
    uniRisks,
    satSections,
    riskCounts,
    activityHours,
    improvementInsight,
  } = useDashboardViewModel({
    courses,
    scores,
    targets,
    universities,
    recommendations,
    extracurriculars,
    user,
  });

  const loading = portfolioLoading || universitiesLoading || userLoading;
  const gpaSource =
    user?.current_gpa !== null && user?.current_gpa !== undefined
      ? "profile"
      : courses.length > 0
      ? "calculated"
      : "not-set";

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-400">Loading your portfolio...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">Overview</h2>
          <p className="text-zinc-400 mt-1">
            Welcome back, {user?.name || "there"}. Here is your application readiness.
            {user?.intended_major && (
              <span className="text-zinc-500"> • {user.intended_major}</span>
            )}
          </p>
        </div>
        <div className="hidden md:block">
          <InteractiveHoverButton text="Update Portfolio" className="w-48" />
        </div>
      </header>

      <DashboardStats
        gpa={gpa}
        satScore={satScore}
        targetCount={targetUniversities.length}
        reachCount={riskCounts.Reach + riskCounts["High Reach"]}
        hasRecommendations={recommendations.length > 0}
        gpaSource={gpaSource}
        coursesCount={courses.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Targets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">University Targets</h3>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">
              View All
            </button>
          </div>

          <Card className="p-0">
            <div className="flex flex-col">
              {uniRisks.length > 0 ? (
                uniRisks.map((uni) => (
                  <UniversityRow key={uni.id} university={uni} risk={uni.risk} />
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500">
                  <p>No target universities yet. Add one to get started!</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              <ActionButton 
                onClick={() => setIsUniversityModalOpen(true)}
                className="w-full justify-center bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Add University
              </ActionButton>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardTestScores
              satScore={satScore}
              actScore={actScore}
              satMath={satSections.math}
              satReadingWriting={satSections.readingWriting}
            />
            <Card className="flex flex-col justify-center items-center text-center p-8">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <TrendingUp className="text-zinc-400" />
              </div>
              <h4 className="text-white font-medium">Extracurriculars</h4>
              <p className="text-sm text-zinc-500 mt-2 mb-4">
                {extracurriculars.length > 0
                  ? `You log ${activityHours.total.toFixed(1)} hrs/wk across ${extracurriculars.length} activities.`
                  : "Add your activities to unlock AI coaching and opportunity matching."}
              </p>
              <button className="text-xs text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">
                View Opportunities
              </button>
            </Card>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">AI Insights</h3>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500 border border-zinc-800 rounded-lg">
                <p className="text-sm">
                  No AI recommendations yet. Add more data to your portfolio to get
                  personalized insights.
                </p>
              </div>
            )}
          </div>

          <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={100} />
            </div>
            <h4 className="text-lg font-bold text-white relative z-10">Boost your GPA</h4>
            <p className="text-sm text-zinc-400 mt-2 relative z-10 mb-6">
              {improvementInsight
                ? `Raise ${improvementInsight.courseName} from ${improvementInsight.from}→${improvementInsight.to} to push your GPA to ${improvementInsight.projectedGpa.toFixed(2)} (${improvementInsight.delta >= 0 ? "+" : ""}${improvementInsight.delta.toFixed(2)}).`
                : "Add your courses to see personalized grade lift simulations."}
            </p>
            <ActionButton className="w-full justify-center relative z-10">
              {improvementInsight ? "See Action Plan" : "Add Courses"}
            </ActionButton>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {user && (
        <UniversitySelectModal
          isOpen={isUniversityModalOpen}
          onClose={() => setIsUniversityModalOpen(false)}
          onSuccess={() => {
            refetchPortfolio();
          }}
          userId={user.id}
          excludeUniversityIds={targets.map(t => t.university_id)}
        />
      )}
    </AppShell>
  );
}
