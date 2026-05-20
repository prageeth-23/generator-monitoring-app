import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Alert } from "@/lib/generator-data";
import { AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

const alertIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const alertStyles = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-accent bg-accent/5",
};

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base">Alerts</CardTitle>
          {unacknowledged > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unacknowledged} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="space-y-1 p-4 pt-0">
            {alerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 rounded-md border-l-4 p-3 transition-colors",
                    alertStyles[alert.type],
                    alert.acknowledged && "opacity-50"
                  )}
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{alert.sensor}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => onAcknowledge(alert.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
