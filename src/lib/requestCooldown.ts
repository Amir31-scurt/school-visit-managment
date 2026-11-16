import { normalizeWhatsAppPhone } from './whatsapp';

const STORAGE_KEY = 'museum_recent_requests';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RecentRequestMap {
  [key: string]: number;
}

function buildKey(phone: string, preferredDate: string): string {
  return `${normalizeWhatsAppPhone(phone)}_${preferredDate}`;
}

function readValidEntries(now: number): RecentRequestMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as RecentRequestMap;
    const pruned: RecentRequestMap = {};
    for (const [k, ts] of Object.entries(parsed)) {
      if (typeof ts === 'number' && now - ts < COOLDOWN_MS) {
        pruned[k] = ts;
      }
    }
    return pruned;
  } catch {
    return {};
  }
}

/**
 * Returns true if a request with the same normalized phone and preferredDate
 * was already submitted from this browser within the last 24 hours.
 */
export function hasRecentRequest(phone: string, preferredDate: string): boolean {
  if (!phone || !preferredDate) return false;
  const now = Date.now();
  const entries = readValidEntries(now);
  const ts = entries[buildKey(phone, preferredDate)];
  return typeof ts === 'number' && now - ts < COOLDOWN_MS;
}

/**
 * Records a successful submission timestamp for (phone, preferredDate).
 */
export function recordRecentRequest(phone: string, preferredDate: string): void {
  if (!phone || !preferredDate) return;
  try {
    const now = Date.now();
    const entries = readValidEntries(now);
    entries[buildKey(phone, preferredDate)] = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

