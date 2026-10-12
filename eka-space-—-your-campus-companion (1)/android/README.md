# EKA SPACE — Your Campus Companion 🎓
Aplikasi Android Mahasiswa All-in-One Pribadi & Offline-First

## Spesifikasi Target
- Perangkat: Xiaomi Redmi 14C
- RAM: 8 GB
- Sistem Operasi Target: Android 16 (API 36)
- Bahasa: Kotlin 2.0+
- UI Framework: Jetpack Compose + Material 3
- Database Lokal: Room Database (SQLite)
- Arsitektur: MVVM + Repository Pattern + Coroutines Flow

## Kredensial Awal (Demo Mode)
- **Username**: \`EKA\`
- **Password**: \`EKA1708\`
- **PIN Default**: \`1708\`

## Cara Membuka di Android Studio
1. Pasang **Android Studio Ladybug (2024.2.1+)** atau versi lebih baru.
2. Pastikan Android SDK 36 (Android 16) terpasang di SDK Manager.
3. Buka folder ini di Android Studio.
4. Tunggu Gradle Sync selesai.
5. Jalankan aplikasi pada perangkat Redmi 14C atau emulator dengan tombol Run.

## Cara Build Release APK
Jalankan di terminal proyek:
\`\`\`bash
./gradlew assembleRelease
\`\`\`
Berkas APK release akan dibuat pada:
\`app/build/outputs/apk/release/app-release.apk\`
