import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  subtitle?: string;
}

export function SensorCard({ title, value, unit, icon, status, trend, subtitle }: SensorCardProps) {
  const statusColors = {
    normal: "border-l-success",
    warning: "border-l-warning",
    critical: "border-l-destructive",
  };

  const statusDotColors = {
    normal: "bg-success",
    warning: "bg-warning",
    critical: "bg-destructive animate-pulse-glow",
  };

  return (
    <Card className={cn("border-l-4", statusColors[status])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("h-2 w-2 rounded-full", statusDotColors[status])} />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="text-muted-foreground/50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
