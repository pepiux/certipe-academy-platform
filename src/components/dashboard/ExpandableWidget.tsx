
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ExpandableWidgetProps { 
  title: string; 
  value: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
  children: React.ReactNode;
}

const ExpandableWidget = ({ 
  title, 
  value, 
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  children,
}: ExpandableWidgetProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="relative h-[146px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">{value}</span>
              </div>
            </div>
          </div>
          <div className={`p-2 rounded-md ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <>
          <Separator className="mx-6" />
          <CardContent className="pb-10 pt-4">
            {children}
          </CardContent>
        </>
      )}
      
      <div className="absolute bottom-4 right-4">
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
    </Card>
  );
};

export default ExpandableWidget;
