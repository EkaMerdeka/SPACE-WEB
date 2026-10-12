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
} from '../types';

export const initialProfile: ProfileData = {
  fullName: '',
  nickname: '',
  studentId: '',
  major: '',
  faculty: '',
  university: '',
  semester: 1,
  batchYear: '',
  email: '',
  phone: '',
  avatarUrl: '',
  bio: '',
  linkedIn: '',
  github: '',
  portfolio: '',
  interests: ['Android Development', 'Pemrograman'],
  skills: ['Kotlin', 'Java'],
  academicGoals: '',
};

export const initialCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Google Associate Android Developer Certification',
    issuer: 'Google Developers Certification',
    eventName: 'Android Developer Certification Exam',
    issueDate: '2024-05-15',
    category: 'Akademik',
    certificateNumber: 'AAD-ID-2024-9981',
    verificationUrl: 'https://developers.google.com/certification/directory',
    description: 'Sertifikasi kompetensi resmi tingkat profesional dalam arsitektur modern Android, Jetpack Compose, Room, dan Material 3.',
    tags: ['Android', 'Google', 'Kotlin', 'Professional'],
    isFavorite: true,
    fileType: 'pdf',
    fileName: 'Google_Android_Dev_Eka.pdf',
    fileSize: 1420000,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
  },
  {
    id: 'cert-2',
    title: 'Juara 1 Hackathon Mobile App Inovasi Kampus 2024',
    issuer: 'Kementerian Pendidikan & Himpunan Informatika',
    eventName: 'National Tech Hackathon Summit 2024',
    issueDate: '2024-08-20',
    category: 'Kompetisi',
    certificateNumber: 'HACK-COMP-084-24',
    verificationUrl: 'https://hackathon.kemdikbud.go.id/winner/2024',
    description: 'Meraih peringkat pertama dalam kompetisi perancangan aplikasi offline-first untuk edukasi mahasiswa di pelosok Nusantara.',
    tags: ['Juara 1', 'Hackathon', 'Android', 'Inovasi'],
    isFavorite: true,
    fileType: 'jpg',
    fileName: 'Juara1_Hackathon_2024.jpg',
    fileSize: 850000,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'cert-3',
    title: 'Menjadi Android Developer Expert (MADE)',
    issuer: 'Dicoding Indonesia',
    eventName: 'Bangkit Academy Learning Path',
    issueDate: '2024-03-10',
    category: 'Bootcamp',
    certificateNumber: 'DCD-MADE-2024-0192',
    verificationUrl: 'https://www.dicoding.com/certificates/DCD-MADE-2024-0192',
    description: 'Penyelesaian kurikulum mendalam: Clean Architecture, Modularization, Dependency Injection Hilt, Testing, dan CI/CD.',
    tags: ['Dicoding', 'Expert', 'Clean Architecture', 'Hilt'],
    isFavorite: false,
    fileType: 'png',
    fileName: 'Sertifikat_Dicoding_Android_Expert.png',
    fileSize: 620000,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
  },
  {
    id: 'cert-4',
    title: 'Ketua Divisi Riset & Pengembangan Himpunan',
    issuer: 'Himpunan Mahasiswa Informatika (HMIF)',
    eventName: 'Kepengurusan Periode 2023/2024',
    issueDate: '2024-01-05',
    category: 'Organisasi',
    certificateNumber: 'HMIF-SK-012/2024',
    verificationUrl: '',
    description: 'Memimpin tim riset RnD mengembangkan sistem informasi pemilihan raya kampus dan workshop pemrograman terstruktur.',
    tags: ['Organisasi', 'Kepemimpinan', 'HMIF'],
    isFavorite: false,
    fileType: 'pdf',
    fileName: 'SK_Kepengurusan_HMIF_Eka.pdf',
    fileSize: 1100000,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
  },
];

