import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateCurrentReading, type SensorReading } from "@/lib/generator-data";
import { Fuel, Zap, Activity, Gauge } from "lucide-react";
import { AnimatedCard } from "@/components/AnimatedCard";

const sensorMeta = [
  { key: "fuel" as const, label: "Fuel Level Sensor", model: "JSN-SR04T Waterproof Ultrasonic", icon: Fuel, unit: "%", min: 0, max: 100, warningAt: 25, criticalAt: 15, inverted: true },
  { key: "voltage" as const, label: "AC Voltage Sensor", model: "Active Single Phase Module", icon: Zap, unit: "V", min: 180, max: 260, warningAt: 215, criticalAt: 210, inverted: true },
  { key: "current" as const, label: "Current Sensor", model: "SCT-013-100 Non-invasive 100A", icon: Gauge, unit: "A", min: 0, max: 100, warningAt: 30, criticalAt: 50 },
  { key: "vibration" as const, label: "Vibration Sensor", model: "ADXL345 Triple Digital Accelerometer", icon: Activity, unit: "g", min: 0, max: 8, warningAt: 3, criticalAt: 4.5 },
];

const Sensors = () => {
  const [reading, setReading] = useState<SensorReading>(generateCurrentReading());

  useEffect(() => {
    const interval = setInterval(() => setReading(generateCurrentReading()), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout title="Sensors">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {sensorMeta.map((sensor, idx) => {
          const value = reading[sensor.key] as number;
          const normalizedValue = ((value - sensor.min) / (sensor.max - sensor.min)) * 100;

          let status: "normal" | "warning" | "critical" = "normal";
          if (sensor.inverted) {
            if (value <= sensor.criticalAt) status = "critical";
            else if (value <= sensor.warningAt) status = "warning";
          } else {
            if (value >= sensor.criticalAt) status = "critical";
            else if (value >= sensor.warningAt) status = "warning";
          }

          return (
            <AnimatedCard key={sensor.key} index={idx}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <sensor.icon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="font-heading text-sm">{sensor.label}</CardTitle>
                    </div>
                    <Badge
                      variant={status === "normal" ? "secondary" : "destructive"}
                      className={status === "warning" ? "bg-warning text-warning-foreground" : ""}
                    >
                      {status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Model: {sensor.model}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <span className="font-heading text-3xl font-bold">{value}</span>
                    <span className="text-muted-foreground ml-1">{sensor.unit}</span>
                  </div>
                  <Progress value={Math.min(normalizedValue, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Warning: {sensor.warningAt}{sensor.unit}</span>
                    <span>Critical: {sensor.criticalAt}{sensor.unit}</span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Sensors;
