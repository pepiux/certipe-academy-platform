
import { useState, ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExpandableWidgetProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  infoTooltip?: string;
  children: ReactNode;
}

const ExpandableWidget = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  infoTooltip,
  children 
}: ExpandableWidgetProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TooltipProvider>
      <Card className={`transition-all duration-300 ${expanded ? 'h-auto' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {infoTooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${iconBgColor} p-2 rounded-lg cursor-help`}>
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    {infoTooltip}
                  </TooltipContent>
                </Tooltip>
              )}
              {!infoTooltip && (
                <div className={`${iconBgColor} p-2 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-6" 
                onClick={toggleExpanded} 
                aria-label={expanded ? 'Colapsar detalles' : 'Expandir detalles'}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
          </div>
          
          {expanded && (
            <ScrollArea className="h-[300px] mt-2 pt-2 border-t border-border">
              {children}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ExpandableWidget;