export const initialFolders: DocumentFolder[] = [
  { id: 'fld-1', name: 'Semester 5 - Bahan Ajar', color: '#8B5CF6', createdAt: Date.now() - 20000000 },
  { id: 'fld-2', name: 'Praktikum & Modul Lab', color: '#06B6D4', createdAt: Date.now() - 15000000 },
  { id: 'fld-3', name: 'Administrasi & KRS', color: '#10B981', createdAt: Date.now() - 10000000 },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Modul Praktikum Sistem Terdistribusi - Lab 3',
    folderId: 'fld-2',
    category: 'Modul praktikum',
    fileType: 'pdf',
    fileName: 'Modul_Sisdis_Lab3_RPC.pdf',
    fileSize: 2450000,
    courseName: 'Sistem Terdistribusi',
    description: 'Panduan implementasi gRPC dan arsitektur event-driven menggunakan Go dan Kafka.',
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'doc-2',
    name: 'Slide Kuliah: Optimasi Query PostgreSQL & Indexing',
    folderId: 'fld-1',
    category: 'Materi kuliah',
    fileType: 'pptx',
    fileName: 'Postgres_BTree_GIN_Optimization.pptx',
    fileSize: 4800000,
    courseName: 'Basis Data Lanjut',
    description: 'Materi B-Tree Index, EXPLAIN ANALYZE, Partitioning, dan Query execution plan.',
    isFavorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'doc-3',
    name: 'Kartu Rencana Studi (KRS) Semester Gasal 2024/2025',
    folderId: 'fld-3',
    category: 'Administrasi kampus',
    fileType: 'pdf',
    fileName: 'KRS_Semester_5_EkaMerdeka.pdf',
    fileSize: 420000,
    courseName: 'Administrasi',
    description: 'KRS resmi disetujui Dosen Pembimbing Akademik dengan beban 22 SKS.',
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 240,
    updatedAt: Date.now() - 1000 * 60 * 60 * 240,
  },
  {
    id: 'doc-4',
    name: 'Draft Proposal Tugas Akhir - Sistem Cache Adaptif',
    folderId: 'fld-1',
    category: 'Laporan',
    fileType: 'docx',
    fileName: 'Proposal_TA_Draft_Rev2.docx',
    fileSize: 1350000,
    courseName: 'Tugas Akhir / Skripsi',
    description: 'Draf bab 1-3 kajian pustaka algoritma penggusuran cache LFU-LRU hibrida.',
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Ringkasan Konsep Kotlin Coroutines & Flow (StateFlow vs SharedFlow)',
    courseName: 'Pemrograman Piranti Bergerak',
    category: 'Struktur Data & Bahasa',
    content: `## Konsep Inti Coroutines
Coroutines adalah lightweight threads untuk eksekusi asynchronous non-blocking.
- **Dispatchers.Main**: Untuk operasi UI di Jetpack Compose.
- **Dispatchers.IO**: Untuk database Room dan file I/O.
- **Dispatchers.Default**: Untuk komputasi berat (JSON parsing, sorting).

## StateFlow vs SharedFlow
1. **StateFlow**:
   - Memiliki value awal (state holder).
   - Selalu menyimpan state terakhir (replay = 1).
   - Cocok untuk ViewState di MVI / MVVM.
2. **SharedFlow**:
   - Event emitter (one-off event seperti snackbar/navigasi).
   - Tidak memerlukan initial value.`,
    tags: ['Kotlin', 'Coroutines', 'Flow', 'Android'],
    isPinned: true,
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'note-2',
    title: 'Prinsip Desain Database Normalisasi 1NF sampai BCNF',
    courseName: 'Basis Data Lanjut',
    category: 'Basis Data',
    content: `## Tahapan Normalisasi:
1. **1NF**: Setiap atribut bersifat atomik, tidak ada repeating groups.
2. **2NF**: Memenuhi 1NF dan tidak memiliki ketergantungan parsial pada primary key komposit.
3. **3NF**: Memenuhi 2NF dan tidak ada ketergantungan transitif (A -> B dan B -> C).
4. **BCNF**: Memenuhi 3NF dan untuk setiap fungsional X -> Y, X haruslah superkey.`,
    tags: ['Database', 'SQL', 'Normalisasi', 'Teori'],
    isPinned: false,
    isFavorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'note-3',
    title: 'Rumus Kompleksitas Waktu Algoritma Dijkstra & Bellman-Ford',
    courseName: 'Desain dan Analisis Algoritma',
    category: 'Algoritma',
    content: `## Perbandingan Jalur Terpendek
- **Dijkstra** (Priority Queue Min-Heap):
  Kompleksitas: O((V + E) log V).
  Hanya berlaku untuk bobot sisi non-negatif.
- **Bellman-Ford**:
  Kompleksitas: O(V * E).
  Dapat mendeteksi siklus berbobot negatif (Negative Cycle).`,
    tags: ['Graf', 'Algoritma', 'Kompleksitas'],
    isPinned: false,
    isFavorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Implementasi Room Database & Repository Pattern Proyek Akhir',
    description: 'Menyusun DAO, TypeConverters, dan Migration dari Room v1 ke v2 untuk aplikasi portofolio.',
    courseName: 'Pemrograman Piranti Bergerak',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(), // 36 hours from now
    priority: 'Tinggi',
    status: 'Sedang dikerjakan',
    attachmentName: 'Spesifikasi_Tugas_Akhir_Android.pdf',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'task-2',
    title: 'Laporan Analisis Kueri Kompleks dengan EXPLAIN ANALYZE',
    description: 'Membandingkan kecepatan sekuensial scan vs index scan pada dataset 1 juta baris di PostgreSQL.',
    courseName: 'Basis Data Lanjut',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(), // 4 days from now
    priority: 'Sedang',
    status: 'Belum dimulai',
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
  },
  {
    id: 'task-3',
    title: 'Kuis Teori Graf & Dynamic Programming',
    description: 'Mempersiapkan materi Knapsack 0/1, Longest Common Subsequence, dan Travelling Salesman Problem.',
    courseName: 'Desain dan Analisis Algoritma',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    priority: 'Sedang',
    status: 'Belum dimulai',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'task-4',
    title: 'Submit Revisi Makalah Etika Profesi Teknologi',
    description: 'Menambahkan studi kasus regulasi perlindungan data pribadi UU PDP Indonesia.',
    courseName: 'Etika Profesi & Hukum Siber',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // finished yesterday
    priority: 'Rendah',
    status: 'Selesai',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    completedAt: Date.now() - 1000 * 60 * 60 * 8,
  },
];

