import {
  INITIAL_DAILY_LOG,
  INITIAL_REMINDERS,
  INITIAL_USER_PROFILE,
  INITIAL_VACCINES,
  INITIAL_WEEKLY_HISTORY
} from '../data/initialData';
import { AssessmentResult, DailyLog, DayMetricPoint, ReminderItem, UserProfile, VaccineRecord } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const scopedKey = (key: string) => `lifeshield:${localStorage.getItem('lifeshield_active_email') || 'guest'}:${key}`;

async function persistRemote(key: string, value: unknown): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/state/${encodeURIComponent(key)}`, {
      method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: JSON.stringify(value) })
    });
    if (!response.ok) console.warn(`LifeShield API save failed for ${key}:`, response.status);
  } catch (error) {
    // The dashboard remains usable offline; data is still saved in localStorage.
    console.warn('LifeShield API is unavailable; saved locally for now.', error);
  }
}

export async function syncWithBackend(): Promise<void> {
  const response = await fetch(`${API_BASE}/state`, { credentials: 'include' });
  if (!response.ok) throw new Error(`Backend returned ${response.status}`);
  const remote: Record<string, string> = await response.json();
  for (const key of Object.values(KEYS)) {
    const local = localStorage.getItem(scopedKey(key));
    if (Object.prototype.hasOwnProperty.call(remote, key)) {
      localStorage.setItem(scopedKey(key), remote[key]);
    } else if (local !== null) {
      await persistRemote(key, JSON.parse(local));
    }
  }
}

const KEYS = {
  PROFILE: 'lifeshield_user_profile',
  DAILY_LOG: 'lifeshield_daily_log',
  WEEKLY_HISTORY: 'lifeshield_weekly_history',
  VACCINES: 'lifeshield_vaccines',
  REMINDERS: 'lifeshield_reminders',
  ASSESSMENTS: 'lifeshield_assessments'
};

export function loadUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.PROFILE));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load profile from localStorage', e);
  }
  return INITIAL_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(scopedKey(KEYS.PROFILE), JSON.stringify(profile));
    void persistRemote(KEYS.PROFILE, profile);
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadDailyLog(): DailyLog {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.DAILY_LOG));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load daily log', e);
  }
  return INITIAL_DAILY_LOG;
}

export function saveDailyLog(log: DailyLog): void {
  try {
    localStorage.setItem(scopedKey(KEYS.DAILY_LOG), JSON.stringify(log));
    void persistRemote(KEYS.DAILY_LOG, log);
  } catch (e) {
    console.error('Failed to save daily log', e);
  }
}

export function loadWeeklyHistory(): DayMetricPoint[] {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.WEEKLY_HISTORY));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load weekly history', e);
  }
  return INITIAL_WEEKLY_HISTORY;
}

export function saveWeeklyHistory(history: DayMetricPoint[]): void {
  try {
    localStorage.setItem(scopedKey(KEYS.WEEKLY_HISTORY), JSON.stringify(history));
    void persistRemote(KEYS.WEEKLY_HISTORY, history);
  } catch (e) {
    console.error('Failed to save weekly history', e);
  }
}

export function loadVaccines(): VaccineRecord[] {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.VACCINES));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load vaccines', e);
  }
  return INITIAL_VACCINES;
}

export function saveVaccines(vaccines: VaccineRecord[]): void {
  try {
    localStorage.setItem(scopedKey(KEYS.VACCINES), JSON.stringify(vaccines));
    void persistRemote(KEYS.VACCINES, vaccines);
  } catch (e) {
    console.error('Failed to save vaccines', e);
  }
}

export function loadReminders(): ReminderItem[] {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.REMINDERS));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load reminders', e);
  }
  return INITIAL_REMINDERS;
}

export function saveReminders(reminders: ReminderItem[]): void {
  try {
    localStorage.setItem(scopedKey(KEYS.REMINDERS), JSON.stringify(reminders));
    void persistRemote(KEYS.REMINDERS, reminders);
  } catch (e) {
    console.error('Failed to save reminders', e);
  }
}

export function loadAssessments(): AssessmentResult[] {
  try {
    const saved = localStorage.getItem(scopedKey(KEYS.ASSESSMENTS));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load assessments', e);
  }
  return [];
}

export function saveAssessmentResult(result: AssessmentResult): void {
  try {
    const current = loadAssessments();
    const updated = [result, ...current.slice(0, 9)]; // keep up to 10 historical records
    localStorage.setItem(scopedKey(KEYS.ASSESSMENTS), JSON.stringify(updated));
    void persistRemote(KEYS.ASSESSMENTS, updated);
  } catch (e) {
    console.error('Failed to save assessment', e);
  }
}
