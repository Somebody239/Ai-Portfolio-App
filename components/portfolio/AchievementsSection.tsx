import React from "react";
import { PortfolioCard, SectionHeader } from "./PortfolioAtoms";
import { Achievement } from "@/lib/types";
import { Trophy } from "lucide-react";

interface AchievementsSectionProps {
  items: Achievement[];
  onAdd: () => void;
}

export const AchievementsSection = ({ items, onAdd }: AchievementsSectionProps) => {
  return (
    <section className="space-y-4">
      <SectionHeader 
        title="Honors & Awards" 
        description="Academic distinctions and competitive awards."
        onAdd={onAdd}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <PortfolioCard 
            key={item.id}
            title={item.title}
            subtitle={item.awarded_by || undefined}
            metaRight={item.date_awarded ? new Date(item.date_awarded).getFullYear().toString() : "N/A"}
            tags={item.category ? [item.category] : ["Award"]}
          >
            <div className="absolute top-4 right-4 text-amber-500/20 group-hover:text-amber-500/40 transition-colors pointer-events-none">
                <Trophy size={40} />
            </div>
          </PortfolioCard>
        ))}
      </div>
    </section>
  );
};

