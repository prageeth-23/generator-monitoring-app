// IoT sensor data for the ESP32 generator monitoring system
// Hardware: NodeMCU ESP32, JSN-SR04T (fuel), AC Voltage Sensor, SCT-013-100 (current), ADXL345 (vibration)
// Actuators: Warning Buzzer, Red LED indicators (local on-site alerts)

export interface SensorReading {
  timestamp: string;
  fuel: number;        // % (JSN-SR04T ultrasonic distance → tank percentage)
  voltage: number;     // V (AC Voltage Sensor - single phase)
  current: number;     // A (SCT-013-100 non-invasive 100A)
  vibration: number;   // g (ADXL345 triple-axis accelerometer)
  power: number;       // kW (calculated: voltage × current / 1000)
}

export interface ActuatorState {
  buzzer: boolean;     // Warning buzzer (Large buzzer module)
  ledAlert: boolean;   // Red LED indicators (3mm diffused)
  reason: string;      // Why the actuator was triggered
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  sensor: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface GeneratorStatus {
  isRunning: boolean;
  runtime: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelConsumptionRate: number;
  estimatedFuelRemaining: number;
}

function randomInRange(min: number, max: number, decimals = 1): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateCurrentReading(): SensorReading {
  const voltage = randomInRange(215, 240);
  const current = randomInRange(5, 25);
  const fuel = randomInRange(15, 85);
  const vibration = randomInRange(0.2, 4.5);
  return {
    timestamp: new Date().toISOString(),
    fuel,
    voltage,
    current,
    vibration,
    power: Number((voltage * current / 1000).toFixed(2)),
  };
}

export function getActuatorState(reading: SensorReading): ActuatorState {
  const fuelCritical = reading.fuel <= 15;
  const vibrationCritical = reading.vibration >= 4;
  const voltageCritical = reading.voltage < 210 || reading.voltage > 245;

  const triggered = fuelCritical || vibrationCritical || voltageCritical;
  const reasons: string[] = [];
  if (fuelCritical) reasons.push("Low fuel level");
  if (vibrationCritical) reasons.push("High vibration");
  if (voltageCritical) reasons.push("Voltage out of range");

  return {
    buzzer: triggered,
    ledAlert: triggered,
    reason: triggered ? reasons.join(", ") : "All readings normal",
  };
}

export function generateHistoricalData(hours: number = 24): SensorReading[] {
  const data: SensorReading[] = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toISOString();
    const baseFuel = 85 - (hours - i) * 1.2;
    const voltage = randomInRange(218, 238);
    const current = randomInRange(8, 22);
    data.push({
      timestamp,
      fuel: Math.max(10, Number((baseFuel + randomInRange(-2, 2)).toFixed(1))),
      voltage,
      current,
      vibration: randomInRange(0.5, 3.5),
      power: Number((voltage * current / 1000).toFixed(2)),
    });
  }
  return data;
}

export function generateAlerts(): Alert[] {
  return [
    {
      id: "1",
      type: "critical",
      sensor: "Fuel Level",
      message: "Fuel below 15% — buzzer & LED activated on-site",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      acknowledged: false,
    },
    {
      id: "2",
      type: "warning",
      sensor: "Vibration",
      message: "ADXL345 reading 3.8g — approaching critical threshold (4.0g)",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      acknowledged: false,
    },
    {
      id: "3",
      type: "warning",
      sensor: "Voltage",
      message: "AC voltage fluctuation: 208V detected (below 210V threshold)",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: true,
    },
    {
      id: "4",
      type: "info",
      sensor: "Current",
      message: "SCT-013-100 reading stable at 18.5A — normal operating range",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      acknowledged: true,
    },
  ];
}

export function getGeneratorStatus(): GeneratorStatus {
  return {
    isRunning: true,
    runtime: 156.4,
    lastMaintenance: "2026-03-28",
    nextMaintenance: "2026-04-28",
    fuelConsumptionRate: 2.8,
    estimatedFuelRemaining: 8.5,
  };
}
