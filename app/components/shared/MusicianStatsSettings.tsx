import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { X } from 'lucide-react';
import { StatItem } from '../../hooks/useMusicianEventsStats';

interface MusicianStatsSettingsProps {
  availableStats: StatItem[];
  selectedStatIds: string[];
  onStatsChange: (statIds: string[]) => void;
  maxStats: number;
  onClose: () => void;
}

export const MusicianStatsSettings: React.FC<MusicianStatsSettingsProps> = ({
  availableStats,
  selectedStatIds,
  onStatsChange,
  maxStats,
  onClose
}) => {
  const handleStatToggle = (statId: string, checked: boolean) => {
    if (checked) {
      if (selectedStatIds.length < maxStats) {
        onStatsChange([...selectedStatIds, statId]);
      }
    } else {
      onStatsChange(selectedStatIds.filter(id => id !== statId));
    }
  };

  const isMaxReached = selectedStatIds.length >= maxStats;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Customize Dashboard Stats</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Select up to {maxStats} stats to display on your dashboard ({selectedStatIds.length}/{maxStats} selected)
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableStats.map((stat) => {
            const isSelected = selectedStatIds.includes(stat.id);
            const isDisabled = !isSelected && isMaxReached;

            return (
              <div
                key={stat.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-300' 
                    : isDisabled 
                      ? 'bg-gray-50 border-gray-200 opacity-50' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  id={stat.id}
                  checked={isSelected}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => handleStatToggle(stat.id, checked as boolean)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={stat.id}
                    className={`text-sm font-medium cursor-pointer ${
                      isDisabled ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {stat.title}
                  </label>
                  <p className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {isMaxReached && (
              <span className="text-amber-600">
                Maximum stats selected. Uncheck some to add others.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 