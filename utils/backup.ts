import { useAppStore } from '@/store/useAppStore';

const LAST_BACKUP_KEY = 'check-cham-chi-last-backup';

export function getLastBackupDate(): Date | null {
  // Kiểm tra an toàn cho môi trường Server
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(LAST_BACKUP_KEY);
  return stored ? new Date(stored) : null;
}

export function updateLastBackupDate() {
  // Kiểm tra an toàn cho môi trường Server
  if (typeof window === 'undefined') return;

  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export function shouldRemindBackup(): boolean {
  // Kiểm tra an toàn cho môi trường Server
  if (typeof window === 'undefined') return false;

  const last = getLastBackupDate();
  if (!last) return true;
  const daysSinceLast = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceLast >= 7;
}

export function autoBackup() {
  // Kiểm tra an toàn cho môi trường Server
  if (typeof window === 'undefined') return;

  const state = useAppStore.getState();
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `check-cham-chi-auto-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  updateLastBackupDate();
}