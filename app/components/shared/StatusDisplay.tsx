import React from "react";
import { Badge } from "../ui/badge";
import { getStatusConfig } from "../../lib/utils";

interface StatusDisplayProps {
  status: string;
  variant?: 'badge' | 'inline' | 'legend' | 'button' | 'compact';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  variant = 'badge',
  showIcon = true,
  showLabel = true,
  className = ""
}) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  if (variant === 'badge') {
    return (
      <Badge className={`${config.colors.badge} ${className}`}>
        {showIcon && <IconComponent className="h-3 w-3 mr-1" />}
        {showLabel && config.label}
      </Badge>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showIcon && (
          <div className={`w-4 h-4 rounded flex items-center justify-center ${config.colors.legend}`}>
            <IconComponent className={`h-3 w-3 ${config.colors.iconColor}`} />
          </div>
        )}
        {showLabel && (
          <span className="text-sm font-medium text-gray-600">{config.label}</span>
        )}
      </div>
    );
  }

  if (variant === 'legend') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-6 h-6 rounded flex items-center justify-center ${config.colors.legend}`}>
          <IconComponent className={`h-3 w-3 ${config.colors.iconColor}`} />
        </div>
        {showLabel && (
          <span className="text-xs font-medium text-gray-600">{config.label}</span>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm text-black ${config.colors.legend} ${className}`}>
        {showIcon && <IconComponent className="h-4 w-4" />}
        {showLabel && <span>{config.label}</span>}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <IconComponent className="h-4 w-4" />}
        {showLabel && <span className="text-xs font-medium">{config.label}</span>}
      </div>
    );
  }

  return null;
}; 