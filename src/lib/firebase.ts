import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get, query, orderByChild, limitToLast, type DatabaseReference } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBjmbApF3JbzaHx8Slai1_aJkmIcucW8I",
  authDomain: "generator-monitoring-sys-41355.firebaseapp.com",
  databaseURL: "https://generator-monitoring-sys-41355-default-rtdb.firebaseio.com",
  projectId: "generator-monitoring-sys-41355",
  storageBucket: "generator-monitoring-sys-41355.firebasestorage.app",
  messagingSenderId: "719398923310",
  appId: "1:719398923310:web:5e8f5e126007c29b34c3bf",
  measurementId: "G-LFVPSHDJ7D",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const sensorDataRef = ref(database, "sensorData/current");
export const sensorHistoryRef = ref(database, "sensorData/history");
export const alertsRef = ref(database, "alerts");
export const generatorStatusRef = ref(database, "generatorStatus");

export { ref, onValue, set, get, query, orderByChild, limitToLast };
export type { DatabaseReference };
