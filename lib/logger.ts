export type LogLevel = "info" | "warn" | "error";

type LogData = Record<string, boolean | number | string | null | undefined>;

const SERVICE = "samosa-sheet-website";

export function logEvent(level: LogLevel, event: string, data: LogData = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE,
    event,
    ...data,
  };

  // Keep the payload structured so browser collectors can ingest it later.
  // Callers must only pass operational metadata, never customer-entered values.
  console[level](JSON.stringify(entry));
}

export function errorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}
