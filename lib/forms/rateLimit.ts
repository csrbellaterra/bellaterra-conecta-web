/**
 * Rate limiting básico en memoria para /api/forms/submit.
 *
 * Limitación conocida: al vivir en memoria del proceso, no es fiable
 * entre invocaciones frías de funciones serverless en Vercel (cada
 * instancia tiene su propio contador). Es una primera barrera
 * razonable contra spam automatizado simple, no una solución
 * definitiva — si el spam se vuelve un problema real, sustituir por
 * un store compartido (ej. Upstash Redis) manteniendo la misma
 * función `checkRateLimit(key)`.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    hits.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true };
}
