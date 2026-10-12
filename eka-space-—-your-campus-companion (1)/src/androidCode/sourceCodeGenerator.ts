export interface AndroidFileItem {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'res' | 'docs';
  content: string;
}

export const getAndroidStudioProjectFiles = (): AndroidFileItem[] => {
  return [
    {
      path: 'build.gradle.kts',
      name: 'build.gradle.kts (Root)',
      category: 'gradle',
      content: `// Top-level build file for EKA SPACE Android Application
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`,
    },
    {
      path: 'settings.gradle.kts',
      name: 'settings.gradle.kts',
      category: 'gradle',
      content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "EkaSpace"
include(":app")
`,
    },
    {
      path: 'app/build.gradle.kts',
      name: 'app/build.gradle.kts',
      category: 'gradle',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.ekaspace.app"
    compileSdk = 36 // Android 16 (API Level 36)

    defaultConfig {
        applicationId = "com.ekaspace.app"
        minSdk = 26 // Android 8.0 Oreo minimum for SAF & Biometrics
        targetSdk = 36 // Target Android 16
        versionCode = 1
        versionName = "1.0.0-rc1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Core
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose BOM & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Navigation Compose
    implementation(libs.androidx.navigation.compose)

    // Room Database (Offline Vaults)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // DataStore Preferences
    implementation(libs.androidx.datastore.preferences)

    // Biometric Authentication
    implementation(libs.androidx.biometric)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`,
    },
    {
      path: 'app/src/main/AndroidManifest.xml',
      name: 'AndroidManifest.xml',
      category: 'manifest',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.ekaspace.app">

    <!-- Permissions for Android 16 -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />

    <application
        android:name=".EkaSpaceApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EkaSpace"
        tools:targetApi="36">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.EkaSpace"
            android:screenOrientation="portrait"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider for Sharing Exported Vaults & Backups -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.ekaspace.app.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
`,
    },
    {
      path: 'app/src/main/java/com/ekaspace/app/data/entities/Entities.kt',
      name: 'Entities.kt (Room)',
      category: 'kotlin',
      content: `package com.ekaspace.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "profile")
data class ProfileEntity(
    @PrimaryKey val id: Int = 1,
    val fullName: String,
    val nickname: String,
    val studentId: String,
    val major: String,
    val faculty: String,
    val university: String,
    val semester: Int,
    val batchYear: String,
    val email: String,
    val phone: String,
    val avatarUri: String,
    val bio: String,
    val linkedIn: String,
    val github: String,
    val portfolio: String,
    val academicGoals: String
)

@Entity(tableName = "certificates")
data class CertificateEntity(
    @PrimaryKey val id: String,
    val title: String,
    val issuer: String,
    val eventName: String,
    val issueDate: String,
    val expiryDate: String?,
    val category: String,
    val certificateNumber: String?,
    val verificationUrl: String?,
    val description: String,
    val tagsJson: String,
    val isFavorite: Boolean,
    val fileType: String,
    val fileName: String,
    val internalFilePath: String?,
    val fileSize: Long,
    val createdAt: Long,
    val updatedAt: Long
)

@Entity(tableName = "documents")
data class DocumentEntity(
    @PrimaryKey val id: String,
    val name: String,
    val folderId: String?,
    val category: String,
    val fileType: String,
    val fileName: String,
    val internalFilePath: String?,
    val fileSize: Long,
    val courseName: String?,
    val description: String?,
    val isFavorite: Boolean,
    val createdAt: Long,
    val updatedAt: Long
)

@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey val id: String,
    val title: String,
    val courseName: String,
    val category: String,
    val content: String,
    val tagsJson: String,
    val isPinned: Boolean,
    val isFavorite: Boolean,
    val createdAt: Long,
    val updatedAt: Long
)

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val courseName: String,
    val deadline: String,
    val priority: String, // Rendah, Sedang, Tinggi
    val status: String, // Belum dimulai, Sedang dikerjakan, Selesai
    val attachmentPath: String?,
    val createdAt: Long,
    val completedAt: Long?
)

@Entity(tableName = "schedules")
data class ScheduleEntity(
    @PrimaryKey val id: String,
    val courseName: String,
    val lecturer: String?,
    val day: String,
    val startTime: String,
    val endTime: String,
    val room: String,
    val building: String?,
    val colorHex: String,
    val notes: String?
)

@Entity(tableName = "snippets")
data class SnippetEntity(
    @PrimaryKey val id: String,
    val title: String,
    val language: String,
    val code: String,
    val description: String,
    val category: String,
    val tagsJson: String,
    val isFavorite: Boolean,
    val createdAt: Long,
    val updatedAt: Long
)
`,
    },
    {
      path: 'app/src/main/java/com/ekaspace/app/data/dao/AppDao.kt',
      name: 'AppDao.kt (Room DAO)',
      category: 'kotlin',
      content: `package com.ekaspace.app.data.dao

import androidx.room.*
import com.ekaspace.app.data.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface CertificateDao {
    @Query("SELECT * FROM certificates ORDER BY createdAt DESC")
    fun getAll(): Flow<List<CertificateEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(cert: CertificateEntity)

    @Update
    suspend fun update(cert: CertificateEntity)

    @Delete
    suspend fun delete(cert: CertificateEntity)

    @Query("SELECT * FROM certificates WHERE id = :id")
    suspend fun getById(id: String): CertificateEntity?
}

@Dao
interface NoteDao {
    @Query("SELECT * FROM notes ORDER BY isPinned DESC, updatedAt DESC")
    fun getAll(): Flow<List<NoteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(note: NoteEntity)

