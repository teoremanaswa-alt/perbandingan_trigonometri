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
      } else {
        // App sudah ada
      }

      db = firebase.firestore();

      // Coba aktifkan offline persistence jika didukung browser
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

      // B. Listener Bank Soal (Jika guru mengubah soal di laptop, siswa langsung terima)
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

      // Gunakan Firestore Batch untuk efisiensi maksimal
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
          batch.set(docRef, u, { merge: true });
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

  // A. AUTHENTICATION
  async function cloudLoginStudent(code) {
    if (!init()) return null;
    try {
      const cleanCode = (code || '').trim().toUpperCase().replace(/[\s\-_]/g, '');
      const snap = await db.collection('users').where('role', '==', 'siswa').get();
      if (snap.empty) return null;

      let matchedUser = null;
      snap.forEach(doc => {
        const u = doc.data();
        const uCode = (u.access_code || '').toUpperCase().replace(/[\s\-_]/g, '');
        if (uCode === cleanCode) matchedUser = u;
      });

      if (matchedUser) {
        // Ambil kelas
        let clsName = 'XA';
        const clsDoc = await db.collection('classes').doc(String(matchedUser.class_id)).get();
        if (clsDoc.exists) clsName = clsDoc.data().class_name;
        matchedUser.class_name = clsName;
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
  async function cloudGetActivity(actNum, userId) {
    if (!init()) return null;
    try {
      // 1. Cek status aktivitas sebelumnya
      if (actNum > 1) {
        const prevProgDoc = await db.collection('student_progress').doc(`${userId}_${actNum - 1}`).get();
        if (!prevProgDoc.exists || prevProgDoc.data().status !== 'completed') {
          return {
            success: false,
            is_locked: true,
            required_activity: actNum - 1,
            message: `Aktivitas ${actNum} terkunci! Selesaikan Aktivitas ${actNum - 1} terlebih dahulu.`
          };
        }
      }

      // 2. Ambil soal untuk aktivitas ini
      const qSnap = await db.collection('questions').where('activity_id', '==', actNum).get();
      let questions = [];
      qSnap.forEach(d => questions.push(d.data()));
      questions.sort((a, b) => (a.order_num || 0) - (b.order_num || 0));

      // 3. Ambil progres & jawaban tersimpan
      const progDoc = await db.collection('student_progress').doc(`${userId}_${actNum}`).get();
      const prog = progDoc.exists ? progDoc.data() : { status: actNum === 1 ? 'in_progress' : 'locked' };

      const ansSnap = await db.collection('student_answers').where('user_id', '==', userId).get();
      const existingAnswers = [];
      ansSnap.forEach(d => {
        const a = d.data();
        if (questions.some(q => q.id === a.question_id)) {
          existingAnswers.push(a);
        }
      });

      return {
        success: true,
        activity: {
          id: actNum,
          activity_number: actNum,
          user_status: prog.status,
          score: prog.score
        },
        questions,
        existing_answers: existingAnswers
      };
    } catch (e) {
      console.warn('cloudGetActivity notice:', e);
    }
    return null;
  }

  async function cloudSubmitActivity(actNum, payload, userId) {
    if (!init()) return null;
    try {
      const batch = db.batch();

      // 1. Simpan jawaban per butir soal
      if (payload.answers && typeof payload.answers === 'object') {
        for (const qIdStr of Object.keys(payload.answers)) {
          const qId = parseInt(qIdStr, 10);
          const studentAns = payload.answers[qIdStr];
          const isCorrect = (payload.details && payload.details[qIdStr] && payload.details[qIdStr].is_correct) ? 1 : 0;
          const score = isCorrect ? 100 : 0;

          const ansRef = db.collection('student_answers').doc(`${userId}_${qId}`);
          batch.set(ansRef, {
            user_id: userId,
            question_id: qId,
            student_answer: studentAns,
            is_correct: isCorrect,
            score: score,
            submitted_at: new Date().toISOString()
          }, { merge: true });
        }
      }

      // 2. Jawaban refleksi (Aktivitas 9)
      if (actNum === 9 && payload.reflections && typeof payload.reflections === 'object') {
        for (const refIdStr of Object.keys(payload.reflections)) {
          const rId = parseInt(refIdStr, 10);
          const rVal = payload.reflections[refIdStr];
          const respRef = db.collection('reflection_responses').doc(`${userId}_${rId}`);
          batch.set(respRef, {
            user_id: userId,
            reflection_id: rId,
            response_text: String(rVal),
            rating: typeof rVal === 'number' ? rVal : null,
            submitted_at: new Date().toISOString()
          }, { merge: true });
        }
      }

      // 3. Update progres aktivitas saat ini -> completed
      const curProgRef = db.collection('student_progress').doc(`${userId}_${actNum}`);
      batch.set(curProgRef, {
        user_id: userId,
        activity_id: actNum,
        status: 'completed',
        score: payload.score !== undefined ? payload.score : null,
        completed_at: new Date().toISOString()
      }, { merge: true });

      // 4. Buka kunci aktivitas berikutnya -> in_progress
      if (actNum < 10) {
        const nextProgRef = db.collection('student_progress').doc(`${userId}_${actNum + 1}`);
        batch.set(nextProgRef, {
          user_id: userId,
          activity_id: actNum + 1,
          status: 'in_progress'
        }, { merge: true });
      }

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
      const usersSnap = await db.collection('users').where('role', '==', 'siswa').get();
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
        if (classFilter && classFilter !== 'all' && u.class_name !== classFilter) return;

        // Cari aktivitas tertinggi
        const uProgs = progressList.filter(p => p.user_id == u.id);
        let curAct = 1;
        uProgs.forEach(p => {
          if (p.status === 'completed' || p.status === 'in_progress') {
            const aId = parseInt(p.activity_id, 10) || 1;
            if (aId > curAct) curAct = aId;
          }
        });

        // Skor Akt 5
        const a5 = answersList.filter(a => a.user_id == u.id && q5Ids.some(qid => qid == a.question_id));
        let act5Score = null;
        if (a5.length > 0) {
          const sum = a5.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
          act5Score = Math.round(sum / a5.length);
        }

        // Skor Akt 8
        const a8 = answersList.filter(a => a.user_id == u.id && q8Ids.some(qid => qid == a.question_id));
        let act8Score = null;
        if (a8.length > 0) {
          const sum = a8.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
          act8Score = Math.round(sum / a8.length);
        }

        // Nilai & Jawaban LKPD (Akt 2) & Pemantik (Akt 1)
        const a1 = answersList.find(a => a.user_id == u.id && q1Ids.some(qid => qid == a.question_id));
        const a2 = answersList.find(a => a.user_id == u.id && q2Ids.some(qid => qid == a.question_id));

        students.push({
          id: u.id,
          name: u.name || '',
          access_code: u.access_code || '',
          role: u.role || 'siswa',
          class_name: u.class_name || 'XA',
          class_id: u.class_id,
          current_activity: curAct,
          act5_score: act5Score,
          act8_score: act8Score,
          act1_score: a1 ? (a1.score ?? null) : null,
          act1_feedback: a1 ? (a1.teacher_feedback ?? null) : null,
          act1_answer: a1 ? (a1.student_answer ?? null) : null,
          act2_score: a2 ? (a2.score ?? null) : null,
          act2_feedback: a2 ? (a2.teacher_feedback ?? null) : null,
          act2_answer: a2 ? (a2.student_answer ?? null) : null
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
                <span class="text-[11px] opacity-80">${isConnectedNow ? `Project ID: <b>${currentConfig.projectId}</b> (Tersinkronisasi Realtime)` : 'Data saat ini tersimpan di browser masing-masing. Hubungkan Firebase agar data siswa tersinkronisasi online.'}</span>
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
              <span class="text-[11px] text-slate-500">Unggah otomatis daftar 108 siswa, 10 aktivitas, bank soal, dan refleksi ke Cloud Firestore.</span>
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
              <li>Buka <a href="https://console.firebase.google.com/" target="_blank" class="text-indigo-600 font-bold underline">Firebase Console</a> lalu klik <b>Add Project</b> (Beri nama misal: <i>trigonometri-sma</i>).</li>
              <li>Klik ikon Web (<b>&lt;/&gt;</b>) untuk mendaftarkan web app, lalu salin kodenya ke formulir di atas.</li>
              <li>Di menu kiri, pilih <b>Firestore Database</b> &gt; <b>Create Database</b> &gt; pilih lokasi (<i>asia-southeast2 Jakarta</i>).</li>
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

  // Parse otomatis jika guru menempel seluruh script config
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

  // Handler tombol Uji Ping
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

  // Handler tombol Unggah Data Awal
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
      submit: cloudSubmitActivity
    },
    teacher: {
      getDashboard: cloudGetTeacherDashboard,
      saveQuestion: cloudSaveQuestion,
      deleteQuestion: cloudDeleteQuestion,
      setExamToken: cloudSetExamToken
    }
  };
})();
