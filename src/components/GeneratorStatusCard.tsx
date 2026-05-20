import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GeneratorStatus } from "@/lib/generator-data";
import { Power, Clock, Wrench, Fuel } from "lucide-react";

interface GeneratorStatusCardProps {
  status: GeneratorStatus;
  fuelLevel: number;
}

export function GeneratorStatusCard({ status, fuelLevel }: GeneratorStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base">Generator Status</CardTitle>
          <Badge variant={status.isRunning ? "default" : "secondary"} className={status.isRunning ? "bg-success" : ""}>
            <Power className="h-3 w-3 mr-1" />
            {status.isRunning ? "Running" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="h-3.5 w-3.5" /> Fuel Level
            </span>
            <span className="font-medium">{fuelLevel}%</span>
          </div>
          <Progress value={fuelLevel} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Est. {status.estimatedFuelRemaining}h remaining at {status.fuelConsumptionRate}%/hr
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Runtime</p>
              <p className="font-medium">{status.runtime}h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Next Service</p>
              <p className="font-medium">{status.nextMaintenance}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
