import { useState, useEffect } from "react";
import { onValue, ref, database } from "@/lib/firebase";
import type { SensorReading, Alert, GeneratorStatus, ActuatorState } from "@/lib/generator-data";
import {
  getGeneratorStatus,
  getActuatorState,
  generateCurrentReading,
  generateHistoricalData,
  generateAlerts,
} from "@/lib/generator-data";

export function useFirebaseSensors() {
  const [currentReading, setCurrentReading] = useState<SensorReading>(generateCurrentReading());
  const [historicalData, setHistoricalData] = useState<SensorReading[]>(generateHistoricalData(48));
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [generatorStatus, setGeneratorStatus] = useState<GeneratorStatus>(getGeneratorStatus());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Try Firebase - if connected use real data, else keep mock data
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
        // If no Firebase data, mock data already set in useState - no change needed
      },
      (error) => {
        console.error("Firebase not connected - using mock data:", error);
        setIsConnected(false);
        // Keep mock data as fallback
        setCurrentReading(generateCurrentReading());
        setHistoricalData(generateHistoricalData(48));
        setAlerts(generateAlerts());
        setGeneratorStatus(getGeneratorStatus());
      }
    );

    // Simulate live updates every 5 seconds when not connected to Firebase
    const mockInterval = setInterval(() => {
      if (!isConnected) {
        setCurrentReading(generateCurrentReading());
      }
    }, 5000);

    return () => {
      unsubCurrent();
      clearInterval(mockInterval);
    };
  }, [isConnected]);

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