export const initialSchedules: ScheduleItem[] = [
  {
    id: 'sch-1',
    courseName: 'Pemrograman Piranti Bergerak (Android)',
    lecturer: 'Dr. Ir. Hendra Saputra, M.T.',
    day: 'Senin',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab Komputer 304',
    building: 'Gedung C - Lantai 3',
    color: '#8B5CF6',
    notes: 'Bawa laptop Redmi 14C & kabel data untuk ADB debugging fisik.',
  },
  {
    id: 'sch-2',
    courseName: 'Basis Data Lanjut & Optimasi',
    lecturer: 'Prof. Sri Wahyuni, Ph.D.',
    day: 'Senin',
    startTime: '13:00',
    endTime: '15:30',
    room: 'Ruang Kuliah 202',
    building: 'Gedung Utama',
    color: '#06B6D4',
    notes: 'Diskusi hasil benchmarking kueri terindeks.',
  },
  {
    id: 'sch-3',
    courseName: 'Desain dan Analisis Algoritma',
    lecturer: 'Ahmad Fauzi, S.Kom., M.Cs.',
    day: 'Selasa',
    startTime: '09:30',
    endTime: '12:00',
    room: 'Auditorium Fasilkom',
    building: 'Gedung Baru',
    color: '#EC4899',
    notes: 'Kuis bab dynamic programming dan graf.',
  },
  {
    id: 'sch-4',
    courseName: 'Sistem Terdistribusi & Komputasi Awan',
    lecturer: 'Bayu Wicaksono, M.Sc.',
    day: 'Rabu',
    startTime: '10:00',
    endTime: '12:30',
    room: 'Lab Jaringan 401',
    building: 'Gedung C - Lantai 4',
    color: '#10B981',
    notes: 'Praktikum konfigurasi microservices dengan Docker.',
  },
  {
    id: 'sch-5',
    courseName: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    lecturer: 'Dina Marlina, S.T., M.Kom.',
    day: 'Kamis',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Ruang Teori 105',
    building: 'Gedung B',
    color: '#F59E0B',
    notes: 'Presentasi sprint 2 desain arsitektur MVI/Clean Architecture.',
  },
  {
    id: 'sch-6',
    courseName: 'Etika Profesi & Hukum Siber',
    lecturer: 'Rudi Hartono, S.H., M.H.',
    day: 'Jumat',
    startTime: '08:30',
    endTime: '10:30',
    room: 'Ruang Seminar 3',
    building: 'Gedung Utama',
    color: '#6366F1',
    notes: 'Analisis undang-undang PDP dan kepatuhan GDPR.',
  },
];

