
import { useState, ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ExpandableWidgetProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  children: ReactNode;
}

const ExpandableWidget = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  children 
}: ExpandableWidgetProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={`transition-all duration-300 ${expanded ? 'h-auto' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className={`transition-all ${expanded ? 'scale-90 opacity-80' : ''}`}>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className={`${iconBgColor} p-2 rounded-lg transition-all ${expanded ? 'scale-90 opacity-80' : ''}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 mt-2" 
              onClick={toggleExpanded} 
              aria-label={expanded ? 'Colapsar detalles' : 'Expandir detalles'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
        
        {expanded && (
          <div className="pt-2 mt-2 border-t border-border animate-fade-in">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandableWidget;
