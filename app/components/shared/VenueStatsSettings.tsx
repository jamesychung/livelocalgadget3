import React from "react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface VenueStatsSettingsProps {
  availableStats: any[];
  selectedStatIds: string[];
  onStatsChange: (ids: string[]) => void;
  maxStats?: number;
  onClose?: () => void;
}

export const VenueStatsSettings: React.FC<VenueStatsSettingsProps> = ({
  availableStats,
  selectedStatIds,
  onStatsChange,
  maxStats = 8,
  onClose
}) => {
  const handleToggle = (id: string, checked: boolean) => {
    console.log("Toggle fired:", { id, checked, selectedStatIds });
    if (checked) {
      if (!selectedStatIds.includes(id) && selectedStatIds.length < maxStats) {
        onStatsChange([...selectedStatIds, id]);
      }
    } else {
      onStatsChange(selectedStatIds.filter((statId) => statId !== id));
    }
  };

  return (
    <div className="bg-muted rounded-lg p-4 border w-full max-w-2xl relative">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Select up to {maxStats} stats</span>
        <Badge variant="outline" className="text-xs">
          {selectedStatIds.length} of {maxStats} selected
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {availableStats.map((stat) => (
          <div key={stat.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent transition">
            <span className="flex items-center gap-2">
              {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
              <span className="font-medium">{stat.title}</span>
            </span>
            <div className="flex-1" />
            <Switch
              checked={selectedStatIds.includes(stat.id)}
              onCheckedChange={(checked) => handleToggle(stat.id, checked)}
              disabled={!selectedStatIds.includes(stat.id) && selectedStatIds.length >= maxStats}
            />
          </div>
        ))}
      </div>
      {onClose && (
        <button
          type="button"
          className="absolute bottom-2 right-2 p-1 rounded bg-background border border-muted-foreground text-muted-foreground hover:bg-accent focus:outline-none text-xs"
          onClick={onClose}
          aria-label="Close"
          style={{ minWidth: 24, minHeight: 24 }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}; 