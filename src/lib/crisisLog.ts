import { supabase } from "@/integrations/supabase/client";

export type CrisisType = "FIRE" | "ACCIDENT" | "UNSAFE";
export type CrisisSource = "manual" | "voice" | "ai" | "esp32" | "remote";

export interface LogCrisisInput {
  type: CrisisType;
  source: CrisisSource;
  transcript?: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, any>;
}

export async function logCrisisEvent(input: LogCrisisInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("crisis_events")
    .insert({
      user_id: user.id,
      type: input.type,
      source: input.source,
      transcript: input.transcript ?? null,
      location_text: input.location_text ?? "Hardoi Road, Lucknow",
      latitude: input.latitude ?? 26.8467,
      longitude: input.longitude ?? 80.9462,
      metadata: input.metadata ?? {},
    })
    .select()
    .single();
  if (error) console.error("logCrisisEvent failed:", error);
  return data;
}

export async function resolveActiveEvents() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("crisis_events")
    .update({ resolved_at: new Date().toISOString() })
    .is("resolved_at", null)
    .eq("user_id", user.id);
  if (error) console.error("resolveActiveEvents failed:", error);
}
