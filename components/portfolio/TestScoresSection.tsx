import React from "react";
import { SectionHeader } from "./PortfolioAtoms";
import { StandardizedScore, TestType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TestScoresSectionProps {
  scores: StandardizedScore[];
  onAdd: () => void;
}

const ScoreBadge = ({ label, value, max }: { label: string, value: number, max?: number }) => {
  const percentage = max ? (value / max) * 100 : 100;
  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-3 w-full">
        <div className="flex justify-between text-xs mb-2">
            <span className="text-zinc-500 uppercase font-bold tracking-wider">{label}</span>
            <span className="text-zinc-200 font-mono">{value}{max && <span className="text-zinc-600">/{max}</span>}</span>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
                className="h-full bg-zinc-100 transition-all duration-500" 
                style={{ width: `${percentage}%` }} 
            />
        </div>
    </div>
  );
};

export const TestScoresSection = ({ scores, onAdd }: TestScoresSectionProps) => {
  return (
    <section className="space-y-4">
      <SectionHeader title="Standardized Tests" onAdd={onAdd} />
      
      <div className="space-y-3">
        {scores.map((score) => (
            <div key={score.id} className="flex items-center gap-3">
                <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-lg font-bold text-white">{score.test_type}</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                    <ScoreBadge 
                        label="Total Score" 
                        value={score.score} 
                        max={score.test_type === TestType.SAT ? 1600 : score.test_type === TestType.ACT ? 36 : 5} 
                    />
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

