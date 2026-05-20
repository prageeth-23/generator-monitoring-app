import { DashboardLayout } from "@/components/DashboardLayout";
import { SensorCard } from "@/components/SensorCard";
import { GeneratorStatusCard } from "@/components/GeneratorStatusCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { SensorChart } from "@/components/SensorChart";
import { PowerGauge } from "@/components/PowerGauge";
import { ActuatorStatusCard } from "@/components/ActuatorStatusCard";
import { useFirebaseSensors } from "@/hooks/useFirebaseSensors";
import { Fuel, Zap, Activity, Gauge, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const AnimatedCard = ({ index, children }: { index: number; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    {children}
  </motion.div>
);

function getSensorStatus(value: number, warningThreshold: number, criticalThreshold: number, inverted = false) {
  if (inverted) {
    if (value <= criticalThreshold) return "critical" as const;
    if (value <= warningThreshold) return "warning" as const;
    return "normal" as const;
  }
  if (value >= criticalThreshold) return "critical" as const;
  if (value >= warningThreshold) return "warning" as const;
  return "normal" as const;
}

const Index = () => {
  const {
    currentReading,
    historicalData,
    alerts,
    setAlerts,
    generatorStatus,
    actuatorState,
    isConnected,
  } = useFirebaseSensors();

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <DashboardLayout title="Dashboard" alertCount={unacknowledgedCount}>
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 gap-1.5">
              <Wifi className="h-3 w-3" /> Firebase Connected — Live Data
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <WifiOff className="h-3 w-3" /> Simulated Data — Waiting for ESP32
            </Badge>
          )}
        </div>

        {/* Sensor Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatedCard index={0}>
            <SensorCard
              title="Fuel Level"
              value={currentReading.fuel}
              unit="%"
              icon={<Fuel className="h-6 w-6" />}
              status={getSensorStatus(currentReading.fuel, 25, 15, true)}
              subtitle="JSN-SR04T Ultrasonic"
            />
          </AnimatedCard>
          <AnimatedCard index={1}>
            <SensorCard
              title="Voltage"
              value={currentReading.voltage}
              unit="V"
              icon={<Zap className="h-6 w-6" />}
              status={
                currentReading.voltage < 210 || currentReading.voltage > 245
                  ? "critical"
                  : currentReading.voltage < 215 || currentReading.voltage > 240
                  ? "warning"
                  : "normal"
              }
              subtitle="AC Voltage Sensor"
            />
          </AnimatedCard>
          <AnimatedCard index={2}>
            <SensorCard
              title="Current"
              value={currentReading.current}
              unit="A"
              icon={<Gauge className="h-6 w-6" />}
              status={getSensorStatus(currentReading.current, 30, 50)}
              subtitle="SCT-013-100"
            />
          </AnimatedCard>
          <AnimatedCard index={3}>
            <SensorCard
              title="Vibration"
              value={currentReading.vibration}
              unit="g"
              icon={<Activity className="h-6 w-6" />}
              status={getSensorStatus(currentReading.vibration, 3, 4)}
              subtitle="ADXL345 Accelerometer"
            />
          </AnimatedCard>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <AnimatedCard index={0}>
            <GeneratorStatusCard status={generatorStatus} fuelLevel={currentReading.fuel} />
          </AnimatedCard>
          <AnimatedCard index={1}>
            <PowerGauge
              voltage={currentReading.voltage}
              current={currentReading.current}
              power={currentReading.power}
            />
          </AnimatedCard>
          <AnimatedCard index={2}>
            <ActuatorStatusCard actuatorState={actuatorState} />
          </AnimatedCard>
          <AnimatedCard index={3}>
            <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledge} />
          </AnimatedCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { dataKey: "fuel" as const, title: "Fuel Level (24h)", color: "hsl(38, 92%, 50%)", unit: "%" },
            { dataKey: "voltage" as const, title: "Voltage Output (24h)", color: "hsl(200, 70%, 50%)", unit: "V" },
            { dataKey: "power" as const, title: "Power Consumption (24h)", color: "hsl(142, 71%, 45%)", unit: "kW" },
            { dataKey: "vibration" as const, title: "Vibration (24h)", color: "hsl(280, 60%, 55%)", unit: "g" },
          ].map((c, i) => (
            <AnimatedCard key={c.dataKey} index={i}>
              <SensorChart data={historicalData} dataKey={c.dataKey} title={c.title} color={c.color} unit={c.unit} />
            </AnimatedCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