export const initialSnippets: SnippetItem[] = [
  {
    id: 'snip-1',
    title: 'Room Database & TypeConverters Template (Android Kotlin)',
    language: 'Kotlin',
    category: 'Database',
    description: 'Implementasi Entity, DAO, dan TypeConverter Room Database yang aman dari thread UI menggunakan Kotlin Coroutines Flow.',
    tags: ['Android', 'Room', 'Kotlin', 'Flow', 'Database'],
    isFavorite: true,
    code: `@Entity(tableName = "certificates")
data class CertificateEntity(
    @PrimaryKey val id: String,
    val title: String,
    val issuer: String,
    val issueDate: String,
    val category: String,
    val isFavorite: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface CertificateDao {
    @Query("SELECT * FROM certificates ORDER BY createdAt DESC")
    fun getAllCertificates(): Flow<List<CertificateEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCertificate(cert: CertificateEntity)

    @Delete
    suspend fun deleteCertificate(cert: CertificateEntity)
}

@Database(entities = [CertificateEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun certificateDao(): CertificateDao
}`,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'snip-2',
    title: 'Jetpack Compose Animated Bottom Navigation Bar',
    language: 'Kotlin',
    category: 'UI',
    description: 'Komponen Material 3 NavigationBar dengan efek animasi scale dan warna aksen khas EKA SPACE.',
    tags: ['Jetpack Compose', 'UI', 'Material 3', 'Animation'],
    isFavorite: true,
    code: `@Composable
fun EkaBottomBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        val items = listOf("dashboard", "certificates", "notes", "coding", "profile")
        items.forEach { route ->
            val selected = currentRoute == route
            val scale by animateFloatAsState(if (selected) 1.15f else 1.0f)
            
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(route) },
                icon = {
                    Icon(
                        imageVector = getIconForRoute(route),
                        contentDescription = route,
                        modifier = Modifier.scale(scale)
                    )
                },
                label = { Text(route.replaceFirstChar { it.uppercase() }) }
            )
        }
    }
}`,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'snip-3',
    title: 'Fast Binary Search & Lower Bound Algorithm',
    language: 'Python',
    category: 'Algoritma',
    description: 'Implementasi Binary Search berkecepatan tinggi O(log N) untuk mencari index elemen terkecil >= target.',
    tags: ['Python', 'Algoritma', 'Binary Search'],
    isFavorite: false,
    code: `def lower_bound(arr: list[int], target: int) -> int:
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left

# Contoh Uji:
data = [10, 20, 25, 30, 42, 60]
idx = lower_bound(data, 25)
print(f"Target 25 ditemukan pada index: {idx}")`,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    updatedAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'snip-4',
    title: 'JWT Authentication Middleware Express.js (TypeScript)',
    language: 'TypeScript',
    category: 'Authentication',
    description: 'Middleware proteksi endpoint API dengan verifikasi token Bearer JWT dan validasi peran pengguna.',
    tags: ['TypeScript', 'Express', 'Auth', 'JWT'],
    isFavorite: false,
    code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token otentikasi tidak ditemukan' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedUser: any) => {
    if (err) return res.status(403).json({ error: 'Sesi kedaluwarsa atau token tidak valid' });
    req.userId = decodedUser.id;
    req.role = decodedUser.role;
    next();
  });
};`,
    createdAt: Date.now() - 1000 * 60 * 60 * 200,
    updatedAt: Date.now() - 1000 * 60 * 60 * 200,
  },
];

export const initialSettings: AppSettings = {
  theme: 'dark',
  showRedmiFrame: true,
  pinLockEnabled: false,
  savedPin: '1708',
  reducedMotion: false,
  notificationEnabled: true,
};
