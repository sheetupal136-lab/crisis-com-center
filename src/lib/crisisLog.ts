export type CrisisType = "FIRE" | "ACCIDENT" | "UNSAFE";
export type CrisisSource = "manual" | "voice" | "ai" | "esp32" | "remote";

export interface CrisisRow {
  id: string;
  type: CrisisType;
  source: CrisisSource;
  transcript: string | null;
  location_text: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface LogCrisisInput {
  type: CrisisType;
  source: CrisisSource;
  transcript?: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = "guardianai-crisis-history";
const CHANGE_EVENT = "guardianai-crisis-history-change";

export function getCrisisEvents(): CrisisRow[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CrisisRow[]) : [];
  } catch {
    return [];
  }
}

function saveCrisisEvents(rows: CrisisRow[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // The dashboard still functions when browser storage is unavailable.
  }
}

export async function logCrisisEvent(input: LogCrisisInput) {
  const row: CrisisRow = {
    id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    type: input.type,
    source: input.source,
    transcript: input.transcript ?? null,
    location_text: input.location_text ?? "Hardoi Road, Lucknow",
    resolved_at: null,
    created_at: new Date().toISOString(),
  };
  saveCrisisEvents([row, ...getCrisisEvents()].slice(0, 100));
  return row;
}

export async function resolveActiveEvents() {
  const resolvedAt = new Date().toISOString();
  saveCrisisEvents(getCrisisEvents().map((row) =>
    row.resolved_at ? row : { ...row, resolved_at: resolvedAt },
  ));
}

export function subscribeCrisisEvents(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
