
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpandableWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
  children: React.ReactNode;
  infoTooltip?: string;
}

const ExpandableWidget = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  children,
  infoTooltip
}: ExpandableWidgetProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-md ${iconBgColor}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                {infoTooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-0 h-4 w-4 ml-1 relative -top-1">
                          <span className="text-xs font-bold rounded-full w-4 h-4 border text-muted-foreground inline-flex items-center justify-center">?</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{infoTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-0 h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pb-3 pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default ExpandableWidget;
