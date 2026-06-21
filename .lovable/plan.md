## Backend plan for GuardianAI (Lovable Cloud)

I'll enable **Lovable Cloud** (managed Postgres + auth + edge functions) alongside your existing Firebase RTDB. Firebase keeps powering the live `/status` sync with the ESP32; Lovable Cloud handles persistence, auth, and outbound SMS.

### 1. Authentication
- Email + password signup/login (Google sign-in optional, can add later)
- Two roles: **responder** (full dashboard) and **family** (read-only crisis feed for their linked user)
- Roles live in a dedicated `user_roles` table (never on profiles — prevents privilege escalation)
- `profiles` table: `id`, `display_name`, `phone`, `emergency_contacts[]`
- Auto-create profile via trigger on signup
- New `/auth` page; dashboard becomes protected

### 2. Crisis log (Postgres)
Table `crisis_events`:
- `id`, `user_id`, `type` (FIRE / ACCIDENT / UNSAFE), `source` (manual / voice / ai / esp32), `transcript`, `location` (text + lat/lng), `created_at`, `resolved_at`
- RLS: users see their own events; responders see all
- Every protocol trigger (button click, voice SOS, AI classifier, Firebase remote signal) inserts a row
- New "Crisis History" panel on the dashboard with live updates via Supabase Realtime

### 3. ESP32 sensor telemetry
Table `sensor_readings`:
- `id`, `device_id`, `temperature_c`, `decibel`, `accel_x/y/z`, `created_at`
- Edge function `ingest-telemetry` (public, HMAC-signed) the ESP32 POSTs to
- Hardware cards (Thermal Matrix, Acoustic, Kinetic) read live values from this table instead of mocked numbers

### 4. Real SMS alerts (Twilio)
- Edge function `send-sos-sms` triggered by Voice Guardian SOS + PANIC button
- Sends to all `emergency_contacts` on the user's profile
- Uses the **Twilio connector** — I'll prompt you to link it when we get there (needs your Twilio account SID, API key, and a verified sender number)

### 5. RESET + UI polish (carries over from previous request)
- Adds the 4-card **Internal Hardware Architecture** section
- Full-screen red flash + "SOS DISPATCHED" popup on voice "Help" trigger
- Prominent **RESET TO SAFE** button (clears mode + writes `CLEAR` to Firebase + marks active event resolved)

### Order of execution
1. Enable Lovable Cloud
2. Create schema (profiles, user_roles, crisis_events, sensor_readings) + RLS + trigger
3. Build `/auth` page and route guard
4. Wire crisis logging into existing handlers
5. Build Crisis History panel + live telemetry into hardware cards
6. Add Hardware Architecture section + voice-flash + RESET button
7. Link Twilio connector and deploy `send-sos-sms` edge function

### One thing to confirm
For SMS: do you already have a **Twilio account with a sender number**? If not, we can build steps 1–6 now and skip SMS (the simulated SMS popup keeps working), then add Twilio later when you have an account.