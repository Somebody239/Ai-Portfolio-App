"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePortfolio } from "@/hooks/usePortfolio";
import { ExtracurricularsSection } from "@/components/portfolio/ExtracurricularsSection";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { TestScoresSection } from "@/components/portfolio/TestScoresSection";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";

export default function PortfolioView() {
  const { 
    extracurriculars, 
    achievements, 
    scores, 
    loading 
  } = usePortfolio();

  // Logic to handle "Add" clicks (Placeholder for modal logic)
  const handleAddActivity = () => console.log("Open Activity Modal");
  const handleAddAward = () => console.log("Open Award Modal");
  const handleAddScore = () => console.log("Open Score Modal");

  if (loading) {
    return (
        <AppShell>
            <div className="h-full flex items-center justify-center">
                <span className="text-zinc-500 animate-pulse">Syncing Portfolio...</span>
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
            This is your holistic academic profile. The AI uses this data to calculate your 
            admission chances. Keep it up to date for the best results.
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
                        <span className="text-3xl font-bold text-white">3.92</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Course Rigor</span>
                            <span className="text-emerald-400">High</span>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Class Rank</span>
                            <span>Top 10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>



      </div>
    </AppShell>
  );
}

