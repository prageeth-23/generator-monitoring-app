import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActuatorState } from "@/lib/generator-data";
import { Volume2, VolumeX, Lightbulb, LightbulbOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActuatorStatusCardProps {
  actuatorState: ActuatorState;
}

export function ActuatorStatusCard({ actuatorState }: ActuatorStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base">On-Site Actuators</CardTitle>
          <Badge
            variant={actuatorState.buzzer ? "destructive" : "secondary"}
            className={!actuatorState.buzzer ? "bg-success text-success-foreground" : ""}
          >
            {actuatorState.buzzer ? "ACTIVE" : "Idle"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buzzer status */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
          actuatorState.buzzer ? "border-destructive/50 bg-destructive/5" : "border-border"
        )}>
          {actuatorState.buzzer ? (
            <Volume2 className="h-5 w-5 text-destructive animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">Warning Buzzer</p>
            <p className="text-xs text-muted-foreground">Large buzzer module</p>
          </div>
          <div className={cn(
            "h-3 w-3 rounded-full",
            actuatorState.buzzer ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground/30"
          )} />
        </div>

        {/* LED status */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
          actuatorState.ledAlert ? "border-destructive/50 bg-destructive/5" : "border-border"
        )}>
          {actuatorState.ledAlert ? (
            <Lightbulb className="h-5 w-5 text-destructive animate-pulse" />
          ) : (
            <LightbulbOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">Red LED Indicators</p>
            <p className="text-xs text-muted-foreground">3mm diffused LED pack</p>
          </div>
          <div className={cn(
            "h-3 w-3 rounded-full",
            actuatorState.ledAlert ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground/30"
          )} />
        </div>

        {/* Trigger reason */}
        <div className="rounded-md bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Status:</span> {actuatorState.reason}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
