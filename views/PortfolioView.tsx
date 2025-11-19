"use client";

import React, { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePortfolio } from "@/hooks/usePortfolio";
import { ExtracurricularsSection } from "@/components/portfolio/ExtracurricularsSection";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { TestScoresSection } from "@/components/portfolio/TestScoresSection";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { StatsService } from "@/services/StatsService";
import { useUser } from "@/hooks/useUser";

export default function PortfolioView() {
  const { 
    extracurriculars, 
    achievements, 
    scores, 
    courses,
    loading,
    error,
  } = usePortfolio();
  const { user, loading: userLoading } = useUser();
  const statsService = useMemo(() => StatsService.getInstance(), []);

  // Logic to handle "Add" clicks (Placeholder for modal logic)
  const handleAddActivity = () => console.log("Open Activity Modal");
  const handleAddAward = () => console.log("Open Award Modal");
  const handleAddScore = () => console.log("Open Score Modal");

  const gpa = useMemo(() => {
    if (user?.current_gpa !== null && user?.current_gpa !== undefined) {
      return user.current_gpa;
    }
    return statsService.calculateGPA(courses);
  }, [user?.current_gpa, courses, statsService]);

  const totalHours = useMemo(
    () => extracurriculars.reduce((sum, activity) => sum + (activity.hours_per_week || 0), 0),
    [extracurriculars]
  );

  const avgHours = extracurriculars.length > 0 ? totalHours / extracurriculars.length : 0;

  const courseRigor = useMemo(() => {
    if (courses.length >= 8) return "Very High";
    if (courses.length >= 5) return "High";
    if (courses.length >= 3) return "Moderate";
    return "Emerging";
  }, [courses.length]);

  const isLoading = loading || userLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <span className="text-zinc-500 animate-pulse">Syncing Portfolio...</span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <span className="text-red-400 text-sm">Failed to load portfolio. Please refresh.</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Page Header */}
      <header className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Portfolio</h1>
          <p className="text-zinc-400 max-w-2xl">
            {user?.name ? `Hi ${user.name.split(" ")[0]},` : "This is"} your holistic academic profile. Keep it up to date so the AI can evaluate your readiness for {user?.intended_major || "your target major"} programs.
          </p>
        </div>
        <div className="hidden md:block">
            <InteractiveHoverButton text="Download Resume" className="w-48" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        

        {/* LEFT COLUMN: Main Content (Activities & Awards) */}
        <div className="lg:col-span-8 space-y-10">
            <ExtracurricularsSection 
                items={extracurriculars} 
                onAdd={handleAddActivity} 
            />
            
            <div className="w-full h-px bg-zinc-900" /> {/* Divider */}

            <AchievementsSection 
                items={achievements} 
                onAdd={handleAddAward} 
            />



             {/* Personality Section (Simplified) */}
             <section className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100">Personality & Essays</h3>
                <div className="p-6 border border-zinc-800 bg-zinc-900/20 rounded-xl text-center space-y-3">
                    <p className="text-sm text-zinc-400">
                        Providing writing samples helps the AI understand your voice.
                    </p>
                    <button className="text-sm text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition-all">
                        Answer Personality Questions
                    </button>
                </div>
            </section>
        </div>



        {/* RIGHT COLUMN: Stats & Scores (Sticky) */}
        <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-4 space-y-8">
            <TestScoresSection 
              scores={scores} 
              onAdd={handleAddScore} 
            />



            {/* GPA Card (Quick View) */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
              <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">Academic Overview</h4>
              <div className="flex justify-between items-end border-b border-zinc-900 pb-4 mb-4">
                <span className="text-zinc-400 text-sm">Unweighted GPA</span>
                <span className="text-3xl font-bold text-white">{gpa > 0 ? gpa.toFixed(2) : "N/A"}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Courses tracked</span>
                  <span className="text-white">{courses.length}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Course rigor</span>
                  <span className="text-emerald-400">{courseRigor}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Avg hrs in activities</span>
                  <span className="text-white">{avgHours.toFixed(1)} hrs/wk</span>
                </div>
              </div>
            </div>
            </div>
        </div>



      </div>
    </AppShell>
  );
}

