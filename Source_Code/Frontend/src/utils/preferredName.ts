import { User } from 'firebase/auth';

const MAX_PREFERRED_NAME_LENGTH = 40;

function getStorageKey(user: User): string {
  return `preferred_name_${user.uid}`;
}

export function sanitizePreferredName(value: string): string {
  return value
    .replace(/[^\p{L}\p{M}\p{N} .'-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_PREFERRED_NAME_LENGTH);
}

function getEmailName(user: User): string {
  const emailName = user.email?.split('@')[0]?.replace(/[._-]+/g, ' ') || '';
  return sanitizePreferredName(emailName);
}

export function savePreferredName(user: User, value: string): string {
  const preferredName = sanitizePreferredName(value);

  if (preferredName) {
    try {
      localStorage.setItem(getStorageKey(user), preferredName);
    } catch {
      // Ignore storage errors and keep the in-memory value for this session.
    }
  }

  return preferredName;
}

export function getPreferredName(user: User | null): string {
  if (!user) return 'Student';

  try {
    const savedName = sanitizePreferredName(
      localStorage.getItem(getStorageKey(user)) || '',
    );

    if (savedName) return savedName;
  } catch {
    // Continue with Firebase fallbacks when storage is unavailable.
  }

  const firebaseName = sanitizePreferredName(user.displayName || '');
  return firebaseName || getEmailName(user) || 'Student';
}