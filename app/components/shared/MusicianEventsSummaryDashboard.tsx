import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Star, 
  Calendar, 
  Music, 
  DollarSign, 
  TrendingUp, 
  Target, 
  XCircle 
} from 'lucide-react';
import { StatItem } from '../../hooks/useMusicianEventsStats';

const iconMap = {
  FileText,
  CheckCircle,
  Clock,
  Star,
  Calendar,
  Music,
  DollarSign,
  TrendingUp,
  Target,
  XCircle
};

const colorMap = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  yellow: 'text-yellow-600 bg-yellow-100',
  purple: 'text-purple-600 bg-purple-100',
  red: 'text-red-600 bg-red-100',
  gray: 'text-gray-600 bg-gray-100'
};

interface MusicianEventsSummaryDashboardProps {
  stats: StatItem[];
  maxStats?: number;
}

export const MusicianEventsSummaryDashboard: React.FC<MusicianEventsSummaryDashboardProps> = ({ 
  stats, 
  maxStats = 8 
}) => {
  const displayStats = stats.slice(0, maxStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        const colorClass = colorMap[stat.color as keyof typeof colorMap] || colorMap.blue;

        return (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${colorClass}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
              {stat.trend && (
                <div className={`flex items-center mt-2 text-xs ${
                  stat.trend.direction === 'up' ? 'text-green-600' : 
                  stat.trend.direction === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  <span>{stat.trend.direction === 'up' ? '↗' : stat.trend.direction === 'down' ? '↘' : '→'}</span>
                  <span className="ml-1">{stat.trend.value}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 