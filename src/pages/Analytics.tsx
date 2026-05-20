import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorChart } from "@/components/SensorChart";
import { generateHistoricalData } from "@/lib/generator-data";
import { TrendingDown, Clock, Zap, Activity } from "lucide-react";
import { AnimatedCard } from "@/components/AnimatedCard";

const Analytics = () => {
  const [data] = useState(generateHistoricalData(48));

  const fuels = data.map((d) => d.fuel);
  const fuelConsumed = (fuels[0] - fuels[fuels.length - 1]).toFixed(1);
  const avgConsumption = (Number(fuelConsumed) / 48).toFixed(2);

  const powers = data.map((d) => d.power);
  const avgPower = (powers.reduce((a, b) => a + b, 0) / powers.length).toFixed(2);
  const peakPower = Math.max(...powers).toFixed(2);

  const vibrations = data.map((d) => d.vibration);
  const avgVibration = (vibrations.reduce((a, b) => a + b, 0) / vibrations.length).toFixed(2);
  const peakVibration = Math.max(...vibrations).toFixed(2);

  const stats = [
    { label: "Fuel Consumed (48h)", value: `${fuelConsumed}%`, icon: TrendingDown, color: "text-warning" },
    { label: "Consumption Rate", value: `${avgConsumption}%/h`, icon: Clock, color: "text-warning" },
    { label: "Avg Power Output", value: `${avgPower} kW`, icon: Zap, color: "text-accent" },
    { label: "Peak Power", value: `${peakPower} kW`, icon: Zap, color: "text-accent" },
    { label: "Avg Vibration", value: `${avgVibration} g`, icon: Activity, color: "text-muted-foreground" },
    { label: "Peak Vibration", value: `${peakVibration} g`, icon: Activity, color: "text-destructive" },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
            <AnimatedCard key={stat.label} index={idx}>
              <Card>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                  <p className="font-heading text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { dataKey: "fuel" as const, title: "Fuel Consumption (48h)", color: "hsl(38, 92%, 50%)", unit: "%" },
            { dataKey: "power" as const, title: "Power Usage Pattern (48h)", color: "hsl(142, 71%, 45%)", unit: "kW" },
            { dataKey: "vibration" as const, title: "Vibration Analysis (48h)", color: "hsl(280, 60%, 55%)", unit: "g" },
            { dataKey: "voltage" as const, title: "Voltage Trend (48h)", color: "hsl(200, 70%, 50%)", unit: "V" },
          ].map((c, i) => (
            <AnimatedCard key={c.dataKey} index={i}>
              <SensorChart data={data} dataKey={c.dataKey} title={c.title} color={c.color} unit={c.unit} />
            </AnimatedCard>
          ))}
        </div>

        <AnimatedCard index={0}>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fuel Refill Needed</p>
                  <p className="font-heading text-2xl font-bold text-warning">~8.5 hours</p>
                  <p className="text-xs text-muted-foreground">Based on current consumption rate of {avgConsumption}%/h</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Maintenance</p>
                  <p className="font-heading text-2xl font-bold text-accent">16 days</p>
                  <p className="text-xs text-muted-foreground">Scheduled for April 28, 2026</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Avg Daily Runtime</p>
                  <p className="font-heading text-2xl font-bold text-success">18.2h</p>
                  <p className="text-xs text-muted-foreground">Based on last 7 days of operation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
