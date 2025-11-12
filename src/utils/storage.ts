import { GradingSession, StorageResult, StorageValue } from '@/types';

// Storage key prefix
const SESSION_PREFIX = 'grading_session:';

/**
 * Check if storage is available
 */
const isStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'storage' in window;
  } catch {
    return false;
  }
};

/**
 * List all saved sessions
 */
export const loadSavedSessions = async (): Promise<GradingSession[]> => {
  if (!isStorageAvailable()) {
    console.warn('Storage not available');
    return [];
  }

  try {
    const result = (await (window as any).storage.list(SESSION_PREFIX)) as StorageResult;

    if (!result || !result.keys || !Array.isArray(result.keys)) {
      return [];
    }

    const sessions: GradingSession[] = [];

    for (const key of result.keys) {
      try {
        const data = (await (window as any).storage.get(key)) as StorageValue;
        if (data && data.value) {
          sessions.push(JSON.parse(data.value));
        }
      } catch (e) {
        console.log('Failed to load session:', key);
      }
    }

    // Sort by timestamp, newest first
    return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
};

/**
 * Save a session
 */
export const saveSession = async (session: GradingSession): Promise<void> => {
  if (!isStorageAvailable()) {
    throw new Error('Storage not available');
  }

  try {
    await (window as any).storage.set(`${SESSION_PREFIX}${session.id}`, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

/**
 * Load a specific session
 */
export const loadSession = async (sessionId: string): Promise<GradingSession | null> => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const data = (await (window as any).storage.get(`${SESSION_PREFIX}${sessionId}`)) as StorageValue;
    if (data && data.value) {
      return JSON.parse(data.value);
    }
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  if (!isStorageAvailable()) {
    throw new Error('Storage not available');
  }

  try {
    await (window as any).storage.delete(`${SESSION_PREFIX}${sessionId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
