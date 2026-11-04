// ======================================================================================
// FIREBASE SERVICE - MEDIA PEMBELAJARAN PERBANDINGAN TRIGONOMETRI SMA
// Sinkronisasi Database Real-time Cloud Firestore untuk GitHub Pages
// ======================================================================================

window.FirebaseService = (function() {
  let db = null;
  let isInitialized = false;
  let isConnected = false;
  let currentConfig = null;
  const LOCAL_CONFIG_KEY = 'trigonometri_firebase_config';

  // 1. Dapatkan Konfigurasi Firebase Aktif (dari LocalStorage atau firebase-config.js)
  function getConfig() {
    try {
      const stored = localStorage.getItem(LOCAL_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.apiKey && !parsed.apiKey.includes('YOUR_')) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca firebase config dari localStorage:', e);
    }

    if (window.FIREBASE_CONFIG &&
        window.FIREBASE_CONFIG.apiKey &&
        !window.FIREBASE_CONFIG.apiKey.includes('YOUR_') &&
        window.FIREBASE_CONFIG.projectId &&
        !window.FIREBASE_CONFIG.projectId.includes('YOUR_')) {
      return window.FIREBASE_CONFIG;
    }

    return null;
  }

  // 2. Inisialisasi Firebase App & Cloud Firestore
  function init() {
    if (isInitialized && db) return true;

    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
      console.warn('Firebase SDK compat belum dimuat. Sistem berjalan dalam Mode Penyimpanan Lokal.');
      updateUIStatus(false, 'SDK Firebase Tidak Terdeteksi');
      return false;
    }

    const config = getConfig();
    if (!config) {
      console.info('Firebase belum dikonfigurasi. Menggunakan Mode Penyimpanan Lokal (Offline).');
      updateUIStatus(false, 'Belum Dikonfigurasi (Mode Lokal)');
      return false;
    }

    try {
      currentConfig = config;
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(config);
      }

      db = firebase.firestore();

      // Aktifkan offline persistence jika didukung browser
      try {
        db.enablePersistence({ synchronizeTabs: true }).catch(err => {
          if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
            console.warn('Persistence notice:', err);
          }
        });
      } catch (pe) {}

      isInitialized = true;
      isConnected = true;
      updateUIStatus(true, `Terhubung (${config.projectId})`);

      // Mulai realtime listener untuk setting token dan butir soal
      initRealtimeListeners();

      console.log('✅ Firebase Cloud Firestore berhasil terhubung ke proyek:', config.projectId);
      return true;
    } catch (err) {
      console.error('❌ Gagal inisialisasi Firebase Firestore:', err);
      isConnected = false;
      updateUIStatus(false, 'Gagal Terhubung');
      return false;
    }
  }

  // 3. Update Status Indikator di Tampilan Web
  function updateUIStatus(connected, message) {
    const badges = document.querySelectorAll('.firebase-status-badge, #firebase-status-badge');
    badges.forEach(b => {
      if (connected) {
        b.className = 'firebase-status-badge text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs cursor-pointer';
        b.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span>Cloud Firebase Online</span>';
        b.title = message || 'Database Cloud Firebase Aktif';
      } else {
        b.className = 'firebase-status-badge text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-2xs cursor-pointer';
        b.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Mode Lokal (Offline)</span>';
        b.title = message || 'Klik untuk menghubungkan ke Firebase';
      }
    });

    const navBadges = document.querySelectorAll('#nav-cloud-status');
    navBadges.forEach(nb => {
      if (connected) {
        nb.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold cursor-pointer';
        nb.innerHTML = '<i class="fa-solid fa-cloud text-emerald-400"></i><span>Cloud Aktif</span>';
      } else {
        nb.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold cursor-pointer';
        nb.innerHTML = '<i class="fa-solid fa-cloud-slash text-amber-400"></i><span>Mode Lokal</span>';
      }
    });
  }

  // 4. Real-time Listeners (Sinkronisasi Otomatis Antar Perangkat)
  function initRealtimeListeners() {
    if (!db) return;

    try {
      // A. Listener Token Ujian
      db.collection('settings').doc('config').onSnapshot(doc => {
        if (doc && doc.exists) {
          const data = doc.data();
          if (data && data.exam_token) {
            const tok = data.exam_token.trim().toUpperCase();
            if (window.StorageService && StorageService.settings) {
              const localDb = StorageService.db ? StorageService.db.getDB() : null;
              if (localDb) {
                localDb.settings = localDb.settings || {};
                localDb.settings.exam_token = tok;
                StorageService.db.saveDB(localDb);
              }
            }
            const badge = document.getElementById('teacher-questions-token-badge');
            if (badge) badge.textContent = tok;
          }
        }
      }, err => console.warn('Listener settings notice:', err));

      // B. Listener Bank Soal
      db.collection('questions').onSnapshot(snapshot => {
        if (snapshot && !snapshot.empty) {
          const cloudQuestions = [];
          snapshot.forEach(doc => {
            const q = doc.data();
            cloudQuestions.push(q);
          });
          if (cloudQuestions.length > 0 && window.StorageService && StorageService.db) {
            const localDb = StorageService.db.getDB();
            localDb.questions = cloudQuestions;
            StorageService.db.saveDB(localDb);
          }
        }
      }, err => console.warn('Listener questions notice:', err));

      // C. Listener Butir Refleksi
      db.collection('reflections').onSnapshot(snapshot => {
        if (snapshot && !snapshot.empty) {
          const cloudRefs = [];
          snapshot.forEach(doc => cloudRefs.push(doc.data()));
          if (cloudRefs.length > 0 && window.StorageService && StorageService.db) {
            const localDb = StorageService.db.getDB();
            localDb.reflections = cloudRefs;
            StorageService.db.saveDB(localDb);
          }
        }
      }, err => console.warn('Listener reflections notice:', err));

    } catch (e) {
      console.warn('Realtime listeners notice:', e);
    }
  }

  // 5. Uji Koneksi Firestore
  async function testConnection() {
    if (!init()) {
      return { success: false, message: 'Firebase belum terkonfigurasi atau SDK belum siap.' };
    }
    try {
      const startTime = Date.now();
      const testDocRef = db.collection('settings').doc('ping');
      await testDocRef.set({
        ping: 'pong',
        tested_at: new Date().toISOString()
      }, { merge: true });
      const snap = await testDocRef.get();
      const latency = Date.now() - startTime;

      if (snap.exists) {
        isConnected = true;
        updateUIStatus(true);
        return {
          success: true,
          latency,
          projectId: currentConfig.projectId,
          message: `Koneksi ke Cloud Firestore Berhasil! (Latensi: ${latency} ms)`
        };
      }
      return { success: false, message: 'Gagal membaca kembali data tes dari Firestore.' };
    } catch (err) {
      console.error('Test Connection Error:', err);
      return { success: false, message: err.message || 'Gagal terhubung ke Cloud Firestore.' };
    }
  }

  // 6. Unggah / Sinkronisasi Data Awal (Seed 108 Siswa & Bank Soal ke Firestore)
  async function seedInitialData() {
    if (!init()) {
      return { success: false, message: 'Harap konfigurasi Firebase terlebih dahulu sebelum sinkronisasi data.' };
    }

    try {
      const seed = window.INITIAL_DB_SEED || (window.StorageService && StorageService.db ? StorageService.db.getDB() : null);
      if (!seed) {
        return { success: false, message: 'Data awal (INITIAL_DB_SEED) tidak ditemukan.' };
      }

      let batch = db.batch();
      let opCount = 0;
      const MAX_BATCH = 450;

      async function commitBatchIfNeeded() {
        if (opCount >= MAX_BATCH) {
          await batch.commit();
          batch = db.batch();
          opCount = 0;
        }
      }

      // A. Settings
      const cfgRef = db.collection('settings').doc('config');
      batch.set(cfgRef, {
        exam_token: (seed.settings && seed.settings.exam_token) ? seed.settings.exam_token : 'TRIGONO2026',
        seeded_at: new Date().toISOString(),
        version: '2.0'
      }, { merge: true });
      opCount++;

      // B. Classes (6 Kelas)
      if (Array.isArray(seed.classes)) {
        for (const c of seed.classes) {
          const docRef = db.collection('classes').doc(String(c.id));
          batch.set(docRef, { id: c.id, class_name: c.class_name }, { merge: true });
          opCount++;
          await commitBatchIfNeeded();
        }
      }

      // C. Activities (10 Modul)
      if (Array.isArray(seed.activities)) {
        for (const a of seed.activities) {
          const docRef = db.collection('activities').doc(String(a.id));
          batch.set(docRef, a, { merge: true });
          opCount++;
          await commitBatchIfNeeded();
        }
      }

      // D. Questions (Bank Soal Akt 1, 2, 5, 7, 8)
      if (Array.isArray(seed.questions)) {
        for (const q of seed.questions) {
          const docRef = db.collection('questions').doc(String(q.id));
          batch.set(docRef, q, { merge: true });
          opCount++;
          await commitBatchIfNeeded();
        }
      }

      // E. Reflections (Instrumen Refleksi Akt 9)
      if (Array.isArray(seed.reflections)) {
        for (const r of seed.reflections) {
          const docRef = db.collection('reflections').doc(String(r.id));
          batch.set(docRef, r, { merge: true });
          opCount++;
          await commitBatchIfNeeded();
        }
      }

      // F. Users (108 Siswa + Guru Aswan)
      if (Array.isArray(seed.users)) {
        for (const u of seed.users) {
          const docRef = db.collection('users').doc(String(u.id));
          const uCopy = Object.assign({}, u);
          if (uCopy.role === 'siswa') {
            uCopy.class_name = resolveClassName(uCopy);
          }
          batch.set(docRef, uCopy, { merge: true });
          opCount++;
          await commitBatchIfNeeded();
        }
      }

      // Commit sisa batch
      if (opCount > 0) {
        await batch.commit();
      }

      console.log('✅ Berhasil menyinkronkan seluruh data awal ke Cloud Firestore!');
      return {
        success: true,
        message: 'Seluruh data awal (108 Siswa SMAS Al Azhar Mandiri Palu, Akun Guru, 10 Modul, Bank Soal, dan Refleksi) berhasil diunggah ke Cloud Firestore!'
      };
    } catch (err) {
      console.error('Error saat seed data ke Firestore:', err);
      return { success: false, message: 'Gagal sinkronisasi data: ' + err.message };
    }
  }

  // ====================================================================================
  // 7. OPERASI DATABASE CLOUD (DIPANGGIL OLEH INTERCEPTOR / APP)
  // ====================================================================================

  function resolveClassName(u) {
    if (!u) return 'XA';
    if (u.class_name && typeof u.class_name === 'string' && u.class_name.trim().length > 0) {
      const cn = u.class_name.trim().toUpperCase();
      if (['XA', 'XB', 'XC', 'XD', 'XE', 'XF'].includes(cn)) return cn;
    }
    const cid = parseInt(u.class_id, 10);
    if (cid === 1) return 'XA';
    if (cid === 2) return 'XB';
    if (cid === 3) return 'XC';
    if (cid === 4) return 'XD';
    if (cid === 5) return 'XE';
    if (cid === 6) return 'XF';
    if (u.access_code) {
      const p = u.access_code.trim().charAt(0).toUpperCase();
      if (p === 'A') return 'XA';
      if (p === 'B') return 'XB';
      if (p === 'C') return 'XC';
      if (p === 'D') return 'XD';
      if (p === 'E') return 'XE';
      if (p === 'F') return 'XF';
    }
    return 'XA';
  }

  // A. AUTHENTICATION
  async function cloudLoginStudent(code) {
    if (!init()) return null;
    try {
      const cleanCode = (code || '').trim().toUpperCase().replace(/[\s\-_]/g, '');
      let snap = await db.collection('users').where('role', '==', 'siswa').get();

      // Jika database Cloud masih kosong, otomatis seed data awal
      if (snap.empty) {
        console.log('Database Cloud Firestore masih kosong. Melakukan inisialisasi otomatis data awal...');
        await seedInitialData();
        snap = await db.collection('users').where('role', '==', 'siswa').get();
      }

      let matchedUser = null;
      snap.forEach(doc => {
        const u = doc.data();
        const uCode = (u.access_code || '').toUpperCase().replace(/[\s\-_]/g, '');
        if (uCode === cleanCode) {
          matchedUser = Object.assign({}, u, {
            class_name: resolveClassName(u)
          });
        }
      });

      if (matchedUser) {
        return { success: true, user: matchedUser, message: `Selamat datang, ${matchedUser.name}!` };
      }
    } catch (e) {
      console.warn('cloudLoginStudent notice:', e);
    }
    return null;
  }

  async function cloudRegisterStudent(name, className, absen) {
    if (!init()) return null;
    try {
      const usersSnap = await db.collection('users').get();
      let maxId = 0;
      usersSnap.forEach(d => {
        const u = d.data();
        if (u.id > maxId) maxId = u.id;
      });

      const newId = maxId + 1;
      const prefix = className.replace(/^X/i, '');
      const code = `${prefix}${absen}`;

      const newUser = {
        id: newId,
        role: 'siswa',
        name: name.trim(),
        access_code: code,
        class_name: className,
        class_id: 1,
        created_at: new Date().toISOString()
      };

      await db.collection('users').doc(String(newId)).set(newUser);

      // Inisialisasi progres 10 aktivitas di Firestore
      const batch = db.batch();
      for (let i = 1; i <= 10; i++) {
        const progRef = db.collection('student_progress').doc(`${newId}_${i}`);
        batch.set(progRef, {
          user_id: newId,
          activity_id: i,
          status: i === 1 ? 'in_progress' : 'locked',
          score: null,
          completed_at: null
        });
      }
      await batch.commit();

      return { success: true, user: newUser, message: 'Pendaftaran siswa baru berhasil tersimpan di Cloud.' };
    } catch (e) {
      console.warn('cloudRegisterStudent error:', e);
    }
    return null;
  }

  // B. ACTIVITIES & SUBMISSIONS
  const ACTIVITY_INFO = {
    1: { title: "Pertanyaan Pemantik", subtitle: "Mengamati fenomena pengukuran tinggi pohon & gedung tanpa memanjat." },
    2: { title: "LKPD Simulasi Konsep", subtitle: "Eksplorasi segitiga siku-siku & penemuan rasio sin, cos, tan." },
    3: { title: "Materi Trigonometri", subtitle: "Definisi sisi depan, samping, miring & mnemonik Demi-Sami-Desa." },
    4: { title: "Sudut Istimewa", subtitle: "Pembuktian geometris & tabel nilai sudut istimewa 0°, 30°, 45°, 60°, 90°." },
    5: { title: "Latihan Soal", subtitle: "5 butir latihan uji pemahaman konsep dasar dengan umpan balik instan." },
    6: { title: "Simulasi Terapan", subtitle: "3 Simulasi interaktif: Tinggi Pohon, Pendaratan Pesawat, Layang-layang." },
    7: { title: "Contoh Literasi Numerasi", subtitle: "5 Contoh soal kontekstual AKM/literasi numerasi dan pembahasannya." },
    8: { title: "Sumatif Literasi Numerasi", subtitle: "Asesmen sumatif terstruktur berbasis stimulus narasi dan diagram." },
    9: { title: "Refleksi Belajar", subtitle: "Evaluasi proses belajar dan pemahaman materi secara mandiri." },
    10: { title: "Hasil Belajar", subtitle: "Laporan akhir pencapaian, sertifikat kompetensi & umpan balik guru." }
  };

  async function cloudGetActivity(actNum, userId) {
    if (!init()) return null;
    try {
      const uId = parseInt(userId, 10);

      // 1. Cek status aktivitas sebelumnya
      if (actNum > 1) {
        const prevProgDoc = await db.collection('student_progress').doc(`${uId}_${actNum - 1}`).get();
        if (!prevProgDoc.exists || prevProgDoc.data().status !== 'completed') {
          return {
            success: false,
            is_locked: true,
            required_activity: actNum - 1,
            message: `Aktivitas ${actNum} terkunci! Selesaikan Aktivitas ${actNum - 1} terlebih dahulu.`
          };
        }
      }

      // 2. Ambil metadata aktivitas (title, subtitle)
      let actTitle = (ACTIVITY_INFO[actNum] && ACTIVITY_INFO[actNum].title) || `Aktivitas ${actNum}`;
      let actSubtitle = (ACTIVITY_INFO[actNum] && ACTIVITY_INFO[actNum].subtitle) || '';
      try {
        const actDoc = await db.collection('activities').doc(String(actNum)).get();
        if (actDoc.exists) {
          const ad = actDoc.data();
          if (ad.title) actTitle = ad.title;
          if (ad.subtitle) actSubtitle = ad.subtitle;
        }
      } catch (ae) {}

      // 3. Ambil soal untuk aktivitas ini
      const qSnap = await db.collection('questions').where('activity_id', '==', actNum).get();
      let questions = [];
      qSnap.forEach(d => questions.push(d.data()));
      questions.sort((a, b) => (a.order_num || 0) - (b.order_num || 0));

      if (questions.length === 0 && window.StorageService && StorageService.activities) {
        const localAct = StorageService.activities.get(actNum);
        if (localAct && localAct.questions) questions = localAct.questions;
      }

      // 4. Ambil progres & jawaban tersimpan
      const progDoc = await db.collection('student_progress').doc(`${uId}_${actNum}`).get();
      const prog = progDoc.exists ? progDoc.data() : { status: actNum === 1 ? 'in_progress' : 'locked' };

      const ansSnap = await db.collection('student_answers').where('user_id', '==', uId).get();
      const existingAnswers = [];
      ansSnap.forEach(d => {
        const a = d.data();
        if (questions.some(q => q.id === a.question_id) || a.question_id == actNum) {
          existingAnswers.push(a);
        }
      });

      // 5. Khusus Aktivitas 9: Ambil instrumen refleksi & respon siswa
      let reflections = [];
      let reflectionResponses = [];
      if (actNum === 9) {
        try {
          const refSnap = await db.collection('reflections').get();
          if (!refSnap.empty) {
            refSnap.forEach(d => {
              const r = d.data();
              if (r.is_active == 1 || r.is_active === true || r.is_active === undefined) {
                reflections.push(r);
              }
            });
            reflections.sort((a, b) => (a.order_num || a.id || 0) - (b.order_num || b.id || 0));
          }
        } catch (re) {}

        if (reflections.length === 0) {
          const defaultRefs = (window.INITIAL_DB_SEED && Array.isArray(window.INITIAL_DB_SEED.reflections))
            ? window.INITIAL_DB_SEED.reflections
            : [
                { id: 1, prompt_text: "Seberapa pahamkah Anda mengenai konsep sinus, kosinus, dan tangen setelah mengikuti pembelajaran ini?", type: "scale", is_active: 1 },
                { id: 2, prompt_text: "Seberapa menarik dan membantukah media pembelajaran digital ini dalam memudahkan Anda memahami konsep abstrak matematika?", type: "scale", is_active: 1 },
                { id: 3, prompt_text: "Aktivitas pembelajaran nomor berapa yang menurut Anda paling menantang dan memerlukan penjelasan tambahan dari guru?", type: "essay", is_active: 1 },
                { id: 4, prompt_text: "Tuliskan satu hikmah atau penerapan perbandingan trigonometri di kehidupan sehari-hari yang paling berkesan bagi Anda!", type: "essay", is_active: 1 }
              ];
          reflections = defaultRefs.filter(r => r.is_active == 1 || r.is_active === true || r.is_active === undefined);
        }

        try {
          const respSnap = await db.collection('reflection_responses').where('user_id', '==', uId).get();
          respSnap.forEach(d => reflectionResponses.push(d.data()));
        } catch (re) {}
      }

      // 6. Khusus Aktivitas 10: Rapor Hasil Belajar
      let recap = null;
      if (actNum === 10 && window.StorageService && StorageService.activities) {
        const localAct10 = StorageService.activities.get(10);
        if (localAct10 && localAct10.recap) recap = localAct10.recap;
      }

      return {
        success: true,
        activity: {
          id: actNum,
          activity_number: actNum,
          title: actTitle,
          subtitle: actSubtitle,
          user_status: prog.status,
          score: prog.score
        },
        questions,
        existing_answers: existingAnswers,
        reflections,
        reflection_responses: reflectionResponses,
        recap
      };
    } catch (e) {
      console.warn('cloudGetActivity notice:', e);
    }
    return null;
  }

  async function cloudGetProgress(userId) {
    if (!init()) return null;
    try {
      const uId = parseInt(userId, 10);
      let progSnap = await db.collection('student_progress').where('user_id', '==', uId).get();

      if (progSnap.empty) {
        const batch = db.batch();
        for (let i = 1; i <= 10; i++) {
          const pref = db.collection('student_progress').doc(`${uId}_${i}`);
          batch.set(pref, {
            user_id: uId,
            activity_id: i,
            status: i === 1 ? 'in_progress' : 'locked',
            score: null,
            completed_at: null
          });
        }
        await batch.commit();
        progSnap = await db.collection('student_progress').where('user_id', '==', uId).get();
      }

      const progMap = {};
      progSnap.forEach(d => {
        const p = d.data();
        progMap[p.activity_id] = p;
      });

      const progress = [];
      let completedCount = 0;
      let currentActive = 1;

      for (let i = 1; i <= 10; i++) {
        const sp = progMap[i];
        const actInfo = ACTIVITY_INFO[i] || { title: `Aktivitas ${i}`, subtitle: '' };
        const status = sp ? sp.status : (i === 1 ? 'in_progress' : 'locked');
        if (status === 'completed') completedCount++;
        if (status === 'in_progress') currentActive = i;

        progress.push({
          activity_id: i,
          activity_number: i,
          title: actInfo.title,
          subtitle: actInfo.subtitle,
          status: status,
          score: sp ? sp.score : null,
          updated_at: sp ? sp.completed_at : null
        });
      }

      if (completedCount === 10) currentActive = 10;
      const percentage = Math.round((completedCount / 10) * 100);

      // Sinkronkan ke StorageService lokal agar instan
      if (window.StorageService && StorageService.db) {
        try {
          const ldb = StorageService.db.getDB();
          if (ldb && Array.isArray(ldb.student_progress)) {
            progress.forEach(p => {
              let lsp = ldb.student_progress.find(x => x.user_id == uId && x.activity_id == p.activity_id);
              if (lsp) {
                lsp.status = p.status;
                lsp.score = p.score;
              } else {
                ldb.student_progress.push({
                  user_id: uId,
                  activity_id: p.activity_id,
                  status: p.status,
                  score: p.score
                });
              }
            });
            StorageService.db.saveDB(ldb);
          }
        } catch (le) {}
      }

      return {
        success: true,
        message: 'Progres belajar Cloud Firestore berhasil dimuat',
        progress,
        completed_count: completedCount,
        total_activities: 10,
        percentage,
        current_active: currentActive
      };
    } catch (e) {
      console.warn('cloudGetProgress error:', e);
    }
    return null;
  }

  async function cloudSubmitActivity(actNum, payload, userId, localRes) {
    if (!init()) return null;
    try {
      const batch = db.batch();
      const uId = parseInt(userId, 10);
      const nowIso = new Date().toISOString();

      let computedScore = null;
      if (localRes && localRes.score !== undefined) {
        computedScore = localRes.score;
      } else if (payload.score !== undefined) {
        computedScore = payload.score;
      }

      // 1. Simpan jawaban per tipe aktivitas ke student_answers di Cloud Firestore
      // A. Aktivitas 1: Pertanyaan Pemantik (Esai)
      if (actNum === 1) {
        const essay = (payload.essay_answer || payload.essay || payload.answer || '').trim();
        const ansRef = db.collection('student_answers').doc(`${uId}_1`);
        batch.set(ansRef, {
          user_id: uId,
          question_id: 1,
          student_answer: essay,
          score: 0,
          teacher_feedback: null,
          submitted_at: nowIso
        }, { merge: true });
      }

      // B. Aktivitas 2: LKPD Simulasi Konsep (Tabel Observasi & Kesimpulan)
      else if (actNum === 2) {
        const conclusion = (payload.conclusion || '').trim();
        const answerPayload = JSON.stringify({
          observation_table: payload.observation_table || [],
          conclusion: conclusion,
          q1: payload.q1 || '',
          q2: payload.q2 || '',
          q3: payload.q3 || '',
          submitted_at: nowIso
        });
        const ansRef = db.collection('student_answers').doc(`${uId}_2`);
        batch.set(ansRef, {
          user_id: uId,
          question_id: 2,
          student_answer: answerPayload,
          score: 0,
          teacher_feedback: null,
          submitted_at: nowIso
        }, { merge: true });
      }

      // C. Aktivitas 4: Verifikasi Sudut Istimewa
      else if (actNum === 4) {
        const answerPayload = JSON.stringify({
          table_answers: payload.table_answers || {},
          submitted_at: nowIso
        });
        const ansRef = db.collection('student_answers').doc(`${uId}_4`);
        batch.set(ansRef, {
          user_id: uId,
          question_id: 4,
          student_answer: answerPayload,
          score: 100,
          submitted_at: nowIso
        }, { merge: true });
      }

      // D. Aktivitas 5 atau Aktivitas 8: Pilihan Ganda / Soal AKM
      else if (actNum === 5 || actNum === 8) {
        if (localRes && Array.isArray(localRes.results)) {
          localRes.results.forEach(r => {
            const ansRef = db.collection('student_answers').doc(`${uId}_${r.question_id}`);
            batch.set(ansRef, {
              user_id: uId,
              question_id: r.question_id,
              student_answer: r.student_answer || '',
              is_correct: r.is_correct ? 1 : 0,
              score: r.is_correct ? 100 : 0,
              submitted_at: nowIso
            }, { merge: true });
          });
        } else if (payload.answers && typeof payload.answers === 'object') {
          for (const qIdStr of Object.keys(payload.answers)) {
            const qId = parseInt(qIdStr, 10);
            const studentAns = payload.answers[qIdStr];
            const isCorrect = (payload.details && payload.details[qIdStr] && payload.details[qIdStr].is_correct) ? 1 : 0;
            const itemScore = isCorrect ? 100 : 0;

            const ansRef = db.collection('student_answers').doc(`${uId}_${qId}`);
            batch.set(ansRef, {
              user_id: uId,
              question_id: qId,
              student_answer: studentAns,
              is_correct: isCorrect,
              score: itemScore,
              submitted_at: nowIso
            }, { merge: true });
          }
        }
      }

      // E. Aktivitas 9: Refleksi Belajar Siswa
      else if (actNum === 9) {
        const rawRefs = payload.reflections || payload.responses || {};
        if (Array.isArray(rawRefs)) {
          rawRefs.forEach(r => {
            const rId = parseInt(r.reflection_id || r.id, 10);
            const respRef = db.collection('reflection_responses').doc(`${uId}_${rId}`);
            batch.set(respRef, {
              user_id: uId,
              reflection_id: rId,
              response_text: r.response_text || r.text || '',
              rating: r.rating !== undefined ? Number(r.rating) : 5,
              submitted_at: nowIso
            }, { merge: true });
          });
        } else if (typeof rawRefs === 'object') {
          for (const refIdStr of Object.keys(rawRefs)) {
            const rId = parseInt(refIdStr, 10);
            const rVal = rawRefs[refIdStr];
            let respText = '';
            let ratingVal = 5;
            if (typeof rVal === 'object' && rVal !== null) {
              respText = rVal.text || rVal.response_text || '';
              ratingVal = rVal.rating !== undefined ? Number(rVal.rating) : 5;
            } else if (typeof rVal === 'number') {
              ratingVal = rVal;
              respText = String(rVal);
            } else {
              respText = String(rVal || '');
            }

            const respRef = db.collection('reflection_responses').doc(`${uId}_${rId}`);
            batch.set(respRef, {
              user_id: uId,
              reflection_id: rId,
              response_text: respText,
              rating: ratingVal,
              submitted_at: nowIso
            }, { merge: true });
          }
        }
      }

      // 2. Update progres aktivitas saat ini -> completed
      const curProgRef = db.collection('student_progress').doc(`${uId}_${actNum}`);
      batch.set(curProgRef, {
        user_id: uId,
        activity_id: actNum,
        status: 'completed',
        score: computedScore,
        completed_at: nowIso
      }, { merge: true });

      // 3. Buka kunci aktivitas berikutnya -> in_progress
      if (actNum < 10) {
        const nextProgRef = db.collection('student_progress').doc(`${uId}_${actNum + 1}`);
        batch.set(nextProgRef, {
          user_id: uId,
          activity_id: actNum + 1,
          status: 'in_progress'
        }, { merge: true });
      }

      // Jika Aktivitas 9 tuntas, buka & selesaikan Aktivitas 10
      if (actNum === 9) {
        const act10Ref = db.collection('student_progress').doc(`${uId}_10`);
        batch.set(act10Ref, {
          user_id: uId,
          activity_id: 10,
          status: 'completed',
          completed_at: nowIso
        }, { merge: true });
      }

      // 4. Update data user di collection 'users'
      const userDocRef = db.collection('users').doc(String(uId));
      batch.set(userDocRef, {
        current_activity: Math.min(10, actNum + 1),
        last_active: nowIso
      }, { merge: true });

      await batch.commit();
      return { success: true, message: 'Progres belajar dan jawaban berhasil disimpan ke Cloud Firestore!' };
    } catch (e) {
      console.warn('cloudSubmitActivity error:', e);
    }
    return null;
  }

  // C. TEACHER DASHBOARD & BANK SOAL
  async function cloudGetTeacherDashboard(classFilter) {
    if (!init()) return null;
    try {
      let usersSnap = await db.collection('users').where('role', '==', 'siswa').get();

      // Jika database Cloud masih kosong, otomatis seed data awal
      if (usersSnap.empty) {
        console.log('Database Cloud Firestore kosong. Mengunggah data awal...');
        await seedInitialData();
        usersSnap = await db.collection('users').where('role', '==', 'siswa').get();
      }

      const progSnap = await db.collection('student_progress').get();
      const ansSnap = await db.collection('student_answers').get();
      const questionsSnap = await db.collection('questions').get();

      const questionsMap = {};
      questionsSnap.forEach(d => {
        const q = d.data();
        questionsMap[q.id] = q;
      });

      const q1List = Object.values(questionsMap).filter(q => q.activity_id == 1);
      const q2List = Object.values(questionsMap).filter(q => q.activity_id == 2);
      const q5List = Object.values(questionsMap).filter(q => q.activity_id == 5);
      const q8List = Object.values(questionsMap).filter(q => q.activity_id == 8);

      const q1Ids = q1List.map(q => q.id);
      const q2Ids = q2List.map(q => q.id);
      const q5Ids = q5List.map(q => q.id);
      const q8Ids = q8List.map(q => q.id);

      const progressList = [];
      progSnap.forEach(d => progressList.push(d.data()));

      const answersList = [];
      ansSnap.forEach(d => answersList.push(d.data()));

      const students = [];
      usersSnap.forEach(d => {
        const u = d.data();
        const resolvedClass = resolveClassName(u);
        if (classFilter && classFilter !== 'all' && resolvedClass !== classFilter) return;

        const uProgs = progressList.filter(p => p.user_id == u.id);
        const p1 = uProgs.find(p => p.activity_id == 1);
        const p2 = uProgs.find(p => p.activity_id == 2);
        const p5 = uProgs.find(p => p.activity_id == 5);
        const p8 = uProgs.find(p => p.activity_id == 8);

        // Cari aktivitas tertinggi
        let curAct = 1;
        uProgs.forEach(p => {
          const aId = parseInt(p.activity_id, 10) || 1;
          if (p.status === 'completed') {
            if (aId + 1 > curAct) curAct = Math.min(10, aId + 1);
          } else if (p.status === 'in_progress') {
            if (aId > curAct) curAct = aId;
          }
        });
        if (u.current_activity && u.current_activity > curAct) {
          curAct = u.current_activity;
        }

        // Skor Akt 5
        let act5Score = null;
        if (p5 && p5.score !== null && p5.score !== undefined) {
          act5Score = p5.score;
        } else {
          const a5 = answersList.filter(a => a.user_id == u.id && q5Ids.some(qid => qid == a.question_id));
          if (a5.length > 0) {
            const sum = a5.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
            act5Score = Math.round(sum / a5.length);
          }
        }

        // Skor Akt 8
        let act8Score = null;
        if (p8 && p8.score !== null && p8.score !== undefined) {
          act8Score = p8.score;
        } else {
          const a8 = answersList.filter(a => a.user_id == u.id && q8Ids.some(qid => qid == a.question_id));
          if (a8.length > 0) {
            const sum = a8.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
            act8Score = Math.round(sum / a8.length);
          }
        }

        // Nilai & Jawaban LKPD (Akt 2) & Pemantik (Akt 1)
        const a1 = answersList.find(a => a.user_id == u.id && (a.question_id == 1 || q1Ids.some(qid => qid == a.question_id)));
        const a2 = answersList.find(a => a.user_id == u.id && (a.question_id == 2 || q2Ids.some(qid => qid == a.question_id)));

        const act1Score = (p1 && (p1.teacher_score !== undefined || p1.score !== null))
          ? (p1.teacher_score ?? p1.score)
          : (a1 ? (a1.score ?? null) : null);
        const act1Feedback = (p1 && p1.teacher_feedback) ? p1.teacher_feedback : (a1 ? a1.teacher_feedback : null);
        const act1Answer = a1 ? (a1.student_answer ?? null) : null;

        const act2Score = (p2 && (p2.teacher_score !== undefined || p2.score !== null))
          ? (p2.teacher_score ?? p2.score)
          : (a2 ? (a2.score ?? null) : null);
        const act2Feedback = (p2 && p2.teacher_feedback) ? p2.teacher_feedback : (a2 ? a2.teacher_feedback : null);
        const act2Answer = a2 ? (a2.student_answer ?? null) : null;

        students.push({
          id: u.id,
          name: u.name || '',
          access_code: u.access_code || '',
          role: u.role || 'siswa',
          class_name: resolvedClass,
          class_id: u.class_id,
          current_activity: curAct,
          act5_score: act5Score,
          act8_score: act8Score,
          act1_score: act1Score,
          act1_feedback: act1Feedback,
          act1_answer: act1Answer,
          act2_score: act2Score,
          act2_feedback: act2Feedback,
          act2_answer: act2Answer
        });
      });

      // Natural numerical sort: A1 to A36
      students.sort((a, b) => {
        if (a.class_name !== b.class_name) {
          return (a.class_name || '').localeCompare(b.class_name || '');
        }
        const numA = parseInt((a.access_code || '').replace(/\D/g, ''), 10) || 0;
        const numB = parseInt((b.access_code || '').replace(/\D/g, ''), 10) || 0;
        if (numA !== numB) return numA - numB;
        return (a.access_code || '').localeCompare(b.access_code || '');
      });

      const totalStudents = students.length;
      const completedStudents = students.filter(s => s.current_activity >= 10).length;
      const scores5 = students.filter(s => s.act5_score !== null).map(s => s.act5_score);
      const avgAct5 = scores5.length > 0 ? (scores5.reduce((a, b) => a + b, 0) / scores5.length).toFixed(1) : 0;
      const scores8 = students.filter(s => s.act8_score !== null).map(s => s.act8_score);
      const avgAct8 = scores8.length > 0 ? (scores8.reduce((a, b) => a + b, 0) / scores8.length).toFixed(1) : 0;

      const defaultClasses = [
        { id: 1, class_name: 'XA' },
        { id: 2, class_name: 'XB' },
        { id: 3, class_name: 'XC' },
        { id: 4, class_name: 'XD' },
        { id: 5, class_name: 'XE' },
        { id: 6, class_name: 'XF' }
      ];

      return {
        success: true,
        classes: defaultClasses,
        selected_class: classFilter || 'all',
        students,
        stats: {
          total_students: totalStudents,
          completed_students: completedStudents,
          avg_act5: avgAct5,
          avg_act8: avgAct8
        }
      };
    } catch (e) {
      console.warn('cloudGetTeacherDashboard notice:', e);
    }
    return null;
  }

  // D. DETAIL SUBMISSI KARYA SISWA UNTUK GURU
  async function cloudGetStudentDetailSubmission(studentId) {
    if (!init()) return null;
    try {
      const sId = parseInt(studentId, 10);

      // 1. Ambil profil siswa
      const userDoc = await db.collection('users').doc(String(sId)).get();
      let st = userDoc.exists ? userDoc.data() : null;
      if (!st) {
        const uSnap = await db.collection('users').where('id', '==', sId).get();
        if (!uSnap.empty) st = uSnap.docs[0].data();
      }
      if (!st) {
        if (window.StorageService && StorageService.teacher) {
          return StorageService.teacher.getStudentDetailSubmission(sId);
        }
        return { success: false, message: 'Siswa tidak ditemukan di Cloud Firestore.' };
      }
      const resolvedClassName = resolveClassName(st);

      // 2. Ambil progres semua aktivitas
      const progSnap = await db.collection('student_progress').where('user_id', '==', sId).get();
      const progressMap = {};
      progSnap.forEach(d => {
        const p = d.data();
        progressMap[p.activity_id] = p;
      });

      const progressList = [];
      for (let i = 1; i <= 10; i++) {
        const p = progressMap[i];
        const actInfo = ACTIVITY_INFO[i] || { title: `Aktivitas ${i}` };
        progressList.push({
          activity_id: i,
          activity_number: i,
          title: actInfo.title,
          status: p ? p.status : (i === 1 ? 'in_progress' : 'locked'),
          score: p ? (p.score ?? null) : null,
          completed_at: p ? (p.completed_at ?? null) : null
        });
      }

      // 3. Ambil seluruh jawaban siswa
      const ansSnap = await db.collection('student_answers').where('user_id', '==', sId).get();
      const answersMap = {};
      ansSnap.forEach(d => {
        const a = d.data();
        answersMap[a.question_id] = a;
      });

      // 4. Ambil seluruh butir pertanyaan
      const qSnap = await db.collection('questions').get();
      const allQuestions = [];
      qSnap.forEach(d => allQuestions.push(d.data()));

      // A. Aktivitas 1: Pertanyaan Pemantik
      const q1List = allQuestions.filter(q => q.activity_id == 1);
      const q1 = q1List[0] || { id: 1, question_text: "Bagaimana cara mengukur tinggi pohon tanpa memanjatnya?", stimulus_text: "" };
      const a1 = answersMap[q1.id] || answersMap[1];
      const p1 = progressMap[1];

      // B. Aktivitas 2: LKPD Simulasi Konsep
      const q2List = allQuestions.filter(q => q.activity_id == 2);
      const q2 = q2List[0] || { id: 2 };
      const a2 = answersMap[q2.id] || answersMap[2];
      const p2 = progressMap[2];
      let act2Parsed = null;
      if (a2 && a2.student_answer) {
        try {
          act2Parsed = typeof a2.student_answer === 'object' ? a2.student_answer : JSON.parse(a2.student_answer);
        } catch (e) {
          act2Parsed = { conclusion: a2.student_answer, observation_table: [] };
        }
      }

      // C. Aktivitas 4: Sudut Istimewa
      const q4List = allQuestions.filter(q => q.activity_id == 4);
      const q4 = q4List[0] || { id: 4 };
      const a4 = answersMap[q4.id] || answersMap[4];
      let act4Parsed = null;
      if (a4 && a4.student_answer) {
        try {
          act4Parsed = typeof a4.student_answer === 'object' ? a4.student_answer : JSON.parse(a4.student_answer);
        } catch (e) {}
      }

      // D. Aktivitas 5: Latihan Soal
      const q5List = allQuestions.filter(q => q.activity_id == 5).sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
      let act5CorrectCount = 0;
      const act5Details = q5List.map((q, idx) => {
        const sa = answersMap[q.id];
        const studentAns = sa ? sa.student_answer : null;
        const isCorrect = sa ? (sa.is_correct === 1 || sa.is_correct === true || (studentAns && studentAns.trim().toUpperCase() === (q.correct_answer || '').trim().toUpperCase())) : false;
        if (isCorrect) act5CorrectCount++;
        return {
          number: idx + 1,
          question_id: q.id,
          stimulus_text: q.stimulus_text || '',
          stimulus_image_url: q.stimulus_image_url || '',
          question_text: q.question_text || '',
          options: q.options || {},
          student_answer: studentAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          score: sa ? (sa.score ?? (isCorrect ? 100 : 0)) : 0,
          explanation: q.explanation || ''
        };
      });
      const act5Score = progressMap[5] && progressMap[5].score !== null && progressMap[5].score !== undefined
        ? progressMap[5].score
        : (q5List.length > 0 ? Math.round((act5CorrectCount / q5List.length) * 100) : null);

      // E. Aktivitas 8: Sumatif Literasi Numerasi
      const q8List = allQuestions.filter(q => q.activity_id == 8).sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
      let act8CorrectCount = 0;
      const act8Details = q8List.map((q, idx) => {
        const sa = answersMap[q.id];
        const studentAns = sa ? sa.student_answer : null;
        const isCorrect = sa ? (sa.is_correct === 1 || sa.is_correct === true || (studentAns && studentAns.trim().toUpperCase() === (q.correct_answer || '').trim().toUpperCase())) : false;
        if (isCorrect) act8CorrectCount++;
        return {
          number: idx + 1,
          question_id: q.id,
          stimulus_text: q.stimulus_text || '',
          stimulus_image_url: q.stimulus_image_url || '',
          question_text: q.question_text || '',
          options: q.options || {},
          student_answer: studentAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          score: sa ? (sa.score ?? (isCorrect ? 100 : 0)) : 0,
          explanation: q.explanation || ''
        };
      });
      const act8Score = progressMap[8] && progressMap[8].score !== null && progressMap[8].score !== undefined
        ? progressMap[8].score
        : (q8List.length > 0 ? Math.round((act8CorrectCount / q8List.length) * 100) : null);

      // F. Aktivitas 9: Refleksi Siswa
      const refSnap = await db.collection('reflections').get();
      const cloudRefList = [];
      refSnap.forEach(d => cloudRefList.push(d.data()));
      cloudRefList.sort((a, b) => (a.order_num || a.id || 0) - (b.order_num || b.id || 0));

      const refRespSnap = await db.collection('reflection_responses').where('user_id', '==', sId).get();
      const refRespMap = {};
      refRespSnap.forEach(d => {
        const r = d.data();
        refRespMap[r.reflection_id] = r;
      });

      const refList = cloudRefList.map(rf => {
        const rr = refRespMap[rf.id];
        return {
          id: rf.id,
          prompt_text: rf.prompt_text,
          type: rf.type,
          rating: rr ? rr.rating : null,
          response_text: rr ? rr.response_text : null,
          submitted_at: rr ? rr.submitted_at : null
        };
      });

      return {
        success: true,
        student: {
          id: st.id,
          name: st.name,
          access_code: st.access_code,
          class_name: resolvedClassName,
          class_id: st.class_id
        },
        progress: progressList,
        act1: {
          stimulus_text: q1 ? q1.stimulus_text : '',
          question_text: q1 ? q1.question_text : '',
          answer: a1 ? a1.student_answer : null,
          score: (a1 && a1.score !== undefined && a1.score !== null) ? a1.score : (p1 ? p1.teacher_score ?? p1.score : null),
          teacher_feedback: (a1 && a1.teacher_feedback) ? a1.teacher_feedback : (p1 ? p1.teacher_feedback : null)
        },
        act2: {
          observation_table: (act2Parsed && act2Parsed.observation_table) || [],
          conclusion: (act2Parsed && act2Parsed.conclusion) || '',
          q1: (act2Parsed && act2Parsed.q1) || '',
          q2: (act2Parsed && act2Parsed.q2) || '',
          q3: (act2Parsed && act2Parsed.q3) || '',
          score: (a2 && a2.score !== undefined && a2.score !== null) ? a2.score : (p2 ? p2.teacher_score ?? p2.score : null),
          teacher_feedback: (a2 && a2.teacher_feedback) ? a2.teacher_feedback : (p2 ? p2.teacher_feedback : null)
        },
        act4: {
          table_answers: (act4Parsed && act4Parsed.table_answers) || null,
          status: (progressMap[4] && progressMap[4].status) || 'locked'
        },
        act5: {
          score: act5Score,
          correct_count: act5CorrectCount,
          total_questions: q5List.length,
          items: act5Details
        },
        act8: {
          score: act8Score,
          correct_count: act8CorrectCount,
          total_questions: q8List.length,
          items: act8Details
        },
        act9: {
          reflections: refList
        }
      };
    } catch (e) {
      console.warn('cloudGetStudentDetailSubmission error:', e);
    }
    return null;
  }

  // E. REKAP JAWABAN REFLEKSI UNTUK GURU
  async function cloudViewReflectionResponses(refId) {
    if (!init()) return null;
    try {
      const rId = parseInt(refId, 10);
      const respSnap = await db.collection('reflection_responses').where('reflection_id', '==', rId).get();
      if (respSnap.empty) {
        return { success: true, responses: [] };
      }

      const usersSnap = await db.collection('users').get();
      const userMap = {};
      usersSnap.forEach(d => {
        const u = d.data();
        userMap[u.id] = u;
      });

      const responses = [];
      respSnap.forEach(d => {
        const rr = d.data();
        const u = userMap[rr.user_id] || {};
        responses.push({
          student_name: u.name || 'Siswa #' + rr.user_id,
          access_code: u.access_code || '-',
          class_name: resolveClassName(u),
          rating: rr.rating,
          response_text: rr.response_text,
          submitted_at: rr.submitted_at || new Date().toISOString()
        });
      });

      responses.sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''));
      return { success: true, responses };
    } catch (e) {
      console.warn('cloudViewReflectionResponses error:', e);
    }
    return null;
  }

  // F. INSTRUMEN REFLEKSI (GET / SAVE / DELETE)
  async function cloudGetReflections() {
    if (!init()) return null;
    try {
      const snap = await db.collection('reflections').get();
      const respSnap = await db.collection('reflection_responses').get();
      const responses = [];
      respSnap.forEach(d => responses.push(d.data()));

      let refs = [];
      snap.forEach(d => refs.push(d.data()));
      if (refs.length === 0) return null;

      refs.sort((a, b) => (a.order_num || a.id || 0) - (b.order_num || b.id || 0));
      refs = refs.map(rf => {
        const count = responses.filter(r => r.reflection_id == rf.id).length;
        return Object.assign({}, rf, { response_count: count });
      });
      return { success: true, reflections: refs };
    } catch (e) {}
    return null;
  }

  async function cloudSaveReflection(payload) {
    if (!init()) return null;
    try {
      const rfId = parseInt(payload.id, 10);
      let finalId = rfId;
      if (!finalId || finalId <= 0) {
        const snap = await db.collection('reflections').get();
        let maxId = 0;
        snap.forEach(d => {
          const id = parseInt(d.id, 10) || d.data().id || 0;
          if (id > maxId) maxId = id;
        });
        finalId = maxId + 1;
      }
      const docData = {
        id: finalId,
        prompt_text: payload.prompt_text,
        type: payload.type || 'essay',
        is_active: payload.is_active !== undefined ? payload.is_active : 1,
        order_num: finalId
      };
      await db.collection('reflections').doc(String(finalId)).set(docData, { merge: true });
      return { success: true, message: 'Pertanyaan refleksi berhasil disimpan ke Cloud.' };
    } catch (e) {
      console.warn('cloudSaveReflection error:', e);
    }
    return null;
  }

  async function cloudDeleteReflection(rfId) {
    if (!init()) return null;
    try {
      await db.collection('reflections').doc(String(rfId)).delete();
      return { success: true, message: 'Pertanyaan refleksi berhasil dihapus dari Cloud.' };
    } catch (e) {}
    return null;
  }

  // G. PENILAIAN MANUAL LKPD / PEMANTIK OLEH GURU
  async function cloudGradeManual(studentId, actId, score, feedback) {
    if (!init()) return null;
    try {
      const sId = parseInt(studentId, 10);
      const aId = parseInt(actId, 10);
      const numScore = parseInt(score, 10) || 0;
      const cleanFeedback = feedback || '';

      const batch = db.batch();
      const progRef = db.collection('student_progress').doc(`${sId}_${aId}`);
      batch.set(progRef, {
        user_id: sId,
        activity_id: aId,
        teacher_score: numScore,
        teacher_feedback: cleanFeedback,
        score: numScore
      }, { merge: true });

      const ansRef = db.collection('student_answers').doc(`${sId}_${aId}`);
      batch.set(ansRef, {
        user_id: sId,
        question_id: aId,
        teacher_feedback: cleanFeedback,
        score: numScore
      }, { merge: true });

      await batch.commit();
      return { success: true, message: 'Nilai dan catatan umpan balik guru berhasil disimpan ke Cloud.' };
    } catch (e) {
      console.warn('cloudGradeManual error:', e);
    }
    return null;
  }

  // H. KELOLA BANK SOAL
  async function cloudSaveQuestion(payload) {
    if (!init()) return null;
    try {
      const qId = parseInt(payload.id, 10);
      const docRef = db.collection('questions').doc(String(qId));
      await docRef.set(payload, { merge: true });
      return { success: true, message: 'Soal berhasil disimpan ke Cloud Firestore.' };
    } catch (e) {
      console.warn('cloudSaveQuestion error:', e);
    }
    return null;
  }

  async function cloudDeleteQuestion(qId) {
    if (!init()) return null;
    try {
      await db.collection('questions').doc(String(qId)).delete();
      return { success: true, message: 'Soal berhasil dihapus dari Cloud Firestore.' };
    } catch (e) {
      console.warn('cloudDeleteQuestion error:', e);
    }
    return null;
  }

  async function cloudSetExamToken(token) {
    if (!init()) return null;
    try {
      await db.collection('settings').doc('config').set({
        exam_token: token.trim().toUpperCase(),
        updated_at: new Date().toISOString()
      }, { merge: true });
      return { success: true, token: token.trim().toUpperCase() };
    } catch (e) {
      console.warn('cloudSetExamToken error:', e);
    }
    return null;
  }

  // ====================================================================================
  // 8. MODAL PENGATURAN FIREBASE (INTERAKTIF UNTUK GURU)
  // ====================================================================================
  function openConfigModal() {
    const activeCfg = getConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };

    const isConnectedNow = isConnected && currentConfig;

    Swal.fire({
      title: '<div class="flex items-center justify-center gap-2 text-indigo-900"><i class="fa-solid fa-fire text-amber-500"></i> Pengaturan Database Firebase</div>',
      width: '780px',
      html: `
        <div class="text-left text-xs space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <!-- Status Banner -->
          <div class="p-4 rounded-2xl border ${isConnectedNow ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl ${isConnectedNow ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center text-lg font-bold shrink-0">
                <i class="fa-solid ${isConnectedNow ? 'fa-cloud-circle-check' : 'fa-triangle-exclamation'}"></i>
              </div>
              <div>
                <span class="font-extrabold text-sm block">${isConnectedNow ? 'Cloud Firestore Aktif & Terhubung' : 'Mode Penyimpanan Lokal (Offline)'}</span>
                <span class="text-[11px] opacity-80">${isConnectedNow ? `Project ID: <b>${currentConfig.projectId}</b> (Tersinkronisasi Realtime Antar Perangkat)` : 'Data saat ini tersimpan di browser masing-masing. Hubungkan Firebase agar seluruh siswa online.'}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button type="button" onclick="FirebaseService.runPingTest()" class="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5">
                <i class="fa-solid fa-arrows-rotate text-indigo-500"></i> Uji Koneksi
              </button>
            </div>
          </div>

          <!-- Tindakan Cepat: Unggah Data Awal -->
          <div class="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
            <div>
              <span class="font-bold text-indigo-950 block text-xs">Sinkronisasi Data Awal ke Cloud</span>
              <span class="text-[11px] text-slate-500">Unggah otomatis daftar 108 siswa, 10 modul, bank soal, dan refleksi ke Cloud Firestore.</span>
            </div>
            <button type="button" onclick="FirebaseService.runSeedUpload()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 shrink-0">
              <i class="fa-solid fa-cloud-arrow-up"></i> Unggah Data
            </button>
          </div>

          <!-- Form Kunci Firebase -->
          <div class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200">
              <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">Kunci Konfigurasi Firebase Web</span>
              <span class="text-[10px] text-slate-500">Dapat disalin dari Firebase Console &gt; Project Settings</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">API Key (apiKey):</label>
                <input type="text" id="fb-in-apikey" value="${activeCfg.apiKey || ''}" placeholder="AIzaSy..." class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Project ID (projectId):</label>
                <input type="text" id="fb-in-projectid" value="${activeCfg.projectId || ''}" placeholder="trigonometri-123" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Auth Domain (authDomain):</label>
                <input type="text" id="fb-in-authdomain" value="${activeCfg.authDomain || ''}" placeholder="proyek.firebaseapp.com" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Storage Bucket (storageBucket):</label>
                <input type="text" id="fb-in-storagebucket" value="${activeCfg.storageBucket || ''}" placeholder="proyek.appspot.com" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Messaging Sender ID:</label>
                <input type="text" id="fb-in-senderid" value="${activeCfg.messagingSenderId || ''}" placeholder="123456789" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">App ID (appId):</label>
                <input type="text" id="fb-in-appid" value="${activeCfg.appId || ''}" placeholder="1:1234:web:abcd..." class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono">
              </div>
            </div>

            <div class="pt-2">
              <label class="block font-bold text-slate-700 mb-1">Atau Tempel (Paste) Seluruh Objek <code>firebaseConfig</code> Langsung:</label>
              <textarea id="fb-in-rawpaste" rows="3" placeholder="const firebaseConfig = { apiKey: '...', ... };" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono" oninput="FirebaseService.parseRawConfigInput(this.value)"></textarea>
            </div>
          </div>

          <!-- Panduan Ringkas -->
          <div class="p-3.5 bg-slate-100 rounded-xl text-slate-600 text-[11px] space-y-1">
            <b class="text-slate-800 block"><i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i>Cara Cepat Membuat Database di Firebase:</b>
            <ol class="list-decimal pl-4 space-y-1 text-slate-600">
              <li>Buka <a href="https://console.firebase.google.com/" target="_blank" class="text-indigo-600 font-bold underline">Firebase Console</a> lalu klik <b>Add Project</b>.</li>
              <li>Klik ikon Web (<b>&lt;/&gt;</b>) untuk mendaftarkan web app, lalu salin kodenya ke formulir di atas.</li>
              <li>Di menu kiri, pilih <b>Firestore Database</b> &gt; <b>Create Database</b>.</li>
              <li>Pada tab <b>Rules</b>, ubah menjadi: <code class="text-rose-600 font-mono font-bold bg-white px-1 rounded">allow read, write: if true;</code> lalu klik <b>Publish</b>.</li>
            </ol>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1"></i> Simpan Konfigurasi',
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#4f46e5',
      preConfirm: () => {
        const apiKey = document.getElementById('fb-in-apikey').value.trim();
        const projectId = document.getElementById('fb-in-projectid').value.trim();
        const authDomain = document.getElementById('fb-in-authdomain').value.trim();
        const storageBucket = document.getElementById('fb-in-storagebucket').value.trim();
        const messagingSenderId = document.getElementById('fb-in-senderid').value.trim();
        const appId = document.getElementById('fb-in-appid').value.trim();

        if (!apiKey || !projectId) {
          Swal.showValidationMessage('API Key dan Project ID wajib diisi!');
          return false;
        }

        return { apiKey, projectId, authDomain, storageBucket, messagingSenderId, appId };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const newCfg = res.value;
        localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(newCfg));
        window.FIREBASE_CONFIG = newCfg;

        // Reset dan inisialisasi ulang
        isInitialized = false;
        db = null;
        const ok = init();

        if (ok) {
          Swal.fire({
            icon: 'success',
            title: 'Tersimpan & Terhubung!',
            html: `
              <p class="text-xs text-slate-600 mb-3">Firebase berhasil dihubungkan ke browser Anda.</p>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs">
                <b>Langkah Terakhir untuk GitHub Pages:</b><br>
                Salin juga kode ini ke file <code>assets/js/firebase-config.js</code> lalu commit ke GitHub agar seluruh siswa otomatis terhubung:
                <pre class="mt-2 p-2 bg-slate-800 text-emerald-400 rounded text-[11px] font-mono overflow-x-auto select-all">window.FIREBASE_CONFIG = ${JSON.stringify(newCfg, null, 2)};</pre>
              </div>
            `,
            confirmButtonText: 'Siap, Mengerti!'
          });
        } else {
          Swal.fire('Periksa Konfigurasi', 'Gagal terhubung dengan kunci yang diberikan. Pastikan Firestore telah dibuat di Firebase Console.', 'warning');
        }
      }
    });
  }

  function parseRawConfigInput(raw) {
    if (!raw) return;
    try {
      const matchKey = raw.match(/apiKey\s*:\s*["']([^"']+)["']/);
      const matchProject = raw.match(/projectId\s*:\s*["']([^"']+)["']/);
      const matchAuth = raw.match(/authDomain\s*:\s*["']([^"']+)["']/);
      const matchBucket = raw.match(/storageBucket\s*:\s*["']([^"']+)["']/);
      const matchSender = raw.match(/messagingSenderId\s*:\s*["']([^"']+)["']/);
      const matchApp = raw.match(/appId\s*:\s*["']([^"']+)["']/);

      if (matchKey && document.getElementById('fb-in-apikey')) document.getElementById('fb-in-apikey').value = matchKey[1];
      if (matchProject && document.getElementById('fb-in-projectid')) document.getElementById('fb-in-projectid').value = matchProject[1];
      if (matchAuth && document.getElementById('fb-in-authdomain')) document.getElementById('fb-in-authdomain').value = matchAuth[1];
      if (matchBucket && document.getElementById('fb-in-storagebucket')) document.getElementById('fb-in-storagebucket').value = matchBucket[1];
      if (matchSender && document.getElementById('fb-in-senderid')) document.getElementById('fb-in-senderid').value = matchSender[1];
      if (matchApp && document.getElementById('fb-in-appid')) document.getElementById('fb-in-appid').value = matchApp[1];
    } catch (e) {}
  }

  async function runPingTest() {
    Swal.fire({
      title: 'Menguji Koneksi...',
      text: 'Menghubungkan ke Cloud Firestore...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const res = await testConnection();
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Koneksi Berhasil!',
        html: `<b>${res.message}</b><br><span class="text-xs text-slate-500">Project: ${res.projectId}</span>`
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        html: `<span class="text-xs text-rose-600">${res.message}</span><br><br><span class="text-xs text-slate-500">Pastikan Anda telah membuat database Firestore di Firebase Console dan mengaktifkan izin Rules (allow read, write: if true;).</span>`
      });
    }
  }

  async function runSeedUpload() {
    const confirm = await Swal.fire({
      title: 'Unggah Data Awal ke Firebase?',
      text: 'Seluruh 108 data siswa SMAS Al Azhar Mandiri Palu, akun guru, 10 aktivitas modul, dan bank soal akan diunggah ke Cloud Firestore.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Unggah Sekarang',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#4f46e5'
    });

    if (confirm.isConfirmed) {
      Swal.fire({
        title: 'Mengunggah ke Cloud...',
        html: 'Menyimpan 108 siswa & modul ke Firestore...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const res = await seedInitialData();
      if (res.success) {
        Swal.fire('Selesai!', res.message, 'success');
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    }
  }

  // Inisialisasi otomatis saat script dimuat
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => init());
    } else {
      setTimeout(() => init(), 100);
    }
  }

  return {
    init,
    isReady: () => isInitialized && isConnected,
    isAvailable: () => isInitialized && isConnected,
    getDB: () => db,
    getConfig,
    testConnection,
    seedInitialData,
    openConfigModal,
    runPingTest,
    runSeedUpload,
    parseRawConfigInput,
    updateStatusBadge: updateUIStatus,
    auth: {
      loginStudent: cloudLoginStudent,
      registerStudent: cloudRegisterStudent
    },
    activities: {
      get: cloudGetActivity,
      submit: cloudSubmitActivity,
      getProgress: cloudGetProgress
    },
    teacher: {
      getDashboard: cloudGetTeacherDashboard,
      saveQuestion: cloudSaveQuestion,
      deleteQuestion: cloudDeleteQuestion,
      setExamToken: cloudSetExamToken,
      getStudentDetailSubmission: cloudGetStudentDetailSubmission,
      viewReflectionResponses: cloudViewReflectionResponses,
      getReflections: cloudGetReflections,
      saveReflection: cloudSaveReflection,
      deleteReflection: cloudDeleteReflection,
      gradeManual: cloudGradeManual
    }
  };
})();
