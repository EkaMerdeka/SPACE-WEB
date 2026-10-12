import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/layout/MobileFrame';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { CertificatesScreen } from './components/screens/CertificatesScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { NotesAndTasksScreen } from './components/screens/NotesAndTasksScreen';
import { CodingScreen } from './components/screens/CodingScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { BackupScreen } from './components/screens/BackupScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AndroidProjectScreen } from './components/screens/AndroidProjectScreen';
import { NotificationModal } from './components/common/NotificationModal';
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
  NavigationTab,
  AppNotification,
} from './types';
import { AppStorageRepository } from './data/storage';
import {
  Award,
  BookOpen,
  CheckSquare,
  Code2,
  Calendar,
  X,
  FileText,
  Plus,
} from 'lucide-react';

export default function App() {
  // Always show the welcome animation on launch/refresh, then transition to main if logged in!
  const [appStage, setAppStage] = useState<'splash' | 'login' | 'main'>('splash');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [previousTab, setPreviousTab] = useState<NavigationTab>('dashboard');

  // Vault data state
  const [profile, setProfile] = useState<ProfileData>(AppStorageRepository.getProfile());
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    AppStorageRepository.getCertificates()
  );
  const [folders, setFolders] = useState<DocumentFolder[]>(AppStorageRepository.getFolders());
  const [documents, setDocuments] = useState<DocumentItem[]>(
    AppStorageRepository.getDocuments()
  );
  const [notes, setNotes] = useState<NoteItem[]>(AppStorageRepository.getNotes());
  const [tasks, setTasks] = useState<TaskItem[]>(AppStorageRepository.getTasks());
  const [schedules, setSchedules] = useState<ScheduleItem[]>(
    AppStorageRepository.getSchedules()
  );
  const [snippets, setSnippets] = useState<SnippetItem[]>(AppStorageRepository.getSnippets());
  const [settings, setSettings] = useState<AppSettings>(AppStorageRepository.getSettings());
  const [notifications, setNotifications] = useState<AppNotification[]>(
    AppStorageRepository.getNotifications()
  );
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Quick Action Sheet modal
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Selected item for deep preview
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<CertificateItem | null>(null);

  // Initial load check
  useEffect(() => {
    const session = AppStorageRepository.getSession();
    // After splash, if user had active session, can proceed to main
    // Splash screen handles timing
  }, []);

  const refreshAllStateFromStorage = () => {
    setProfile(AppStorageRepository.getProfile());
    setCertificates(AppStorageRepository.getCertificates());
    setFolders(AppStorageRepository.getFolders());
    setDocuments(AppStorageRepository.getDocuments());
    setNotes(AppStorageRepository.getNotes());
    setTasks(AppStorageRepository.getTasks());
    setSchedules(AppStorageRepository.getSchedules());
    setSnippets(AppStorageRepository.getSnippets());
    setSettings(AppStorageRepository.getSettings());
    setNotifications(AppStorageRepository.getNotifications());
  };

  const handleSplashFinish = () => {
    refreshAllStateFromStorage();
    if (AppStorageRepository.isLoggedIn()) {
      setAppStage('main');
    } else {
      setAppStage('login');
    }
  };

  const handleLoginSuccess = (user: string) => {
    refreshAllStateFromStorage();
    setAppStage('main');
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    AppStorageRepository.clearSession();
    setAppStage('login');
  };

  const navigateTo = (tab: NavigationTab) => {
    setPreviousTab(currentTab);
    setCurrentTab(tab);
    setIsQuickAddOpen(false);
  };

  const handleBack = () => {
    if (
      currentTab === 'documents' ||
      currentTab === 'schedule' ||
      currentTab === 'search' ||
      currentTab === 'backup' ||
      currentTab === 'settings' ||
      currentTab === 'android-project'
    ) {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // State mutators with automatic persistence
  const handleUpdateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    AppStorageRepository.saveProfile(newProfile);
  };

  const handleAddCertificate = (cert: CertificateItem) => {
    const updated = [cert, ...certificates];
    setCertificates(updated);
    AppStorageRepository.saveCertificates(updated);
  };

  const handleUpdateCertificate = (cert: CertificateItem) => {
    const updated = certificates.map((c) => (c.id === cert.id ? cert : c));
    setCertificates(updated);
    AppStorageRepository.saveCertificates(updated);
  };

  const handleDeleteCertificate = (id: string) => {
    const updated = certificates.filter((c) => c.id !== id);
    setCertificates(updated);
    AppStorageRepository.saveCertificates(updated);
  };

  // Documents
  const handleAddDocument = (doc: DocumentItem) => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    AppStorageRepository.saveDocuments(updated);
  };

  const handleUpdateDocument = (doc: DocumentItem) => {
    const updated = documents.map((d) => (d.id === doc.id ? doc : d));
    setDocuments(updated);
    AppStorageRepository.saveDocuments(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    AppStorageRepository.saveDocuments(updated);
  };

  const handleAddFolder = (folder: DocumentFolder) => {
    const updated = [...folders, folder];
    setFolders(updated);
    AppStorageRepository.saveFolders(updated);
  };

  const handleDeleteFolder = (folderId: string) => {
    const updated = folders.filter((f) => f.id !== folderId);
    setFolders(updated);
    AppStorageRepository.saveFolders(updated);
  };

  // Notes
  const handleAddNote = (note: NoteItem) => {
    const updated = [note, ...notes];
    setNotes(updated);
    AppStorageRepository.saveNotes(updated);
  };

  const handleUpdateNote = (note: NoteItem) => {
    const updated = notes.map((n) => (n.id === note.id ? note : n));
    setNotes(updated);
    AppStorageRepository.saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    AppStorageRepository.saveNotes(updated);
  };

  // Tasks
  const handleAddTask = (task: TaskItem) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    AppStorageRepository.saveTasks(updated);
  };

  const handleUpdateTask = (task: TaskItem) => {
    const updated = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updated);
    AppStorageRepository.saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    AppStorageRepository.saveTasks(updated);
  };

  // Schedules
  const handleAddSchedule = (schedule: ScheduleItem) => {
    const updated = [...schedules, schedule];
    setSchedules(updated);
    AppStorageRepository.saveSchedules(updated);
  };

  const handleUpdateSchedule = (schedule: ScheduleItem) => {
    const updated = schedules.map((s) => (s.id === schedule.id ? schedule : s));
    setSchedules(updated);
    AppStorageRepository.saveSchedules(updated);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    AppStorageRepository.saveSchedules(updated);
  };

  // Snippets
  const handleAddSnippet = (snippet: SnippetItem) => {
    const updated = [snippet, ...snippets];
    setSnippets(updated);
    AppStorageRepository.saveSnippets(updated);
  };

  const handleUpdateSnippet = (snippet: SnippetItem) => {
    const updated = snippets.map((s) => (s.id === snippet.id ? snippet : s));
    setSnippets(updated);
    AppStorageRepository.saveSnippets(updated);
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    AppStorageRepository.saveSnippets(updated);
  };

  // Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    AppStorageRepository.saveSettings(newSettings);
  };

  const handleResetData = () => {
    AppStorageRepository.resetAllToDemo();
    refreshAllStateFromStorage();
  };

  const handleClearData = () => {
    AppStorageRepository.clearAllData();
    refreshAllStateFromStorage();
  };

  const isDarkMode = settings.theme !== 'light';

  const getScreenTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'EKA SPACE';
      case 'certificates':
        return 'Sertifikat Prestasi';
      case 'documents':
        return 'Dokumen Kampus';
      case 'notes-tasks':
        return 'Catatan & Tugas';
      case 'coding':
        return 'Coding Vault';
      case 'profile':
        return 'Profil Mahasiswa';
      case 'schedule':
        return 'Jadwal Kuliah';
      case 'search':
        return 'Pencarian Global';
      case 'backup':
        return 'Cadangan & Pemulihan';
      case 'settings':
        return 'Pengaturan Aplikasi';
      case 'android-project':
        return 'Android Studio Project';
      default:
        return 'EKA SPACE';
    }
  };

  const getScreenSubtitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Your Campus Companion · Redmi 14C';
      case 'certificates':
        return `${certificates.length} sertifikat tersimpan`;
      case 'documents':
        return `${documents.length} berkas akademik`;
      case 'notes-tasks':
        return `${tasks.filter((t) => t.status !== 'Selesai').length} tugas aktif`;
      case 'coding':
        return `${snippets.length} snippet kode`;
      case 'profile':
        return `${profile.studentId} · ${profile.major}`;
      case 'schedule':
        return `${schedules.length} mata kuliah mingguan`;
      case 'search':
        return 'Pencarian terintegrasi 6 vault';
      case 'backup':
        return 'Offline-First Local Storage';
      case 'settings':
        return 'Android 16 API Level 36';
      case 'android-project':
        return 'Kotlin & Jetpack Compose Native';
      default:
        return '';
    }
  };

  const isSubScreen =
    currentTab === 'documents' ||
    currentTab === 'schedule' ||
    currentTab === 'search' ||
    currentTab === 'backup' ||
    currentTab === 'settings' ||
    currentTab === 'android-project';

  return (
    <MobileFrame
      activeScreenTitle={getScreenTitle()}
      onOpenSearch={() => navigateTo('search')}
      onOpenAndroidExport={() => navigateTo('android-project')}
      onOpenSettings={() => navigateTo('settings')}
      isDarkMode={isDarkMode}
      onToggleTheme={() =>
        handleUpdateSettings({
          ...settings,
          theme: isDarkMode ? 'light' : 'dark',
        })
      }
    >
      {/* 1. Splash Screen Stage */}
      {appStage === 'splash' && (
        <SplashScreen
          onFinish={handleSplashFinish}
          reducedMotion={settings.reducedMotion}
        />
      )}

      {/* 2. Login Screen Stage */}
      {appStage === 'login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} />
      )}

      {/* 3. Main App Stage */}
      {appStage === 'main' && (
        <div className="flex flex-col h-full w-full">
          {/* Top Header */}
          <TopHeader
            title={getScreenTitle()}
            subtitle={getScreenSubtitle()}
            canGoBack={isSubScreen}
            onBack={handleBack}
            onOpenSearch={() => navigateTo('search')}
            onOpenDocuments={() => navigateTo('documents')}
            onOpenSchedule={() => navigateTo('schedule')}
            onOpenSettings={() => navigateTo('settings')}
            onOpenBackup={() => navigateTo('backup')}
            onOpenAndroidExport={() => navigateTo('android-project')}
            onOpenNotifications={() => setIsNotificationModalOpen(true)}
            unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
            isDarkMode={isDarkMode}
          />

          {/* Active Screen View */}
          <div className="flex-1 overflow-y-auto">
            {currentTab === 'dashboard' && (
              <DashboardScreen
                profile={profile}
                certificates={certificates}
                documents={documents}
                notes={notes}
                tasks={tasks}
                schedules={schedules}
                snippets={snippets}
                onNavigate={navigateTo}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                onOpenSearch={() => navigateTo('search')}
                onSelectCertificate={(cert) => {
                  setSelectedCertForPreview(cert);
                  navigateTo('certificates');
                }}
                onSelectTask={(task) => navigateTo('notes-tasks')}
                onSelectSnippet={(snip) => navigateTo('coding')}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'certificates' && (
              <CertificatesScreen
                certificates={certificates}
                onAddCertificate={handleAddCertificate}
                onUpdateCertificate={handleUpdateCertificate}
                onDeleteCertificate={handleDeleteCertificate}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsScreen
                documents={documents}
                folders={folders}
                onAddDocument={handleAddDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
                onAddFolder={handleAddFolder}
                onDeleteFolder={handleDeleteFolder}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'notes-tasks' && (
              <NotesAndTasksScreen
                notes={notes}
                tasks={tasks}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'coding' && (
              <CodingScreen
                snippets={snippets}
                onAddSnippet={handleAddSnippet}
                onUpdateSnippet={handleUpdateSnippet}
                onDeleteSnippet={handleDeleteSnippet}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'schedule' && (
              <ScheduleScreen
                schedules={schedules}
                onAddSchedule={handleAddSchedule}
                onUpdateSchedule={handleUpdateSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'search' && (
              <SearchScreen
                certificates={certificates}
                documents={documents}
                notes={notes}
                tasks={tasks}
                schedules={schedules}
                snippets={snippets}
                onNavigate={navigateTo}
                onSelectCertificate={(cert) => {
                  setSelectedCertForPreview(cert);
                  navigateTo('certificates');
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'backup' && (
              <BackupScreen
                onDataRestored={refreshAllStateFromStorage}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                onClearData={handleClearData}
                onNavigateToAndroidProject={() => navigateTo('android-project')}
                isDarkMode={isDarkMode}
                onToggleTheme={() =>
                  handleUpdateSettings({
                    ...settings,
                    theme: isDarkMode ? 'light' : 'dark',
                  })
                }
              />
            )}

            {currentTab === 'android-project' && (
              <AndroidProjectScreen isDarkMode={isDarkMode} />
            )}
          </div>

          {/* Bottom Navigation Bar */}
          <BottomNavigation
            currentTab={currentTab}
            onTabChange={navigateTo}
            activeTasksCount={tasks.filter((t) => t.status !== 'Selesai').length}
            onQuickAdd={() => setIsQuickAddOpen(true)}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Quick Add Action Sheet Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-3">
          <div className="w-full max-w-sm bg-[#111728] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs uppercase text-slate-400">
                Tambah Data Cepat
              </span>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigateTo('certificates')}
                className="p-3 rounded-xl bg-[#162036] hover:bg-purple-950/40 border border-slate-700/60 text-left transition-colors"
              >
                <Award className="w-5 h-5 text-purple-400 mb-1" />
                <div className="font-bold text-white">+ Sertifikat</div>
                <div className="text-[10px] text-slate-400">Prestasi / Seminar</div>
              </button>

              <button
                onClick={() => navigateTo('notes-tasks')}
                className="p-3 rounded-xl bg-[#162036] hover:bg-cyan-950/40 border border-slate-700/60 text-left transition-colors"
              >
                <CheckSquare className="w-5 h-5 text-cyan-400 mb-1" />
                <div className="font-bold text-white">+ Tugas Kuliah</div>
                <div className="text-[10px] text-slate-400">Deadline & Prioritas</div>
              </button>

              <button
                onClick={() => navigateTo('notes-tasks')}
                className="p-3 rounded-xl bg-[#162036] hover:bg-amber-950/40 border border-slate-700/60 text-left transition-colors"
              >
                <BookOpen className="w-5 h-5 text-amber-400 mb-1" />
                <div className="font-bold text-white">+ Catatan</div>
                <div className="text-[10px] text-slate-400">Materi Kuliah</div>
              </button>

              <button
                onClick={() => navigateTo('coding')}
                className="p-3 rounded-xl bg-[#162036] hover:bg-emerald-950/40 border border-slate-700/60 text-left transition-colors"
              >
                <Code2 className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="font-bold text-white">+ Snippet Kode</div>
                <div className="text-[10px] text-slate-400">Kotlin, Py, JS, SQL</div>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* In-App Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          const updated = AppStorageRepository.markAllNotificationsAsRead();
          setNotifications(updated);
        }}
        onClearAll={() => {
          AppStorageRepository.clearNotifications();
          setNotifications([]);
        }}
        onSelectNotification={(notif) => {
          AppStorageRepository.markNotificationAsRead(notif.id);
          setNotifications(AppStorageRepository.getNotifications());
          setIsNotificationModalOpen(false);
          if (notif.actionTab) {
            navigateTo(notif.actionTab);
          }
        }}
        isDarkMode={isDarkMode}
      />
    </MobileFrame>
  );
}
