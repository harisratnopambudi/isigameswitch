// ==========================================
// FIREBASE CONFIGURATION & SERVICE LAYER
// ISI Game Switch
// ==========================================
//
// CATATAN KEAMANAN:
// - apiKey Firebase di bawah ini BUKAN password. Ini hanya penanda project
//   dan memang selalu terlihat oleh pengunjung website. Aman di GitHub.
// - Keamanan data diatur oleh FIRESTORE SECURITY RULES (lihat file
//   firestore.rules) + login admin via Firebase Authentication.
//   Tanpa rules yang benar, siapa pun bisa mengubah database.

// Konfigurasi Resmi Firebase untuk project isigameswitch
let FIREBASE_CONFIG = {
    apiKey: "AIzaSyAQ1IZZQx2KSDsY3T8KFmLmrYddfRgZHHs",
    authDomain: "isigameswitch.firebaseapp.com",
    projectId: "isigameswitch",
    storageBucket: "isigameswitch.firebasestorage.app",
    messagingSenderId: "874181970067",
    appId: "1:874181970067:web:ba60a2738347c8c710e566",
    measurementId: "G-WN72GFYQV6"
};

// Cek apakah ada config tersimpan di localStorage dari Admin Panel
// (hanya berlaku di browser yang menyimpannya, tidak memengaruhi pengunjung lain)
const savedConfig = localStorage.getItem('switch_firebase_config');
if (savedConfig) {
    try {
        FIREBASE_CONFIG = { ...FIREBASE_CONFIG, ...JSON.parse(savedConfig) };
    } catch (e) {
        console.error("Gagal load config Firebase dari localStorage:", e);
    }
}

let db = null;
let auth = null;
let isFirebaseReady = false;

// Inisialisasi Firebase jika config sudah terisi
function initFirebaseApp() {
    if (typeof firebase === 'undefined') {
        console.warn("Firebase SDK belum dimuat.");
        return false;
    }

    if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
        console.log("Firebase config belum diisi. Menggunakan mode database lokal.");
        return false;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        // Auth hanya dimuat di admin.html (firebase-auth-compat.js)
        if (typeof firebase.auth === 'function') {
            auth = firebase.auth();
        }
        isFirebaseReady = true;
        console.log("Firestore berhasil terhubung! Project ID:", FIREBASE_CONFIG.projectId);
        return true;
    } catch (err) {
        console.error("Error saat inisialisasi Firebase:", err);
        return false;
    }
}

// ------------------------------------------
// AUTENTIKASI ADMIN
// ------------------------------------------

async function loginAdmin(email, password) {
    if (!auth) throw new Error("Firebase Auth belum siap.");
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return auth.signInWithEmailAndPassword(email, password);
}

async function logoutAdmin() {
    if (auth) await auth.signOut();
}

function getAuthErrorMessage(err) {
    const code = err && err.code ? err.code : '';
    const messages = {
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/user-disabled': 'Akun ini dinonaktifkan.',
        'auth/user-not-found': 'Email atau password salah.',
        'auth/wrong-password': 'Email atau password salah.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/invalid-login-credentials': 'Email atau password salah.',
        'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.',
        'auth/network-request-failed': 'Koneksi internet bermasalah.',
        'auth/operation-not-allowed': 'Login Email/Password belum diaktifkan di Firebase Console.'
    };
    return messages[code] || 'Login gagal. Periksa kembali email dan password.';
}

function isPermissionError(err) {
    return !!(err && (err.code === 'permission-denied' || String(err.message || '').includes('permission')));
}

// ------------------------------------------
// OPERASI DATABASE GAMES
// ------------------------------------------

// 1. Ambil semua game dari Firestore
async function getGamesFromFirebase() {
    if (!isFirebaseReady || !db) return null;
    try {
        const snapshot = await db.collection("games").orderBy("id", "asc").get();
        if (snapshot.empty) {
            return [];
        }
        const games = [];
        snapshot.forEach(doc => {
            games.push({ docId: doc.id, ...doc.data() });
        });
        return games;
    } catch (error) {
        console.error("Gagal mengambil game dari Firestore:", error);
        return null;
    }
}

// Buang field internal sebelum disimpan
function cleanGameData(gameData) {
    const { docId, ...rest } = gameData;
    return rest;
}

// 2. Tambah game baru ke Firestore (document ID = id game, konsisten dengan migrasi)
async function addGameToFirebase(gameData) {
    if (!isFirebaseReady || !db) return null;
    try {
        const docId = String(gameData.id);
        await db.collection("games").doc(docId).set(cleanGameData(gameData));
        return docId;
    } catch (error) {
        console.error("Gagal menambah game ke Firestore:", error);
        throw error;
    }
}

// 3. Update game di Firestore
async function updateGameInFirebase(gameId, updatedData) {
    if (!isFirebaseReady || !db) return false;
    try {
        const data = cleanGameData(updatedData);
        // Cari dokumen berdasarkan field id (mendukung data lama dengan document ID acak)
        const snapshot = await db.collection("games").where("id", "==", gameId).get();
        if (!snapshot.empty) {
            await snapshot.docs[0].ref.update(data);
        } else {
            await db.collection("games").doc(String(gameId)).set(data);
        }
        return true;
    } catch (error) {
        console.error("Gagal update game di Firestore:", error);
        throw error;
    }
}

// 4. Hapus game dari Firestore
async function deleteGameFromFirebase(gameId) {
    if (!isFirebaseReady || !db) return false;
    try {
        const snapshot = await db.collection("games").where("id", "==", gameId).get();
        if (snapshot.empty) return false;
        const batch = db.batch();
        snapshot.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Gagal menghapus game dari Firestore:", error);
        throw error;
    }
}

// 5. Upload game default dari games.js ke Firestore sekaligus
async function migrateDefaultGamesToFirebase(defaultGames) {
    if (!isFirebaseReady || !db) return false;
    try {
        const batch = db.batch();
        defaultGames.forEach(game => {
            const docRef = db.collection("games").doc(game.id.toString());
            batch.set(docRef, cleanGameData(game));
        });
        await batch.commit();
        console.log(`Migrasi ${defaultGames.length} game ke Firestore berhasil!`);
        return true;
    } catch (error) {
        console.error("Gagal migrasi default games ke Firestore:", error);
        throw error;
    }
}

// ------------------------------------------
// OPERASI SETTINGS TOKO & WHATSAPP
// ------------------------------------------

async function getStoreSettingsFromFirebase() {
    if (!isFirebaseReady || !db) return null;
    try {
        const doc = await db.collection("settings").doc("store").get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error("Gagal mengambil settings dari Firestore:", error);
        return null;
    }
}

async function saveStoreSettingsToFirebase(settingsData) {
    if (!isFirebaseReady || !db) return false;
    try {
        await db.collection("settings").doc("store").set(settingsData, { merge: true });
        return true;
    } catch (error) {
        console.error("Gagal menyimpan settings ke Firestore:", error);
        throw error;
    }
}
