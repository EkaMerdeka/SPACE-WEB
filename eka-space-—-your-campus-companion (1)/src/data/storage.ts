import {
  ProfileData,
  CertificateItem,
  DocumentFolder,
  DocumentItem,
  NoteItem,
  TaskItem,
  ScheduleItem,
  SnippetItem,
  AppSettings,
  AppBackupPayload,
  AppNotification,
} from '../types';
import {
  initialProfile,
  initialCertificates,
  initialFolders,
  initialDocuments,
  initialNotes,
  initialTasks,
  initialSchedules,
  initialSnippets,
  initialSettings,
} from './initialData';

const STORAGE_KEYS = {
  PROFILE: 'ekaspace_profile_v1',
  CERTIFICATES: 'ekaspace_certificates_v1',
  FOLDERS: 'ekaspace_folders_v1',
  DOCUMENTS: 'ekaspace_documents_v1',
  NOTES: 'ekaspace_notes_v1',
  TASKS: 'ekaspace_tasks_v1',
  SCHEDULES: 'ekaspace_schedules_v1',
  SNIPPETS: 'ekaspace_snippets_v1',
  SETTINGS: 'ekaspace_settings_v1',
  AUTH: 'ekaspace_auth_session_v1',
  CREDENTIALS: 'ekaspace_user_credentials_v1',
  SEARCH_HISTORY: 'ekaspace_search_history_v1',
  NOTIFICATIONS: 'ekaspace_notifications_v1',
};

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Pengingat Deadline Tugas',
    message: 'Tugas "Implementasi Room Database & Repository Pattern" jatuh tempo besok!',
    type: 'task',
    timestamp: Date.now() - 1000 * 60 * 30,
    isRead: false,
    actionTab: 'notes-tasks',
  },
  {
    id: 'notif-2',
    title: 'Jadwal Kuliah Hari Ini',
    message: 'Pemrograman Piranti Bergerak (Android) di Lab Komputer 304 jam 08:00.',
    type: 'schedule',
    timestamp: Date.now() - 1000 * 60 * 120,
    isRead: false,
    actionTab: 'schedule',
  },
  {
    id: 'notif-3',
    title: 'Sertifikat Terverifikasi',
    message: 'Google Associate Android Developer tersimpan rapi di Vault offline.',
    type: 'cert',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    isRead: true,
    actionTab: 'certificates',
  },
  {
    id: 'notif-4',
    title: 'Selamat Datang di EKA SPACE',
    message: 'Aplikasi siap digunakan offline di perangkat Xiaomi Redmi 14C Anda.',
    type: 'system',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    isRead: true,
    actionTab: 'dashboard',
  },
];

// Safe storage getter
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key} from localStorage`, err);
    return fallback;
  }
}

// Safe storage setter
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage`, err);
  }
}

export class AppStorageRepository {
  // Profile
  static getProfile(): ProfileData {
    const p = loadFromStorage(STORAGE_KEYS.PROFILE, initialProfile);
    // If previous demo data had the old sample name, clear it so user can input their own
    if (p.fullName === 'Eka Merdeka Putra') {
      const cleanProfile = {
        ...initialProfile,
        avatarUrl: p.avatarUrl || '',
      };
      this.saveProfile(cleanProfile);
      return cleanProfile;
    }
    return p;
  }
  static saveProfile(profile: ProfileData): void {
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
  }

  // Certificates
  static getCertificates(): CertificateItem[] {
    return loadFromStorage(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  }
  static saveCertificates(certs: CertificateItem[]): void {
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certs);
  }

  // Folders & Documents
  static getFolders(): DocumentFolder[] {
    return loadFromStorage(STORAGE_KEYS.FOLDERS, initialFolders);
  }
  static saveFolders(folders: DocumentFolder[]): void {
    saveToStorage(STORAGE_KEYS.FOLDERS, folders);
  }

