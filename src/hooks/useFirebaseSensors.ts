import { useState, useEffect } from "react";
import { onValue, ref, database } from "@/lib/firebase";
import type { SensorReading, Alert, GeneratorStatus, ActuatorState } from "@/lib/generator-data";
import { getGeneratorStatus, getActuatorState } from "@/lib/generator-data";

export function useFirebaseSensors() {
  // Initial state: Start with zero values (No more dummy data)
  const [currentReading, setCurrentReading] = useState<SensorReading>({
    timestamp: new Date().toISOString(),
    fuel: 0,
    voltage: 0,
    current: 0,
    vibration: 0,
    power: 0,
  });

  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [generatorStatus, setGeneratorStatus] = useState<GeneratorStatus>({ status: 'off', lastUpdate: new Date().toISOString() });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. LISTEN ONLY TO FIREBASE LIVE DATA
    const unsubCurrent = onValue(
      ref(database, "sensorData/current"), 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Firebase Live Data Received:", data);
          setCurrentReading({
            timestamp: data.timestamp || new Date().toISOString(),
            fuel: Number(data.fuel) || 0,
            voltage: Number(data.voltage) || 0,
            current: Number(data.current) || 0,
            vibration: Number(data.vibration) || 0,
            power: Number(data.power) || Number(((data.voltage * data.current) / 1000).toFixed(2)),
          });
          setIsConnected(true);
        }
      },
      (error) => {
        console.error("Firebase connection failed:", error);
        setIsConnected(false);
      }
    );

    return () => unsubCurrent();
  }, []);

  const actuatorState: ActuatorState = getActuatorState(currentReading);

  return {
    currentReading,
    historicalData,
    alerts,
    setAlerts,
    generatorStatus,
    actuatorState,
    isConnected,
  };
}