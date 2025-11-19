import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/Atoms";
import { University, AIRecommendation } from "@/lib/types";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
}

export const StatWidget = memo<StatWidgetProps>(({ label, value, icon, subtext }) => (
  <Card className="flex flex-col justify-between min-h-[140px]">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-zinc-800">
        {icon}
      </div>
      {subtext && <span className="text-xs text-zinc-500 font-mono">{subtext}</span>}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-zinc-100 tracking-tight">{value}</h3>
      <p className="text-sm text-zinc-500 font-medium mt-1">{label}</p>
    </div>
  </Card>
));

StatWidget.displayName = "StatWidget";


interface UniversityRowProps {
  university: University;
  risk: "Safety" | "Target" | "Reach" | "High Reach";
}

export const UniversityRow = memo<UniversityRowProps>(({ university, risk }) => {
  const riskMap = {
    Safety: "success",
    Target: "neutral",
    Reach: "warning",
    "High Reach": "danger",
  } as const;

  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
          {university.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white">
            {university.name}
          </h4>
          <p className="text-xs text-zinc-500">{university.country}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:block text-right">
          <p className="text-xs text-zinc-500">Acceptance</p>
          <p className="text-sm text-zinc-300">{university.acceptance_rate}%</p>
        </div>
        <Badge text={risk} variant={riskMap[risk]} />
      </div>
    </div>
  );
});

UniversityRow.displayName = "UniversityRow";


interface RecommendationCardProps {
  rec: AIRecommendation;
}

export const RecommendationCard = memo<RecommendationCardProps>(({ rec }) => (
  <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg mb-3">
    <div className="flex gap-3">
      <AlertCircle className="w-5 h-5 text-zinc-100 shrink-0 mt-0.5" />
      <div>
        <h5 className="text-sm font-semibold text-zinc-200 mb-1">Recommendation</h5>
        <p className="text-sm text-zinc-400 leading-relaxed">{rec.recommendation}</p>
        <p className="text-xs text-zinc-600 mt-2 font-mono uppercase">Source: {rec.source}</p>
      </div>
    </div>
  </div>
));

RecommendationCard.displayName = "RecommendationCard";


