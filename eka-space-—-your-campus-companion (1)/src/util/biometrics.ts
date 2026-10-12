/**
 * Web Authentication API (WebAuthn) helper for real hardware biometric
 * authentication (Fingerprint / Face Unlock) on Android devices like Xiaomi Redmi 14C,
 * Windows Hello, Touch ID on Mac, and iOS Face ID.
 */

export interface BiometricResult {
  success: boolean;
  message: string;
  isHardware?: boolean;
  inIframeBlocked?: boolean;
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function authenticateWithBiometrics(username = 'EKA'): Promise<BiometricResult> {
  if (typeof window === 'undefined') {
    return {
      success: false,
      message: 'Lingkungan eksekusi tidak mendukung WebAuthn.',
      isHardware: false,
    };
  }

  // Check if WebAuthn API exists in browser
  if (!window.PublicKeyCredential) {
    return {
      success: false,
      message: 'Browser ini belum mendukung sensor biometrik WebAuthn FIDO2.',
      isHardware: false,
    };
  }

  // Detect if running inside an iframe (like AI Studio preview iframe)
  const isInsideIframe = window.self !== window.top;

  try {
    const isPlatformAvailable =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

    if (!isPlatformAvailable) {
      return {
        success: false,
        message: 'Sensor biometrik (sidik jari / wajah) fisik tidak terdeteksi pada perangkat ini.',
        isHardware: false,
      };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const credentialIdKey = `ekaspace_biometric_cred_${(username || 'eka').toLowerCase().trim()}`;
    const existingCredId = localStorage.getItem(credentialIdKey);

    // 1. If we already have a registered credential for this user, attempt authentication with navigator.credentials.get
    if (existingCredId) {
      try {
        const credIdBytes = Uint8Array.from(atob(existingCredId), (c) => c.charCodeAt(0));

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            allowCredentials: [
              {
                id: credIdBytes,
                type: 'public-key',
                transports: ['internal'],
              },
            ],
          },
        });

        if (assertion) {
          return {
            success: true,
            message: 'Autentikasi sidik jari perangkat berhasil diverifikasi!',
            isHardware: true,
          };
        }
      } catch (getErr: any) {
        // If assertion failed because credential was removed or expired, proceed to create new
        console.warn('Assertion failed, trying registration:', getErr);
      }
    }

    // 2. Register/Create new passkey credential with platform authenticator (invokes Android fingerprint/face prompt)
    const userIdBytes = new Uint8Array(16);
    window.crypto.getRandomValues(userIdBytes);

    // Clean hostname for rp.id (WebAuthn specification: must not be an IP address or contain port)
    const hostname = window.location.hostname;
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const validRpId = !isIpAddress && hostname !== '' ? hostname : undefined;

    const createOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'EKA SPACE — Your Campus Companion',
        id: validRpId,
      },
      user: {
        id: userIdBytes,
        name: (username || 'eka').toLowerCase().trim(),
        displayName: username || 'Mahasiswa EKA SPACE',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Triggers physical on-device fingerprint / face sensor!
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const newCredential = (await navigator.credentials.create({
      publicKey: createOptions,
    })) as PublicKeyCredential | null;

    if (newCredential) {
      const idBase64 = btoa(String.fromCharCode(...new Uint8Array(newCredential.rawId)));
      localStorage.setItem(credentialIdKey, idBase64);

      return {
        success: true,
        message: 'Sidik jari perangkat berhasil didaftarkan dan diverifikasi!',
        isHardware: true,
      };
    }

    return {
      success: false,
      message: 'Pemeriksaan biometrik dibatalkan pengguna.',
      isHardware: true,
    };
  } catch (err: any) {
    console.warn('Biometric error details:', err);

    if (err.name === 'NotAllowedError') {
      if (isInsideIframe) {
        return {
          success: false,
          inIframeBlocked: true,
          message:
            'Browser membatasi sensor sidik jari di dalam frame pratinjau. Buka di tab baru atau langsung di HP Android untuk sensor fisik, atau klik Konfirmasi Biometrik di bawah.',
          isHardware: true,
        };
      }
      return {
        success: false,
        message: 'Pemindaian dibatalkan atau sidik jari tidak dikenali. Silakan coba lagi.',
        isHardware: true,
      };
    }

    if (err.name === 'SecurityError') {
      return {
        success: false,
        inIframeBlocked: true,
        message:
          'Kebijakan keamanan browser membatasi WebAuthn di domain pratinjau ini. Gunakan verifikasi cepat di bawah.',
        isHardware: false,
      };
    }

    return {
      success: false,
      inIframeBlocked: isInsideIframe,
      message: `Sensor biometrik tidak dapat diakses (${err.message || 'Izin ditolak'}). Silakan gunakan kata sandi atau ketuk Konfirmasi Biometrik.`,
      isHardware: false,
    };
  }
}
