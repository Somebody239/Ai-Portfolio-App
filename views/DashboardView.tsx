// /views/DashboardView.tsx

// NOTE: This file is intended to be used in a Next.js app (app router) with "use client".
// It wires up the StatsService (business logic) with UI components and real Supabase data.

"use client";

import React, { useMemo } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { StatWidget, UniversityRow, RecommendationCard } from "@/components/dashboard/Widgets";
import { Card, ActionButton } from "@/components/ui/Atoms";
import { StatsService } from "@/services/StatsService";
import { GraduationCap, BookOpen, Target, Zap, TrendingUp } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUniversities } from "@/hooks/useUniversities";
import { useUser } from "@/hooks/useUser";

import { TestType } from "@/lib/types";

export default function DashboardView() {
  const statsService = StatsService.getInstance();
  const { courses, scores, targets, recommendations, loading: portfolioLoading } = usePortfolio();
  const { universities, loading: universitiesLoading } = useUniversities();
  const { user, loading: userLoading } = useUser();

  // Use current_gpa from database if available, otherwise calculate from courses
  const gpa = useMemo(() => {
    if (user?.current_gpa !== null && user?.current_gpa !== undefined) {
      return user.current_gpa;
    }
    // Fallback to calculated GPA from courses if no current_gpa in database
    return statsService.calculateGPA(courses);
  }, [user?.current_gpa, courses, statsService]);
  
  const satScore = useMemo(() => statsService.getBestScore(scores, TestType.SAT), [scores]);
  const actScore = useMemo(() => statsService.getBestScore(scores, TestType.ACT), [scores]);

  // Get universities from user targets or fallback to all universities
  const targetUniversities = useMemo(() => {
    if (targets.length > 0 && targets[0].university) {
      return targets.map((target) => target.university!);
    }
    return universities.slice(0, 3); // Show first 3 if no targets
  }, [targets, universities]);

  const uniRisks = useMemo(() => {
    return targetUniversities.map((uni) => ({
      ...uni,
      risk: statsService.calculateAdmissionsRisk(gpa, satScore, uni),
    }));
  }, [targetUniversities, gpa, satScore, statsService]);

  // Calculate SAT section scores if available
  const satMath = useMemo(() => {
    const satScoreRecord = scores.find((s) => s.test_type === TestType.SAT);
    return satScoreRecord?.section_scores?.math || null;
  }, [scores]);

  const satRW = useMemo(() => {
    const satScoreRecord = scores.find((s) => s.test_type === TestType.SAT);
    return satScoreRecord?.section_scores?.reading_writing || 
           satScoreRecord?.section_scores?.['reading & writing'] || null;
  }, [scores]);

  // Calculate risk breakdown
  const riskCounts = useMemo(() => {
    const counts = { Safety: 0, Target: 0, Reach: 0, 'High Reach': 0 };
    uniRisks.forEach((uni) => {
      counts[uni.risk]++;
    });
    return counts;
  }, [uniRisks]);

  const loading = portfolioLoading || universitiesLoading || userLoading;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatWidget 
          label="Current GPA" 
          value={gpa > 0 ? gpa.toFixed(2) : "N/A"} 
          icon={<GraduationCap size={20} />} 
          subtext={user?.current_gpa !== null && user?.current_gpa !== undefined ? "From Profile" : courses.length > 0 ? "Calculated" : "Not Set"} 
        />
        <StatWidget 
          label="SAT Score" 
          value={satScore || "N/A"} 
          icon={<BookOpen size={20} />} 
          subtext={satScore ? "Best Score" : "No score"} 
        />
        <StatWidget label="Target Unis" value={targetUniversities.length} icon={<Target size={20} />} subtext={`${riskCounts.Reach + riskCounts['High Reach']} Reach`} />
        <StatWidget label="App Strength" value={recommendations.length > 0 ? "Active" : "Pending"} icon={<Zap size={20} />} subtext="AI Rating" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Targets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">University Targets</h3>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
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
              <ActionButton className="w-full justify-center bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                Add University
              </ActionButton>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-lg font-medium text-white mb-4">Standardized Testing</h4>
              <div className="space-y-6">
                {satScore ? (
                  <>
                    {satMath && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">SAT Math</span>
                          <span className="text-white">{satMath} / 800</span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-white" style={{ width: `${(satMath / 800) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                    {satRW && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">SAT R&W</span>
                          <span className="text-white">{satRW} / 800</span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-600" style={{ width: `${(satRW / 800) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                    {!satMath && !satRW && satScore && (
                      <div className="text-sm text-zinc-400 text-center py-4">
                        Total SAT: <span className="text-white font-semibold">{satScore}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-zinc-500 text-center py-4">
                    No test scores recorded yet
                  </div>
                )}
                {actScore && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">ACT</span>
                      <span className="text-white">{actScore} / 36</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-500" style={{ width: `${(actScore / 36) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card className="flex flex-col justify-center items-center text-center p-8">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <TrendingUp className="text-zinc-400" />
              </div>
              <h4 className="text-white font-medium">Extracurriculars</h4>
              <p className="text-sm text-zinc-500 mt-2 mb-4">You need 2 more leadership hours/week to hit Ivy League averages.</p>
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
                <p className="text-sm">No AI recommendations yet. Add more data to your portfolio to get personalized insights.</p>
              </div>
            )}
          </div>

          <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={100} />
            </div>
            <h4 className="text-lg font-bold text-white relative z-10">Boost your GPA</h4>
            <p className="text-sm text-zinc-400 mt-2 relative z-10 mb-6">
              Based on your major (Pre-Med), raising your Physics grade to 92 would increase your Stanford acceptance probability by 4%.
            </p>
            <ActionButton className="w-full justify-center relative z-10">
              See Action Plan
            </ActionButton>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}


