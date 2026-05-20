import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateAlerts, type Alert } from "@/lib/generator-data";
import { AlertTriangle, AlertCircle, Info, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/AnimatedCard";

const alertIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  return (
    <DashboardLayout title="Alerts" alertCount={unacknowledged}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="destructive">{alerts.filter((a) => a.type === "critical").length} Critical</Badge>
            <Badge className="bg-warning text-warning-foreground">{alerts.filter((a) => a.type === "warning").length} Warning</Badge>
            <Badge variant="secondary">{alerts.filter((a) => a.type === "info").length} Info</Badge>
          </div>
          {unacknowledged > 0 && (
            <Button size="sm" variant="outline" onClick={handleAcknowledgeAll}>
              <CheckCheck className="h-4 w-4 mr-1" /> Acknowledge All
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {alerts.map((alert, idx) => {
            const Icon = alertIcons[alert.type];
            return (
              <AnimatedCard key={alert.id} index={idx}>
                <Card className={cn(alert.acknowledged && "opacity-50")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        alert.type === "critical" && "bg-destructive/10 text-destructive",
                        alert.type === "warning" && "bg-warning/10 text-warning",
                        alert.type === "info" && "bg-accent/10 text-accent",
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{alert.sensor}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {alert.type}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge variant="secondary" className="text-[10px]">
                              <Check className="h-2.5 w-2.5 mr-0.5" /> Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Ack
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
