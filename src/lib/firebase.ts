import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCViHJCR0rCzJGDz2_BcYdKDk_B_34EQdA",
  authDomain: "guardianai-proto.firebaseapp.com",
  databaseURL: "https://guardianai-proto-default-rtdb.firebaseio.com",
  projectId: "guardianai-proto",
  storageBucket: "guardianai-proto.firebasestorage.app",
  messagingSenderId: "63056621918",
  appId: "1:63056621918:web:f512428749ba4f9fbf5fcf",
  measurementId: "G-7Z99YQW9NT",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const statusRef = ref(db, "/status");

export type StatusValue = "FIRE" | "ACCIDENT" | "UNSAFE" | "CLEAR" | string;

export const setStatus = (value: StatusValue) => set(statusRef, value);
export const subscribeStatus = (cb: (v: StatusValue | null) => void) =>
  onValue(statusRef, (snap) => cb(snap.val()));
