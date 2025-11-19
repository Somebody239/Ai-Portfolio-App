import React, { useMemo } from "react";
import { SectionHeader } from "./PortfolioAtoms";
import { StandardizedScore, TestType } from "@/lib/types";

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
  const displayScores = useMemo(() => {
    const bestByType = scores.reduce<Record<string, StandardizedScore>>((acc, score) => {
      const key = score.test_type;
      if (!acc[key] || score.score > acc[key].score) {
        acc[key] = score;
      }
      return acc;
    }, {});

    return Object.values(bestByType).sort((a, b) => {
      const aDate = a.date_taken || a.created_at || "";
      const bDate = b.date_taken || b.created_at || "";
      return bDate.localeCompare(aDate);
    });
  }, [scores]);

  const getMaxScore = (type: TestType): number | undefined => {
    switch (type) {
      case TestType.SAT:
        return 1600;
      case TestType.ACT:
        return 36;
      case TestType.AP:
        return 5;
      case TestType.IB:
        return 45;
      case TestType.TOEFL:
        return 120;
      case TestType.IELTS:
        return 9;
      default:
        return undefined;
    }
  };

  return (
    <section className="space-y-4">
      <SectionHeader title="Standardized Tests" onAdd={onAdd} />
      
      {displayScores.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
          No official test scores yet. Add your SAT, ACT, AP, IB or language scores to strengthen this section.
        </div>
      ) : (
        <div className="space-y-3">
          {displayScores.map((score) => (
              <div key={score.id} className="flex flex-col gap-3 border border-zinc-800 rounded-xl p-4 bg-zinc-950/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 flex-shrink-0 flex flex-col items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-[15px] font-bold text-white">{score.test_type}</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">
                          {score.date_taken ? new Date(score.date_taken).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Date TBD"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Last synced {score.created_at ? new Date(score.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="w-32">
                      <ScoreBadge 
                        label="Total Score" 
                        value={score.score} 
                        max={getMaxScore(score.test_type)} 
                      />
                    </div>
                  </div>
                  {score.section_scores && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                      {Object.entries(score.section_scores).map(([section, value]) => (
                        <span key={`${score.id}-${section}`} className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-white">
                          {section}: {value}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
          ))}
        </div>
      )}
    </section>
  );
};

