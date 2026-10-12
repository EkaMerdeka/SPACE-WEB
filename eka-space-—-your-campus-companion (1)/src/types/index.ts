export interface ProfileData {
  fullName: string;
  nickname: string;
  studentId: string; // NIM
  major: string; // Program Studi
  faculty: string;
  university: string;
  semester: number;
  batchYear: string; // Angkatan
  email: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  interests: string[];
  skills: string[];
  academicGoals: string;
}

export type CertificateCategory =
  | 'Seminar'
  | 'Webinar'
  | 'Bootcamp'
  | 'Kursus online'
  | 'Kompetisi'
  | 'Organisasi'
  | 'Kepanitiaan'
  | 'Magang'
  | 'Akademik'
  | 'Lainnya';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string; // Penyelenggara
  eventName: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate?: string;
  category: CertificateCategory;
  certificateNumber?: string;
  verificationUrl?: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  fileType: 'pdf' | 'jpg' | 'png';
  fileName: string;
  fileSize: number; // in bytes
  fileData?: string; // base64 data uri or sample placeholder
  createdAt: number;
  updatedAt: number;
}

export type DocumentCategory =
  | 'Materi kuliah'
  | 'Modul praktikum'
  | 'Tugas'
  | 'Laporan'
  | 'Presentasi'
  | 'Jurnal'
  | 'Referensi'
  | 'Administrasi kampus'
  | 'Dokumen pribadi'
  | 'Lainnya';

export interface DocumentFolder {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  folderId?: string | null;
  category: DocumentCategory;
  fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'txt' | 'zip' | 'jpg' | 'png' | 'other';
  fileName: string;
  fileSize: number;
  fileData?: string;
  courseName?: string;
  description?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NoteItem {
  id: string;
  title: string;
  courseName: string;
  category: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export type TaskPriority = 'Rendah' | 'Sedang' | 'Tinggi';
export type TaskStatus = 'Belum dimulai' | 'Sedang dikerjakan' | 'Selesai';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  courseName: string;
  deadline: string; // ISO string with time
  priority: TaskPriority;
  status: TaskStatus;
  attachmentName?: string;
  createdAt: number;
  completedAt?: number;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface ScheduleItem {
  id: string;
  courseName: string;
  lecturer?: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room: string;
  building?: string;
  color: string;
  notes?: string;
}

export type ProgrammingLanguage =
  | 'Kotlin'
  | 'Java'
  | 'Python'
  | 'JavaScript'
  | 'TypeScript'
  | 'C'
  | 'C++'
  | 'HTML'
  | 'CSS'
  | 'SQL'
  | 'PHP'
  | 'Dart'
  | 'Bash'
  | 'JSON';

export type SnippetCategory =
  | 'Algoritma'
  | 'Struktur data'
  | 'UI'
  | 'API'
  | 'Database'
  | 'Authentication'
  | 'Debugging'
  | 'Utility'
  | 'Tugas kuliah'
  | 'Project pribadi';

export interface SnippetItem {
  id: string;
  title: string;
  language: ProgrammingLanguage;
  code: string;
  description: string;
  category: SnippetCategory;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  showRedmiFrame: boolean;
  pinLockEnabled: boolean;
  savedPin: string;
  reducedMotion: boolean;
  notificationEnabled: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'schedule' | 'cert' | 'system';
  timestamp: number;
  isRead: boolean;
  actionTab?: NavigationTab;
}

export interface AppBackupPayload {
  version: string;
  appName: string;
  timestamp: number;
  profile: ProfileData;
  certificates: CertificateItem[];
  folders: DocumentFolder[];
  documents: DocumentItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  schedules: ScheduleItem[];
  snippets: SnippetItem[];
  settings: AppSettings;
}

export type NavigationTab =
  | 'dashboard'
  | 'certificates'
  | 'notes-tasks'
  | 'coding'
  | 'profile'
  | 'documents'
  | 'schedule'
  | 'search'
  | 'settings'
  | 'backup'
  | 'android-project';