    @Delete
    suspend fun delete(note: NoteEntity)
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY deadline ASC")
    fun getAll(): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(task: TaskEntity)

    @Update
    suspend fun update(task: TaskEntity)

    @Delete
    suspend fun delete(task: TaskEntity)
}

@Dao
interface ScheduleDao {
    @Query("SELECT * FROM schedules ORDER BY startTime ASC")
    fun getAll(): Flow<List<ScheduleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(schedule: ScheduleEntity)

    @Delete
    suspend fun delete(schedule: ScheduleEntity)
}

@Dao
interface SnippetDao {
    @Query("SELECT * FROM snippets ORDER BY updatedAt DESC")
    fun getAll(): Flow<List<SnippetEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(snippet: SnippetEntity)

    @Delete
    suspend fun delete(snippet: SnippetEntity)
}
`,
    },
    {
      path: 'app/src/main/java/com/ekaspace/app/MainActivity.kt',
      name: 'MainActivity.kt',
      category: 'kotlin',
      content: `package com.ekaspace.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.ekaspace.app.ui.navigation.EkaNavHost
import com.ekaspace.app.ui.theme.EkaSpaceTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EkaSpaceTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    EkaNavHost(navController = navController)
                }
            }
        }
    }
}
`,
    },
    {
      path: 'app/src/main/java/com/ekaspace/app/ui/theme/Theme.kt',
      name: 'Theme.kt (Deep Navy & Violet)',
      category: 'kotlin',
      content: `package com.ekaspace.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// EKA SPACE Color Palette
val NavyBackground = Color(0xFF0B0F19)
val NavySurface = Color(0xFF111728)
val ElectricPurple = Color(0xFF8B5CF6)
val DeepViolet = Color(0xFF7C3AED)
val NeonCyan = Color(0xFF06B6D4)
val EmeraldSuccess = Color(0xFF10B981)
val RoseError = Color(0xFFF43F5E)

private val DarkColorScheme = darkColorScheme(
    primary = ElectricPurple,
    secondary = NeonCyan,
    tertiary = DeepViolet,
    background = NavyBackground,
    surface = NavySurface,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = Color(0xFFF1F5F9),
    onSurface = Color(0xFFE2E8F0)
)

private val LightColorScheme = lightColorScheme(
    primary = DeepViolet,
    secondary = NeonCyan,
    background = Color(0xFFF8FAFC),
    surface = Color.White,
    onPrimary = Color.White,
    onBackground = Color(0xFF0F172A),
    onSurface = Color(0xFF1E293B)
)

@Composable
fun EkaSpaceTheme(
    darkTheme: Boolean = true, // Dark mode as default
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
`,
    },
    {
      path: 'README.md',
      name: 'README.md (Panduan Build APK)',
      category: 'docs',
      content: `# EKA SPACE — Your Campus Companion 🎓
Aplikasi Android Mahasiswa All-in-One Pribadi & Offline-First

## Fitur Utama
1. **Certificate Vault**: Pengelolaan sertifikat prestasi, seminar, dan webinar dengan filter kategori & pratinjau.
2. **Campus Document Vault**: Modul praktikum, slide materi, dan berkas KRS dengan hierarki folder.
3. **Catatan Kuliah**: Editor catatan Markdown dengan tag mata kuliah dan ekspor berkas.
4. **Manajemen Tugas & Deadline**: Pelacak tugas terorganisir dengan status, prioritas, dan progress bar.
5. **Jadwal Kuliah Mingguan**: Jadwal kuliah harian lengkap dengan deteksi tabrakan waktu (Collision Detection).
6. **Coding Vault**: Penyimpanan snippet kode multi-bahasa (Kotlin, Python, Java, dsb.) dengan syntax styling.
7. **Profil Mahasiswa & KTM Digital**: Kartu Tanda Mahasiswa interaktif dengan fitur flip & NFC compatibility.
8. **Pencarian Global**: Satu kolom pencarian serentak ke seluruh 6 vault.
9. **Backup & Restore Lokal**: Cadangkan ke arsip ZIP atau JSON tanpa server luar.

## Spesifikasi Perangkat Target
- **Perangkat**: Xiaomi Redmi 14C
- **RAM**: 8 GB
- **Sistem Operasi**: Android 16 (API 36)
- **Bahasa**: Kotlin 2.0+
- **Toolkit UI**: Jetpack Compose & Material 3
- **Database**: Room Database v2.6.1 (Offline-First)

## Cara Membuka & Membangun di Android Studio
1. Buka **Android Studio Ladybug (2024.2.1+)** atau versi terbaru yang mendukung Android 16 SDK 36.
2. Pilih menu **File > Open**, lalu arahkan ke folder proyek ini.
3. Tunggu proses **Gradle Sync** selesai secara otomatis.
4. Hubungkan smartphone **Xiaomi Redmi 14C** via USB dengan mengaktifkan opsi *USB Debugging*.
5. Pilih target perangkat Redmi 14C di toolbar atas.
6. Klik tombol hijau **Run 'app' (Shift + F10)**.

## Cara Menghasilkan APK Release
1. Di Android Studio, pilih menu **Build > Generate Signed Bundle / APK...**
2. Pilih opsi **APK**, lalu klik **Next**.
3. Buat atau pilih Keystore release Anda.
4. Pilih build variant **release**, lalu centang **V1 (Jar Signature)** dan **V2 (Full APK Signature)**.
5. Klik **Finish**. Berkas APK siap diinstal langsung di perangkat Xiaomi Redmi 14C.

## Kredensial Demo Awal
- **Username**: EKA
- **Password**: EKA1708
- **PIN Default**: 1708
`,
    },
  ];
};
