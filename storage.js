/**
 * assets/js/storage.js - Client-Side Database Engine untuk GitHub Pages
 * Menyediakan emulasi database MySQL penuh (Auth, Pembelajaran 1-10, Dashboard Guru)
 * Menggunakan localStorage browser dengan seed 108 siswa SMAS Al Azhar Mandiri Palu.
 */

window.StorageService = (function() {
  const DB_KEY = 'trigonometri_db_v2';
  const SESSION_KEY = 'trigonometri_session_v1';

  // Helper Sanitasi Teks Matematika dari Mojibake / Karakter Aneh
  function cleanMathText(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/Â°/g, '°')
      .replace(/âˆš/g, '√')
      .replace(/Â²/g, '²')
      .replace(/Â³/g, '³')
      .replace(/âˆ\s*/g, '∠')
      .replace(/âˆ’/g, '−')
      .replace(/â‰ˆ/g, '≈')
      .replace(/Ã—/g, '×')
      .replace(/Î¸/g, 'θ')
      .replace(/Î±/g, 'α')
      .replace(/Î²/g, 'β')
      .replace(/Â±/g, '±')
      .replace(/â€’|â€“/g, '–')
      .replace(/â€™/g, "'")
      .replace(/â€œ|â€/g, '"')
      .replace(/\bsin\s*\?A\b/gi, 'sin ∠A')
      .replace(/\bsin\s*∠\s*A\b/gi, 'sin ∠A')
      .replace(/\(tan\s*\?\s*=/gi, '(tan θ =')
      .replace(/\b(sin|cos|tan)\s*\?(?!\w)/gi, '$1 θ');
  }
  window.cleanMathText = cleanMathText;

  function sanitizeObject(obj) {
    if (!obj) return obj;
    if (typeof obj === 'string') return cleanMathText(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
      const res = {};
      for (const k in obj) {
        res[k] = sanitizeObject(obj[k]);
      }
      return res;
    }
    return obj;
  }

  // 1. Inisialisasi Database
  function getDB() {
    let db = null;
    try {
      let stored = localStorage.getItem(DB_KEY);
      if (!stored) {
        // Fallback untuk migrasi dari v1 (agar progres akun siswa tetap utuh)
        stored = localStorage.getItem('trigonometri_db_v1');
      }
      if (stored) {
        db = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca localStorage, memulihkan seed awal...', e);
    }

    // Validasi kelengkapan database: harus punya users >= 100 dan guru Aswan
    const isValid = db &&
                    Array.isArray(db.users) &&
                    db.users.length >= 100 &&
                    db.users.some(u => u.role === 'guru' && u.access_code === '100418') &&
                    Array.isArray(db.activities) &&
                    db.activities.length === 10;

    if (isValid) {
      // Pastikan struktur data penting selalu siap tanpa menimpa data yang telah diubah pengguna
      if (!Array.isArray(db.questions) || db.questions.length === 0) {
        if (window.INITIAL_DB_SEED && Array.isArray(window.INITIAL_DB_SEED.questions)) {
          db.questions = sanitizeObject(JSON.parse(JSON.stringify(window.INITIAL_DB_SEED.questions)));
        } else {
          db.questions = [];
        }
      }
      if (!Array.isArray(db.reflections) || db.reflections.length === 0) {
        if (window.INITIAL_DB_SEED && Array.isArray(window.INITIAL_DB_SEED.reflections)) {
          db.reflections = sanitizeObject(JSON.parse(JSON.stringify(window.INITIAL_DB_SEED.reflections)));
        } else {
          db.reflections = [];
        }
      } else {
        db.reflections.forEach(r => {
          if (r.prompt_text && r.prompt_text.includes('Bapak Guru Aswan')) {
            r.prompt_text = r.prompt_text.replace(/Bapak Guru Aswan/g, 'guru');
          }
        });
      }
      if (!Array.isArray(db.student_progress)) db.student_progress = [];
      if (!Array.isArray(db.student_answers)) db.student_answers = [];
      if (!Array.isArray(db.reflection_responses)) db.reflection_responses = [];
      if (!db.settings || typeof db.settings !== 'object') {
        db.settings = { exam_token: 'TRIGONO2026' };
      } else if (!db.settings.exam_token) {
        db.settings.exam_token = 'TRIGONO2026';
      }

      // Pastikan entri soal untuk Aktivitas 4 tersedia jika belum ada
      const act4 = db.activities.find(a => a.activity_number == 4);
      if (act4 && !db.questions.some(q => q.activity_id == act4.id)) {
        db.questions.push({
          id: 401,
          activity_id: act4.id,
          order_num: 1,
          question_text: "Tabel Verifikasi Perbandingan Trigonometri Sudut Istimewa (0°, 30°, 45°, 60°, 90°)",
          options: null,
          correct_answer: null,
          explanation: null
        });
      }

      saveDB(db);
      return db;
    }

    // Jika belum ada atau belum lengkap, pulihkan dari INITIAL_DB_SEED
    const initial = (window.INITIAL_DB_SEED && Array.isArray(window.INITIAL_DB_SEED.users) && window.INITIAL_DB_SEED.users.length >= 100)
      ? JSON.parse(JSON.stringify(window.INITIAL_DB_SEED))
      : {
          classes: [],
          activities: [],
          questions: [],
          reflections: [],
          users: [],
          student_progress: [],
          student_answers: [],
          reflection_responses: [],
          settings: { exam_token: 'TRIGONO2026' }
        };

    // Pertahankan modifikasi dan riwayat jika sebelumnya ada
    if (db) {
      if (Array.isArray(db.questions) && db.questions.length > 0) initial.questions = db.questions;
      if (Array.isArray(db.reflections) && db.reflections.length > 0) initial.reflections = db.reflections;
      if (Array.isArray(db.student_progress) && db.student_progress.length > 0) initial.student_progress = db.student_progress;
      if (Array.isArray(db.student_answers) && db.student_answers.length > 0) initial.student_answers = db.student_answers;
      if (Array.isArray(db.reflection_responses) && db.reflection_responses.length > 0) initial.reflection_responses = db.reflection_responses;
      if (db.settings && typeof db.settings === 'object') initial.settings = db.settings;
    }

    const cleaned = sanitizeObject(initial);
    saveDB(cleaned);
    return cleaned;
  }

  function saveDB(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Gagal menyimpan ke localStorage:', e);
    }
  }

  function resetToDefault() {
    if (window.INITIAL_DB_SEED) {
      saveDB(JSON.parse(JSON.stringify(window.INITIAL_DB_SEED)));
    }
  }

  // 2. Manajemen Sesi
  function getSession() {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ========================================================
  // AUTENTIKASI (Emulasi api/auth.php)
  // ========================================================
  function loginStudent(code) {
    const db = getDB();
    if (!code || !code.trim()) {
      return { success: false, message: 'Harap masukkan kode akses (contoh: A21 atau A1)' };
    }

    const rawInput = code.trim();
    const cleanCode = rawInput.toUpperCase().replace(/[\s\-_]/g, '');

    // 1. Ekstrak inisial kelas dan nomor absen (misal: A1, A01, B5, B05, D08)
    let prefix = '';
    let num = null;
    const match = cleanCode.match(/^([A-Z])0*([1-9][0-9]*)$/);
    if (match) {
      prefix = match[1];
      num = parseInt(match[2], 10);
    }

    // 2. Cari di database users berdasarkan kode akses
    let user = db.users.find(u => {
      if (u.role !== 'siswa') return false;
      const uCode = (u.access_code || '').toUpperCase().replace(/[\s\-_]/g, '');
      if (uCode === cleanCode) return true;
      if (match) {
        const uMatch = uCode.match(/^([A-Z])0*([1-9][0-9]*)$/);
        if (uMatch && uMatch[1] === prefix && parseInt(uMatch[2], 10) === num) {
          return true;
        }
      }
      return false;
    });

    // 3. Jika belum ditemukan, coba pencocokan nama siswa (jika siswa/guru mengetik nama)
    if (!user) {
      const lowerInput = rawInput.toLowerCase();
      user = db.users.find(u => {
        if (u.role !== 'siswa' || !u.name) return false;
        const uName = u.name.toLowerCase();
        return uName === lowerInput || uName.includes(lowerInput);
      });
    }

    // 4. Jika tetap tidak ditemukan tetapi formatnya berupa kode kelas (misal D08, E14, F22 dari akun demo lama)
    // Otomatis buat akun baru on-the-fly agar login siap pakai tanpa kendala!
    if (!user && match) {
      const className = 'X' + prefix;
      let cls = db.classes.find(c => c.class_name === className);
      if (!cls) {
        const maxClsId = db.classes.reduce((m, c) => Math.max(m, c.id || 0), 0);
        cls = { id: maxClsId + 1, class_name: className };
        db.classes.push(cls);
      }

      // Berikan nama deskriptif ramah
      let demoName = `Siswa Kelas ${className} No ${num}`;
      if (prefix === 'D' && num === 8) demoName = 'Irfan Bachdim (Demo XD)';
      else if (prefix === 'E' && num === 14) demoName = 'Jessica Mila (Demo XE)';
      else if (prefix === 'F' && num === 22) demoName = 'Kevin Sanjaya (Demo XF)';
      else if (prefix === 'A' && num === 21) demoName = 'Dimas Anggara (Demo XA)';
      else if (prefix === 'A' && num === 1) demoName = 'Andi Pratama (Demo XA)';
      else if (prefix === 'B' && num === 5) demoName = 'Farah Diba (Demo XB)';

      const maxUserId = db.users.reduce((m, u) => Math.max(m, u.id || 0), 0);
      user = {
        id: maxUserId + 1,
        role: 'siswa',
        access_code: prefix + num,
        name: demoName,
        class_id: cls.id
      };
      db.users.push(user);

      // Inisialisasi progres 10 aktivitas
      db.activities.forEach(act => {
        const status = (act.activity_number == 1) ? 'in_progress' : 'locked';
        db.student_progress.push({
          user_id: user.id,
          activity_id: act.id,
          status: status,
          score: null,
          completed_at: null,
          teacher_score: null,
          teacher_feedback: null
        });
      });

      saveDB(db);
    }

    if (!user) {
      return {
        success: false,
        message: `Kode akses '${code}' tidak ditemukan. Silakan gunakan kode seperti A1 s.d A36, B1 s.d B36, C1 s.d C36, atau daftar akun baru.`
      };
    }

    const cls = db.classes.find(c => c.id == user.class_id);
    const sessionUser = {
      id: user.id,
      role: 'siswa',
      access_code: user.access_code,
      name: user.name,
      class_id: user.class_id,
      class_name: cls ? cls.class_name : ('X' + (prefix || 'A'))
    };

    setSession(sessionUser);
    return { success: true, message: 'Login siswa berhasil! Selamat datang, ' + user.name, user: sessionUser };
  }

  function loginTeacher(username, code) {
    const rawU = (username || '').trim();
    const rawC = (code || '').trim();
    if (!rawU || !rawC) {
      return { success: false, message: 'Harap masukkan username dan kode akses guru.' };
    }

    const cleanU = rawU.toLowerCase().replace(/[\s\.\,\_\-]/g, '');
    const cleanC = rawC.replace(/[\s\-\_]/g, '');

    // Sangat toleran terhadap variasi penulisan guru:
    // 'aswan', 'aswanmpdgr', 'aswanmpd', 'guru', 'admin', 'pakaswan', 'pakguru'
    const isUserValid = cleanU.includes('aswan') ||
                        cleanU.includes('guru') ||
                        cleanU.includes('admin') ||
                        cleanU === '100418';

    const isCodeValid = cleanC === '100418' ||
                        cleanC.toLowerCase().includes('aswan');

    if (!isUserValid || !isCodeValid) {
      return {
        success: false,
        message: 'Kredensial Guru salah! Gunakan Username: Aswan dan Kode Akses: 100418.'
      };
    }

    const sessionUser = {
      id: 1,
      role: 'guru',
      access_code: '100418',
      name: 'Aswan, M.Pd., Gr.',
      class_name: 'Semua Kelas (XA-XF)'
    };

    setSession(sessionUser);
    return { success: true, message: 'Login Guru berhasil! Selamat bertugas, Aswan, M.Pd., Gr.', user: sessionUser };
  }

  function registerStudent(name, className, absen) {
    const db = getDB();
    const cleanName = (name || '').trim();
    const cleanClass = (className || '').trim();
    const cleanAbsen = parseInt(absen, 10);

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Nama lengkap harus diisi minimal 2 karakter.' };
    }
    if (!cleanClass) {
      return { success: false, message: 'Pilih rombongan belajar / kelas (XA s.d. XF).' };
    }
    if (isNaN(cleanAbsen) || cleanAbsen < 1 || cleanAbsen > 50) {
      return { success: false, message: 'Nomor absen harus antara 1 sampai 50.' };
    }

    const cls = db.classes.find(c => c.class_name === cleanClass);
    if (!cls) {
      return { success: false, message: 'Kelas tidak valid.' };
    }

    const classLetter = cleanClass.replace('X', '').toUpperCase();
    const accessCode = classLetter + cleanAbsen;

    const existing = db.users.find(u => {
      if (u.role !== 'siswa') return false;
      const uCode = (u.access_code || '').toUpperCase();
      return uCode === accessCode || uCode === (classLetter + String(cleanAbsen).padStart(2, '0'));
    });

    if (existing) {
      return {
        success: false,
        message: `Siswa dengan nomor absen ${cleanAbsen} di kelas ${cleanClass} sudah terdaftar atas nama: ${existing.name}. Gunakan kode akses: ${existing.access_code} untuk login.`
      };
    }

    const maxId = db.users.reduce((m, u) => Math.max(m, u.id || 0), 0);
    const newId = maxId + 1;
    const newUser = {
      id: newId,
      role: 'siswa',
      access_code: accessCode,
      name: cleanName,
      class_id: cls.id
    };
    db.users.push(newUser);

    // Buat progres 1-10
    db.activities.forEach(act => {
      const st = (act.activity_number == 1) ? 'in_progress' : 'locked';
      db.student_progress.push({
        user_id: newId,
        activity_id: act.id,
        status: st
      });
    });

    saveDB(db);

    const sessionUser = {
      id: newId,
      role: 'siswa',
      access_code: accessCode,
      name: cleanName,
      class_id: cls.id,
      class_name: cleanClass
    };
    setSession(sessionUser);

    return {
      success: true,
      message: `Registrasi berhasil! Kode akses Anda: ${accessCode}`,
      user: sessionUser
    };
  }

  function checkSession() {
    const s = getSession();
    if (s && s.id) {
      return { success: true, message: 'Sesi aktif', user: s };
    }
    return { success: false, message: 'Belum login', user: null };
  }

  function logout() {
    clearSession();
    return { success: true, message: 'Logout berhasil' };
  }

  // ========================================================
  // AKTIVITAS SISWA 1 - 10 (Emulasi api/activities.php)
  // ========================================================
  function checkLockedAccess(db, userId, actNum) {
    if (actNum <= 1) return true;
    const prevAct = db.activities.find(a => a.activity_number == (actNum - 1));
    if (!prevAct) return true;
    const prog = db.student_progress.find(p => p.user_id == userId && p.activity_id == prevAct.id);
    return prog && prog.status === 'completed';
  }

  function markCompletedAndUnlockNext(db, userId, actNum) {
    const curAct = db.activities.find(a => a.activity_number == actNum);
    if (curAct) {
      let pCur = db.student_progress.find(p => p.user_id == userId && p.activity_id == curAct.id);
      if (pCur) {
        pCur.status = 'completed';
      } else {
        db.student_progress.push({ user_id: userId, activity_id: curAct.id, status: 'completed' });
      }
    }

    if (actNum < 10) {
      const nextAct = db.activities.find(a => a.activity_number == (actNum + 1));
      if (nextAct) {
        let pNext = db.student_progress.find(p => p.user_id == userId && p.activity_id == nextAct.id);
        if (pNext) {
          if (pNext.status === 'locked') pNext.status = 'in_progress';
        } else {
          db.student_progress.push({ user_id: userId, activity_id: nextAct.id, status: 'in_progress' });
        }
      }
    }
  }

  function getActivity(actNum) {
    const session = getSession();
    if (!session || session.role !== 'siswa') {
      return { success: false, message: 'Akses ditolak. Silakan login sebagai siswa.' };
    }

    const db = getDB();
    const userId = session.id;

    if (!checkLockedAccess(db, userId, actNum)) {
      return {
        success: false,
        is_locked: true,
        required_activity: actNum - 1,
        message: `Aktivitas ${actNum} terkunci! Selesaikan Aktivitas ${actNum - 1} terlebih dahulu.`
      };
    }

    const act = db.activities.find(a => a.activity_number == actNum);
    if (!act) {
      return { success: false, message: 'Aktivitas tidak ditemukan.' };
    }

    const prog = db.student_progress.find(p => p.user_id == userId && p.activity_id == act.id);
    const userStatus = prog ? prog.status : (actNum == 1 ? 'in_progress' : 'locked');

    const rawQuestions = db.questions.filter(q => q.activity_id == act.id)
      .sort((a, b) => (a.order_num || 0) - (b.order_num || 0));

    // Sembunyikan kunci jawaban untuk sumatif / latihan saat masih dikerjakan
    const needHideAnswer = (actNum === 8) || (actNum === 5 && userStatus !== 'completed');
    const questions = rawQuestions.map(q => {
      const copy = Object.assign({}, q);
      if (needHideAnswer) {
        copy.correct_answer = null;
        copy.explanation = null;
      }
      return copy;
    });

    // Ambil jawaban tersimpan
    const qIds = rawQuestions.map(q => q.id);
    const existingAnswers = db.student_answers.filter(sa => sa.user_id == userId && qIds.includes(sa.question_id));

    // Aktivitas 9: Refleksi
    let reflections = [];
    let reflectionResponses = [];
    if (actNum === 9) {
      if (!Array.isArray(db.reflections) || db.reflections.length === 0) {
        if (window.INITIAL_DB_SEED && Array.isArray(window.INITIAL_DB_SEED.reflections)) {
          db.reflections = sanitizeObject(JSON.parse(JSON.stringify(window.INITIAL_DB_SEED.reflections)));
          saveDB(db);
        }
      }
      reflections = (db.reflections || []).filter(r => r.is_active == 1 || r.is_active === true || r.is_active === undefined);
      reflectionResponses = (db.reflection_responses || []).filter(rr => rr.user_id == userId);
    }

    // Aktivitas 10: Hasil Belajar (Rapor Lengkap)
    let recap = null;
    if (actNum === 10) {
      const cls = db.classes.find(c => c.id == session.class_id);
      const allProg = db.student_progress.filter(p => p.user_id == userId);

      // Hitung skor Akt 5
      const act5 = db.activities.find(a => a.activity_number == 5);
      const q5Ids = act5 ? db.questions.filter(q => q.activity_id == act5.id).map(q => q.id) : [];
      const a5 = db.student_answers.filter(sa => sa.user_id == userId && q5Ids.includes(sa.question_id));
      let act5Score = 0;
      if (a5.length > 0) {
        const sum5 = a5.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
        act5Score = Math.round(sum5 / a5.length);
      }

      // Hitung skor Akt 8
      const act8 = db.activities.find(a => a.activity_number == 8);
      const q8Ids = act8 ? db.questions.filter(q => q.activity_id == act8.id).map(q => q.id) : [];
      const a8 = db.student_answers.filter(sa => sa.user_id == userId && q8Ids.includes(sa.question_id));
      let act8Score = 0;
      if (a8.length > 0) {
        const sum8 = a8.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
        act8Score = Math.round(sum8 / a8.length);
      }

      // Ambil nilai manual guru untuk Akt 1 & Akt 2
      const manualGrades = [];
      const act1 = db.activities.find(a => a.activity_number == 1);
      if (act1) {
        const q1 = db.questions.find(q => q.activity_id == act1.id);
        if (q1) {
          const ans1 = db.student_answers.find(sa => sa.user_id == userId && sa.question_id == q1.id);
          if (ans1) {
            manualGrades.push({ activity_number: 1, score: ans1.score, teacher_feedback: ans1.teacher_feedback });
          }
        }
      }
      const act2 = db.activities.find(a => a.activity_number == 2);
      if (act2) {
        const q2 = db.questions.find(q => q.activity_id == act2.id);
        if (q2) {
          const ans2 = db.student_answers.find(sa => sa.user_id == userId && sa.question_id == q2.id);
          if (ans2) {
            manualGrades.push({ activity_number: 2, score: ans2.score, teacher_feedback: ans2.teacher_feedback });
          }
        }
      }

      recap = {
        student: {
          name: session.name,
          access_code: session.access_code,
          class_name: cls ? cls.class_name : 'XA',
          created_at: new Date().toISOString()
        },
        act5_score: act5Score,
        act8_score: act8Score,
        manual_grades: manualGrades,
        all_progress: allProg
      };
    }

    return {
      success: true,
      activity: Object.assign({}, act, { user_status: userStatus }),
      questions,
      existing_answers: existingAnswers,
      reflections,
      reflection_responses: reflectionResponses,
      recap
    };
  }

  function getStudentProgress() {
    const session = getSession();
    if (!session || session.role !== 'siswa') {
      return { success: false, message: 'Tidak diizinkan' };
    }
    const db = getDB();
    const userId = session.id;

    const progress = db.activities.slice().sort((a,b) => a.activity_number - b.activity_number).map(a => {
      const sp = db.student_progress.find(p => p.user_id == userId && p.activity_id == a.id);
      return {
        activity_id: a.id,
        activity_number: a.activity_number,
        title: a.title,
        subtitle: a.subtitle,
        status: sp ? sp.status : (a.activity_number == 1 ? 'in_progress' : 'locked'),
        updated_at: sp ? sp.updated_at : null
      };
    });

    const totalActivities = progress.length;
    let completedCount = 0;
    let currentActive = 1;

    progress.forEach(p => {
      if (p.status === 'completed') completedCount++;
      if (p.status === 'in_progress') currentActive = p.activity_number;
    });

    const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

    return {
      success: true,
      message: 'Progres belajar berhasil dimuat',
      progress: progress,
      completed_count: completedCount,
      total_activities: totalActivities,
      percentage: percentage,
      current_active: currentActive
    };
  }

  function submitActivity(actNum, payload) {
    const session = getSession();
    if (!session || session.role !== 'siswa') {
      return { success: false, message: 'Akses ditolak.' };
    }

    const db = getDB();
    const userId = session.id;
    const act = db.activities.find(a => a.activity_number == actNum);
    if (!act) return { success: false, message: 'Aktivitas tidak valid.' };

    const questions = db.questions.filter(q => q.activity_id == act.id);

    // Kunci Permanen: Siswa tidak dapat mengubah jawaban setelah menginputnya
    const existingProg = db.student_progress.find(p => p.user_id == userId && p.activity_id == act.id);
    if (existingProg && existingProg.status === 'completed' && [1, 2, 4, 5, 8, 9].includes(actNum)) {
      return {
        success: false,
        message: 'Aktivitas ini telah Anda selesaikan sebelumnya dan jawaban telah dikunci permanen.',
        locked: true,
        next_activity: actNum < 10 ? actNum + 1 : 10
      };
    }

    if (actNum === 1) {
      const q1 = questions[0];
      const essay = (payload.essay_answer || payload.essay || payload.answer || '').trim();
      if (essay.length < 10) {
        return { success: false, message: 'Harap tuliskan uraian jawaban Anda secara lebih lengkap (minimal 10 karakter).' };
      }
      if (q1) {
        let sa = db.student_answers.find(a => a.user_id == userId && a.question_id == q1.id);
        if (sa) {
          sa.student_answer = essay;
        } else {
          db.student_answers.push({
            user_id: userId,
            question_id: q1.id,
            student_answer: essay,
            score: 0,
            teacher_feedback: null
          });
        }
      }
      markCompletedAndUnlockNext(db, userId, 1);
      saveDB(db);
      return {
        success: true,
        message: 'Jawaban pertanyaan pemantik berhasil dikirim! Aktivitas 2 (LKPD Simulasi Konsep) kini terbuka.',
        next_activity: 2
      };
    }

    if (actNum === 2) {
      const q2 = questions[0];
      const conclusion = (payload.conclusion || '').trim();
      if (!conclusion || conclusion.length < 10) {
        return { success: false, message: 'Harap isi kesimpulan analisis rasio sisi segitiga siku-siku Anda secara lengkap.' };
      }
      const combinedAnswer = JSON.stringify({
        observation_table: payload.observation_table || [],
        conclusion: conclusion,
        q1: payload.q1 || '',
        q2: payload.q2 || '',
        q3: payload.q3 || '',
        submitted_at: new Date().toISOString()
      });
      if (q2) {
        let sa = db.student_answers.find(a => a.user_id == userId && a.question_id == q2.id);
        if (sa) {
          sa.student_answer = combinedAnswer;
        } else {
          db.student_answers.push({
            user_id: userId,
            question_id: q2.id,
            student_answer: combinedAnswer,
            score: 0,
            teacher_feedback: null
          });
        }
      }
      markCompletedAndUnlockNext(db, userId, 2);
      saveDB(db);
      return {
        success: true,
        message: 'LKPD Simulasi Konsep berhasil dikirim! Aktivitas 3 (Materi Trigonometri) telah terbuka.',
        next_activity: 3
      };
    }

    if (actNum === 3) {
      markCompletedAndUnlockNext(db, userId, 3);
      saveDB(db);
      return {
        success: true,
        message: 'Hebat! Anda telah menuntaskan pendalaman materi. Aktivitas 4 (Sudut Istimewa) telah terbuka.',
        next_activity: 4
      };
    }

    if (actNum === 4) {
      let q4 = db.questions.find(q => q.activity_id == act.id);
      if (!q4) {
        const maxQId = db.questions.reduce((m, q) => Math.max(m, q.id || 0), 0);
        q4 = {
          id: maxQId + 1,
          activity_id: act.id,
          order_num: 1,
          question_text: "Tabel Verifikasi Perbandingan Trigonometri Sudut Istimewa (0°, 30°, 45°, 60°, 90°)"
        };
        db.questions.push(q4);
      }

      const tableData = payload.table_answers || {};
      const answerContent = JSON.stringify({
        table_answers: tableData,
        submitted_at: new Date().toISOString()
      });

      let sa = db.student_answers.find(a => a.user_id == userId && a.question_id == q4.id);
      if (sa) {
        sa.student_answer = answerContent;
        sa.score = 100;
      } else {
        db.student_answers.push({
          user_id: userId,
          question_id: q4.id,
          student_answer: answerContent,
          score: 100,
          teacher_feedback: null
        });
      }

      markCompletedAndUnlockNext(db, userId, 4);
      saveDB(db);
      return {
        success: true,
        message: 'Luar biasa! Seluruh nilai sudut istimewa telah Anda verifikasi dengan tepat 100%. Aktivitas 5 (Latihan Soal) telah terbuka.',
        next_activity: 5
      };
    }

    if (actNum === 5) {
      const answers = payload.answers || {};
      let totalCorrect = 0;
      const count = questions.length;
      const results = [];

      questions.forEach(q => {
        const studentAns = (answers[q.id] || '').trim();
        const isCorrect = (studentAns.toUpperCase() === (q.correct_answer || '').trim().toUpperCase());
        const itemScore = isCorrect ? 100 : 0;
        if (isCorrect) totalCorrect++;

        let sa = db.student_answers.find(a => a.user_id == userId && a.question_id == q.id);
        if (sa) {
          sa.student_answer = studentAns;
          sa.score = itemScore;
        } else {
          db.student_answers.push({
            user_id: userId,
            question_id: q.id,
            student_answer: studentAns,
            score: itemScore,
            teacher_feedback: null
          });
        }

        results.push({
          question_id: q.id,
          student_answer: studentAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          explanation: q.explanation
        });
      });

      const finalScore = count > 0 ? Math.round((totalCorrect / count) * 100) : 0;
      markCompletedAndUnlockNext(db, userId, 5);
      saveDB(db);

      return {
        success: true,
        message: `Latihan soal selesai! Skor Anda: ${finalScore} (${totalCorrect} dari ${count} benar).`,
        score: finalScore,
        correct_count: totalCorrect,
        total_questions: count,
        results: results,
        next_activity: 6
      };
    }

    if (actNum === 6) {
      markCompletedAndUnlockNext(db, userId, 6);
      saveDB(db);
      return {
        success: true,
        message: 'Selamat! Anda telah menguasai ketiga simulasi terapan trigonometri nyata. Aktivitas 7 (Contoh Literasi Numerasi) telah terbuka.',
        next_activity: 7
      };
    }

    if (actNum === 7) {
      markCompletedAndUnlockNext(db, userId, 7);
      saveDB(db);
      return {
        success: true,
        message: 'Bagus sekali! Kelima contoh literasi numerasi telah Anda pelajari. Siap untuk Aktivitas 8 (Sumatif Literasi Numerasi)?',
        next_activity: 8
      };
    }

    if (actNum === 8) {
      const answers = payload.answers || {};
      let totalCorrect = 0;
      const count = questions.length;
      const results = [];

      questions.forEach(q => {
        const studentAns = (answers[q.id] || '').trim();
        const isCorrect = (studentAns.toUpperCase() === (q.correct_answer || '').trim().toUpperCase());
        const itemScore = isCorrect ? 100 : 0;
        if (isCorrect) totalCorrect++;

        let sa = db.student_answers.find(a => a.user_id == userId && a.question_id == q.id);
        if (sa) {
          sa.student_answer = studentAns;
          sa.score = itemScore;
        } else {
          db.student_answers.push({
            user_id: userId,
            question_id: q.id,
            student_answer: studentAns,
            score: itemScore,
            teacher_feedback: null
          });
        }

        results.push({
          question_id: q.id,
          student_answer: studentAns
        });
      });

      const finalScore = count > 0 ? Math.round((totalCorrect / count) * 100) : 0;
      markCompletedAndUnlockNext(db, userId, 8);
      saveDB(db);

      return {
        success: true,
        message: `Asesmen Sumatif telah dikirim! Nilai Akhir Sumatif Anda: ${finalScore}. Aktivitas 9 (Refleksi Belajar) kini terbuka.`,
        score: finalScore,
        correct_count: totalCorrect,
        total_questions: count,
        next_activity: 9
      };
    }

    if (actNum === 9) {
      const responses = payload.reflections || payload.responses || {};
      if (Array.isArray(responses)) {
        responses.forEach(r => {
          let resp = db.reflection_responses.find(rr => rr.user_id == userId && rr.reflection_id == r.reflection_id);
          if (resp) {
            resp.response_text = r.response_text || r.text || '';
            resp.rating = r.rating || null;
          } else {
            db.reflection_responses.push({
              user_id: userId,
              reflection_id: r.reflection_id,
              response_text: r.response_text || r.text || '',
              rating: r.rating || null,
              submitted_at: new Date().toISOString()
            });
          }
        });
      } else {
        Object.keys(responses).forEach(refId => {
          const item = responses[refId] || {};
          let resp = db.reflection_responses.find(rr => rr.user_id == userId && rr.reflection_id == refId);
          if (resp) {
            resp.response_text = item.text || item.response_text || '';
            resp.rating = item.rating || null;
          } else {
            db.reflection_responses.push({
              user_id: userId,
              reflection_id: parseInt(refId, 10),
              response_text: item.text || item.response_text || '',
              rating: item.rating || null,
              submitted_at: new Date().toISOString()
            });
          }
        });
      }

      markCompletedAndUnlockNext(db, userId, 9);
      markCompletedAndUnlockNext(db, userId, 10);
      saveDB(db);

      return {
        success: true,
        message: 'Terima kasih atas refleksi Anda! Aktivitas 10 (Laporan Hasil Belajar) telah terbuka.',
        next_activity: 10
      };
    }

    return { success: false, message: 'Aktivitas tidak dikenal.' };
  }

  // ========================================================
  // DASHBOARD GURU (Emulasi api/teacher.php)
  // ========================================================
  function getTeacherDashboard(classFilter = 'all') {
    const session = getSession();
    if (!session || session.role !== 'guru') {
      return { success: false, message: 'Akses ditolak. Khusus guru pengampu.' };
    }

    const db = getDB();
    const act5 = db.activities.find(a => a.activity_number == 5);
    const act8 = db.activities.find(a => a.activity_number == 8);
    const act1 = db.activities.find(a => a.activity_number == 1);
    const act2 = db.activities.find(a => a.activity_number == 2);

    const q5Ids = act5 ? db.questions.filter(q => q.activity_id == act5.id).map(q => q.id) : [];
    const q8Ids = act8 ? db.questions.filter(q => q.activity_id == act8.id).map(q => q.id) : [];
    const q1 = act1 ? db.questions.find(q => q.activity_id == act1.id) : null;
    const q2 = act2 ? db.questions.find(q => q.activity_id == act2.id) : null;

    let students = db.users.filter(u => u.role === 'siswa').map(u => {
      const cls = db.classes.find(c => c.id == u.class_id);
      const className = cls ? cls.class_name : 'XA';

      // Posisi aktivitas terakhir
      const uProg = db.student_progress.filter(p => p.user_id == u.id);
      let curAct = 1;
      const completed = uProg.filter(p => p.status === 'completed');
      if (completed.length >= 10) {
        curAct = 10;
      } else {
        const inProg = uProg.find(p => p.status === 'in_progress');
        if (inProg) {
          const actObj = db.activities.find(a => a.id == inProg.activity_id);
          if (actObj) curAct = actObj.activity_number;
        } else if (completed.length > 0) {
          curAct = Math.min(10, completed.length + 1);
        }
      }

      // Nilai Akt 5
      const ans5 = db.student_answers.filter(sa => sa.user_id == u.id && q5Ids.includes(sa.question_id));
      let act5Score = null;
      if (ans5.length > 0) {
        const sum = ans5.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
        act5Score = Math.round(sum / ans5.length);
      }

      // Nilai Akt 8
      const ans8 = db.student_answers.filter(sa => sa.user_id == u.id && q8Ids.includes(sa.question_id));
      let act8Score = null;
      if (ans8.length > 0) {
        const sum = ans8.reduce((acc, curr) => acc + (parseFloat(curr.score) || 0), 0);
        act8Score = Math.round(sum / ans8.length);
      }

      // Nilai & feedback Akt 1 & Akt 2
      const ans1 = q1 ? db.student_answers.find(sa => sa.user_id == u.id && sa.question_id == q1.id) : null;
      const ans2 = q2 ? db.student_answers.find(sa => sa.user_id == u.id && sa.question_id == q2.id) : null;

      return {
        id: u.id,
        name: u.name,
        access_code: u.access_code,
        role: u.role,
        class_name: className,
        class_id: u.class_id,
        current_activity: curAct,
        act5_score: act5Score,
        act8_score: act8Score,
        act1_score: ans1 ? ans1.score : null,
        act1_feedback: ans1 ? ans1.teacher_feedback : null,
        act1_answer: ans1 ? ans1.student_answer : null,
        act2_score: ans2 ? ans2.score : null,
        act2_feedback: ans2 ? ans2.teacher_feedback : null,
        act2_answer: ans2 ? ans2.student_answer : null
      };
    });

    if (classFilter !== 'all' && classFilter) {
      students = students.filter(s => s.class_name === classFilter);
    }

    // Natural numerical sorting: A1 to A36
    students.sort((a, b) => {
      if (a.class_name !== b.class_name) {
        return a.class_name.localeCompare(b.class_name);
      }
      const numA = parseInt((a.access_code || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt((b.access_code || '').replace(/\D/g, ''), 10) || 0;
      if (numA !== numB) return numA - numB;
      return (a.access_code || '').localeCompare(b.access_code || '');
    });

    // Ringkasan Statistik
    const totalStudents = students.length;
    let completedCount = 0;
    let sum5 = 0, count5 = 0;
    let sum8 = 0, count8 = 0;

    students.forEach(st => {
      if (st.current_activity >= 10) completedCount++;
      if (st.act5_score !== null) { sum5 += st.act5_score; count5++; }
      if (st.act8_score !== null) { sum8 += st.act8_score; count8++; }
    });

    return {
      success: true,
      classes: db.classes,
      selected_class: classFilter,
      students,
      stats: {
        total_students: totalStudents,
        completed_students: completedCount,
        avg_act5: count5 > 0 ? Math.round((sum5 / count5) * 10) / 10 : 0,
        avg_act8: count8 > 0 ? Math.round((sum8 / count8) * 10) / 10 : 0
      }
    };
  }

  function gradeManual(studentId, actNum, score, feedback) {
    const db = getDB();
    const act = db.activities.find(a => a.activity_number == actNum);
    if (!act) return { success: false, message: 'Aktivitas tidak valid.' };
    const q = db.questions.find(q => q.activity_id == act.id);
    if (!q) return { success: false, message: 'Soal tidak ditemukan.' };

    let sa = db.student_answers.find(a => a.user_id == studentId && a.question_id == q.id);
    if (sa) {
      sa.score = parseFloat(score);
      sa.teacher_feedback = feedback;
    } else {
      db.student_answers.push({
        user_id: studentId,
        question_id: q.id,
        student_answer: null,
        score: parseFloat(score),
        teacher_feedback: feedback
      });
    }
    saveDB(db);
    return { success: true, message: 'Nilai dan umpan balik berhasil disimpan!' };
  }

  function addStudentTeacher(name, className, absen) {
    return registerStudent(name, className, absen);
  }

  function updateStudentTeacher(studentId, name, className, accessCode) {
    const db = getDB();
    const st = db.users.find(u => u.id == studentId && u.role === 'siswa');
    if (!st) return { success: false, message: 'Siswa tidak ditemukan.' };

    const cls = db.classes.find(c => c.class_name === className);
    if (!cls) return { success: false, message: 'Kelas tidak valid.' };

    const dup = db.users.find(u => u.id != studentId && (u.access_code || '').toUpperCase() === accessCode.toUpperCase());
    if (dup) return { success: false, message: `Kode akses ${accessCode} sudah digunakan oleh siswa lain.` };

    st.name = name.trim();
    st.class_id = cls.id;
    st.access_code = accessCode.trim().toUpperCase();

    saveDB(db);
    return { success: true, message: `Data siswa berhasil diperbarui! Kode akses: ${st.access_code}` };
  }

  function resetStudentProgress(studentId, clearAnswers) {
    const db = getDB();
    db.student_progress.forEach(p => {
      if (p.user_id == studentId) {
        const act = db.activities.find(a => a.id == p.activity_id);
        p.status = (act && act.activity_number == 1) ? 'in_progress' : 'locked';
      }
    });

    if (clearAnswers) {
      db.student_answers = db.student_answers.filter(sa => sa.user_id != studentId);
      db.reflection_responses = db.reflection_responses.filter(rr => rr.user_id != studentId);
      try {
        localStorage.removeItem('exam_timer_start_' + studentId);
        sessionStorage.removeItem('exam_token_unlocked_' + studentId);
      } catch (e) {}
    }

    saveDB(db);
    return { success: true, message: 'Progres belajar siswa berhasil di-reset untuk remedial.' };
  }

  function deleteStudentTeacher(studentId) {
    const db = getDB();
    db.users = db.users.filter(u => u.id != studentId);
    db.student_progress = db.student_progress.filter(p => p.user_id != studentId);
    db.student_answers = db.student_answers.filter(sa => sa.user_id != studentId);
    db.reflection_responses = db.reflection_responses.filter(rr => rr.user_id != studentId);
    saveDB(db);
    return { success: true, message: 'Data siswa berhasil dihapus.' };
  }

  function getQuestions(actNum) {
    const db = getDB();
    const act = db.activities.find(a => a.activity_number == actNum);
    if (!act) return { success: false, questions: [] };

    const questions = db.questions.filter(q => q.activity_id == act.id)
      .sort((a, b) => (a.order_num || 0) - (b.order_num || 0));

    return { success: true, questions };
  }

  function saveQuestion(payload) {
    const db = getDB();
    let act = null;
    if (payload.activity_number) {
      act = db.activities.find(a => a.activity_number == payload.activity_number);
    } else if (payload.activity_id) {
      act = db.activities.find(a => a.id == payload.activity_id);
    } else if (payload.id) {
      const existingQ = db.questions.find(q => q.id == payload.id);
      if (existingQ) {
        act = db.activities.find(a => a.id == existingQ.activity_id);
      }
    }
    if (!act) return { success: false, message: 'Aktivitas tidak valid.' };

    if (payload.id && payload.id > 0) {
      let q = db.questions.find(q => q.id == payload.id);
      if (q) {
        q.activity_id = act.id;
        q.order_num = payload.order_num;
        q.stimulus_text = payload.stimulus_text;
        q.stimulus_image_url = payload.stimulus_image_url;
        q.question_text = payload.question_text;
        q.options = payload.options;
        q.correct_answer = payload.correct_answer;
        q.explanation = payload.explanation;
      }
    } else {
      const maxId = db.questions.reduce((m, q) => Math.max(m, q.id || 0), 0);
      db.questions.push({
        id: maxId + 1,
        activity_id: act.id,
        order_num: payload.order_num || 1,
        stimulus_text: payload.stimulus_text || '',
        stimulus_image_url: payload.stimulus_image_url || '',
        question_text: payload.question_text,
        options: payload.options,
        correct_answer: payload.correct_answer,
        explanation: payload.explanation || ''
      });
    }

    saveDB(db);
    return { success: true, message: 'Soal berhasil disimpan ke bank soal.' };
  }

  function deleteQuestion(qId) {
    const db = getDB();
    db.questions = db.questions.filter(q => q.id != qId);
    saveDB(db);
    return { success: true, message: 'Soal berhasil dihapus.' };
  }

  function getReflections() {
    const db = getDB();
    const refs = db.reflections.map(rf => {
      const count = db.reflection_responses.filter(rr => rr.reflection_id == rf.id).length;
      return Object.assign({}, rf, { response_count: count });
    });
    return { success: true, reflections: refs };
  }

  function saveReflection(payload) {
    const db = getDB();
    if (payload.id && payload.id > 0) {
      let rf = db.reflections.find(r => r.id == payload.id);
      if (rf) {
        rf.prompt_text = payload.prompt_text;
        rf.type = payload.type;
        rf.is_active = payload.is_active;
      }
    } else {
      const maxId = db.reflections.reduce((m, r) => Math.max(m, r.id || 0), 0);
      db.reflections.push({
        id: maxId + 1,
        prompt_text: payload.prompt_text,
        type: payload.type || 'essay',
        is_active: payload.is_active !== undefined ? payload.is_active : 1
      });
    }
    saveDB(db);
    return { success: true, message: 'Pertanyaan refleksi berhasil disimpan.' };
  }

  function deleteReflection(rfId) {
    const db = getDB();
    db.reflections = db.reflections.filter(r => r.id != rfId);
    db.reflection_responses = db.reflection_responses.filter(rr => rr.reflection_id != rfId);
    saveDB(db);
    return { success: true, message: 'Pertanyaan refleksi berhasil dihapus.' };
  }

  function viewReflectionResponses(refId) {
    const db = getDB();
    const responses = db.reflection_responses.filter(rr => rr.reflection_id == refId).map(rr => {
      const u = db.users.find(u => u.id == rr.user_id) || {};
      const cls = db.classes.find(c => c.id == u.class_id);
      return {
        student_name: u.name || 'Siswa',
        access_code: u.access_code || '-',
        class_name: cls ? cls.class_name : '-',
        rating: rr.rating,
        response_text: rr.response_text,
        submitted_at: rr.submitted_at || new Date().toISOString()
      };
    });
    return { success: true, responses };
  }

  // Backup & Restore Database JSON
  function exportDatabaseJSON() {
    const db = getDB();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `trigonometri_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  function importDatabaseJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.users && parsed.activities && parsed.questions) {
        saveDB(parsed);
        return { success: true, message: 'Database berhasil dipulihkan dari file backup!' };
      }
      return { success: false, message: 'Format file JSON backup tidak valid.' };
    } catch (e) {
      return { success: false, message: 'Gagal membaca file JSON: ' + e.message };
    }
  }

  // Detail Pengerjaan Siswa Lengkap untuk Menu Hasil Pengerjaan Siswa di Dashboard Guru
  function getStudentDetailSubmission(studentId) {
    const session = getSession();
    if (!session || session.role !== 'guru') {
      return { success: false, message: 'Akses ditolak. Khusus guru pengampu.' };
    }
    const db = getDB();
    const st = db.users.find(u => u.id == studentId && u.role === 'siswa');
    if (!st) return { success: false, message: 'Siswa tidak ditemukan.' };

    const cls = db.classes.find(c => c.id == st.class_id);
    const className = cls ? cls.class_name : 'XA';

    // 1. Progres semua aktivitas
    const progressList = db.activities.slice().sort((a,b) => a.activity_number - b.activity_number).map(act => {
      const sp = db.student_progress.find(p => p.user_id == st.id && p.activity_id == act.id);
      return {
        activity_id: act.id,
        activity_number: act.activity_number,
        title: act.title,
        status: sp ? sp.status : (act.activity_number == 1 ? 'in_progress' : 'locked'),
        score: sp ? sp.score : null,
        completed_at: sp ? sp.completed_at : null
      };
    });

    // 2. Aktivitas 1: Pertanyaan Pemantik
    const act1 = db.activities.find(a => a.activity_number == 1);
    const q1 = act1 ? db.questions.find(q => q.activity_id == act1.id) : null;
    const a1 = (q1 && act1) ? db.student_answers.find(sa => sa.user_id == st.id && sa.question_id == q1.id) : null;

    // 3. Aktivitas 2: LKPD Simulasi Konsep & Pertanyaan Analisis
    const act2 = db.activities.find(a => a.activity_number == 2);
    const q2 = act2 ? db.questions.find(q => q.activity_id == act2.id) : null;
    const a2 = (q2 && act2) ? db.student_answers.find(sa => sa.user_id == st.id && sa.question_id == q2.id) : null;
    let act2Parsed = null;
    if (a2 && a2.student_answer) {
      try {
        act2Parsed = JSON.parse(a2.student_answer);
      } catch (e) {
        act2Parsed = { conclusion: a2.student_answer, observation_table: [] };
      }
    }

    // 4. Aktivitas 4: Verifikasi Sudut Istimewa
    const act4 = db.activities.find(a => a.activity_number == 4);
    const q4 = act4 ? db.questions.find(q => q.activity_id == act4.id) : null;
    const a4 = (q4 && act4) ? db.student_answers.find(sa => sa.user_id == st.id && sa.question_id == q4.id) : null;
    let act4Parsed = null;
    if (a4 && a4.student_answer) {
      try {
        act4Parsed = JSON.parse(a4.student_answer);
      } catch (e) {}
    }

    // 5. Aktivitas 5: Latihan Soal (5 Butir)
    const act5 = db.activities.find(a => a.activity_number == 5);
    const q5List = act5 ? db.questions.filter(q => q.activity_id == act5.id).sort((a,b) => (a.order_num||0)-(b.order_num||0)) : [];
    let act5CorrectCount = 0;
    const act5Details = q5List.map((q, idx) => {
      const sa = db.student_answers.find(a => a.user_id == st.id && a.question_id == q.id);
      const studentAns = sa ? sa.student_answer : null;
      const isCorrect = studentAns && (studentAns.trim().toUpperCase() === (q.correct_answer || '').trim().toUpperCase());
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
        score: sa ? sa.score : 0,
        explanation: q.explanation || ''
      };
    });
    const act5Score = q5List.length > 0 ? Math.round((act5CorrectCount / q5List.length) * 100) : null;

    // 6. Aktivitas 8: Sumatif Literasi Numerasi (10 Butir)
    const act8 = db.activities.find(a => a.activity_number == 8);
    const q8List = act8 ? db.questions.filter(q => q.activity_id == act8.id).sort((a,b) => (a.order_num||0)-(b.order_num||0)) : [];
    let act8CorrectCount = 0;
    const act8Details = q8List.map((q, idx) => {
      const sa = db.student_answers.find(a => a.user_id == st.id && a.question_id == q.id);
      const studentAns = sa ? sa.student_answer : null;
      const isCorrect = studentAns && (studentAns.trim().toUpperCase() === (q.correct_answer || '').trim().toUpperCase());
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
        score: sa ? sa.score : 0,
        explanation: q.explanation || ''
      };
    });
    const act8Score = q8List.length > 0 ? Math.round((act8CorrectCount / q8List.length) * 100) : null;

    // 7. Aktivitas 9: Refleksi Siswa
    const refList = (db.reflections || []).map(rf => {
      const rr = db.reflection_responses.find(r => r.user_id == st.id && r.reflection_id == rf.id);
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
        class_name: className,
        class_id: st.class_id
      },
      progress: progressList,
      act1: {
        stimulus_text: q1 ? q1.stimulus_text : '',
        question_text: q1 ? q1.question_text : '',
        answer: a1 ? a1.student_answer : null,
        score: a1 ? a1.score : null,
        teacher_feedback: a1 ? a1.teacher_feedback : null
      },
      act2: {
        observation_table: (act2Parsed && act2Parsed.observation_table) || [],
        conclusion: (act2Parsed && act2Parsed.conclusion) || '',
        q1: (act2Parsed && act2Parsed.q1) || '',
        q2: (act2Parsed && act2Parsed.q2) || '',
        q3: (act2Parsed && act2Parsed.q3) || '',
        score: a2 ? a2.score : null,
        teacher_feedback: a2 ? a2.teacher_feedback : null
      },
      act4: {
        table_answers: (act4Parsed && act4Parsed.table_answers) || null,
        status: progressList.find(p => p.activity_number == 4)?.status || 'locked'
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
  }

  // Isi data simulasi jawaban siswa untuk demonstrasi instan menu Hasil Pengerjaan Siswa
  function populateSampleSubmissions() {
    const db = getDB();
    const demoCodes = ['A1', 'A2', 'B5', 'C1'];
    let count = 0;

    demoCodes.forEach(code => {
      let st = db.users.find(u => (u.access_code || '').toUpperCase() === code);
      if (!st) return;
      count++;

      // Tandai semua 10 aktivitas selesai
      db.activities.forEach(act => {
        let sp = db.student_progress.find(p => p.user_id == st.id && p.activity_id == act.id);
        if (!sp) {
          sp = { user_id: st.id, activity_id: act.id, status: 'completed', completed_at: new Date().toISOString() };
          db.student_progress.push(sp);
        } else {
          sp.status = 'completed';
          sp.completed_at = sp.completed_at || new Date().toISOString();
        }
      });

      // Akt 1
      const act1 = db.activities.find(a => a.activity_number == 1);
      const q1 = act1 ? db.questions.find(q => q.activity_id == act1.id) : null;
      if (q1) {
        let sa1 = db.student_answers.find(a => a.user_id == st.id && a.question_id == q1.id);
        const ansText = `Berdasarkan ilustrasi pohon di sekolah Al-Azhar, kita dapat menggunakan konsep segitiga siku-siku. Bayangkan garis dari mata pengamat ke puncak pohon sebagai sisi miring (hipotenusa), tinggi pohon sebagai sisi depan (de), dan jarak kaki pengamat ke pohon sebagai sisi samping (sa). Dengan mengukur sudut elevasi menggunakan klinometer dan jarak mendatar, tinggi pohon dapat dihitung dengan perbandingan tangen: tan(θ) = depan / samping, sehingga tinggi total = (jarak × tan θ) + tinggi mata pengamat.`;
        if (sa1) {
          sa1.student_answer = ansText;
          sa1.score = 90;
          sa1.teacher_feedback = 'Pemikiran matematis dan formulasi klinometer sangat tepat dan sistematis!';
        } else {
          db.student_answers.push({
            user_id: st.id,
            question_id: q1.id,
            student_answer: ansText,
            score: 90,
            teacher_feedback: 'Pemikiran matematis dan formulasi klinometer sangat tepat dan sistematis!'
          });
        }
      }

      // Akt 2
      const act2 = db.activities.find(a => a.activity_number == 2);
      const q2 = act2 ? db.questions.find(q => q.activity_id == act2.id) : null;
      if (q2) {
        const obsTable = [
          { angle: '30°', depan: '110.0', samping: '190.5', miring: '220.0', sin: '0.500', cos: '0.866', tan: '0.577', kondisi: 'Skala Normal' },
          { angle: '30°', depan: '70.0', samping: '121.2', miring: '140.0', sin: '0.500', cos: '0.866', tan: '0.577', kondisi: 'Skala Kecil' },
          { angle: '30°', depan: '140.0', samping: '242.5', miring: '280.0', sin: '0.500', cos: '0.866', tan: '0.577', kondisi: 'Skala Besar' },
          { angle: '45°', depan: '155.6', samping: '155.6', miring: '220.0', sin: '0.707', cos: '0.707', tan: '1.000', kondisi: 'Sudut 45°' },
          { angle: '60°', depan: '190.5', samping: '110.0', miring: '220.0', sin: '0.866', cos: '0.500', tan: '1.732', kondisi: 'Sudut 60°' }
        ];
        const q1Ans = 'Nilai perbandingan rasio sisi (sin, cos, tan) tetap konstan meskipun skala segitiga diubah-ubah dari kecil ke besar. Hal ini karena segitiga yang terbentuk selalu sebangun (similar) dengan besar sudut lancip yang sama, sehingga perbandingan sisi-sisinya selalu bernilai tetap.';
        const q2Ans = 'Ketika sudut θ bertambah dari 0° menuju 90°, sisi depan membesar dan sisi samping mengecil mendekati nol. Akibatnya nilai Sin meningkat dari 0 ke 1, nilai Cos menurun dari 1 ke 0, dan nilai Tan membesar hingga tidak terdefinisi pada 90° karena pembagian dengan nol (samping = 0).';
        const q3Ans = 'Sinus θ adalah perbandingan panjang sisi depan dengan sisi miring (Demi). Kosinus θ adalah perbandingan sisi samping dengan sisi miring (Sami). Tangen θ adalah perbandingan sisi depan dengan sisi samping (Desa).';
        const act2Payload = JSON.stringify({
          observation_table: obsTable,
          conclusion: `1. ${q1Ans}\n\n2. ${q2Ans}\n\n3. ${q3Ans}`,
          q1: q1Ans,
          q2: q2Ans,
          q3: q3Ans,
          submitted_at: new Date().toISOString()
        });
        let sa2 = db.student_answers.find(a => a.user_id == st.id && a.question_id == q2.id);
        if (sa2) {
          sa2.student_answer = act2Payload;
          sa2.score = 95;
          sa2.teacher_feedback = 'Analisis kesebangunan dan penjelasan limit pembagian nol pada tan 90° sangat mengagumkan!';
        } else {
          db.student_answers.push({
            user_id: st.id,
            question_id: q2.id,
            student_answer: act2Payload,
            score: 95,
            teacher_feedback: 'Analisis kesebangunan dan penjelasan limit pembagian nol pada tan 90° sangat mengagumkan!'
          });
        }
      }

      // Akt 4
      const act4 = db.activities.find(a => a.activity_number == 4);
      let q4 = act4 ? db.questions.find(q => q.activity_id == act4.id) : null;
      if (!q4 && act4) {
        const maxQ = db.questions.reduce((m, q) => Math.max(m, q.id || 0), 0);
        q4 = { id: maxQ + 1, activity_id: act4.id, order_num: 1, question_text: "Tabel Verifikasi Perbandingan Trigonometri Sudut Istimewa (0°, 30°, 45°, 60°, 90°)" };
        db.questions.push(q4);
      }
      if (q4) {
        const act4Answers = {
          sin_0: '0', sin_30: '1/2', sin_45: '1/2 V2', sin_60: '1/2 V3', sin_90: '1',
          cos_0: '1', cos_30: '1/2 V3', cos_45: '1/2 V2', cos_60: '1/2', cos_90: '0',
          tan_0: '0', tan_30: '1/3 V3', tan_45: '1', tan_60: 'V3', tan_90: 'tak terdefinisi'
        };
        let sa4 = db.student_answers.find(a => a.user_id == st.id && a.question_id == q4.id);
        const ansJson = JSON.stringify({ table_answers: act4Answers, submitted_at: new Date().toISOString() });
        if (sa4) {
          sa4.student_answer = ansJson;
          sa4.score = 100;
        } else {
          db.student_answers.push({ user_id: st.id, question_id: q4.id, student_answer: ansJson, score: 100, teacher_feedback: null });
        }
      }

      // Akt 5
      const act5 = db.activities.find(a => a.activity_number == 5);
      const q5List = act5 ? db.questions.filter(q => q.activity_id == act5.id) : [];
      q5List.forEach(q => {
        let sa = db.student_answers.find(a => a.user_id == st.id && a.question_id == q.id);
        const studentAns = q.correct_answer || 'A';
        if (sa) {
          sa.student_answer = studentAns;
          sa.score = 100;
        } else {
          db.student_answers.push({ user_id: st.id, question_id: q.id, student_answer: studentAns, score: 100, teacher_feedback: null });
        }
      });

      // Akt 8
      const act8 = db.activities.find(a => a.activity_number == 8);
      const q8List = act8 ? db.questions.filter(q => q.activity_id == act8.id) : [];
      q8List.forEach((q, idx) => {
        let sa = db.student_answers.find(a => a.user_id == st.id && a.question_id == q.id);
        let studentAns = q.correct_answer || 'B';
        let score = 100;
        if (idx === 7) {
          const wrongOpt = Object.keys(q.options || {}).find(k => k !== q.correct_answer) || 'A';
          studentAns = wrongOpt;
          score = 0;
        }
        if (sa) {
          sa.student_answer = studentAns;
          sa.score = score;
        } else {
          db.student_answers.push({ user_id: st.id, question_id: q.id, student_answer: studentAns, score: score, teacher_feedback: null });
        }
      });

      // Akt 9
      (db.reflections || []).forEach(rf => {
        let rr = db.reflection_responses.find(r => r.user_id == st.id && r.reflection_id == rf.id);
        let rating = rf.type === 'scale' ? 5 : null;
        let text = '';
        if (rf.id === 1) { text = 'Sangat paham, simulasi segitiga dan sudut istimewa sangat memudahkan konsep.'; rating = 5; }
        else if (rf.id === 2) { text = 'Media interaktif ini sangat membantu memahami perbandingan trigonometri.'; rating = 5; }
        else if (rf.id === 3) { text = 'Aktivitas 8 soal nomor 8 mengenai sudut depresi mercusuar cukup menantang.'; }
        else if (rf.id === 4) { text = 'Penerapan trigonometri pada arsitektur atap rumah tahan gempa di Palu sangat membuka wawasan saya!'; }

        if (rr) {
          rr.rating = rating;
          rr.response_text = text;
        } else {
          db.reflection_responses.push({
            user_id: st.id,
            reflection_id: rf.id,
            rating: rating,
            response_text: text,
            submitted_at: new Date().toISOString()
          });
        }
      });
    });

    saveDB(db);
    return { success: true, message: `Berhasil mengisi contoh pengerjaan untuk ${count} siswa (A1, A2, B5, C1)!` };
  }

  // Impor hasil pengerjaan siswa dari format JSON
  function importStudentSubmission(data) {
    const db = getDB();
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const submissions = Array.isArray(parsed) ? parsed : [parsed];
      let importedCount = 0;

      submissions.forEach(sub => {
        if (!sub || !sub.student) return;
        const studentInfo = sub.student;
        let st = db.users.find(u =>
          (u.access_code && (u.access_code || '').toUpperCase() === (studentInfo.access_code || '').toUpperCase()) ||
          (u.id && u.id == studentInfo.id)
        );

        if (!st) {
          const maxId = db.users.reduce((m, u) => Math.max(m, u.id || 0), 0);
          let cls = db.classes.find(c => c.class_name === studentInfo.class_name);
          if (!cls) {
            const maxCls = db.classes.reduce((m, c) => Math.max(m, c.id || 0), 0);
            cls = { id: maxCls + 1, class_name: studentInfo.class_name || 'XA' };
            db.classes.push(cls);
          }
          st = {
            id: maxId + 1,
            role: 'siswa',
            access_code: studentInfo.access_code || ('S' + (maxId + 1)),
            name: studentInfo.name || 'Siswa Impor',
            class_id: cls.id
          };
          db.users.push(st);
        }

        const targetUserId = st.id;

        if (Array.isArray(sub.progress)) {
          sub.progress.forEach(p => {
            let existing = db.student_progress.find(sp => sp.user_id == targetUserId && sp.activity_id == p.activity_id);
            if (existing) {
              existing.status = p.status;
              existing.score = p.score;
              existing.completed_at = p.completed_at;
            } else {
              db.student_progress.push(Object.assign({}, p, { user_id: targetUserId }));
            }
          });
        }

        if (Array.isArray(sub.answers)) {
          sub.answers.forEach(a => {
            let existing = db.student_answers.find(sa => sa.user_id == targetUserId && sa.question_id == a.question_id);
            if (existing) {
              existing.student_answer = a.student_answer;
              existing.score = a.score;
              if (a.teacher_feedback) existing.teacher_feedback = a.teacher_feedback;
            } else {
              db.student_answers.push(Object.assign({}, a, { user_id: targetUserId }));
            }
          });
        }

        if (Array.isArray(sub.reflections)) {
          sub.reflections.forEach(r => {
            let existing = db.reflection_responses.find(rr => rr.user_id == targetUserId && rr.reflection_id == r.reflection_id);
            if (existing) {
              existing.rating = r.rating;
              existing.response_text = r.response_text;
            } else {
              db.reflection_responses.push(Object.assign({}, r, { user_id: targetUserId }));
            }
          });
        }

        importedCount++;
      });

      saveDB(db);
      return { success: true, message: `Berhasil mengimpor data pengerjaan untuk ${importedCount} siswa!` };
    } catch (e) {
      return { success: false, message: 'Gagal mengimpor data: ' + e.message };
    }
  }

  // Ekspor hasil pengerjaan siswa aktif (untuk dikirim ke guru atau backup)
  function exportStudentSubmission(studentId) {
    const session = getSession();
    const db = getDB();
    const idToExport = studentId || (session ? session.id : null);
    if (!idToExport) return null;

    const st = db.users.find(u => u.id == idToExport);
    if (!st) return null;
    const cls = db.classes.find(c => c.id == st.class_id);

    return {
      version: "1.0",
      exported_at: new Date().toISOString(),
      student: {
        id: st.id,
        name: st.name,
        access_code: st.access_code,
        class_name: cls ? cls.class_name : 'XA'
      },
      progress: db.student_progress.filter(p => p.user_id == idToExport),
      answers: db.student_answers.filter(a => a.user_id == idToExport),
      reflections: db.reflection_responses.filter(r => r.user_id == idToExport)
    };
  }

  return {
    init: getDB,
    resetToDefault,
    auth: {
      loginStudent,
      loginTeacher,
      registerStudent,
      checkSession,
      logout
    },
    progress: {
      get: getStudentProgress
    },
    activities: {
      get: getActivity,
      submit: submitActivity
    },
    settings: {
      getExamToken: function() {
        const db = getDB();
        return (db.settings && db.settings.exam_token) ? db.settings.exam_token.trim().toUpperCase() : 'TRIGONO2026';
      },
      setExamToken: function(tok) {
        const db = getDB();
        if (!db.settings) db.settings = {};
        db.settings.exam_token = (tok || 'TRIGONO2026').trim().toUpperCase();
        saveDB(db);
        return db.settings.exam_token;
      }
    },
    teacher: {
      getDashboard: getTeacherDashboard,
      gradeManual,
      addStudent: addStudentTeacher,
      updateStudent: updateStudentTeacher,
      resetProgress: resetStudentProgress,
      deleteStudent: deleteStudentTeacher,
      getQuestions,
      saveQuestion,
      deleteQuestion,
      getReflections,
      saveReflection,
      deleteReflection,
      viewReflectionResponses,
      getStudentDetailSubmission,
      populateSampleSubmissions,
      importStudentSubmission,
      exportStudentSubmission,
      exportJSON: exportDatabaseJSON,
      getExamToken: function() {
        const db = getDB();
        return (db.settings && db.settings.exam_token) ? db.settings.exam_token.trim().toUpperCase() : 'TRIGONO2026';
      },
      setExamToken: function(tok) {
        const db = getDB();
        if (!db.settings) db.settings = {};
        db.settings.exam_token = (tok || 'TRIGONO2026').trim().toUpperCase();
        saveDB(db);
        return db.settings.exam_token;
      },
      importJSON: importDatabaseJSON
    },
    student: {
      exportSubmission: exportStudentSubmission
    }
  };
})();

// ========================================================
// SMART FETCH INTERCEPTOR UNTUK GITHUB PAGES / STATIC HOSTING
// ========================================================
(function() {
  const originalFetch = window.fetch;

  window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    // Cek apakah request ditujukan ke endpoint api/*.php
    const isApiRequest = url.includes('api/auth.php') ||
                         url.includes('api/activities.php') ||
                         url.includes('api/progress.php') ||
                         url.includes('api/teacher.php');

    // Cek apakah berjalan di GitHub Pages, static hosting, file://, atau mode client storage
    const isPhpHost = window.location.pathname.endsWith('.php');
    const isStatic = !isPhpHost ||
                     window.USE_CLIENT_STORAGE === true ||
                     window.location.protocol === 'file:' ||
                     window.location.hostname.includes('github.io') ||
                     window.location.hostname.includes('pages.dev') ||
                     window.location.hostname.includes('netlify.app') ||
                     window.location.hostname.includes('vercel.app') ||
                     window.location.pathname.endsWith('.html');

    if (isApiRequest && isStatic) {
      try {
        const responseData = await handleMockApi(url, init);
        if (responseData !== null) {
          return new Response(JSON.stringify(responseData), {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } catch (err) {
        console.error('StorageService Mock Error:', err);
        return new Response(JSON.stringify({ success: false, message: err.message }), {
          status: 500,
          statusText: 'Internal Error',
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // Jika berjalan pada server PHP asli (misal http://localhost:8080/index.php)
    try {
      const response = await originalFetch.apply(this, arguments);
      // Jika server PHP mengembalikan 404 (misal di GitHub Pages atau host statis)
      if (!response.ok && response.status === 404 && isApiRequest) {
        const fallbackData = await handleMockApi(url, init);
        if (fallbackData !== null) {
          return new Response(JSON.stringify(fallbackData), {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      }
      return response;
    } catch (netErr) {
      // Jika gagal koneksi (network error / offline)
      if (isApiRequest) {
        const fallbackData = await handleMockApi(url, init);
        if (fallbackData !== null) {
          return new Response(JSON.stringify(fallbackData), {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      }
      throw netErr;
    }
  };

  async function handleMockApi(rawUrl, init) {
    let urlPath = rawUrl;
    let queryStr = '';
    const qIndex = rawUrl.indexOf('?');
    if (qIndex !== -1) {
      urlPath = rawUrl.substring(0, qIndex);
      queryStr = rawUrl.substring(qIndex + 1);
    }
    const searchParams = new URLSearchParams(queryStr);
    let action = searchParams.get('action') || '';
    let body = {};

    if (init && init.body) {
      try {
        body = (typeof init.body === 'string') ? JSON.parse(init.body) : init.body;
        if (body.action) {
          action = body.action;
        }
      } catch (e) {
        // body not json
      }
    }

    // 1. AUTH (api/auth.php)
    if (urlPath.includes('api/auth.php')) {
      if (action === 'check') {
        return StorageService.auth.checkSession();
      }
      if (action === 'login_siswa') {
        return StorageService.auth.loginStudent(body.access_code);
      }
      if (action === 'login_guru') {
        return StorageService.auth.loginTeacher(body.username, body.access_code);
      }
      if (action === 'register_siswa') {
        return StorageService.auth.registerStudent(body.name, body.class_name, body.absen);
      }
      if (action === 'logout') {
        return StorageService.auth.logout();
      }
      return { success: false, message: 'Aksi auth tidak valid' };
    }

    // 2. PROGRESS (api/progress.php)
    if (urlPath.includes('api/progress.php')) {
      if (action === 'get') {
        return StorageService.progress.get();
      }
      return { success: false, message: 'Aksi progress tidak valid' };
    }

    // 3. ACTIVITIES (api/activities.php)
    if (urlPath.includes('api/activities.php')) {
      if (action === 'get') {
        const actNum = parseInt(searchParams.get('activity_number') || '1', 10);
        return StorageService.activities.get(actNum);
      }
      if (action.startsWith('submit_act')) {
        const actNum = parseInt(action.replace('submit_act', ''), 10);
        return StorageService.activities.submit(actNum, body);
      }
      return { success: false, message: 'Aksi aktivitas tidak valid' };
    }

    // 4. TEACHER (api/teacher.php)
    if (urlPath.includes('api/teacher.php')) {
      if (action === 'dashboard') {
        const className = searchParams.get('class') || 'all';
        return StorageService.teacher.getDashboard(className);
      }
      if (action === 'grade_manual') {
        const actId = body.activity_id || body.activity_number || 1;
        return StorageService.teacher.gradeManual(body.student_id, actId, body.score, body.teacher_feedback);
      }
      if (action === 'add_student') {
        return StorageService.teacher.addStudent(body.name, body.class_name, body.absen);
      }
      if (action === 'update_student') {
        return StorageService.teacher.updateStudent(body.student_id, body.name, body.class_name, body.access_code);
      }
      if (action === 'reset_progress') {
        return StorageService.teacher.resetProgress(body.student_id, body.clear_answers);
      }
      if (action === 'delete_student') {
        return StorageService.teacher.deleteStudent(body.student_id);
      }
      if (action === 'get_questions') {
        const actNum = parseInt(searchParams.get('activity_number') || '5', 10);
        return StorageService.teacher.getQuestions(actNum);
      }
      if (action === 'save_question') {
        return StorageService.teacher.saveQuestion(body);
      }
      if (action === 'delete_question') {
        return StorageService.teacher.deleteQuestion(body.id);
      }
      if (action === 'get_reflections') {
        return StorageService.teacher.getReflections();
      }
      if (action === 'save_reflection') {
        return StorageService.teacher.saveReflection(body);
      }
      if (action === 'delete_reflection') {
        return StorageService.teacher.deleteReflection(body.id);
      }
      if (action === 'view_reflection_responses') {
        const refId = searchParams.get('reflection_id') || body.reflection_id;
        return StorageService.teacher.viewReflectionResponses(refId);
      }
      if (action === 'get_student_submission') {
        const studentId = parseInt(searchParams.get('student_id') || body.student_id, 10);
        return StorageService.teacher.getStudentDetailSubmission(studentId);
      }
      if (action === 'populate_sample_submissions') {
        return StorageService.teacher.populateSampleSubmissions();
      }
      if (action === 'import_student_submission') {
        return StorageService.teacher.importStudentSubmission(body.data);
      }
      if (action === 'export_student_submission') {
        const studentId = parseInt(searchParams.get('student_id') || body.student_id, 10);
        return StorageService.teacher.exportStudentSubmission(studentId);
      }
      if (action === 'get_token') {
        return { success: true, token: StorageService.settings.getExamToken() };
      }
      if (action === 'set_token') {
        const updated = StorageService.settings.setExamToken(body.token);
        return { success: true, token: updated };
      }
      return { success: false, message: 'Aksi guru tidak valid' };
    }

    return null;
  }
})();