  static getDocuments(): DocumentItem[] {
    return loadFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments);
  }
  static saveDocuments(docs: DocumentItem[]): void {
    saveToStorage(STORAGE_KEYS.DOCUMENTS, docs);
  }

  // Notes
  static getNotes(): NoteItem[] {
    return loadFromStorage(STORAGE_KEYS.NOTES, initialNotes);
  }
  static saveNotes(notes: NoteItem[]): void {
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  }

  // Tasks
  static getTasks(): TaskItem[] {
    return loadFromStorage(STORAGE_KEYS.TASKS, initialTasks);
  }
  static saveTasks(tasks: TaskItem[]): void {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }

  // Schedules
  static getSchedules(): ScheduleItem[] {
    return loadFromStorage(STORAGE_KEYS.SCHEDULES, initialSchedules);
  }
  static saveSchedules(schedules: ScheduleItem[]): void {
    saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
  }

  // Snippets
  static getSnippets(): SnippetItem[] {
    return loadFromStorage(STORAGE_KEYS.SNIPPETS, initialSnippets);
  }
  static saveSnippets(snippets: SnippetItem[]): void {
    saveToStorage(STORAGE_KEYS.SNIPPETS, snippets);
  }

  // Settings
  static getSettings(): AppSettings {
    return loadFromStorage(STORAGE_KEYS.SETTINGS, initialSettings);
  }
  static saveSettings(settings: AppSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  // Auth Credentials
  static getCredentials(): { username: string; passwordHash: string } {
    return loadFromStorage(STORAGE_KEYS.CREDENTIALS, {
      username: 'EKA',
      // Simple hashed representation for local demo security:
      passwordHash: 'EKA1708',
    });
  }
  static saveCredentials(username: string, passwordHash: string): void {
    saveToStorage(STORAGE_KEYS.CREDENTIALS, { username, passwordHash });
  }

  // Session
  static isLoggedIn(): boolean {
    const session = this.getSession();
    if (session?.isLoggedIn) return true;
    try {
      return localStorage.getItem('ekaspace_is_authenticated') === 'true';
    } catch {
      return false;
    }
  }

  static getSession(): { isLoggedIn: boolean; user: string; loginTime: number } | null {
    const session = loadFromStorage<{ isLoggedIn: boolean; user: string; loginTime: number } | null>(
      STORAGE_KEYS.AUTH,
      null
    );
    if (session && session.isLoggedIn) return session;

    try {
      const isAuth = localStorage.getItem('ekaspace_is_authenticated') === 'true';
      if (isAuth) {
        const user = localStorage.getItem('ekaspace_current_user') || 'EKA';
        return { isLoggedIn: true, user, loginTime: Date.now() };
      }
    } catch {
      // ignore
    }
    return null;
  }

  static saveSession(user: string): void {
    const sessionData = {
      isLoggedIn: true,
      user: user || 'EKA',
      loginTime: Date.now(),
    };
    saveToStorage(STORAGE_KEYS.AUTH, sessionData);
    try {
      localStorage.setItem('ekaspace_is_authenticated', 'true');
      localStorage.setItem('ekaspace_current_user', user || 'EKA');
    } catch (e) {
      console.warn('Failed to set localStorage auth flag', e);
    }
  }

  static clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    try {
      localStorage.removeItem('ekaspace_is_authenticated');
      localStorage.removeItem('ekaspace_current_user');
    } catch (e) {
      console.warn('Failed to remove localStorage auth flag', e);
    }
  }

  // Search History
  static getSearchHistory(): string[] {
    return loadFromStorage(STORAGE_KEYS.SEARCH_HISTORY, ['Kotlin', 'Basis Data', 'Hackathon', 'Sistem']);
  }
  static addSearchHistory(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getSearchHistory();
    const current = this.getSearchHistory().filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...current].slice(0, 10);
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updated);
    return updated;
  }
  static clearSearchHistory(): void {
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    return loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
  static saveNotifications(notifs: AppNotification[]): void {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
  static markNotificationAsRead(id: string): AppNotification[] {
    const notifs = this.getNotifications().map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveNotifications(notifs);
    return notifs;
  }
  static markAllNotificationsAsRead(): AppNotification[] {
    const notifs = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(notifs);
    return notifs;
  }
  static clearNotifications(): void {
    this.saveNotifications([]);
  }

  // Reset to initial demo data
  static resetAllToDemo(): void {
    this.saveProfile(initialProfile);
    this.saveCertificates(initialCertificates);
    this.saveFolders(initialFolders);
    this.saveDocuments(initialDocuments);
    this.saveNotes(initialNotes);
    this.saveTasks(initialTasks);
    this.saveSchedules(initialSchedules);
    this.saveSnippets(initialSnippets);
    this.saveSettings(initialSettings);
    this.saveCredentials('EKA', 'EKA1708');
  }

  // Clear all data (blank state)
  static clearAllData(): void {
    this.saveProfile({
      ...initialProfile,
      fullName: 'Mahasiswa Baru',
      nickname: 'User',
      studentId: '',
      major: '',
      faculty: '',
      university: '',
      semester: 1,
      batchYear: '2024',
      email: '',
      phone: '',
      bio: '',
      interests: [],
      skills: [],
      academicGoals: '',
    });
    this.saveCertificates([]);
    this.saveFolders([]);
    this.saveDocuments([]);
    this.saveNotes([]);
    this.saveTasks([]);
    this.saveSchedules([]);
    this.saveSnippets([]);
    this.clearSearchHistory();
  }

  // Storage breakdown calculations
  static getStorageBreakdown(): {
    certificatesBytes: number;
    documentsBytes: number;
    notesBytes: number;
    snippetsBytes: number;
    totalBytes: number;
  } {
    const certs = this.getCertificates();
    const docs = this.getDocuments();
    const notes = this.getNotes();
    const snippets = this.getSnippets();

    const certificatesBytes = certs.reduce((acc, c) => acc + (c.fileSize || 1200000), 0);
    const documentsBytes = docs.reduce((acc, d) => acc + (d.fileSize || 1800000), 0);
    const notesBytes = notes.reduce((acc, n) => acc + new Blob([n.content]).size + 1024, 0);
    const snippetsBytes = snippets.reduce((acc, s) => acc + new Blob([s.code]).size + 1024, 0);
    const totalBytes = certificatesBytes + documentsBytes + notesBytes + snippetsBytes;

    return {
      certificatesBytes,
      documentsBytes,
      notesBytes,
      snippetsBytes,
      totalBytes,
    };
  }

  // Full Backup Package
  static generateBackup(): AppBackupPayload {
    return {
      version: '1.0.0-android16',
      appName: 'EKA SPACE',
      timestamp: Date.now(),
      profile: this.getProfile(),
      certificates: this.getCertificates(),
      folders: this.getFolders(),
      documents: this.getDocuments(),
      notes: this.getNotes(),
      tasks: this.getTasks(),
      schedules: this.getSchedules(),
      snippets: this.getSnippets(),
      settings: this.getSettings(),
    };
  }

  // Restore validation and execution
  static restoreBackup(payload: any): { success: boolean; message: string; summary?: any } {
    if (!payload || typeof payload !== 'object') {
      return { success: false, message: 'File backup rusak atau format tidak valid.' };
    }
    if (!payload.profile || !Array.isArray(payload.certificates) || !Array.isArray(payload.tasks)) {
      return { success: false, message: 'Struktur manifest backup tidak sesuai spesifikasi EKA SPACE.' };
    }

    try {
      this.saveProfile(payload.profile);
      this.saveCertificates(payload.certificates);
      this.saveFolders(payload.folders || []);
      this.saveDocuments(payload.documents || []);
      this.saveNotes(payload.notes || []);
      this.saveTasks(payload.tasks || []);
      this.saveSchedules(payload.schedules || []);
      this.saveSnippets(payload.snippets || []);
      if (payload.settings) {
        this.saveSettings(payload.settings);
      }

      const summary = {
        certificates: payload.certificates.length,
        documents: (payload.documents || []).length,
        notes: (payload.notes || []).length,
        tasks: (payload.tasks || []).length,
        schedules: (payload.schedules || []).length,
        snippets: (payload.snippets || []).length,
      };

      return {
        success: true,
        message: 'Pemulihan data berhasil! Semua vault telah disinkronkan.',
        summary,
      };
    } catch (err: any) {
      return { success: false, message: `Gagal memulihkan data: ${err.message || 'Kesalahan penyimpanan'}` };
    }
  }
}
