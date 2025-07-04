import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, List, Workflow, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface WorkflowSelectorProps {
  className?: string;
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({ className = "" }) => {
  const location = useLocation();
  
      const workflows = [
      {
        id: "workflow-based",
        title: "Workflow-Based (Recommended)",
        description: "Organized by workflow stages: My Events, Applications, Planning, History",
        icon: Workflow,
        path: "/venue-events/workflow-based",
        features: ["My Events", "Applications to Review", "Event Planning", "Event History"]
      },
      {
        id: "event-centric",
        title: "Event-Centric",
        description: "Single events list with inline application management and modal details",
        icon: List,
        path: "/venue-events/event-centric",
        features: ["Events Overview", "Inline Applications", "Modal Details", "Quick Actions"]
      },
      {
        id: "current",
        title: "Current Tabbed",
        description: "Traditional 4-tab approach with Calendar, List, Applications, and History",
        icon: Settings,
        path: "/venue-events/current",
        features: ["Calendar View", "List View", "Applications Tab", "Event History"]
      }
    ];

  const isActiveWorkflow = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <Card className={`w-80 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          Workflow Options
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred way to manage venue events
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.map((workflow) => {
          const IconComponent = workflow.icon;
          const isActive = isActiveWorkflow(workflow.path);
          
          return (
            <div key={workflow.id} className="space-y-3">
              <Button
                asChild
                variant={isActive ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
              >
                <Link to={workflow.path}>
                  <IconComponent className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{workflow.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {workflow.description}
                    </div>
                  </div>
                </Link>
              </Button>
              
              {isActive && (
                <div className="pl-8 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Features:
                  </div>
                  {workflow.features.map((feature, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}; 