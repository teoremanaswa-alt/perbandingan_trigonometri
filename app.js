/**
 * assets/js/app.js - Kontroler Utama Frontend Media Pembelajaran Trigonometri
 * Pengembang: Aswan, M.Pd., Gr.
 */

const App = (function() {
  let currentUser = null;
  let currentActivityNum = 1;
  let currentProgressList = [];
  let currentSimObjects = {};

  function getStimulusImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const filename = url.split('/').pop().split('?')[0];
    if (window.SVG_DATA && window.SVG_DATA[filename]) {
      return window.SVG_DATA[filename];
    }
    return url;
  }

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

  function toggleExplanation(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    if (isHidden) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
    const btnText = document.getElementById('btn-text-' + id);
    if (btnText) {
      btnText.textContent = isHidden ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan';
    }
  }
  // 1. INISIALISASI & AUTENTIKASI
  // ==========================================
  async function init() {
    try {
      let data = null;
      if (window.StorageService && (window.USE_CLIENT_STORAGE || !window.location.pathname.endsWith('.php'))) {
        data = window.StorageService.auth.checkSession();
      } else {
        const res = await fetch('api/auth.php?action=check');
        data = await res.json();
      }
      if (data && data.success && data.user) {
        currentUser = data.user;
        renderApp();
      } else {
        renderAuthView();
      }
    } catch (err) {
      if (window.StorageService) {
        const fallbackData = window.StorageService.auth.checkSession();
        if (fallbackData && fallbackData.success && fallbackData.user) {
          currentUser = fallbackData.user;
          renderApp();
          return;
        }
      }
      console.warn('Gagal inisialisasi sesi, menampilkan layar autentikasi:', err);
      renderAuthView();
    }
  }

  function renderAuthView() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('student-container').classList.add('hidden');
    document.getElementById('teacher-container').classList.add('hidden');
    
    // Pastikan input guru kosong
    const tUser = document.getElementById('login-teacher-username');
    const tCode = document.getElementById('login-teacher-code');
    if (tUser) tUser.value = '';
    if (tCode) tCode.value = '';

    renderMathJaxOrKaTeX();
  }

  function renderApp() {
    document.getElementById('auth-container').classList.add('hidden');
    if (currentUser.role === 'guru') {
      document.getElementById('student-container').classList.add('hidden');
      document.getElementById('teacher-container').classList.remove('hidden');
      initTeacherDashboard();
    } else {
      document.getElementById('teacher-container').classList.add('hidden');
      document.getElementById('student-container').classList.remove('hidden');
      initStudentView();
    }
  }

  // Login Siswa
  async function loginStudent(code) {
    if (!code) {
      Swal.fire('Perhatian', 'Harap masukkan kode akses (contoh: A21 atau A1)', 'warning');
      return;
    }
    try {
      let data = null;
      if (window.StorageService && (window.USE_CLIENT_STORAGE || !window.location.pathname.endsWith('.php'))) {
        data = window.StorageService.auth.loginStudent(code);
      } else {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login_siswa', access_code: code })
        });
        data = await res.json();
      }

      if (data && data.success) {
        currentUser = data.user;
        Swal.fire({
          icon: 'success',
          title: 'Selamat Belajar!',
          text: data.message,
          timer: 1500,
          showConfirmButton: false
        });
        renderApp();
      } else {
        Swal.fire('Gagal Masuk', data ? data.message : 'Kode akses tidak ditemukan', 'error');
      }
    } catch (err) {
      if (window.StorageService) {
        const fallbackRes = window.StorageService.auth.loginStudent(code);
        if (fallbackRes.success) {
          currentUser = fallbackRes.user;
          Swal.fire({
            icon: 'success',
            title: 'Selamat Belajar!',
            text: fallbackRes.message,
            timer: 1500,
            showConfirmButton: false
          });
          renderApp();
          return;
        } else {
          Swal.fire('Gagal Masuk', fallbackRes.message, 'error');
          return;
        }
      }
      Swal.fire('Error', 'Terjadi kesalahan jaringan: ' + err.message, 'error');
    }
  }

  // Login Guru
  async function loginTeacher(username, code) {
    if (!username || !code) {
      Swal.fire('Perhatian', 'Harap masukkan username dan kode akses guru.', 'warning');
      return;
    }
    try {
      let data = null;
      if (window.StorageService && (window.USE_CLIENT_STORAGE || !window.location.pathname.endsWith('.php'))) {
        data = window.StorageService.auth.loginTeacher(username, code);
      } else {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login_guru', username, access_code: code })
        });
        data = await res.json();
      }

      if (data && data.success) {
        currentUser = data.user;
        Swal.fire({
          icon: 'success',
          title: 'Selamat Datang, Bapak Aswan!',
          text: data.message,
          timer: 1500,
          showConfirmButton: false
        });
        renderApp();
      } else {
        Swal.fire('Kredensial Salah', data ? data.message : 'Periksa Username dan Kode Akses.', 'error');
      }
    } catch (err) {
      if (window.StorageService) {
        const fallbackRes = window.StorageService.auth.loginTeacher(username, code);
        if (fallbackRes.success) {
          currentUser = fallbackRes.user;
          Swal.fire({
            icon: 'success',
            title: 'Selamat Datang, Bapak Aswan!',
            text: fallbackRes.message,
            timer: 1500,
            showConfirmButton: false
          });
          renderApp();
          return;
        } else {
          Swal.fire('Kredensial Salah', fallbackRes.message, 'error');
          return;
        }
      }
      Swal.fire('Error', 'Terjadi kesalahan sistem: ' + err.message, 'error');
    }
  }

  // Registrasi Siswa Baru
  async function registerStudent(name, className, absen) {
    if (!name || !className || !absen) {
      Swal.fire('Perhatian', 'Harap lengkapi semua kolom pendaftaran.', 'warning');
      return;
    }
    try {
      let data = null;
      if (window.StorageService && (window.USE_CLIENT_STORAGE || !window.location.pathname.endsWith('.php'))) {
        data = window.StorageService.auth.registerStudent(name, className, absen);
      } else {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register_siswa',
            name,
            class_name: className,
            absen: parseInt(absen)
          })
        });
        data = await res.json();
      }
      if (data && data.success) {
        currentUser = data.user;
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil!',
          html: `<b>${data.message}</b><br><br><span class="text-sm text-gray-500">Simpan kode akses ini untuk masuk di lain waktu.</span>`,
          confirmButtonText: 'Mulai Belajar Sekarang'
        }).then(() => {
          renderApp();
        });
      } else {
        Swal.fire('Pendaftaran Gagal', data ? data.message : 'Gagal mendaftar', 'error');
      }
    } catch (err) {
      if (window.StorageService) {
        const fallbackRes = window.StorageService.auth.registerStudent(name, className, absen);
        if (fallbackRes.success) {
          currentUser = fallbackRes.user;
          confettiBurst();
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            html: `<b>${fallbackRes.message}</b><br><br><span class="text-sm text-gray-500">Simpan kode akses ini untuk masuk di lain waktu.</span>`,
            confirmButtonText: 'Mulai Belajar Sekarang'
          }).then(() => {
            renderApp();
          });
          return;
        }
      }
      Swal.fire('Error', 'Gagal memproses pendaftaran: ' + err.message, 'error');
    }
  }

  // Logout
  async function logout() {
    const confirm = await Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin keluar dari sistem pembelajaran?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      try {
        if (window.StorageService && (window.USE_CLIENT_STORAGE || !window.location.pathname.endsWith('.php'))) {
          window.StorageService.auth.logout();
        } else {
          await fetch('api/auth.php?action=logout');
        }
      } catch (e) {
        if (window.StorageService) window.StorageService.auth.logout();
      }
      currentUser = null;
      window.location.reload();
    }
  }

  // ==========================================
  // 2. LOGIKA INTERFAS SISWA (LOCKED PROGRESSION)
  // ==========================================
  async function initStudentView() {
    // Tampilkan info siswa
    document.getElementById('student-name-display').textContent = currentUser.name;
    document.getElementById('student-class-display').textContent = `${currentUser.class_name || 'XA'} • Kode: ${currentUser.access_code}`;

    await loadStudentProgress();
    // Buka aktivitas aktif terakhir atau aktivitas 1
    const activeAct = currentProgressList.find(p => p.status === 'in_progress') || currentProgressList[0];
    const initialActNum = activeAct ? activeAct.activity_number : 1;
    loadActivity(initialActNum);
  }

  async function loadStudentProgress() {
    try {
      const res = await fetch('api/progress.php?action=get');
      const data = await res.json();
      if (data.success) {
        currentProgressList = data.progress;
        renderSidebar(data);
      }
    } catch (err) {
      console.error('Gagal memuat progres:', err);
    }
  }

  function renderSidebar(progData) {
    const listContainer = document.getElementById('sidebar-activities-list');
    listContainer.innerHTML = '';

    // Update progress bar
    document.getElementById('overall-progress-pct').textContent = `${progData.percentage}%`;
    document.getElementById('overall-progress-bar').style.width = `${progData.percentage}%`;
    document.getElementById('overall-progress-text').textContent = `${progData.completed_count} dari ${progData.total_activities} Selesai`;

    // Ikon tematik tiap aktivitas untuk dashboard menu
    const actIcons = {
      1: 'fa-solid fa-lightbulb',
      2: 'fa-solid fa-draw-polygon',
      3: 'fa-solid fa-book-open',
      4: 'fa-solid fa-star',
      5: 'fa-solid fa-pen-to-square',
      6: 'fa-solid fa-cubes-stacked',
      7: 'fa-solid fa-calculator',
      8: 'fa-solid fa-clipboard-check',
      9: 'fa-solid fa-heart',
      10: 'fa-solid fa-award'
    };

    progData.progress.forEach(act => {
      const item = document.createElement('div');
      const iconClass = actIcons[act.activity_number] || 'fa-solid fa-circle';
      const isActive = (act.activity_number === currentActivityNum);
      const isCompleted = (act.status === 'completed');
      const isLocked = (act.status === 'locked');

      let itemClass = 'flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer select-none mb-1.5 ';
      let iconBoxClass = 'w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 transition-all ';
      let rightBadge = '';

      if (isActive) {
        // Active Dashboard Menu Item
        itemClass += 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25';
        iconBoxClass += 'bg-white/20 text-white shadow-inner';
        rightBadge = '<span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-black tracking-wider uppercase">Aktif</span>';
      } else if (isCompleted) {
        // Completed Dashboard Menu Item
        itemClass += 'bg-white hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-900 border border-slate-200/90 font-semibold shadow-xs';
        iconBoxClass += 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        rightBadge = '<span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shadow-xs"><i class="fa-solid fa-check"></i></span>';
      } else {
        // Locked Dashboard Menu Item
        itemClass += 'bg-slate-50/60 border border-slate-200/50 text-slate-400 opacity-60 cursor-not-allowed';
        iconBoxClass += 'bg-slate-200/60 text-slate-400';
        rightBadge = '<i class="fa-solid fa-lock text-slate-300 text-xs"></i>';
      }

      item.className = itemClass;
      item.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="${iconBoxClass}">
            <i class="${iconClass}"></i>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400'} uppercase font-extrabold tracking-wider leading-none">Modul ${act.activity_number}</div>
            <div class="text-xs truncate ${isActive ? 'text-white' : 'text-slate-800'} font-bold mt-1">${act.title}</div>
          </div>
        </div>
        <div class="shrink-0 ml-2">${rightBadge}</div>
      `;

      item.addEventListener('click', () => {
        if (isLocked) {
          Swal.fire({
            icon: 'info',
            title: 'Modul Terkunci',
            text: `Selesaikan Modul ${act.activity_number - 1} terlebih dahulu untuk membuka menu ini.`,
            confirmButtonColor: '#6366f1'
          });
          return;
        }
        loadActivity(act.activity_number);
      });

      listContainer.appendChild(item);
    });
  }

  // Muat Konten Aktivitas
  async function loadActivity(actNum) {
    currentActivityNum = actNum;
    const contentArea = document.getElementById('activity-content-area');
    contentArea.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-slate-400">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500 mb-4"></i>
        <p class="font-medium">Memuat modul pembelajaran Aktivitas ${actNum}...</p>
      </div>
    `;

    // Render ulang status highlight sidebar
    await loadStudentProgress();

    try {
      const res = await fetch(`api/activities.php?action=get&activity_number=${actNum}`);
      const data = await res.json();

      if (!data.success) {
        if (data.is_locked) {
          Swal.fire('Terkunci', data.message, 'warning');
          loadActivity(data.required_activity || 1);
          return;
        }
        contentArea.innerHTML = `<div class="p-6 text-red-500 bg-red-50 rounded-xl">${data.message}</div>`;
        return;
      }

      renderActivityModule(actNum, data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      contentArea.innerHTML = `<div class="p-6 text-red-500 bg-red-50 rounded-xl">Gagal memuat materi. Pastikan koneksi server aktif.</div>`;
    }
  }

  // Router Tampilan Aktivitas 1 - 10
  function renderActivityModule(actNum, payload) {
    const contentArea = document.getElementById('activity-content-area');
    const act = payload.activity;

    let headerHtml = `
      <div class="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black">#${actNum}</div>
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <i class="fa-solid fa-graduation-cap"></i> Aktivitas Pembelajaran ${actNum} dari 10
        </div>
        <h2 class="text-2xl md:text-3xl font-extrabold font-heading">${act.title}</h2>
        <p class="text-indigo-100 text-sm md:text-base mt-1 max-w-2xl">${act.subtitle || ''}</p>
      </div>
    `;

    let bodyHtml = '';

    switch (actNum) {
      case 1:
        bodyHtml = renderAct1(payload);
        break;
      case 2:
        bodyHtml = renderAct2(payload);
        break;
      case 3:
        bodyHtml = renderAct3(payload);
        break;
      case 4:
        bodyHtml = renderAct4(payload);
        break;
      case 5:
        bodyHtml = renderAct5(payload);
        break;
      case 6:
        bodyHtml = renderAct6(payload);
        break;
      case 7:
        bodyHtml = renderAct7(payload);
        break;
      case 8:
        bodyHtml = renderAct8(payload);
        break;
      case 9:
        bodyHtml = renderAct9(payload);
        break;
      case 10:
        bodyHtml = renderAct10(payload);
        break;
      default:
        bodyHtml = '<p>Modul aktivitas tidak tersedia.</p>';
    }

    contentArea.innerHTML = headerHtml + bodyHtml;

    // Inisialisasi widget interaktif sesuai nomor aktivitas
    postRenderActivity(actNum, payload);
    renderMathJaxOrKaTeX();
  }

  // ==========================================
  // VIEW MODUL 1: PERTANYAAN PEMANTIK
  // ==========================================
  function renderAct1(payload) {
    const q = payload.questions[0] || {};
    const existingAns = payload.existing_answers[0] || null;

    let ansValue = existingAns ? existingAns.student_answer : '';
    let isCompleted = payload.activity.user_status === 'completed';

    const defaultStimulus = "Di halaman sekolah SMAS Al Azhar Mandiri Palu terdapat sebuah pohon rindang yang menjulang tinggi. Pernahkah kalian berpikir bagaimana cara mengukur tinggi puncak pohon tersebut tanpa harus memanjatnya satu langkah pun? Hanya dengan berdiri di atas tanah, membidik puncak pohon dengan sudut elevasi tertentu, dan mengukur jarak langkah kaki kita, tinggi pohon dapat dihitung secara presisi! Rahasia matematika apakah yang menghubungkan sudut pandang, jarak horizontal, dan tinggi pohon tersebut?";
    const defaultQuestion = "Bagaimana cara mengukur tinggi pohon tanpa memanjatnya? Berdasarkan ilustrasi di samping, kemukakan ide, dugaan, dan strategi matematis kalian!";

    const stimulusText = q.stimulus_text || defaultStimulus;
    const questionText = q.question_text || defaultQuestion;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Kolom Stimulus -->
        <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-3">
              <i class="fa-solid fa-lightbulb"></i> Stimulus Konseptual
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">Misteri Mengukur Tanpa Memanjat</h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">${stimulusText}</p>
            <div class="rounded-xl overflow-hidden border border-slate-200 bg-sky-50 p-2">
              <img src="${getStimulusImageUrl(q.stimulus_image_url || 'stimulus_pohon.svg')}" onerror="var f=(this.src||'').split('/').pop().split('?')[0]; if(window.SVG_DATA && window.SVG_DATA[f]) this.src=window.SVG_DATA[f];" alt="Stimulus Pohon" class="w-full h-auto rounded-lg">
            </div>
          </div>
        </div>

        <!-- Kolom Form Uraian -->
        <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-3">
              <i class="fa-solid fa-pen-fancy"></i> Lembar Uraian Ide
            </div>
            <h3 class="text-base font-bold text-slate-800 mb-3">${questionText}</h3>

            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-600 uppercase mb-2">Tuliskan Ide Solusi Matematis Anda:</label>
              <textarea id="act1-answer" rows="9" class="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm leading-relaxed" placeholder="Tuliskan gagasan, ide, atau dugaan matematis Anda di sini...">${ansValue}</textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500">Kirim jawaban untuk membuka Aktivitas 2</span>
            <button onclick="App.submitAct1()" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
              <span>${isCompleted ? 'Perbarui Jawaban' : 'Kirim Jawaban & Lanjut'}</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 2: LKPD SIMULASI KONSEP
  // ==========================================
  function renderAct2(payload) {
    const existingAns = payload.existing_answers[0] || null;
    let conclusionVal = '';
    let q1Val = '';
    let q2Val = '';
    let q3Val = '';
    let tableDataVal = [];

    if (existingAns && existingAns.student_answer) {
      try {
        const parsed = JSON.parse(existingAns.student_answer);
        conclusionVal = parsed.conclusion || '';
        q1Val = parsed.q1 || '';
        q2Val = parsed.q2 || '';
        q3Val = parsed.q3 || '';
        tableDataVal = parsed.observation_table || [];
      } catch (e) {
        conclusionVal = existingAns.student_answer;
      }
    }
    if (!q1Val && !q2Val && !q3Val && conclusionVal) {
      q1Val = conclusionVal;
    }

    return `
      <div class="space-y-6">
        <!-- Panduan & Petunjuk Praktikum LKPD Terarah -->
        <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
          <div class="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold w-fit mb-3">
            <i class="fa-solid fa-compass"></i> Panduan Lembar Kerja Peserta Didik (LKPD)
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Eksplorasi Penemuan Konsep Perbandingan Trigonometri</h2>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">
            Ikuti 4 langkah penyelidikan ilmiah di bawah untuk menemukan sendiri mengapa rasio sisi segitiga siku-siku hanya bergantung pada besar sudut, serta memahami definisi dasar <b class="text-rose-600">Sinus</b>, <b class="text-sky-600">Kosinus</b>, dan <b class="text-amber-600">Tangen</b>:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div class="bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <b class="text-slate-800 block">Penyelidikan Skala</b>
                <span class="text-slate-500 text-[11px]">Tetapkan sudut pada 30°. Ubah slider skala segitiga (Kecil & Besar). Catat ke tabel.</span>
              </div>
            </div>
            <div class="bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <b class="text-slate-800 block">Variasi Sudut Lancip</b>
                <span class="text-slate-500 text-[11px]">Gunakan tombol sudut 0°, 30°, 45°, 60°, 75°, 90°. Amati perubahan bentuk sisi.</span>
              </div>
            </div>
            <div class="bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
              <div>
                <b class="text-slate-800 block">Analisis Pola Rasio</b>
                <span class="text-slate-500 text-[11px]">Perhatikan nilai De/Mi, Sa/Mi, dan De/Sa. Amati kasus khusus saat sudut 0° dan 90°.</span>
              </div>
            </div>
            <div class="bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
              <div>
                <b class="text-slate-800 block">Tarik Kesimpulan</b>
                <span class="text-slate-500 text-[11px]">Jawab 3 pertanyaan reflektif penemuan konsep di bagian bawah LKPD ini.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian 1: Kanvas Simulasi Segitiga Siku-siku Interaktif -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-1">
                <i class="fa-solid fa-draw-polygon"></i> Laboratorium Geometri Segitiga Siku-Siku
              </div>
              <h3 class="text-xl font-bold text-slate-800">Eksplorasi Dinamis Segitiga Siku-Siku ABC</h3>
              <p class="text-xs text-slate-500">Geser slider atau klik tombol sudut di bawah untuk mengamati perubahan panjang sisi dan nilai rasio.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="App.recordToLKPDTable()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2">
                <i class="fa-solid fa-plus-circle"></i> Catat Hasil ke Tabel LKPD
              </button>
            </div>
          </div>

          <!-- Kanvas & Kontroler -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div class="lg:col-span-7 flex justify-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
              <canvas id="canvas-triangle" width="560" height="340" class="sim-canvas max-w-full h-auto"></canvas>
            </div>

            <!-- Panel Sliders & Nilai Real-time -->
            <div class="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <!-- Slider Sudut Theta (0 - 90 Derajat) -->
              <div>
                <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <i class="fa-solid fa-compass-drafting text-indigo-600"></i> Besar Sudut Lancip θ:
                  </span>
                  <span id="label-angle-val" class="px-2.5 py-0.5 bg-indigo-600 text-white rounded-md font-mono text-sm font-bold shadow-xs">30°</span>
                </div>
                <input type="range" id="slider-triangle-angle" min="0" max="90" step="1" value="30" class="w-full h-2.5 bg-indigo-200 rounded-lg cursor-pointer accent-indigo-600">
                <div class="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                  <span>0° (Datar)</span>
                  <span>30°</span>
                  <span>45°</span>
                  <span>60°</span>
                  <span>90° (Tegak)</span>
                </div>

                <!-- Tombol Pintas Sudut Istimewa -->
                <div class="mt-3">
                  <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pintasan Sudut Eksplorasi:</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button type="button" onclick="App.setTriangleAngle(0)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">0°</button>
                    <button type="button" onclick="App.setTriangleAngle(30)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">30°</button>
                    <button type="button" onclick="App.setTriangleAngle(45)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">45°</button>
                    <button type="button" onclick="App.setTriangleAngle(60)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">60°</button>
                    <button type="button" onclick="App.setTriangleAngle(75)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">75°</button>
                    <button type="button" onclick="App.setTriangleAngle(90)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs">90°</button>
                    <button type="button" onclick="App.setTriangleScale(220)" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all border border-indigo-200 shadow-2xs ml-auto">
                      <i class="fa-solid fa-rotate-left"></i> Reset Skala
                    </button>
                  </div>
                </div>
              </div>

              <!-- Slider Ukuran Skala Segitiga -->
              <div class="pt-2 border-t border-slate-200">
                <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <i class="fa-solid fa-up-right-and-down-left-from-center text-slate-600"></i> Ukuran Skala (Perbesaran):
                  </span>
                  <span id="label-scale-val" class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-mono text-xs">Normal</span>
                </div>
                <input type="range" id="slider-triangle-scale" min="140" max="280" value="220" class="w-full h-2 bg-slate-300 rounded-lg cursor-pointer accent-slate-600">
                <div class="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Kecil (140px)</span>
                  <span>Normal (220px)</span>
                  <span>Besar (280px)</span>
                </div>
              </div>

              <!-- Nilai Rasio Realtime -->
              <div class="pt-3 border-t border-slate-200">
                <div class="text-xs font-extrabold text-slate-600 uppercase mb-2 flex items-center justify-between">
                  <span>Nilai Real-time Rasio Sisi:</span>
                  <span class="text-[10px] font-normal text-slate-400">Pembulatan 4 desimal</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                    <div class="text-[11px] font-bold text-rose-700">Sinus (θ)</div>
                    <div class="text-[10px] text-slate-500">depan / miring</div>
                    <div id="readout-sin" class="text-sm font-extrabold text-rose-600 font-mono mt-1">0.5000</div>
                  </div>
                  <div class="p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
                    <div class="text-[11px] font-bold text-sky-700">Kosinus (θ)</div>
                    <div class="text-[10px] text-slate-500">samping / miring</div>
                    <div id="readout-cos" class="text-sm font-extrabold text-sky-600 font-mono mt-1">0.8660</div>
                  </div>
                  <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <div class="text-[11px] font-bold text-amber-700">Tangen (θ)</div>
                    <div class="text-[10px] text-slate-500">depan / samping</div>
                    <div id="readout-tan" class="text-sm font-extrabold text-amber-600 font-mono mt-1">0.5774</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian 2: Tabel Lembar Kerja (LKPD) Siswa -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <i class="fa-solid fa-table-list"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800">Tabel Lembar Kerja Siswa (LKPD)</h3>
                <p class="text-xs text-slate-500">Rekap data pengukuran segitiga siku-siku dari berbagai sudut lancip θ.</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="App.clearLKPDTable()" class="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5">
                <i class="fa-solid fa-eraser"></i> Bersihkan Tabel
              </button>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 mb-6">
            <table class="w-full text-left text-xs" id="table-lkpd-observation">
              <thead class="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="p-3">No</th>
                  <th class="p-3">Sudut (θ)</th>
                  <th class="p-3 text-rose-700">Depan (a)</th>
                  <th class="p-3 text-sky-700">Samping (b)</th>
                  <th class="p-3 text-emerald-700">Miring (c)</th>
                  <th class="p-3 bg-rose-50 text-rose-700">Sin θ (De/Mi)</th>
                  <th class="p-3 bg-sky-50 text-sky-700">Cos θ (Sa/Mi)</th>
                  <th class="p-3 bg-amber-50 text-amber-700">Tan θ (De/Sa)</th>
                  <th class="p-3">Keterangan</th>
                  <th class="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-lkpd" class="divide-y divide-slate-100 text-slate-700 font-mono">
                <!-- Baris akan dimasukkan via JS -->
              </tbody>
            </table>
          </div>

          <!-- Pertanyaan Reflektif & Analisis Terarah Penemuan Konsep -->
          <div class="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-6">
            <div class="flex items-center gap-2 text-indigo-950 font-bold text-base border-b border-indigo-200/60 pb-3">
              <i class="fa-solid fa-brain text-indigo-600 text-lg"></i>
              <span>Pertanyaan Penyelidikan Terpandu Penemuan Konsep (Wajib Dilengkapi)</span>
            </div>

            <!-- Pertanyaan 1 -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <label for="act2-q1" class="block font-bold text-xs text-indigo-900 leading-relaxed">
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md font-mono mr-1">Pertanyaan 1</span>
                Ketika sudut lancip θ tetap sama (misalnya θ = 30°), namun ukuran segitiga diubah (skala diperbesar/diperkecil), apakah nilai perbandingan sisi (Sin, Cos, Tan) berubah atau tetap sama? Jelaskan mengapa hal ini terjadi dengan mengaitkannya pada konsep <b>kesebangunan segitiga</b>!
              </label>
              <textarea id="act2-q1" rows="3" class="w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs leading-relaxed" placeholder="Tuliskan analisis jawaban Anda di sini...">${q1Val}</textarea>
            </div>

            <!-- Pertanyaan 2 -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <label for="act2-q2" class="block font-bold text-xs text-indigo-900 leading-relaxed">
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md font-mono mr-1">Pertanyaan 2</span>
                Ketika sudut lancip θ diperbesar dari 0° menuju 90°, bagaimana kecenderungan panjang sisi depan, panjang sisi samping, serta nilai Sin, Cos, dan Tan? Mengapa nilai Tangen pada sudut 90° menjadi <b>tidak terdefinisi</b>?
              </label>
              <textarea id="act2-q2" rows="3" class="w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs leading-relaxed" placeholder="Tuliskan analisis jawaban Anda di sini...">${q2Val}</textarea>
            </div>

            <!-- Pertanyaan 3 -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <label for="act2-q3" class="block font-bold text-xs text-indigo-900 leading-relaxed">
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md font-mono mr-1">Pertanyaan 3</span>
                Berdasarkan seluruh hasil penyelidikan di atas, simpulkan formulasi definisi perbandingan trigonometri: <b>Sinus</b>, <b>Kosinus</b>, dan <b>Tangen</b> pada segitiga siku-siku menggunakan kalimat dan pemahaman Anda sendiri!
              </label>
              <textarea id="act2-q3" rows="3" class="w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs leading-relaxed" placeholder="Tuliskan kesimpulan jawaban Anda di sini...">${q3Val}</textarea>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500">Pastikan tabel memiliki data pengamatan dan ketiga pertanyaan terisi lengkap.</span>
            <button onclick="App.submitAct2()" class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
              <span>Submit LKPD & Buka Aktivitas 3</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 3: MATERI TRIGONOMETRI
  // ==========================================
  function renderAct3(payload) {
    return `
      <div class="space-y-6">
        <!-- Diagram Geometris Segitiga Siku-Siku: Penentuan Posisi Sisi Depan, Samping, Miring -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-1">
                <i class="fa-solid fa-draw-polygon"></i> Diagram Anatomi Segitiga Siku-Siku
              </div>
              <h3 class="text-xl font-bold text-slate-800">Menentukan Posisi Sisi Depan, Samping, & Miring</h3>
              <p class="text-xs text-slate-500">Pahami posisi ketiga sisi segitiga siku-siku ABC berdasarkan sudut acuan lancip yang ditinjau.</p>
            </div>

            <!-- Toggle Pilihan Sudut Acuan -->
            <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
              <button id="btn-ref-angle-theta" onclick="App.setAct3RefAngle('theta')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 text-white shadow-xs flex items-center gap-1.5">
                <i class="fa-solid fa-eye"></i> Sudut Acuan θ (di Titik A)
              </button>
              <button id="btn-ref-angle-beta" onclick="App.setAct3RefAngle('beta')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
                <i class="fa-solid fa-eye"></i> Sudut Acuan β (di Titik C)
              </button>
            </div>
          </div>

          <!-- Diagram & Panel Analisis -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <!-- Diagram SVG -->
            <div class="lg:col-span-7 flex justify-center bg-slate-50/70 p-4 rounded-2xl border border-slate-200" id="act3-diagram-container">
              <!-- SVG diisi secara dinamis via JS -->
            </div>

            <!-- Panel Rangkuman Posisi Sisi -->
            <div class="lg:col-span-5 space-y-3" id="act3-anatomy-details">
              <!-- Rangkuman terisi dinamis sesuai sudut acuan -->
            </div>
          </div>
        </div>

        <!-- Infografis 3 Kartu Definisi Sisi -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-3">
            <i class="fa-solid fa-shapes"></i> Rangkuman Konsep Anatomi
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Mengenal 3 Sisi Terhadap Sudut Acuan Lancip (θ)</h3>
          <p class="text-slate-600 text-sm mb-6">Penamaan sisi depan dan samping selalu relatif bergantung pada sudut mana yang menjadi sudut acuan!</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Card Sisi Depan -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200 hover-glow">
              <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow">
                De
              </div>
              <h4 class="text-base font-extrabold text-rose-800">Sisi Depan (Opposite)</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                Sisi segitiga yang posisinya berada tepat di seberang / berhadapan langsung dengan sudut acuan θ.
              </p>
              <div class="mt-3 px-2 py-1 bg-white/70 rounded-md text-[11px] font-mono text-rose-700 font-bold">
                Simbol: a / Depan
              </div>
            </div>

            <!-- Card Sisi Samping -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-200 hover-glow">
              <div class="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow">
                Sa
              </div>
              <h4 class="text-base font-extrabold text-sky-800">Sisi Samping (Adjacent)</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                Sisi tegak yang mengapit sudut acuan θ bersama dengan hipotenusa (bukan sisi miring).
              </p>
              <div class="mt-3 px-2 py-1 bg-white/70 rounded-md text-[11px] font-mono text-sky-700 font-bold">
                Simbol: b / Samping
              </div>
            </div>

            <!-- Card Sisi Miring -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 hover-glow">
              <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow">
                Mi
              </div>
              <h4 class="text-base font-extrabold text-emerald-800">Sisi Miring (Hypotenuse)</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                Sisi terpanjang pada segitiga siku-siku yang posisinya selalu tepat di depan sudut siku-siku 90°.
              </p>
              <div class="mt-3 px-2 py-1 bg-white/70 rounded-md text-[11px] font-mono text-emerald-700 font-bold">
                Simbol: c / Miring
              </div>
            </div>
          </div>
        </div>

        <!-- Jembatan Keledai Populer: DEMI - SAMI - DESA -->
        <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-7 rounded-2xl shadow-md">
          <div class="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-2">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Mnemonik Sakti SMA
          </div>
          <h3 class="text-2xl font-black font-heading mb-4">Ingat Rumus dengan: "DeMi - SaMi - DeSa"</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm flex flex-col justify-between">
              <div>
                <div class="text-rose-300 font-black text-xl mb-1 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-rose-500/30 text-rose-200 flex items-center justify-center text-xs font-bold">1</span>
                  SIN = De / Mi
                </div>
                <p class="text-xs text-slate-200 mb-3">Sinus adalah perbandingan sisi <b>Depan</b> terhadap sisi <b>Miring</b>.</p>
              </div>
              <div class="bg-black/50 border border-white/20 p-3.5 rounded-xl text-center font-bold text-base flex items-center justify-center gap-2">
                <span class="text-rose-300 font-black text-lg">sin θ</span>
                <span class="text-white font-bold text-lg">=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1.5 leading-tight text-xs md:text-sm font-extrabold">
                  <span class="border-b-2 border-white/90 pb-0.5 px-3 block w-full text-center text-rose-200">Sisi Depan</span>
                  <span class="pt-0.5 px-3 block w-full text-center text-emerald-200">Sisi Miring</span>
                </span>
              </div>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm flex flex-col justify-between">
              <div>
                <div class="text-sky-300 font-black text-xl mb-1 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-sky-500/30 text-sky-200 flex items-center justify-center text-xs font-bold">2</span>
                  COS = Sa / Mi
                </div>
                <p class="text-xs text-slate-200 mb-3">Kosinus adalah perbandingan sisi <b>Samping</b> terhadap sisi <b>Miring</b>.</p>
              </div>
              <div class="bg-black/50 border border-white/20 p-3.5 rounded-xl text-center font-bold text-base flex items-center justify-center gap-2">
                <span class="text-sky-300 font-black text-lg">cos θ</span>
                <span class="text-white font-bold text-lg">=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1.5 leading-tight text-xs md:text-sm font-extrabold">
                  <span class="border-b-2 border-white/90 pb-0.5 px-3 block w-full text-center text-sky-200">Sisi Samping</span>
                  <span class="pt-0.5 px-3 block w-full text-center text-emerald-200">Sisi Miring</span>
                </span>
              </div>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm flex flex-col justify-between">
              <div>
                <div class="text-amber-300 font-black text-xl mb-1 flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-amber-500/30 text-amber-200 flex items-center justify-center text-xs font-bold">3</span>
                  TAN = De / Sa
                </div>
                <p class="text-xs text-slate-200 mb-3">Tangen adalah perbandingan sisi <b>Depan</b> terhadap sisi <b>Samping</b>.</p>
              </div>
              <div class="bg-black/50 border border-white/20 p-3.5 rounded-xl text-center font-bold text-base flex items-center justify-center gap-2">
                <span class="text-amber-300 font-black text-lg">tan θ</span>
                <span class="text-white font-bold text-lg">=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1.5 leading-tight text-xs md:text-sm font-extrabold">
                  <span class="border-b-2 border-white/90 pb-0.5 px-3 block w-full text-center text-rose-200">Sisi Depan</span>
                  <span class="pt-0.5 px-3 block w-full text-center text-sky-200">Sisi Samping</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rasio Kebalikan -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-arrows-rotate text-indigo-500"></i> Rasio Kebalikan (Reciprocal Ratios)
          </h4>
          <p class="text-xs text-slate-600 mb-4">Selain tiga rasio utama di atas, terdapat 3 perbandingan trigonometri kebalikan:</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span class="font-bold text-indigo-700 block mb-1">1. Cosecan (csc θ) — Kebalikan Sinus:</span>
              <div class="flex items-center gap-1.5 font-bold text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                <span class="text-indigo-600 font-mono">csc θ</span> = 
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-slate-900">1</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-indigo-700">sin θ</span>
                </span>
                <span>=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-emerald-700">Miring</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-rose-700">Depan</span>
                </span>
              </div>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span class="font-bold text-indigo-700 block mb-1">2. Secan (sec θ) — Kebalikan Kosinus:</span>
              <div class="flex items-center gap-1.5 font-bold text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                <span class="text-indigo-600 font-mono">sec θ</span> = 
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-slate-900">1</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-indigo-700">cos θ</span>
                </span>
                <span>=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-emerald-700">Miring</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-sky-700">Samping</span>
                </span>
              </div>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span class="font-bold text-indigo-700 block mb-1">3. Cotangen (cot θ) — Kebalikan Tangen:</span>
              <div class="flex items-center gap-1.5 font-bold text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                <span class="text-indigo-600 font-mono">cot θ</span> = 
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-slate-900">1</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-indigo-700">tan θ</span>
                </span>
                <span>=</span>
                <span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs font-bold leading-tight">
                  <span class="border-b-2 border-slate-700 pb-0.5 px-1.5 block w-full text-center text-sky-700">Samping</span>
                  <span class="pt-0.5 px-1.5 block w-full text-center text-rose-700">Depan</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Selesai Membaca -->
        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-800 text-sm">Sudah menguasai konsep dan rumus dasar?</div>
            <div class="text-xs text-slate-500">Klik tombol di samping untuk menuntaskan Aktivitas 3 dan lanjut ke pembuktian Sudut Istimewa.</div>
          </div>
          <button onclick="App.submitAct3()" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <i class="fa-solid fa-check-double"></i>
            <span>Selesai Membaca & Lanjut</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 4: SUDUT ISTIMEWA
  // ==========================================
  function renderAct4(payload) {
    const existingAns = (payload.existing_answers && payload.existing_answers[0]) || null;
    let savedVals = {};
    if (existingAns && existingAns.student_answer) {
      try {
        const parsed = JSON.parse(existingAns.student_answer);
        savedVals = parsed.table_answers || parsed;
      } catch (e) {}
    }

    return `
      <div class="space-y-6">
        <!-- Bagian Pembuktian Geometris -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-3">
            <i class="fa-solid fa-compass-drafting"></i> Pembuktian Geometris
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Dari Mana Nilai Sudut Istimewa Berasal?</h3>
          <p class="text-slate-600 text-sm mb-6">Nilai trigonometri sudut istimewa bukan dihafal buta, melainkan dibuktikan secara eksak melalui geometri bangun datar!</p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Bukti 1: Segitiga Sama Sisi (30 & 60) -->
            <div class="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-indigo-900 text-base mb-2 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                  Segitiga Sama Sisi (Sudut 30° dan 60°)
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed mb-3">
                  Ambil segitiga sama sisi dengan panjang sisi <b>2</b>. Tarik garis tinggi simetris yang membaginya menjadi dua segitiga siku-siku:
                </p>

                <!-- Diagram Geometris Segitiga Sama Sisi -->
                <div class="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs mb-3 flex justify-center">
                  <svg viewBox="0 0 340 215" class="w-full h-auto max-h-[215px]">
                    <!-- Segitiga Sama Sisi Bayangan Kanan (Dashed) -->
                    <polygon points="170,25 290,185 170,185" fill="rgba(241, 245, 249, 0.5)" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3" />
                    <text x="235" y="105" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" fill="#94a3b8" font-style="italic">Sisi = 2</text>
                    <text x="220" y="200" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" fill="#94a3b8">1</text>

                    <!-- Segitiga Siku-Siku Utama Kiri (30-60-90) -->
                    <polygon points="50,185 170,185 170,25" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" stroke-width="2" />
                    
                    <!-- Garis Tinggi CD = √3 -->
                    <line x1="170" y1="25" x2="170" y2="185" stroke="#0284c7" stroke-width="3" />
                    
                    <!-- Sisi Hipotenusa AC = 2 -->
                    <line x1="50" y1="185" x2="170" y2="25" stroke="#10b981" stroke-width="3.5" />
                    
                    <!-- Sisi Alas AD = 1 -->
                    <line x1="50" y1="185" x2="170" y2="185" stroke="#f43f5e" stroke-width="3.5" />

                    <!-- Simbol Siku-siku di D -->
                    <polyline points="154,185 154,169 170,169" fill="none" stroke="#64748b" stroke-width="1.5" />

                    <!-- Busur Sudut 60° di A (50, 185) -->
                    <path d="M 75,185 A 25,25 0 0,0 62,163" fill="none" stroke="#f59e0b" stroke-width="2.5" />
                    <text x="75" y="172" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#d97706">60°</text>

                    <!-- Busur Sudut 30° di C (170, 25) -->
                    <path d="M 170,55 A 30,30 0 0,1 155,51" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
                    <text x="144" y="70" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#7c3aed">30°</text>

                    <!-- Badge Panjang Sisi -->
                    <!-- Sisi Hipotenusa = 2 -->
                    <g transform="translate(85, 90)">
                      <rect x="0" y="0" width="38" height="20" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2" />
                      <text x="19" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#047857" text-anchor="middle">c = 2</text>
                    </g>
                    <!-- Sisi Tinggi = √3 -->
                    <g transform="translate(178, 98)">
                      <rect x="0" y="0" width="45" height="20" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2" />
                      <text x="22" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#0369a1" text-anchor="middle">b = √3</text>
                    </g>
                    <!-- Sisi Alas = 1 -->
                    <g transform="translate(95, 192)">
                      <rect x="0" y="0" width="36" height="20" rx="5" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.2" />
                      <text x="18" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#be123c" text-anchor="middle">a = 1</text>
                    </g>

                    <!-- Titik Sudut -->
                    <circle cx="50" cy="185" r="4" fill="#1e293b" />
                    <circle cx="170" cy="185" r="4" fill="#1e293b" />
                    <circle cx="170" cy="25" r="4" fill="#1e293b" />
                    <circle cx="290" cy="185" r="3" fill="#94a3b8" />
                    <text x="35" y="195" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">A</text>
                    <text x="172" y="200" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">D</text>
                    <text x="165" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">C</text>
                    <text x="296" y="195" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#94a3b8">B</text>
                  </svg>
                </div>

                <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-white/80 p-3 rounded-xl border border-indigo-100 mb-3">
                  <li>Sisi alas terbagi dua sama panjang: <b>AD = 1</b>.</li>
                  <li>Sisi miring (hipotenusa): <b>AC = 2</b>.</li>
                  <li>Tinggi: <b>CD = √(2² − 1²) = √(4 − 1) = √3</b>.</li>
                  <li>Sudut puncak terbelah menjadi <b>30°</b> dan sudut alas tetap <b>60°</b>.</li>
                </ul>
              </div>

              <div class="mt-2 p-3 bg-indigo-950 text-indigo-100 text-xs rounded-xl font-mono space-y-1">
                <div class="font-bold text-amber-300 uppercase text-[10px] tracking-wider mb-1">Nilai Sudut 30° dan 60°:</div>
                <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div class="bg-white/10 p-1.5 rounded">sin 30° = <b>1/2</b></div>
                  <div class="bg-white/10 p-1.5 rounded">cos 30° = <b>1/2 √3</b></div>
                  <div class="bg-white/10 p-1.5 rounded">tan 30° = <b>1/3 √3</b></div>
                  <div class="bg-white/10 p-1.5 rounded">sin 60° = <b>1/2 √3</b></div>
                  <div class="bg-white/10 p-1.5 rounded">cos 60° = <b>1/2</b></div>
                  <div class="bg-white/10 p-1.5 rounded">tan 60° = <b>√3</b></div>
                </div>
              </div>
            </div>

            <!-- Bukti 2: Segitiga Sama Kaki (45) -->
            <div class="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-emerald-900 text-base mb-2 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  Segitiga Siku-Siku Sama Kaki (Sudut 45°)
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed mb-3">
                  Ambil persegi satuan dipotong diagonal, menghasilkan segitiga siku-siku dengan dua sisi siku sama panjang bernilai <b>1</b>:
                </p>

                <!-- Diagram Geometris Segitiga Siku-Siku Sama Kaki -->
                <div class="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs mb-3 flex justify-center">
                  <svg viewBox="0 0 340 215" class="w-full h-auto max-h-[215px]">
                    <!-- Persegi Bayangan Lengkap (Dashed) -->
                    <polygon points="60,185 220,185 220,25 60,25" fill="rgba(241, 245, 249, 0.4)" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3" />

                    <!-- Segitiga Siku-siku Sama Kaki Utama -->
                    <polygon points="60,185 220,185 220,25" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" stroke-width="2" />
                    
                    <!-- Sisi Samping/Alas AB = 1 -->
                    <line x1="60" y1="185" x2="220" y2="185" stroke="#0284c7" stroke-width="3.5" />
                    
                    <!-- Sisi Depan/Tegak BC = 1 -->
                    <line x1="220" y1="185" x2="220" y2="25" stroke="#f43f5e" stroke-width="3.5" />
                    
                    <!-- Sisi Miring/Diagonal AC = √2 -->
                    <line x1="60" y1="185" x2="220" y2="25" stroke="#10b981" stroke-width="3.5" />

                    <!-- Simbol Siku-siku di B (220, 185) -->
                    <polyline points="204,185 204,169 220,169" fill="none" stroke="#64748b" stroke-width="1.5" />

                    <!-- Busur Sudut 45° di A (60, 185) -->
                    <path d="M 90,185 A 30,30 0 0,0 81,164" fill="none" stroke="#f59e0b" stroke-width="2.5" />
                    <text x="94" y="172" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#d97706">45°</text>

                    <!-- Busur Sudut 45° di C (220, 25) -->
                    <path d="M 220,55 A 30,30 0 0,1 199,46" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
                    <text x="180" y="66" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#7c3aed">45°</text>

                    <!-- Badge Panjang Sisi -->
                    <!-- Sisi Miring = √2 -->
                    <g transform="translate(120, 95)">
                      <rect x="0" y="0" width="46" height="20" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2" />
                      <text x="23" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#047857" text-anchor="middle">c = √2</text>
                    </g>
                    <!-- Sisi Depan = 1 -->
                    <g transform="translate(228, 100)">
                      <rect x="0" y="0" width="38" height="20" rx="5" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.2" />
                      <text x="19" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#be123c" text-anchor="middle">a = 1</text>
                    </g>
                    <!-- Sisi Samping = 1 -->
                    <g transform="translate(125, 192)">
                      <rect x="0" y="0" width="38" height="20" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2" />
                      <text x="19" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#0369a1" text-anchor="middle">b = 1</text>
                    </g>

                    <!-- Titik Sudut -->
                    <circle cx="60" cy="185" r="4" fill="#1e293b" />
                    <circle cx="220" cy="185" r="4" fill="#1e293b" />
                    <circle cx="220" cy="25" r="4" fill="#1e293b" />
                    <text x="45" y="195" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">A</text>
                    <text x="228" y="195" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">B (90°)</text>
                    <text x="225" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#1e293b">C</text>
                  </svg>
                </div>

                <ul class="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-white/80 p-3 rounded-xl border border-emerald-100 mb-3">
                  <li>Dua sisi siku sama panjang: <b>AB = BC = 1</b>.</li>
                  <li>Kedua sudut lancip sama besar: <b>∠A = ∠C = 45°</b>.</li>
                  <li>Sisi miring (hipotenusa): <b>AC = √(1² + 1²) = √2</b>.</li>
                  <li>Rasio Sin & Cos: <b>1/√2 = 1/2 √2</b> (setelah dirasionalkan).</li>
                </ul>
              </div>

              <div class="mt-2 p-3 bg-emerald-950 text-emerald-100 text-xs rounded-xl font-mono space-y-1">
                <div class="font-bold text-amber-300 uppercase text-[10px] tracking-wider mb-1">Nilai Sudut 45°:</div>
                <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div class="bg-white/10 p-1.5 rounded">sin 45° = <b>1/2 √2</b></div>
                  <div class="bg-white/10 p-1.5 rounded">cos 45° = <b>1/2 √2</b></div>
                  <div class="bg-white/10 p-1.5 rounded">tan 45° = <b>1</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabel Interaktif Nilai Sudut Istimewa -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-1">
                <i class="fa-solid fa-keyboard"></i> Tantangan Validasi Otomatis
              </div>
              <h3 class="text-xl font-bold text-slate-800">Lengkapi Tabel Sudut Istimewa</h3>
              <p class="text-xs text-slate-500">Ketikkan nilai eksak atau gunakan tombol simbol bantuan di bawah untuk mengisi seluruh sel tabel.</p>
            </div>
            <!-- Bantuan Tombol Simbol -->
            <div class="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span class="text-[11px] font-bold text-slate-500 mr-1">Simbol Cepat:</span>
              <button onclick="App.insertSymbol('0')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">0</button>
              <button onclick="App.insertSymbol('1/2')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">1/2</button>
              <button onclick="App.insertSymbol('1/2 V2')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">1/2 √2</button>
              <button onclick="App.insertSymbol('1/2 V3')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">1/2 √3</button>
              <button onclick="App.insertSymbol('1')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">1</button>
              <button onclick="App.insertSymbol('1/3 V3')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">1/3 √3</button>
              <button onclick="App.insertSymbol('V3')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">√3</button>
              <button onclick="App.insertSymbol('tak terdefinisi')" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold hover:bg-slate-100">∞</button>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 mb-6">
            <table class="w-full text-center text-sm" id="table-special-angles">
              <thead class="bg-indigo-600 text-white font-extrabold text-xs">
                <tr>
                  <th class="p-3.5 text-left pl-6">Rasio</th>
                  <th class="p-3.5">0°</th>
                  <th class="p-3.5">30°</th>
                  <th class="p-3.5">45°</th>
                  <th class="p-3.5">60°</th>
                  <th class="p-3.5">90°</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 font-mono text-sm bg-slate-50/50">
                <!-- Baris SIN -->
                <tr>
                  <td class="p-3 text-left pl-6 font-bold text-rose-600 font-sans">sin θ</td>
                  <td class="p-2.5"><input type="text" id="angle-sin_0" value="${savedVals['sin_0'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="0"></td>
                  <td class="p-2.5"><input type="text" id="angle-sin_30" value="${savedVals['sin_30'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2"></td>
                  <td class="p-2.5"><input type="text" id="angle-sin_45" value="${savedVals['sin_45'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2 V2"></td>
                  <td class="p-2.5"><input type="text" id="angle-sin_60" value="${savedVals['sin_60'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2 V3"></td>
                  <td class="p-2.5"><input type="text" id="angle-sin_90" value="${savedVals['sin_90'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1"></td>
                </tr>
                <!-- Baris COS -->
                <tr>
                  <td class="p-3 text-left pl-6 font-bold text-sky-600 font-sans">cos θ</td>
                  <td class="p-2.5"><input type="text" id="angle-cos_0" value="${savedVals['cos_0'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1"></td>
                  <td class="p-2.5"><input type="text" id="angle-cos_30" value="${savedVals['cos_30'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2 V3"></td>
                  <td class="p-2.5"><input type="text" id="angle-cos_45" value="${savedVals['cos_45'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2 V2"></td>
                  <td class="p-2.5"><input type="text" id="angle-cos_60" value="${savedVals['cos_60'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/2"></td>
                  <td class="p-2.5"><input type="text" id="angle-cos_90" value="${savedVals['cos_90'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="0"></td>
                </tr>
                <!-- Baris TAN -->
                <tr>
                  <td class="p-3 text-left pl-6 font-bold text-amber-600 font-sans">tan θ</td>
                  <td class="p-2.5"><input type="text" id="angle-tan_0" value="${savedVals['tan_0'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="0"></td>
                  <td class="p-2.5"><input type="text" id="angle-tan_30" value="${savedVals['tan_30'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1/3 V3"></td>
                  <td class="p-2.5"><input type="text" id="angle-tan_45" value="${savedVals['tan_45'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="1"></td>
                  <td class="p-2.5"><input type="text" id="angle-tan_60" value="${savedVals['tan_60'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="V3"></td>
                  <td class="p-2.5"><input type="text" id="angle-tan_90" value="${savedVals['tan_90'] || ''}" class="angle-input w-24 p-2 border border-slate-300 rounded-lg text-xs" placeholder="tak terdefinisi"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button onclick="App.autoFillSpecialAngles()" class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline">
              <i class="fa-solid fa-wand-magic"></i> Isi Contoh Nilai Benar (Bantuan Cepat)
            </button>
            <button onclick="App.submitAct4()" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
              <i class="fa-solid fa-circle-check"></i>
              <span>Validasi Jawaban & Lanjut</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 5: LATIHAN SOAL
  // ==========================================
  function renderAct5(payload) {
    const questions = payload.questions || [];
    const existingAns = payload.existing_answers || [];
    const isCompleted = payload.activity.user_status === 'completed';

    // Buat map jawaban tersimpan
    const answerMap = {};
    existingAns.forEach(a => {
      answerMap[a.question_id] = a.student_answer;
    });

    let qHtml = questions.map((q, idx) => {
      const selected = answerMap[q.id] || '';
      let optionsHtml = '';

      if (q.options) {
        optionsHtml = Object.entries(q.options).map(([optKey, optVal]) => {
          const isChecked = selected === optKey ? 'checked' : '';
          return `
            <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-indigo-50/50 cursor-pointer transition-all has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/80">
              <input type="radio" name="q_${q.id}" value="${optKey}" ${isChecked} class="mt-1 text-indigo-600 focus:ring-indigo-500">
              <div class="text-xs md:text-sm text-slate-800">
                <span class="font-bold text-indigo-700">${optKey}.</span> ${cleanMathText(optVal)}
              </div>
            </label>
          `;
        }).join('');
      }

      let explanationHtml = '';
      if (isCompleted && q.explanation) {
        explanationHtml = `
          <div class="mt-3">
            <button type="button" onclick="App.toggleExplanation('exp-act5-${q.id}')" class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-all shadow-2xs border border-emerald-300">
              <i class="fa-solid fa-lightbulb text-amber-500"></i> <span id="btn-text-exp-act5-${q.id}">Lihat Pembahasan</span>
            </button>
            <div id="exp-act5-${q.id}" class="hidden mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 transition-all">
              <div class="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-lightbulb text-amber-500"></i> Pembahasan Lengkap:
              </div>
              <div class="whitespace-pre-line leading-relaxed font-sans">${cleanMathText(q.explanation)}</div>
              <div class="mt-2 font-bold text-indigo-700">Kunci Jawaban: ${cleanMathText(q.correct_answer)}</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6" id="card-q-${q.id}">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">${idx + 1}</span>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Butir Soal Pemahaman ${idx + 1}</span>
          </div>
          ${q.stimulus_text ? `<p class="text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-200 italic leading-relaxed">${cleanMathText(q.stimulus_text)}</p>` : ''}
          <h4 class="text-sm md:text-base font-bold text-slate-800 mb-4">${cleanMathText(q.question_text)}</h4>
          <div class="space-y-2 mb-2">
            ${optionsHtml}
          </div>
          ${explanationHtml}
        </div>
      `;
    }).join('');

    return `
      <div>
        <div class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-list-ol text-indigo-600 text-lg"></i>
            <span>Kerjakan 5 butir soal di bawah untuk menguji pemahaman konsep perbandingan trigonometri dasar.</span>
          </div>
          ${isCompleted ? '<span class="badge-status badge-completed"><i class="fa-solid fa-check"></i> Sudah Dinilai</span>' : ''}
        </div>

        ${qHtml}

        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span class="text-xs text-slate-500">Nilai akan langsung dihitung otomatis dan pembahasan akan terbuka.</span>
          <button onclick="App.submitAct5()" class="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <span>${isCompleted ? 'Hitung Ulang & Lanjut' : 'Kirim Jawaban Latihan'}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 6: SIMULASI TERAPAN
  // ==========================================
  function renderAct6(payload) {
    return `
      <div class="space-y-6">
        <!-- Tab Simulasi -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-6">
            <button onclick="App.switchSimTab('tree')" id="tab-btn-tree" class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-indigo-600 text-white transition-all shadow">
              <i class="fa-solid fa-tree"></i> 1. Tinggi Pohon (Elevasi)
            </button>
            <button onclick="App.switchSimTab('plane')" id="tab-btn-plane" class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
              <i class="fa-solid fa-plane-arrival"></i> 2. Pendaratan Pesawat (Depresi)
            </button>
            <button onclick="App.switchSimTab('kite')" id="tab-btn-kite" class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
              <i class="fa-solid fa-wind"></i> 3. Tinggi Layang-Layang
            </button>
          </div>

          <!-- PANEL SIMULASI 1: TINGGI POHON -->
          <div id="sim-panel-tree" class="sim-panel">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div class="lg:col-span-7 flex justify-center">
                <canvas id="canvas-tree-sim" width="560" height="340" class="sim-canvas max-w-full h-auto"></canvas>
              </div>
              <div class="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <i class="fa-solid fa-sliders text-indigo-600"></i> Kontrol Parameter Lapangan:
                </h4>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Jarak Pengamat ke Pohon (d):</span>
                    <span id="label-tree-d" class="font-mono text-indigo-600">12.0 meter</span>
                  </div>
                  <input type="range" id="slider-tree-d" min="5" max="25" value="12" step="0.5" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-indigo-600">
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sudut Elevasi Klinometer (α):</span>
                    <span id="label-tree-alpha" class="font-mono text-rose-600">41°</span>
                  </div>
                  <input type="range" id="slider-tree-alpha" min="15" max="75" value="41" step="1" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-rose-600">
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Tinggi Mata Pengamat (t₀):</span>
                    <span id="label-tree-eye" class="font-mono text-emerald-600">1.6 meter</span>
                  </div>
                  <input type="range" id="slider-tree-eye" min="1.2" max="1.8" value="1.6" step="0.05" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-emerald-600">
                </div>
                <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div class="font-bold text-slate-600 mb-1">Kalkulasi Terpandu:</div>
                  <div class="font-mono text-slate-700 space-y-0.5">
                    <div>t₁ = d × tan(α) = <span id="calc-tree-t1" class="font-bold text-indigo-600">10.40</span> m</div>
                    <div>Tinggi Pohon Tetap (T) = t₀ + t₁ = <span id="calc-tree-total" class="font-bold text-emerald-600 text-sm">12.00 m (Konstan)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PANEL SIMULASI 2: PENDARATAN PESAWAT -->
          <div id="sim-panel-plane" class="sim-panel hidden">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div class="lg:col-span-7 flex justify-center">
                <canvas id="canvas-plane-sim" width="560" height="340" class="sim-canvas max-w-full h-auto"></canvas>
              </div>
              <div class="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <i class="fa-solid fa-sliders text-indigo-600"></i> Instrumen Kokpit Pesawat:
                </h4>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Ketinggian Altitud (h):</span>
                    <span id="label-plane-h" class="font-mono text-blue-600">1200 meter</span>
                  </div>
                  <input type="range" id="slider-plane-h" min="600" max="2000" value="1200" step="50" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-blue-600">
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sudut Depresi Pilot (β):</span>
                    <span id="label-plane-beta" class="font-mono text-rose-600">25°</span>
                  </div>
                  <input type="range" id="slider-plane-beta" min="0" max="90" value="25" step="1" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-rose-600">
                </div>
                <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div class="font-bold text-slate-600 mb-1">Kalkulasi Navigasi:</div>
                  <div class="font-mono text-slate-700 space-y-0.5">
                    <div>Jarak Datar ke Runway = h / tan(β) = <span id="calc-plane-horiz" class="font-bold text-blue-600">2573.4</span> m</div>
                    <div>Lintasan Meluncur (Glide Slope) = <span id="calc-plane-glide" class="font-bold text-rose-600 font-bold">2839.4</span> m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PANEL SIMULASI 3: LAYANG-LAYANG -->
          <div id="sim-panel-kite" class="sim-panel hidden">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div class="lg:col-span-7 flex justify-center">
                <canvas id="canvas-kite-sim" width="560" height="340" class="sim-canvas max-w-full h-auto"></canvas>
              </div>
              <div class="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <i class="fa-solid fa-sliders text-indigo-600"></i> Pengaturan Tali Layang-Layang:
                </h4>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Panjang Benang Terulur (s):</span>
                    <span id="label-kite-s" class="font-mono text-indigo-600">60 meter</span>
                  </div>
                  <input type="range" id="slider-kite-s" min="30" max="90" value="60" step="5" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-indigo-600">
                </div>
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sudut Kemiringan Benang (θ):</span>
                    <span id="label-kite-theta" class="font-mono text-rose-600">45°</span>
                  </div>
                  <input type="range" id="slider-kite-theta" min="25" max="70" value="45" step="1" class="w-full h-2 bg-slate-200 rounded cursor-pointer accent-rose-600">
                </div>
                <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div class="font-bold text-slate-600 mb-1">Kalkulasi Ketinggian:</div>
                  <div class="font-mono text-slate-700 space-y-0.5">
                    <div>Ketinggian Naik = s × sin(θ) = <span id="calc-kite-rise" class="font-bold text-rose-600">42.43</span> m</div>
                    <div>Tinggi Total dari Tanah = <span id="calc-kite-total" class="font-bold text-emerald-600 text-sm">43.63</span> m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="text-xs text-slate-500">Jalankan dan amati ketiga simulasi untuk memahami sudut elevasi dan depresi.</div>
          <button onclick="App.submitAct6()" class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <i class="fa-solid fa-flag-checkered"></i>
            <span>Tuntaskan Simulasi Terapan & Lanjut</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 7: CONTOH LITERASI NUMERASI
  // ==========================================
  function renderAct7(payload) {
    const examples = payload.questions || [];

    let exHtml = examples.map((ex, idx) => {
      return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">${idx + 1}</span>
              <span class="text-xs font-bold text-purple-700 uppercase tracking-wider">Kasus Nyata ${idx + 1}</span>
            </div>
            <span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-[11px] font-bold">AKM Literasi Numerasi</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-4">
            <div class="md:col-span-7">
              <h4 class="text-base font-extrabold text-slate-800 mb-2">${cleanMathText(ex.question_text)}</h4>
              <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3">${cleanMathText(ex.stimulus_text)}</p>
            </div>
            <div class="md:col-span-5">
              <div class="rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                <img src="${getStimulusImageUrl(ex.stimulus_image_url || 'stimulus_mercusuar.svg')}" onerror="var f=(this.src||'').split('/').pop().split('?')[0]; if(window.SVG_DATA && window.SVG_DATA[f]) this.src=window.SVG_DATA[f];" alt="Diagram Kasus" class="w-full h-auto rounded-lg">
              </div>
            </div>
          </div>

          <div class="mt-2">
            <button type="button" onclick="App.toggleExplanation('exp-act7-${ex.id}')" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
              <i class="fa-solid fa-lightbulb text-amber-300"></i> <span id="btn-text-exp-act7-${ex.id}">Lihat Pembahasan</span>
            </button>
            <div id="exp-act7-${ex.id}" class="hidden mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 transition-all">
              <div class="font-extrabold text-emerald-800 flex items-center gap-1.5 mb-2">
                <i class="fa-solid fa-calculator text-emerald-600"></i> Jawaban & Langkah Analisis Matematis:
              </div>
              <div class="font-bold text-emerald-700 mb-2">Hasil: ${cleanMathText(ex.correct_answer)}</div>
              <div class="whitespace-pre-line leading-relaxed font-sans">${cleanMathText(ex.explanation)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center gap-3">
          <i class="fa-solid fa-book-open-reader text-purple-600 text-xl"></i>
          <div>Pelajari 5 contoh kasus literasi numerasi di bawah ini untuk memahami strategi menyelesaikan persoalan kontekstual sebelum melangkah ke Asesmen Sumatif.</div>
        </div>

        ${exHtml}

        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span class="text-xs text-slate-500">Pastikan Anda telah mencermati seluruh langkah penyelesaian di atas.</span>
          <button onclick="App.submitAct7()" class="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <span>Selesai Menelaah & Buka Sumatif</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 8: SUMATIF LITERASI NUMERASI
  // ==========================================
  function renderAct8(payload) {
    const questions = payload.questions || [];
    const existingAns = payload.existing_answers || [];
    const isCompleted = payload.activity.user_status === 'completed';

    const answerMap = {};
    existingAns.forEach(a => {
      answerMap[a.question_id] = a.student_answer;
    });

    let qHtml = questions.map((q, idx) => {
      const selected = answerMap[q.id] || '';
      let optionsHtml = '';

      if (q.options) {
        optionsHtml = Object.entries(q.options).map(([optKey, optVal]) => {
          const isChecked = selected === optKey ? 'checked' : '';
          return `
            <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-indigo-50/50 cursor-pointer transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/80">
              <input type="radio" name="sumatif_${q.id}" value="${optKey}" ${isChecked} class="mt-1 text-indigo-600 focus:ring-indigo-500">
              <div class="text-xs md:text-sm text-slate-800">
                <span class="font-bold text-indigo-700">${optKey}.</span> ${cleanMathText(optVal)}
              </div>
            </label>
          `;
        }).join('');
      }

      return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">${idx + 1}</span>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Soal Sumatif ${idx + 1}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 mb-4">
            <div class="md:col-span-7">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3">
                ${cleanMathText(q.stimulus_text)}
              </div>
              <h4 class="text-sm md:text-base font-bold text-slate-800 mb-3">${cleanMathText(q.question_text)}</h4>
            </div>
            <div class="md:col-span-5">
              ${q.stimulus_image_url ? `
                <div class="rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                  <img src="${getStimulusImageUrl(q.stimulus_image_url)}" onerror="var f=(this.src||'').split('/').pop().split('?')[0]; if(window.SVG_DATA && window.SVG_DATA[f]) this.src=window.SVG_DATA[f];" alt="Ilustrasi Stimulus" class="w-full h-auto rounded-lg">
                </div>
              ` : ''}
            </div>
          </div>

          <div class="space-y-2 mb-2">
            ${optionsHtml}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <div class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-file-signature text-rose-600 text-xl"></i>
            <div><b>Asesmen Sumatif Literasi Numerasi:</b> Jawab setiap butir soal dengan teliti berdasarkan stimulus cerita dan ilustrasi gambar yang disajikan.</div>
          </div>
          ${isCompleted ? '<span class="badge-status badge-completed"><i class="fa-solid fa-check"></i> Selesai Dinilai</span>' : ''}
        </div>

        ${qHtml}

        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span class="text-xs text-slate-500">Periksa kembali jawaban Anda sebelum mengonfirmasi pengiriman.</span>
          <button onclick="App.submitAct8()" class="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <i class="fa-solid fa-paper-plane"></i>
            <span>${isCompleted ? 'Kirim Ulang / Perbarui' : 'Kirim Asesmen Sumatif'}</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 9: REFLEKSI BELAJAR
  // ==========================================
  function renderAct9(payload) {
    const reflections = payload.reflections || [];
    const responses = payload.reflection_responses || [];

    const respMap = {};
    responses.forEach(r => {
      respMap[r.reflection_id] = r;
    });

    let refHtml = reflections.map((rf, idx) => {
      const existing = respMap[rf.id] || {};
      const savedText = existing.response_text || '';
      const savedRating = existing.rating || 5;

      let inputSection = '';
      if (rf.type === 'scale') {
        inputSection = `
          <div class="flex items-center gap-3 mt-3">
            <span class="text-xs text-slate-500">Kurang</span>
            <div class="flex items-center gap-2">
              ${[1, 2, 3, 4, 5].map(star => `
                <label class="cursor-pointer">
                  <input type="radio" name="ref_rating_${rf.id}" value="${star}" ${savedRating == star ? 'checked' : ''} class="sr-only peer">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 peer-checked:bg-amber-400 peer-checked:text-white text-slate-400 flex items-center justify-center font-bold text-sm transition-all hover:bg-slate-200">
                    <i class="fa-solid fa-star"></i>
                  </div>
                </label>
              `).join('')}
            </div>
            <span class="text-xs text-slate-500">Sangat Baik</span>
          </div>
        `;
      }

      return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">${idx + 1}</span>
            <span class="text-xs font-bold text-slate-400 uppercase">Pertanyaan Refleksi</span>
          </div>
          <h4 class="text-sm md:text-base font-bold text-slate-800 mb-3">${rf.prompt_text}</h4>
          ${inputSection}
          <div class="mt-3">
            <textarea id="ref_text_${rf.id}" rows="3" class="w-full p-3.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" placeholder="Tuliskan refleksi atau tanggapan jujur Anda di sini...">${savedText}</textarea>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div>
        <div class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-3">
          <i class="fa-solid fa-heart text-indigo-600 text-xl"></i>
          <div>Refleksi membantu Bapak Guru Aswan mengevaluasi pemahaman Anda serta menyempurnakan kualitas media pembelajaran ini.</div>
        </div>

        ${refHtml}

        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span class="text-xs text-slate-500">Isi seluruh instrumen untuk membuka Rapor Hasil Belajar.</span>
          <button onclick="App.submitAct9()" class="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
            <i class="fa-solid fa-check"></i>
            <span>Kirim Refleksi & Buka Hasil Belajar</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW MODUL 10: HASIL BELAJAR (SERTIFIKAT & RAPOR)
  // ==========================================
  function renderAct10(payload) {
    const recap = payload.recap || {};
    const st = recap.student || {};
    const allProg = recap.all_progress || [];

    const completedCount = allProg.filter(p => p.status === 'completed').length;
    const progressPct = allProg.length ? Math.round((completedCount / allProg.length) * 100) : 100;

    // Nilai
    const act5Score = recap.act5_score ?? 0;
    const act8Score = recap.act8_score ?? 0;

    // Nilai manual
    let act1Score = '-';
    let act1Feedback = 'Menunggu penilaian guru';
    let act2Score = '-';
    let act2Feedback = 'Menunggu penilaian guru';

    if (recap.manual_grades) {
      recap.manual_grades.forEach(mg => {
        if (mg.activity_number == 1) {
          act1Score = mg.score ?? '-';
          act1Feedback = mg.teacher_feedback || act1Feedback;
        }
        if (mg.activity_number == 2) {
          act2Score = mg.score ?? '-';
          act2Feedback = mg.teacher_feedback || act2Feedback;
        }
      });
    }

    // Rata-rata akhir
    const numericScores = [act5Score, act8Score];
    if (typeof act1Score === 'number') numericScores.push(act1Score);
    if (typeof act2Score === 'number') numericScores.push(act2Score);
    const finalScoreAvg = numericScores.length ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length) : 0;

    let gradeLetter = 'B';
    if (finalScoreAvg >= 88) gradeLetter = 'A (Sangat Mahir)';
    else if (finalScoreAvg >= 75) gradeLetter = 'B (Mahir)';
    else if (finalScoreAvg >= 60) gradeLetter = 'C (Cukup)';
    else gradeLetter = 'D (Perlu Bimbingan)';

    return `
      <div class="space-y-6">
        <!-- Tombol Cetak / Simpan PDF -->
        <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm no-print">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Selamat atas penyelesaian seluruh rangkaian belajar!</h4>
            <p class="text-xs text-slate-500">Anda dapat mencetak atau menyimpan dokumen Kartu Hasil Belajar ini sebagai PDF.</p>
          </div>
          <button onclick="window.print()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2">
            <i class="fa-solid fa-print"></i>
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        <!-- DOKUMEN HASIL BELAJAR RESMI -->
        <div id="printable-certificate" class="bg-white p-8 md:p-12 rounded-3xl border-2 border-indigo-200 shadow-lg relative overflow-hidden">
          <!-- Dekorasi Badge Header -->
          <div class="border-b-2 border-indigo-100 pb-6 mb-8 text-center relative">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <i class="fa-solid fa-award"></i> Laporan Capaian Kompetensi Belajar Siswa
            </div>
            <h1 class="text-2xl md:text-4xl font-black font-heading text-slate-800 tracking-tight">KARTU HASIL BELAJAR TRIGONOMETRI</h1>
            <p class="text-slate-500 text-xs md:text-sm mt-1">Media Pembelajaran Interaktif Perbandingan Trigonometri SMA</p>
          </div>

          <!-- Data Diri Siswa -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-8 text-xs">
            <div>
              <span class="text-slate-400 font-semibold uppercase block text-[10px]">Nama Lengkap Siswa</span>
              <span class="text-base font-extrabold text-slate-800 font-heading">${st.name || currentUser.name}</span>
            </div>
            <div>
              <span class="text-slate-400 font-semibold uppercase block text-[10px]">Rombongan Belajar (Kelas)</span>
              <span class="text-base font-extrabold text-slate-800 font-heading">${st.class_name || currentUser.class_name || 'XA'}</span>
            </div>
            <div>
              <span class="text-slate-400 font-semibold uppercase block text-[10px]">Kode Akses Unik</span>
              <span class="text-base font-extrabold text-indigo-600 font-mono">${st.access_code || currentUser.access_code}</span>
            </div>
          </div>

          <!-- Rekapitulasi Nilai Asesmen Sumatif (Hanya Nilai Sumatif) -->
          <div class="max-w-xs mx-auto mb-8 text-center p-6 bg-gradient-to-br from-rose-50 via-rose-100/50 to-pink-50 border-2 border-rose-300 rounded-3xl shadow-sm">
            <span class="text-rose-600 text-xs font-black uppercase tracking-wider block mb-2">Nilai Asesmen Sumatif (Aktivitas 8)</span>
            <div class="text-5xl font-black text-rose-700 font-mono mb-2">${act8Score}</div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-rose-200 text-rose-800 rounded-full text-xs font-bold shadow-2xs">
              <i class="fa-solid fa-file-signature text-rose-600"></i> Literasi Numerasi Trigonometri
            </div>
          </div>

          <!-- Catatan & Umpan Balik Guru -->
          <div class="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl mb-8 space-y-3 text-xs">
            <div class="flex items-center gap-2 font-bold text-indigo-900 text-sm">
              <i class="fa-solid fa-chalkboard-user text-indigo-600"></i> Catatan & Umpan Balik Guru Pengampu:
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-3.5 rounded-xl border border-indigo-100">
                <span class="font-bold text-slate-700 block mb-1">Uraian Pertanyaan Pemantik:</span>
                <p class="text-slate-600 italic">"${act1Feedback}"</p>
              </div>
              <div class="bg-white p-3.5 rounded-xl border border-indigo-100">
                <span class="font-bold text-slate-700 block mb-1">Lembar Kerja Peserta Didik (LKPD):</span>
                <p class="text-slate-600 italic">"${act2Feedback}"</p>
              </div>
            </div>
          </div>

          <!-- Tanda Tangan & Legalisasi Pengembang -->
          <div class="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div>
              <p class="text-slate-400">Status Kelulusan Media:</p>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold mt-1">
                <i class="fa-solid fa-circle-check"></i> KOMPETEN / TUNTAS (100%)
              </div>
            </div>
            <div class="text-right">
              <p class="text-slate-400 mb-8">Guru Pengampu & Pengembang,</p>
              <p class="font-black text-slate-800 text-sm font-heading underline">Aswan, M.Pd., Gr.</p>
              <p class="text-slate-500 text-[11px]">NIP. 19880418 201101 1 002</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. LOGIKA SUBMIT PER AKTIVITAS SISWA
  // ==========================================
  async function submitAct1() {
    const essay = document.getElementById('act1-answer').value.trim();
    if (!essay || essay.length < 10) {
      Swal.fire('Perhatian', 'Harap isi ide jawaban Anda secara lebih lengkap (minimal 10 karakter).', 'warning');
      return;
    }
    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act1', essay_answer: essay })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Luar Biasa!',
          text: data.message,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Buka Aktivitas 2'
        }).then(() => {
          loadActivity(2);
        });
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal mengirim data.', 'error');
    }
  }

  async function submitAct2() {
    const q1 = (document.getElementById('act2-q1')?.value || '').trim();
    const q2 = (document.getElementById('act2-q2')?.value || '').trim();
    const q3 = (document.getElementById('act2-q3')?.value || '').trim();

    if (!q1 || !q2 || !q3) {
      Swal.fire('Perhatian', 'Harap lengkapi ketiga pertanyaan penemuan konsep di LKPD secara menyeluruh.', 'warning');
      return;
    }

    if (q1.length < 10 || q2.length < 10 || q3.length < 10) {
      Swal.fire('Perhatian', 'Uraian jawaban Anda pada setiap pertanyaan masih terlalu singkat. Berikan penjelasan yang lebih analitis.', 'warning');
      return;
    }

    // Ambil data baris tabel
    const rows = document.querySelectorAll('#tbody-lkpd tr');
    const tableData = [];
    rows.forEach(r => {
      const cells = r.querySelectorAll('td');
      if (cells.length >= 8) {
        tableData.push({
          angle: cells[1].innerText.trim(),
          depan: cells[2].innerText.trim(),
          samping: cells[3].innerText.trim(),
          miring: cells[4].innerText.trim(),
          sin: cells[5].innerText.trim(),
          cos: cells[6].innerText.trim(),
          tan: cells[7].innerText.trim(),
          kondisi: cells.length >= 10 ? cells[8].innerText.trim() : '-'
        });
      }
    });

    if (tableData.length < 2) {
      Swal.fire('Perhatian', 'Tabel pengamatan belum cukup data. Catat hasil simulasi ke tabel minimal 2 baris (atau gunakan tombol "Contoh Data Lengkap").', 'warning');
      return;
    }

    const combinedConclusion = `1. [Penyelidikan Skala & Kesebangunan]:\n${q1}\n\n2. [Pola Perubahan Sudut 0°-90° & Kasus 90°]:\n${q2}\n\n3. [Formulasi Definisi Trigonometri]:\n${q3}`;

    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_act2',
          observation_table: tableData,
          conclusion: combinedConclusion,
          q1: q1,
          q2: q2,
          q3: q3
        })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'LKPD Berhasil Disimpan!',
          text: data.message,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Buka Aktivitas 3'
        }).then(() => {
          loadActivity(3);
        });
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal mengirim LKPD.', 'error');
    }
  }

  async function submitAct3() {
    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act3' })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Materi Tuntas!',
          text: data.message,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Buka Aktivitas 4'
        }).then(() => {
          loadActivity(4);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    }
  }

  async function submitAct4() {
    // Ambil seluruh input sel tabel
    const keys = [
      'sin_0', 'sin_30', 'sin_45', 'sin_60', 'sin_90',
      'cos_0', 'cos_30', 'cos_45', 'cos_60', 'cos_90',
      'tan_0', 'tan_30', 'tan_45', 'tan_60', 'tan_90'
    ];

    const answers = {};
    keys.forEach(k => {
      const el = document.getElementById(`angle-${k}`);
      answers[k] = el ? el.value.trim() : '';
    });

    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act4', table_answers: answers })
      });
      const data = await res.json();

      // Reset warna sel
      keys.forEach(k => {
        const el = document.getElementById(`angle-${k}`);
        if (el) el.classList.remove('wrong', 'correct');
      });

      if (data.success) {
        keys.forEach(k => {
          const el = document.getElementById(`angle-${k}`);
          if (el) el.classList.add('correct');
        });
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Sempurna 100%!',
          text: data.message,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Buka Aktivitas 5'
        }).then(() => {
          loadActivity(5);
        });
      } else {
        if (data.invalid_fields) {
          data.invalid_fields.forEach(k => {
            const el = document.getElementById(`angle-${k}`);
            if (el) el.classList.add('wrong');
          });
        }
        Swal.fire('Belum Tepat', data.message, 'warning');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal memvalidasi tabel sudut istimewa.', 'error');
    }
  }

  async function submitAct5() {
    const radioInputs = document.querySelectorAll('input[type="radio"][name^="q_"]:checked');
    const answers = {};
    radioInputs.forEach(r => {
      const qId = r.name.replace('q_', '');
      answers[qId] = r.value;
    });

    const totalRadios = new Set(Array.from(document.querySelectorAll('input[type="radio"][name^="q_"]')).map(r => r.name)).size;
    if (Object.keys(answers).length < totalRadios) {
      const proceed = await Swal.fire({
        title: 'Masih Ada Soal Kosong',
        text: `Anda baru menjawab ${Object.keys(answers).length} dari ${totalRadios} soal. Yakin ingin mengirim sekarang?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tetap Kirim',
        cancelButtonText: 'Lengkapi Dulu'
      });
      if (!proceed.isConfirmed) return;
    }

    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act5', answers })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Latihan Selesai!',
          html: `<b>Skor Anda: ${data.score} / 100</b><br><span class="text-xs text-slate-500">${data.correct_count} dari ${data.total_questions} soal dijawab dengan benar.</span>`,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Lihat Pembahasan & Lanjut'
        }).then(() => {
          loadActivity(6);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal mengirim latihan soal.', 'error');
    }
  }

  async function submitAct6() {
    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act6' })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Simulasi Terapan Tuntas!',
          text: data.message,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Buka Aktivitas 7'
        }).then(() => {
          loadActivity(7);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal mengirim progres simulasi.', 'error');
    }
  }

  async function submitAct7() {
    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act7' })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Siap Asesmen Sumatif!',
          text: data.message,
          confirmButtonColor: '#8b5cf6',
          confirmButtonText: 'Buka Aktivitas 8'
        }).then(() => {
          loadActivity(8);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal menelaah contoh numerasi.', 'error');
    }
  }

  async function submitAct8() {
    const radioInputs = document.querySelectorAll('input[type="radio"][name^="sumatif_"]:checked');
    const answers = {};
    radioInputs.forEach(r => {
      const qId = r.name.replace('sumatif_', '');
      answers[qId] = r.value;
    });

    const totalRadios = new Set(Array.from(document.querySelectorAll('input[type="radio"][name^="sumatif_"]')).map(r => r.name)).size;
    if (Object.keys(answers).length < totalRadios) {
      const confirm = await Swal.fire({
        title: 'Konfirmasi Asesmen Sumatif',
        text: `Anda baru menjawab ${Object.keys(answers).length} dari ${totalRadios} soal sumatif. Kirim sekarang?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Kirim Asesmen',
        cancelButtonText: 'Periksa Kembali'
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act8', answers })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Asesmen Sumatif Berhasil!',
          html: `<b class="text-xl text-rose-600">Nilai Sumatif: ${data.score} / 100</b><br><br><span class="text-xs text-slate-500">${data.message}</span>`,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Lanjut ke Refleksi Belajar'
        }).then(() => {
          loadActivity(9);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal mengirim asesmen sumatif.', 'error');
    }
  }

  async function submitAct9() {
    const textareas = document.querySelectorAll('textarea[id^="ref_text_"]');
    const reflections = {};

    textareas.forEach(ta => {
      const refId = ta.id.replace('ref_text_', '');
      const text = ta.value.trim();
      const ratingRadio = document.querySelector(`input[name="ref_rating_${refId}"]:checked`);
      const rating = ratingRadio ? parseInt(ratingRadio.value) : 5;
      reflections[refId] = { text, rating };
    });

    try {
      const res = await fetch('api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_act9', reflections })
      });
      const data = await res.json();
      if (data.success) {
        confettiBurst();
        Swal.fire({
          icon: 'success',
          title: 'Refleksi Selesai!',
          text: data.message,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Buka Hasil Belajar'
        }).then(() => {
          loadActivity(10);
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal menyimpan refleksi.', 'error');
    }
  }

  // ==========================================
  // 4. POST-RENDER & WIDGET ATTACHMENTS
  // ==========================================
  let currentTriangleData = null;

  function postRenderActivity(actNum, payload) {
    if (actNum === 2) {
      // Inisialisasi kanvas segitiga siku-siku
      currentSimObjects.triangle = TrigSim.initTriangleSim('canvas-triangle', data => {
        currentTriangleData = data;
        const angleEl = document.getElementById('label-angle-val');
        if (angleEl) angleEl.textContent = `${data.angle}°`;
        const sinEl = document.getElementById('readout-sin');
        if (sinEl) sinEl.textContent = (typeof data.sin === 'number') ? data.sin.toFixed(4) : data.sin;
        const cosEl = document.getElementById('readout-cos');
        if (cosEl) cosEl.textContent = (typeof data.cos === 'number') ? data.cos.toFixed(4) : data.cos;
        const tanEl = document.getElementById('readout-tan');
        if (tanEl) tanEl.textContent = (typeof data.tan === 'number') ? data.tan.toFixed(4) : data.tan;
      });

      const angleSlider = document.getElementById('slider-triangle-angle');
      const scaleSlider = document.getElementById('slider-triangle-scale');

      if (angleSlider) {
        angleSlider.addEventListener('input', e => {
          if (currentSimObjects.triangle) {
            currentSimObjects.triangle.setAngle(e.target.value);
          }
        });
      }
      if (scaleSlider) {
        scaleSlider.addEventListener('input', e => {
          if (currentSimObjects.triangle) {
            currentSimObjects.triangle.setScale(e.target.value);
            const scVal = parseInt(e.target.value);
            const lbl = document.getElementById('label-scale-val');
            if (lbl) lbl.textContent = scVal > 220 ? 'Besar' : (scVal < 200 ? 'Kecil' : 'Normal');
          }
        });
      }

      // Render data tabel yang sudah tersimpan atau inisialisasi default
      const existingAns = payload.existing_answers[0];
      const tbody = document.getElementById('tbody-lkpd');
      if (tbody) {
        tbody.innerHTML = '';
        let prefillRows = [];
        if (existingAns && existingAns.student_answer) {
          try {
            const parsed = JSON.parse(existingAns.student_answer);
            if (Array.isArray(parsed.observation_table)) {
              prefillRows = parsed.observation_table;
            }
          } catch (e) {}
        }

        if (prefillRows.length > 0) {
          prefillRows.forEach(row => addRowToObservationTable(row));
        }
      }
    }

    if (actNum === 3) {
      setAct3RefAngle('theta');
    }

    if (actNum === 6) {
      // Inisialisasi 3 simulasi kanvas
      currentSimObjects.tree = TrigSim.initTreeClinometerSim('canvas-tree-sim', data => {
        const dSlider = document.getElementById('slider-tree-d');
        const aSlider = document.getElementById('slider-tree-alpha');
        if (dSlider && Math.abs(parseFloat(dSlider.value) - data.distance) > 0.05) {
          dSlider.value = data.distance;
        }
        if (aSlider && Math.abs(parseInt(aSlider.value) - data.angle) > 0) {
          aSlider.value = data.angle;
        }
        document.getElementById('label-tree-d').textContent = `${data.distance} meter`;
        document.getElementById('label-tree-alpha').textContent = `${data.angle}°`;
        document.getElementById('label-tree-eye').textContent = `${data.eyeHeight} meter`;
        document.getElementById('calc-tree-t1').textContent = data.t1;
        document.getElementById('calc-tree-total').textContent = `${data.totalHeight} m (Konstan)`;
      });

      currentSimObjects.plane = TrigSim.initPlaneLandingSim('canvas-plane-sim', data => {
        document.getElementById('label-plane-h').textContent = `${data.altitude} meter`;
        document.getElementById('label-plane-beta').textContent = `${data.angle}°`;
        document.getElementById('calc-plane-horiz').textContent = data.horizontalDistance;
        document.getElementById('calc-plane-glide').textContent = data.glidePath;
      });

      currentSimObjects.kite = TrigSim.initKiteSim('canvas-kite-sim', data => {
        document.getElementById('label-kite-s').textContent = `${data.stringLength} meter`;
        document.getElementById('label-kite-theta').textContent = `${data.angle}°`;
        document.getElementById('calc-kite-rise').textContent = data.rise;
        document.getElementById('calc-kite-total').textContent = data.totalAltitude;
      });

      // Bind slider pohon
      document.getElementById('slider-tree-d').addEventListener('input', e => currentSimObjects.tree.setDistance(e.target.value));
      document.getElementById('slider-tree-alpha').addEventListener('input', e => currentSimObjects.tree.setAngle(e.target.value));
      document.getElementById('slider-tree-eye').addEventListener('input', e => currentSimObjects.tree.setEyeHeight(e.target.value));

      // Bind slider pesawat
      document.getElementById('slider-plane-h').addEventListener('input', e => currentSimObjects.plane.setAltitude(e.target.value));
      document.getElementById('slider-plane-beta').addEventListener('input', e => currentSimObjects.plane.setAngle(e.target.value));

      // Bind slider layang-layang
      document.getElementById('slider-kite-s').addEventListener('input', e => currentSimObjects.kite.setStringLength(e.target.value));
      document.getElementById('slider-kite-theta').addEventListener('input', e => currentSimObjects.kite.setAngle(e.target.value));
    }
  }

  function recordToLKPDTable() {
    if (!currentTriangleData) return;
    const scVal = parseInt(document.getElementById('slider-triangle-scale')?.value || 220);
    const scaleText = (currentTriangleData.angle === 0) ? 'Garis Datar' : ((currentTriangleData.angle === 90) ? 'Garis Tegak' : (scVal > 220 ? 'Skala Besar' : (scVal < 200 ? 'Skala Kecil' : 'Skala Normal')));
    const tanText = (typeof currentTriangleData.tan === 'number') ? currentTriangleData.tan.toFixed(4) : currentTriangleData.tan;

    addRowToObservationTable({
      angle: `${currentTriangleData.angle}°`,
      depan: currentTriangleData.depan.toFixed(2),
      samping: currentTriangleData.samping.toFixed(2),
      miring: currentTriangleData.miring.toFixed(2),
      sin: (typeof currentTriangleData.sin === 'number') ? currentTriangleData.sin.toFixed(4) : currentTriangleData.sin,
      cos: (typeof currentTriangleData.cos === 'number') ? currentTriangleData.cos.toFixed(4) : currentTriangleData.cos,
      tan: tanText,
      kondisi: scaleText
    });
    Swal.fire({
      icon: 'success',
      title: 'Tercatat!',
      text: `Data pengamatan sudut ${currentTriangleData.angle}° (${scaleText}) telah ditambahkan ke tabel LKPD.`,
      timer: 1200,
      showConfirmButton: false
    });
  }

  function addRowToObservationTable(row) {
    const tbody = document.getElementById('tbody-lkpd');
    if (!tbody) return;
    const rowCount = tbody.querySelectorAll('tr').length + 1;
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="p-3 font-bold text-slate-400 font-sans">${rowCount}</td>
      <td class="p-3 font-bold text-indigo-700">${row.angle}</td>
      <td class="p-3 text-rose-600 font-semibold">${row.depan} cm</td>
      <td class="p-3 text-sky-600 font-semibold">${row.samping} cm</td>
      <td class="p-3 text-emerald-600 font-semibold">${row.miring} cm</td>
      <td class="p-3 bg-rose-50/50 font-bold text-rose-700 font-mono">${row.sin}</td>
      <td class="p-3 bg-sky-50/50 font-bold text-sky-700 font-mono">${row.cos}</td>
      <td class="p-3 bg-amber-50/50 font-bold text-amber-700 font-mono">${row.tan}</td>
      <td class="p-3 text-slate-500 font-sans text-[11px]">${row.kondisi || '-'}</td>
      <td class="p-3 text-center">
        <button onclick="this.closest('tr').remove()" class="text-slate-400 hover:text-red-500 text-xs transition-colors" title="Hapus Baris">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  function setTriangleAngle(deg) {
    const slider = document.getElementById('slider-triangle-angle');
    if (slider) slider.value = deg;
    if (currentSimObjects.triangle) {
      currentSimObjects.triangle.setAngle(deg);
    }
  }

  function setTriangleScale(sc) {
    const slider = document.getElementById('slider-triangle-scale');
    if (slider) slider.value = sc;
    if (currentSimObjects.triangle) {
      currentSimObjects.triangle.setScale(sc);
      const scVal = parseInt(sc);
      const lbl = document.getElementById('label-scale-val');
      if (lbl) lbl.textContent = scVal > 220 ? 'Besar' : (scVal < 200 ? 'Kecil' : 'Normal');
    }
  }

  function loadLKPDExampleData() {
    const tbody = document.getElementById('tbody-lkpd');
    if (!tbody) return;
    tbody.innerHTML = '';
    const exampleRows = [
      { angle: '0°', depan: '0.00', samping: '11.00', miring: '11.00', sin: '0.0000', cos: '1.0000', tan: '0.0000', kondisi: 'Garis Datar' },
      { angle: '30°', depan: '5.50', samping: '9.53', miring: '11.00', sin: '0.5000', cos: '0.8660', tan: '0.5774', kondisi: 'Skala Normal' },
      { angle: '30°', depan: '6.50', samping: '11.26', miring: '13.00', sin: '0.5000', cos: '0.8660', tan: '0.5774', kondisi: 'Skala Besar' },
      { angle: '45°', depan: '7.78', samping: '7.78', miring: '11.00', sin: '0.7071', cos: '0.7071', tan: '1.0000', kondisi: 'Sama Kaki' },
      { angle: '60°', depan: '9.53', samping: '5.50', miring: '11.00', sin: '0.8660', cos: '0.5000', tan: '1.7321', kondisi: 'Skala Normal' },
      { angle: '90°', depan: '11.00', samping: '0.00', miring: '11.00', sin: '1.0000', cos: '0.0000', tan: 'Tak Terdefinisi (∞)', kondisi: 'Garis Tegak' }
    ];
    exampleRows.forEach(r => addRowToObservationTable(r));
    Swal.fire({
      icon: 'info',
      title: 'Contoh Data LKPD Dimuat',
      text: 'Tabel pengamatan telah diisi 6 data eksplorasi lengkap sudut 0° hingga 90° dan variasi skala.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  function clearLKPDTable() {
    const tbody = document.getElementById('tbody-lkpd');
    if (tbody) tbody.innerHTML = '';
  }

  function setAct3RefAngle(mode) {
    const btnTheta = document.getElementById('btn-ref-angle-theta');
    const btnBeta = document.getElementById('btn-ref-angle-beta');
    const container = document.getElementById('act3-diagram-container');
    const panel = document.getElementById('act3-anatomy-details');

    if (!container || !panel) return;

    if (mode === 'beta') {
      if (btnTheta) {
        btnTheta.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      }
      if (btnBeta) {
        btnBeta.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 text-white shadow-xs flex items-center gap-1.5';
      }

      container.innerHTML = `
        <svg viewBox="0 0 520 320" class="w-full h-auto max-h-[320px]">
          <defs>
            <marker id="arrow-act3-beta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
            </marker>
          </defs>
          <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2">
            <line x1="40" y1="60" x2="480" y2="60" />
            <line x1="40" y1="120" x2="480" y2="120" />
            <line x1="40" y1="180" x2="480" y2="180" />
            <line x1="40" y1="240" x2="480" y2="240" />
            <line x1="70" y1="40" x2="70" y2="280" />
            <line x1="245" y1="40" x2="245" y2="280" />
            <line x1="420" y1="40" x2="420" y2="280" />
          </g>
          <polygon points="70,250 420,250 420,60" fill="rgba(99, 102, 241, 0.08)" stroke="#818cf8" stroke-width="2" />
          <polyline points="396,250 396,226 420,226" fill="rgba(148, 163, 184, 0.2)" stroke="#64748b" stroke-width="2" />
          <circle cx="408" cy="238" r="2" fill="#64748b" />

          <!-- Sisi Depan bagi Beta: AB (Alas Datar) -->
          <line x1="70" y1="250" x2="420" y2="250" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" />
          
          <!-- Sisi Samping bagi Beta: BC (Tegak Lurus) -->
          <line x1="420" y1="250" x2="420" y2="60" stroke="#0284c7" stroke-width="5" stroke-linecap="round" />

          <!-- Sisi Miring: AC (Hipotenusa) -->
          <line x1="70" y1="250" x2="420" y2="60" stroke="#10b981" stroke-width="5" stroke-linecap="round" />

          <!-- Busur Sudut Beta di C -->
          <path d="M 420,110 A 50,50 0 0,1 382,92" fill="none" stroke="#f59e0b" stroke-width="3.5" />
          <path d="M 420,60 L 420,110 A 50,50 0 0,1 382,92 Z" fill="rgba(245, 158, 11, 0.18)" />

          <!-- Simpul -->
          <circle cx="70" cy="250" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />
          <circle cx="420" cy="250" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />
          <circle cx="420" cy="60" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />

          <text x="50" y="270" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">A</text>
          <text x="432" y="270" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">B (90°)</text>
          <text x="432" y="55" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">C</text>

          <g transform="translate(305, 38)">
            <rect x="0" y="0" width="105" height="24" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
            <text x="52" y="16" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#b45309" text-anchor="middle">Sudut Acuan (β)</text>
          </g>

          <g transform="translate(340, 22)">
            <ellipse cx="12" cy="12" rx="10" ry="6" fill="#ffffff" stroke="#6366f1" stroke-width="2" />
            <circle cx="12" cy="12" r="3.5" fill="#4338ca" />
            <circle cx="13" cy="10.5" r="1" fill="#ffffff" />
          </g>
          <line x1="365" y1="55" x2="270" y2="235" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arrow-act3-beta)" />

          <g transform="translate(150, 264)">
            <rect x="0" y="0" width="190" height="28" rx="8" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.5" />
            <text x="95" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#be123c" text-anchor="middle">SISI DEPAN (Opposite)</text>
          </g>

          <g transform="translate(432, 145)">
            <rect x="0" y="0" width="80" height="26" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" />
            <text x="40" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="10" fill="#0369a1" text-anchor="middle">SAMPING</text>
          </g>

          <g transform="translate(145, 120)">
            <rect x="0" y="0" width="175" height="28" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <text x="87" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#047857" text-anchor="middle">SISI MIRING (Hipotenusa)</text>
          </g>
        </svg>
      `;

      panel.innerHTML = `
        <div class="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div class="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5 mb-1">
            <i class="fa-solid fa-triangle-exclamation"></i> Posisi Terhadap Sudut Acuan β (di Titik C)
          </div>
          <p class="text-xs text-amber-900 leading-relaxed">
            Perhatikan! Ketika sudut acuan berpindah ke <b>Sudut β</b> di atas, sisi depan dan samping saling bertukar posisi:
          </p>
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">De</span>
            <div>
              <div class="font-bold text-rose-800">Sisi Depan = Sisi AB (Alas Datar)</div>
              <div class="text-slate-600 text-[11px]">Sisi yang berada tepat di seberang / hadapan Sudut β.</div>
            </div>
          </div>

          <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">Sa</span>
            <div>
              <div class="font-bold text-sky-800">Sisi Samping = Sisi BC (Tegak Lurus)</div>
              <div class="text-slate-600 text-[11px]">Sisi penyiku yang mengapit Sudut β bersama hipotenusa.</div>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">Mi</span>
            <div>
              <div class="font-bold text-emerald-800">Sisi Miring = Sisi AC (Hipotenusa)</div>
              <div class="text-slate-600 text-[11px]"><b>Tetap sama!</b> Selalu berada tepat di depan sudut siku-siku 90°.</div>
            </div>
          </div>
        </div>
      `;

    } else {
      // Default: Mode Theta (Sudut Acuan theta di Titik A)
      if (btnTheta) {
        btnTheta.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 text-white shadow-xs flex items-center gap-1.5';
      }
      if (btnBeta) {
        btnBeta.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
      }

      container.innerHTML = `
        <svg viewBox="0 0 520 320" class="w-full h-auto max-h-[320px]">
          <defs>
            <marker id="arrow-act3-theta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
            </marker>
          </defs>
          <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2">
            <line x1="40" y1="60" x2="480" y2="60" />
            <line x1="40" y1="120" x2="480" y2="120" />
            <line x1="40" y1="180" x2="480" y2="180" />
            <line x1="40" y1="240" x2="480" y2="240" />
            <line x1="70" y1="40" x2="70" y2="280" />
            <line x1="245" y1="40" x2="245" y2="280" />
            <line x1="420" y1="40" x2="420" y2="280" />
          </g>
          <polygon points="70,250 420,250 420,60" fill="rgba(99, 102, 241, 0.08)" stroke="#818cf8" stroke-width="2" />
          <polyline points="396,250 396,226 420,226" fill="rgba(148, 163, 184, 0.2)" stroke="#64748b" stroke-width="2" />
          <circle cx="408" cy="238" r="2" fill="#64748b" />

          <!-- Sisi Samping bagi Theta: AB (Alas Datar) -->
          <line x1="70" y1="250" x2="420" y2="250" stroke="#0284c7" stroke-width="5" stroke-linecap="round" />

          <!-- Sisi Depan bagi Theta: BC (Tegak Lurus) -->
          <line x1="420" y1="250" x2="420" y2="60" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" />

          <!-- Sisi Miring: AC (Hipotenusa) -->
          <line x1="70" y1="250" x2="420" y2="60" stroke="#10b981" stroke-width="5" stroke-linecap="round" />

          <!-- Busur Sudut Acuan Theta di A -->
          <path d="M 125,250 A 55,55 0 0,0 118,224" fill="none" stroke="#f59e0b" stroke-width="3.5" />
          <path d="M 70,250 L 125,250 A 55,55 0 0,0 118,224 Z" fill="rgba(245, 158, 11, 0.18)" />

          <!-- Simpul -->
          <circle cx="70" cy="250" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />
          <circle cx="420" cy="250" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />
          <circle cx="420" cy="60" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" />

          <text x="50" y="270" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">A</text>
          <text x="432" y="270" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">B (90°)</text>
          <text x="432" y="55" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">C</text>

          <g transform="translate(130, 218)">
            <rect x="0" y="0" width="105" height="24" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
            <text x="52" y="16" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#b45309" text-anchor="middle">Sudut Acuan (θ)</text>
          </g>

          <g transform="translate(25, 226)">
            <ellipse cx="12" cy="12" rx="10" ry="6" fill="#ffffff" stroke="#6366f1" stroke-width="2" />
            <circle cx="12" cy="12" r="3.5" fill="#4338ca" />
            <circle cx="13" cy="10.5" r="1" fill="#ffffff" />
          </g>
          <line x1="60" y1="240" x2="400" y2="170" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arrow-act3-theta)" />

          <g transform="translate(432, 145)">
            <rect x="0" y="0" width="75" height="26" rx="6" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.5" />
            <text x="37" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="10" fill="#be123c" text-anchor="middle">DEPAN</text>
          </g>

          <g transform="translate(150, 264)">
            <rect x="0" y="0" width="190" height="28" rx="8" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" />
            <text x="95" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#0369a1" text-anchor="middle">SISI SAMPING (Adjacent)</text>
          </g>

          <g transform="translate(145, 120)">
            <rect x="0" y="0" width="175" height="28" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <text x="87" y="18" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="bold" font-size="11" fill="#047857" text-anchor="middle">SISI MIRING (Hipotenusa)</text>
          </g>
        </svg>
      `;

      panel.innerHTML = `
        <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <div class="text-xs font-bold text-indigo-800 uppercase flex items-center gap-1.5 mb-1">
            <i class="fa-solid fa-circle-info"></i> Posisi Terhadap Sudut Acuan θ (di Titik A)
          </div>
          <p class="text-xs text-indigo-900 leading-relaxed">
            Tiga sisi segitiga siku-siku didefinisikan terhadap <b>Sudut Acuan θ</b> sebagai berikut:
          </p>
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">De</span>
            <div>
              <div class="font-bold text-rose-800">Sisi Depan = Sisi BC (Tegak Lurus)</div>
              <div class="text-slate-600 text-[11px]">Sisi yang berada tepat di seberang / hadapan Sudut θ.</div>
            </div>
          </div>

          <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">Sa</span>
            <div>
              <div class="font-bold text-sky-800">Sisi Samping = Sisi AB (Alas Datar)</div>
              <div class="text-slate-600 text-[11px]">Sisi penyiku yang mengapit Sudut θ bersama hipotenusa.</div>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <span class="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">Mi</span>
            <div>
              <div class="font-bold text-emerald-800">Sisi Miring = Sisi AC (Hipotenusa)</div>
              <div class="text-slate-600 text-[11px]">Sisi terpanjang yang selalu berada tepat di depan sudut siku-siku 90°.</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function switchSimTab(tabName) {
    document.querySelectorAll('.sim-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('[id^="tab-btn-"]').forEach(b => {
      b.classList.remove('bg-indigo-600', 'text-white', 'shadow');
      b.classList.add('bg-slate-100', 'text-slate-700');
    });

    document.getElementById(`sim-panel-${tabName}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow');
    activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
  }

  function insertSymbol(sym) {
    const active = document.activeElement;
    if (active && active.classList.contains('angle-input')) {
      active.value = sym;
      active.focus();
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Klik salah satu sel tabel terlebih dahulu!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  function autoFillSpecialAngles() {
    const vals = {
      'sin_0': '0', 'sin_30': '1/2', 'sin_45': '1/2 V2', 'sin_60': '1/2 V3', 'sin_90': '1',
      'cos_0': '1', 'cos_30': '1/2 V3', 'cos_45': '1/2 V2', 'cos_60': '1/2', 'cos_90': '0',
      'tan_0': '0', 'tan_30': '1/3 V3', 'tan_45': '1', 'tan_60': 'V3', 'tan_90': 'tak terdefinisi'
    };
    Object.entries(vals).forEach(([k, v]) => {
      const el = document.getElementById(`angle-${k}`);
      if (el) el.value = v;
    });
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Sel tabel terisi nilai pembuktian!',
      showConfirmButton: false,
      timer: 1500
    });
  }

  function confettiBurst() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function renderMathJaxOrKaTeX() {
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // ==========================================
  // 5. DASBOR GURU (TEACHER CONTROLLER)
  // ==========================================
  let currentClassFilter = 'all';

  async function initTeacherDashboard() {
    loadTeacherRoster(currentClassFilter);
    initTeacherQuestionBank();
    initTeacherReflections();
  }

  async function loadTeacherRoster(className = 'all') {
    currentClassFilter = className;
    const rosterBody = document.getElementById('teacher-roster-body');
    if (!rosterBody) return;

    rosterBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-slate-400">
          <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
          <div>Memuat data kemajuan kelas...</div>
        </td>
      </tr>
    `;

    try {
      const res = await fetch(`api/teacher.php?action=dashboard&class=${className}`);
      const data = await res.json();
      if (!data.success) return;

      // Update KPIs
      document.getElementById('kpi-total-students').textContent = data.stats.total_students;
      document.getElementById('kpi-completed-students').textContent = data.stats.completed_students;
      document.getElementById('kpi-avg-act5').textContent = data.stats.avg_act5;
      document.getElementById('kpi-avg-act8').textContent = data.stats.avg_act8;

      // Render tab kelas
      renderClassTabs(data.classes, data.selected_class);

      // Render Tabel Siswa
      rosterBody.innerHTML = '';
      if (data.students.length === 0) {
        rosterBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-10 text-slate-400">
              Belum ada siswa terdaftar di rombel ini.
            </td>
          </tr>
        `;
        return;
      }

      data.students.forEach((st, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors border-b border-slate-100';

        const actBadge = st.current_activity >= 10
          ? '<span class="badge-status badge-completed"><i class="fa-solid fa-check"></i> Tamat (Akt 10)</span>'
          : `<span class="badge-status badge-in-progress">Aktivitas ${st.current_activity}</span>`;

        tr.innerHTML = `
          <td class="p-3.5 text-center font-bold text-slate-400 font-sans">${idx + 1}</td>
          <td class="p-3.5 font-bold text-slate-800">
            ${st.name}
            <div class="text-[11px] text-slate-400 font-normal">ID: #${st.id}</div>
          </td>
          <td class="p-3.5 text-center font-bold text-indigo-700">${st.class_name}</td>
          <td class="p-3.5 text-center font-mono font-bold text-slate-700">${st.access_code}</td>
          <td class="p-3.5 text-center">${actBadge}</td>
          <td class="p-3.5 text-center font-mono font-bold ${st.act8_score !== null ? 'text-rose-600' : 'text-slate-300'}">
            ${st.act8_score !== null ? st.act8_score : '-'}
          </td>
          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="App.viewStudentDetailSubmission(${st.id})" title="Periksa Seluruh Hasil Pengerjaan Siswa" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold border border-indigo-200 flex items-center gap-1">
                <i class="fa-solid fa-clipboard-check"></i> Periksa
              </button>
              <button onclick="App.openEditStudentModal(${st.id}, '${st.name.replace(/'/g, "\\'")}', '${st.class_name}', '${st.access_code}')" title="Edit Data Siswa (Nama, Kelas, Kode)" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button onclick="App.openGradingModal(${st.id}, '${st.name.replace(/'/g, "\\'")}', 2, ${st.act2_score ?? 0}, '${(st.act2_feedback ?? '').replace(/'/g, "\\'")}', '${encodeURIComponent(st.act2_answer || '')}')" title="Nilai LKPD (Akt 2)" class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1">
                <i class="fa-solid fa-pen-to-square"></i> LKPD
              </button>
              <button onclick="App.resetStudentProgress(${st.id}, '${st.name.replace(/'/g, "\\'")}')" title="Reset Remedial" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-bold border border-amber-200">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button onclick="App.deleteStudent(${st.id}, '${st.name.replace(/'/g, "\\'")}')" title="Hapus Siswa" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold border border-red-200">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        rosterBody.appendChild(tr);
      });

      const badge = document.getElementById('roster-count-badge');
      if (badge) {
        badge.textContent = `Total: ${data.students.length} Siswa (${className === 'all' ? 'Semua Kelas' : 'Kelas ' + className})`;
      }

    } catch (e) {
      console.error(e);
    }
  }

  function renderClassTabs(classes, current) {
    const container = document.getElementById('teacher-class-tabs');
    const sidebarContainer = document.getElementById('teacher-class-sidebar-pills');

    if (container) {
      container.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${current === 'all' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
      allBtn.textContent = 'Semua Kelas (XA-XF)';
      allBtn.onclick = () => loadTeacherRoster('all');
      container.appendChild(allBtn);

      classes.forEach(c => {
        const btn = document.createElement('button');
        btn.className = `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${current === c.class_name ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
        btn.textContent = `Kelas ${c.class_name}`;
        btn.onclick = () => loadTeacherRoster(c.class_name);
        container.appendChild(btn);
      });
    }

    if (sidebarContainer) {
      sidebarContainer.innerHTML = '';
      const allSideBtn = document.createElement('button');
      allSideBtn.className = `w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all col-span-2 text-center ${current === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
      allSideBtn.textContent = 'Semua Rombel';
      allSideBtn.onclick = () => loadTeacherRoster('all');
      sidebarContainer.appendChild(allSideBtn);

      classes.forEach(c => {
        const btn = document.createElement('button');
        btn.className = `py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center ${current === c.class_name ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
        btn.textContent = c.class_name;
        btn.onclick = () => loadTeacherRoster(c.class_name);
        sidebarContainer.appendChild(btn);
      });
    }
  }

  // Modal Penilaian Manual Guru
  function openGradingModal(studentId, studentName, actNum, currentScore, currentFeedback, encodedAnswer) {
    const rawAnswer = decodeURIComponent(encodedAnswer);
    let answerDisplay = rawAnswer || '<i>Belum ada jawaban yang dikirimkan.</i>';

    if (actNum === 2 && rawAnswer) {
      try {
        const parsed = JSON.parse(rawAnswer);
        answerDisplay = `<b>Kesimpulan Analisis:</b><br>${parsed.conclusion || '-'}<br><br><b>Tabel Observasi:</b> ${JSON.stringify(parsed.observation_table || [])}`;
      } catch (e) {}
    }

    Swal.fire({
      title: `Penilaian Siswa: ${studentName}`,
      html: `
        <div class="text-left text-xs space-y-3">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span class="font-bold text-slate-700 uppercase block mb-1">Aktivitas ${actNum === 1 ? '1 (Pertanyaan Pemantik)' : '2 (LKPD Simulasi)'}</span>
            <div class="text-slate-600 max-h-40 overflow-y-auto leading-relaxed bg-white p-2 rounded border border-slate-200">${answerDisplay}</div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Beri Nilai (0 - 100):</label>
            <input type="number" id="swal-grade-score" min="0" max="100" value="${currentScore || 85}" class="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-base">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Umpan Balik Guru (Feedback):</label>
            <textarea id="swal-grade-feedback" rows="3" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs" placeholder="Tuliskan catatan apresiasi atau perbaikan untuk siswa...">${currentFeedback || ''}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Simpan Penilaian',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6366f1',
      preConfirm: () => {
        const score = document.getElementById('swal-grade-score').value;
        const feedback = document.getElementById('swal-grade-feedback').value;
        return { score, feedback };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const { score, feedback } = res.value;
        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'grade_manual',
            student_id: studentId,
            activity_number: actNum,
            score: parseFloat(score),
            feedback: feedback
          })
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          loadTeacherRoster(currentClassFilter);
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      }
    });
  }

  // Tambah Siswa Baru oleh Guru
  function openAddStudentModal() {
    Swal.fire({
      title: 'Tambah Siswa Baru',
      html: `
        <div class="text-left text-xs space-y-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa:</label>
            <input type="text" id="add-st-name" placeholder="Contoh: Muhammad Farhan" class="w-full p-2.5 border border-slate-300 rounded-lg">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilihan Kelas:</label>
              <select id="add-st-class" class="w-full p-2.5 border border-slate-300 rounded-lg">
                <option value="XA">XA</option>
                <option value="XB">XB</option>
                <option value="XC">XC</option>
                <option value="XD">XD</option>
                <option value="XE">XE</option>
                <option value="XF">XF</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nomor Absen (1 - 50):</label>
              <input type="number" id="add-st-absen" min="1" max="50" value="1" class="w-full p-2.5 border border-slate-300 rounded-lg">
            </div>
          </div>
          <p class="text-[11px] text-slate-500 italic">Kode akses unik akan digenerate otomatis berdasarkan kombinasi kelas dan nomor absen (contoh: XA absen 21 -> A21).</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Simpan Siswa',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        return {
          name: document.getElementById('add-st-name').value.trim(),
          className: document.getElementById('add-st-class').value,
          absen: parseInt(document.getElementById('add-st-absen').value)
        };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const { name, className, absen } = res.value;
        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_student',
            name,
            class_name: className,
            absen
          })
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          loadTeacherRoster(currentClassFilter);
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      }
    });
  }

  // Edit / Ubah Data Siswa oleh Guru (Nama, Kelas, Kode Akses)
  function openEditStudentModal(studentId, currentName, currentClass, currentAccessCode) {
    Swal.fire({
      title: 'Edit Data Siswa',
      html: `
        <div class="text-left text-xs space-y-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa:</label>
            <input type="text" id="edit-st-name" value="${currentName.replace(/"/g, '&quot;')}" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kelas (Rombel):</label>
              <select id="edit-st-class" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
                <option value="XA" ${currentClass === 'XA' ? 'selected' : ''}>XA</option>
                <option value="XB" ${currentClass === 'XB' ? 'selected' : ''}>XB</option>
                <option value="XC" ${currentClass === 'XC' ? 'selected' : ''}>XC</option>
                <option value="XD" ${currentClass === 'XD' ? 'selected' : ''}>XD</option>
                <option value="XE" ${currentClass === 'XE' ? 'selected' : ''}>XE</option>
                <option value="XF" ${currentClass === 'XF' ? 'selected' : ''}>XF</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kode Akses:</label>
              <input type="text" id="edit-st-code" value="${currentAccessCode}" placeholder="Contoh: A21" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 uppercase">
            </div>
          </div>
          <p class="text-[11px] text-slate-500 italic">Kode akses unik sesuai format kelas dan nomor absen siswa (contoh: A1 s.d. A36).</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1"></i> Simpan Perubahan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6366f1',
      preConfirm: () => {
        const name = document.getElementById('edit-st-name').value.trim();
        const className = document.getElementById('edit-st-class').value;
        const accessCode = document.getElementById('edit-st-code').value.trim().toUpperCase();
        if (!name || name.length < 2) {
          Swal.showValidationMessage('Nama siswa minimal 2 karakter.');
          return false;
        }
        if (!accessCode) {
          Swal.showValidationMessage('Kode akses tidak boleh kosong.');
          return false;
        }
        return { name, className, accessCode };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const { name, className, accessCode } = res.value;
        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_student',
            student_id: studentId,
            name,
            class_name: className,
            access_code: accessCode
          })
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          loadTeacherRoster(currentClassFilter);
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      }
    });
  }

  // Reset Progres Siswa untuk Remedial
  async function resetStudentProgress(studentId, studentName) {
    const confirm = await Swal.fire({
      title: 'Reset Progres Siswa?',
      html: `Apakah Anda ingin mereset progres belajar <b>${studentName}</b> untuk program <b>remedial</b>?<br><span class="text-xs text-red-500">Siswa akan mengulang kembali dari Aktivitas 1.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Ya, Reset untuk Remedial',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_progress',
          student_id: studentId,
          clear_answers: true
        })
      });
      const d = await resp.json();
      if (d.success) {
        Swal.fire('Progres Direset!', d.message, 'success');
        loadTeacherRoster(currentClassFilter);
      }
    }
  }

  // Hapus Siswa
  async function deleteStudent(studentId, studentName) {
    const confirm = await Swal.fire({
      title: 'Hapus Data Siswa?',
      html: `Data siswa <b>${studentName}</b> beserta seluruh riwayat aktivitas dan nilai akan dihapus permanen.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Hapus Permanen',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_student', student_id: studentId })
      });
      const d = await resp.json();
      if (d.success) {
        Swal.fire('Terhapus', d.message, 'success');
        loadTeacherRoster(currentClassFilter);
      }
    }
  }

  // ==========================================
  // MANAJEMEN BANK SOAL GURU (CRUD Akt 5, 7, 8)
  // ==========================================
  let currentQBActivity = 5;
  let teacherQuestionsMap = {};

  async function initTeacherQuestionBank(actNum = 5) {
    currentQBActivity = actNum;

    // Update styling tab filter soal
    [5, 7, 8].forEach(n => {
      const btn = document.getElementById(`qb-tab-${n}`);
      if (btn) {
        if (n === actNum) {
          btn.className = 'qb-tab-btn px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow';
        } else {
          btn.className = 'qb-tab-btn px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200';
        }
      }
    });

    const listContainer = document.getElementById('teacher-qb-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="py-8 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-xl"></i></div>';

    try {
      const res = await fetch(`api/teacher.php?action=get_questions&activity_number=${actNum}`);
      const data = await res.json();
      if (!data.success) return;

      listContainer.innerHTML = '';
      teacherQuestionsMap = {};

      if (data.questions.length === 0) {
        listContainer.innerHTML = '<div class="py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">Belum ada butir soal di modul ini. Klik tombol <b>Tambah Soal Baru</b> untuk menambahkan.</div>';
        return;
      }

      data.questions.forEach((q, idx) => {
        teacherQuestionsMap[q.id] = q;
        const item = document.createElement('div');
        item.className = 'p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 text-xs space-y-3';

        // Render Opsi Jawaban Preview
        let optionsHtml = '';
        if (q.options && typeof q.options === 'object') {
          optionsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">';
          Object.keys(q.options).forEach(optKey => {
            const isCorrect = q.correct_answer === optKey;
            optionsHtml += `
              <div class="p-2 rounded-lg text-[11px] flex items-start gap-2 ${isCorrect ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'bg-slate-50 text-slate-600'}">
                <span class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">${optKey}</span>
                <span class="flex-1">${q.options[optKey]}</span>
                ${isCorrect ? '<i class="fa-solid fa-check text-emerald-600 mt-0.5"></i>' : ''}
              </div>
            `;
          });
          optionsHtml += '</div>';
        }

        // Render Stimulus Gambar jika ada
        let imageHtml = '';
        if (q.stimulus_image_url) {
          imageHtml = `
            <div class="my-2 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <img src="${getStimulusImageUrl(q.stimulus_image_url)}" alt="Stimulus" class="max-h-24 max-w-[140px] object-contain rounded border border-slate-200 bg-white" onerror="var f=(this.src||'').split('/').pop().split('?')[0]; if(window.SVG_DATA && window.SVG_DATA[f]){this.src=window.SVG_DATA[f];}else{this.style.display='none';}">
              <div class="text-[11px] text-slate-400 truncate">URL: ${q.stimulus_image_url}</div>
            </div>
          `;
        }

        item.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-indigo-700 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Soal #${idx + 1} (Urutan ${q.order_num})</span>
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold font-mono"><i class="fa-solid fa-key mr-1"></i>Kunci: ${q.correct_answer}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="App.openEditQuestionModal(${q.id})" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all">
                <i class="fa-solid fa-pen-to-square"></i> Edit Soal
              </button>
              <button onclick="App.deleteQuestion(${q.id})" class="px-2.5 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Soal">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>

          ${q.stimulus_text ? `<div class="p-3 bg-slate-50 border-l-4 border-indigo-400 rounded text-slate-700 italic leading-relaxed">${q.stimulus_text}</div>` : ''}
          ${imageHtml}
          <div class="font-bold text-slate-800 text-sm leading-relaxed">${q.question_text}</div>
          ${optionsHtml}
          ${q.explanation ? `
            <div class="mt-2 p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-sky-900 text-[11px] leading-relaxed">
              <b class="text-sky-800"><i class="fa-solid fa-lightbulb mr-1"></i>Pembahasan:</b> ${q.explanation}
            </div>
          ` : ''}
        `;
        listContainer.appendChild(item);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Modal Tambah / Edit Soal
  function openEditQuestionModal(qId = 0) {
    const q = (qId && teacherQuestionsMap[qId]) ? teacherQuestionsMap[qId] : null;
    const isEdit = !!q;

    const currentAct = q ? q.activity_number : currentQBActivity;
    const currentOrder = q ? q.order_num : 1;
    const currentStimulus = q ? (q.stimulus_text || '') : '';
    const currentImage = q ? (q.stimulus_image_url || '') : '';
    const currentText = q ? (q.question_text || '') : '';
    const currentOpts = (q && q.options) ? q.options : { A: '', B: '', C: '', D: '', E: '' };
    const currentKey = q ? q.correct_answer : 'A';
    const currentExp = q ? (q.explanation || '') : '';

    Swal.fire({
      title: isEdit ? `Edit Soal #${q.order_num}` : 'Tambah Soal Baru',
      width: '680px',
      html: `
        <div class="text-left text-xs space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilihan Modul Aktivitas:</label>
              <select id="edit-q-act" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
                <option value="5" ${currentAct == 5 ? 'selected' : ''}>Aktivitas 5 (Latihan Pemahaman)</option>
                <option value="7" ${currentAct == 7 ? 'selected' : ''}>Aktivitas 7 (Contoh Literasi Numerasi)</option>
                <option value="8" ${currentAct == 8 ? 'selected' : ''}>Aktivitas 8 (Sumatif Literasi Numerasi)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nomor Urut Soal:</label>
              <input type="number" id="edit-q-order" min="1" value="${currentOrder}" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Teks Stimulus Narasi / Konteks Nyata (Opsional):</label>
            <textarea id="edit-q-stimulus" rows="2" class="w-full p-2 border border-slate-300 rounded-lg text-xs" placeholder="Cerita pengantar atau data situasi kontekstual...">${currentStimulus}</textarea>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">URL / Path Media Gambar Pendukung (Opsional):</label>
            <input type="text" id="edit-q-image" value="${currentImage}" placeholder="Contoh: assets/images/stimulus_pesawat.png atau link gambar..." class="w-full p-2 border border-slate-300 rounded-lg text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Teks Pertanyaan Soal: <span class="text-rose-500">*</span></label>
            <textarea id="edit-q-text" rows="3" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold" placeholder="Tuliskan bunyi pertanyaan soal...">${currentText}</textarea>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label class="block font-bold text-slate-700 uppercase text-[11px] tracking-wider">Opsi Jawaban Pilihan Ganda (A - E):</label>
            <div class="space-y-1.5">
              ${['A', 'B', 'C', 'D', 'E'].map(opt => `
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs shrink-0">${opt}</span>
                  <input type="text" id="edit-q-opt-${opt}" value="${(currentOpts[opt] || '').replace(/"/g, '&quot;')}" placeholder="Pilihan ${opt}..." class="w-full p-1.5 border border-slate-300 rounded-lg text-xs">
                </div>
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kunci Jawaban Benar: <span class="text-rose-500">*</span></label>
              <select id="edit-q-correct" class="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-indigo-700">
                <option value="A" ${currentKey === 'A' ? 'selected' : ''}>A</option>
                <option value="B" ${currentKey === 'B' ? 'selected' : ''}>B</option>
                <option value="C" ${currentKey === 'C' ? 'selected' : ''}>C</option>
                <option value="D" ${currentKey === 'D' ? 'selected' : ''}>D</option>
                <option value="E" ${currentKey === 'E' ? 'selected' : ''}>E</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Status Aktivitas Terkait:</label>
              <div class="p-2 bg-slate-100 rounded-lg text-slate-500 text-xs italic">Tersimpan di database MySQL</div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pembahasan Soal / Langkah Penyelesaian (Opsional):</label>
            <textarea id="edit-q-explanation" rows="2" class="w-full p-2 border border-slate-300 rounded-lg text-xs" placeholder="Tuliskan rumus atau pembahasan rinci...">${currentExp}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1"></i> Simpan Soal',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6366f1',
      preConfirm: () => {
        const actNum = parseInt(document.getElementById('edit-q-act').value);
        const orderNum = parseInt(document.getElementById('edit-q-order').value) || 1;
        const stimulusText = document.getElementById('edit-q-stimulus').value.trim();
        const stimulusImage = document.getElementById('edit-q-image').value.trim();
        const questionText = document.getElementById('edit-q-text').value.trim();
        const correct = document.getElementById('edit-q-correct').value;
        const explanation = document.getElementById('edit-q-explanation').value.trim();

        if (!questionText) {
          Swal.showValidationMessage('Teks pertanyaan soal wajib diisi.');
          return false;
        }

        const options = {
          A: document.getElementById('edit-q-opt-A').value.trim(),
          B: document.getElementById('edit-q-opt-B').value.trim(),
          C: document.getElementById('edit-q-opt-C').value.trim(),
          D: document.getElementById('edit-q-opt-D').value.trim(),
          E: document.getElementById('edit-q-opt-E').value.trim()
        };

        return {
          id: isEdit ? q.id : 0,
          activity_number: actNum,
          order_num: orderNum,
          stimulus_text: stimulusText,
          stimulus_image_url: stimulusImage,
          question_text: questionText,
          options,
          correct_answer: correct,
          explanation
        };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const payload = res.value;
        payload.action = 'save_question';

        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          initTeacherQuestionBank(payload.activity_number);
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      }
    });
  }

  async function deleteQuestion(qId) {
    const confirm = await Swal.fire({
      title: 'Hapus Soal?',
      text: 'Soal akan dihapus permanen dari bank soal aktivitas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_question', id: qId })
      });
      const d = await resp.json();
      if (d.success) {
        Swal.fire('Terhapus', d.message, 'success');
        initTeacherQuestionBank(currentQBActivity);
      } else {
        Swal.fire('Gagal', d.message, 'error');
      }
    }
  }

  // ==========================================
  // MANAJEMEN REFLEKSI GURU (Aktivitas 9)
  // ==========================================
  let teacherReflectionsMap = {};

  async function initTeacherReflections() {
    const container = document.getElementById('teacher-reflections-list');
    if (!container) return;

    try {
      const res = await fetch('api/teacher.php?action=get_reflections');
      const data = await res.json();
      if (!data.success) return;

      container.innerHTML = '';
      teacherReflectionsMap = {};

      if (data.reflections.length === 0) {
        container.innerHTML = '<div class="py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">Belum ada instrumen refleksi. Klik <b>Tambah Pertanyaan Refleksi</b> untuk membuat.</div>';
        return;
      }

      data.reflections.forEach((rf, idx) => {
        teacherReflectionsMap[rf.id] = rf;
        const item = document.createElement('div');
        item.className = 'p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 text-xs space-y-3';
        
        const activeBadge = rf.is_active == 1 
          ? '<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Aktif</span>'
          : '<span class="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg font-bold"><i class="fa-solid fa-circle-xmark mr-1"></i>Non-aktif</span>';

        item.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-800 uppercase bg-slate-100 px-2.5 py-1 rounded-lg">Refleksi #${idx + 1} (${rf.type === 'scale' ? 'Skala Rating Bintang 1-5' : 'Uraian Singkat / Esai'})</span>
              ${activeBadge}
              <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold font-mono">${rf.response_count} Responden</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="App.openEditReflectionModal(${rf.id})" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all">
                <i class="fa-solid fa-pen-to-square"></i> Edit Refleksi
              </button>
              <button onclick="App.viewReflectionResponses(${rf.id}, '${rf.prompt_text.replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all">
                <i class="fa-solid fa-list-check"></i> Lihat Jawaban
              </button>
              <button onclick="App.deleteReflection(${rf.id})" class="px-2.5 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Refleksi">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <p class="text-slate-800 font-bold text-sm leading-relaxed">${rf.prompt_text}</p>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Modal Tambah / Edit Refleksi
  function openEditReflectionModal(rfId = 0) {
    const rf = (rfId && teacherReflectionsMap[rfId]) ? teacherReflectionsMap[rfId] : null;
    const isEdit = !!rf;

    const currentPrompt = rf ? rf.prompt_text : '';
    const currentType = rf ? rf.type : 'essay';
    const currentStatus = rf ? rf.is_active : 1;

    Swal.fire({
      title: isEdit ? 'Edit Pertanyaan Refleksi' : 'Tambah Pertanyaan Refleksi',
      html: `
        <div class="text-left text-xs space-y-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Teks Pertanyaan Refleksi: <span class="text-rose-500">*</span></label>
            <textarea id="edit-rf-prompt" rows="3" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800" placeholder="Tuliskan pertanyaan refleksi siswa...">${currentPrompt}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Tipe Instrumen Refleksi:</label>
              <select id="edit-rf-type" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
                <option value="scale" ${currentType === 'scale' ? 'selected' : ''}>Skala Rating Bintang (1 - 5)</option>
                <option value="essay" ${currentType === 'essay' ? 'selected' : ''}>Uraian Singkat / Esai Siswa</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Status Instrumen:</label>
              <select id="edit-rf-status" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800">
                <option value="1" ${currentStatus == 1 ? 'selected' : ''}>Aktif (Tampil di Aktivitas 9)</option>
                <option value="0" ${currentStatus == 0 ? 'selected' : ''}>Non-aktif (Disembunyikan)</option>
              </select>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 italic">Pertanyaan yang aktif akan langsung muncul pada lembar refleksi belajar Aktivitas 9 siswa.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1"></i> Simpan Refleksi',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6366f1',
      preConfirm: () => {
        const prompt = document.getElementById('edit-rf-prompt').value.trim();
        const type = document.getElementById('edit-rf-type').value;
        const status = parseInt(document.getElementById('edit-rf-status').value);

        if (!prompt) {
          Swal.showValidationMessage('Teks pertanyaan refleksi harus diisi.');
          return false;
        }

        return {
          id: isEdit ? rf.id : 0,
          prompt_text: prompt,
          type: type,
          is_active: status
        };
      }
    }).then(async res => {
      if (res.isConfirmed) {
        const payload = res.value;
        payload.action = 'save_reflection';

        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          initTeacherReflections();
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      }
    });
  }

  async function deleteReflection(rfId) {
    const confirm = await Swal.fire({
      title: 'Hapus Pertanyaan Refleksi?',
      text: 'Pertanyaan refleksi akan dihapus dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_reflection', id: rfId })
      });
      const d = await resp.json();
      if (d.success) {
        Swal.fire('Terhapus', d.message, 'success');
        initTeacherReflections();
      } else {
        Swal.fire('Gagal', d.message, 'error');
      }
    }
  }

  async function viewReflectionResponses(refId, prompt) {
    try {
      const res = await fetch(`api/teacher.php?action=view_reflection_responses&reflection_id=${refId}`);
      const data = await res.json();
      if (!data.success) return;

      let listHtml = data.responses.map(r => `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-2">
          <div class="flex justify-between font-bold text-indigo-800 mb-1">
            <span>${r.student_name} (${r.class_name} - ${r.access_code})</span>
            ${r.rating ? `<span class="text-amber-500 font-mono"><i class="fa-solid fa-star"></i> ${r.rating}/5</span>` : ''}
          </div>
          <div class="text-slate-700 italic">"${r.response_text || '-'}"</div>
        </div>
      `).join('');

      if (!listHtml) listHtml = '<p class="text-slate-400 text-center py-4">Belum ada respon siswa untuk pertanyaan ini.</p>';

      Swal.fire({
        title: 'Rekap Refleksi Siswa',
        html: `
          <div class="text-left text-xs mb-3 text-slate-500 font-medium">${prompt}</div>
          <div class="text-left max-h-60 overflow-y-auto">${listHtml}</div>
        `,
        confirmButtonColor: '#6366f1'
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Switch Menu Utama Guru (Sidebar Menurun di Sisi Kiri)
  function switchTeacherNav(tab) {
    document.querySelectorAll('.teacher-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.teacher-nav-btn').forEach(b => {
      b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-500/20');
      b.classList.add('text-slate-600', 'hover:bg-slate-100');
      const iconWrap = b.querySelector('.shrink-0');
      if (iconWrap) {
        iconWrap.classList.remove('bg-white/20');
        iconWrap.classList.add('bg-slate-100');
      }
    });

    const activeSec = document.getElementById(`teacher-sec-${tab}`);
    if (activeSec) activeSec.classList.remove('hidden');

    const activeBtn = document.getElementById(`tnav-${tab}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-500/20');
      activeBtn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      const iconWrap = activeBtn.querySelector('.shrink-0');
      if (iconWrap) {
        iconWrap.classList.add('bg-white/20');
        iconWrap.classList.remove('bg-slate-100');
      }
    }

    if (tab === 'questions') {
      initTeacherQuestionBank(currentQBActivity || 5);
    } else if (tab === 'reflections') {
      initTeacherReflections();
    } else if (tab === 'submissions') {
      initTeacherSubmissions();
    }
  }

  // ==========================================
  // 6. MENU HASIL PENGERJAAN SISWA (PORTFOLIO VIEWER)
  // ==========================================
  let currentSubmissionClass = 'all';
  let currentSelectedStudentId = null;
  let cachedSubmissionStudents = [];
  let currentDetailSubTab = 'act1';

  async function initTeacherSubmissions(classFilter, targetStudentId) {
    if (classFilter !== undefined) currentSubmissionClass = classFilter;
    try {
      const res = await fetch(`api/teacher.php?action=dashboard&class=${currentSubmissionClass}`);
      const data = await res.json();
      if (!data.success) return;

      cachedSubmissionStudents = data.students || [];

      // Render filter pills kelas
      const pillsContainer = document.getElementById('submissions-class-pills');
      if (pillsContainer) {
        pillsContainer.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.className = `px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentSubmissionClass === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
        allBtn.textContent = 'Semua';
        allBtn.onclick = () => initTeacherSubmissions('all');
        pillsContainer.appendChild(allBtn);

        data.classes.forEach(c => {
          const btn = document.createElement('button');
          btn.className = `px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentSubmissionClass === c.class_name ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
          btn.textContent = c.class_name;
          btn.onclick = () => initTeacherSubmissions(c.class_name);
          pillsContainer.appendChild(btn);
        });
      }

      // Populate student select dropdown
      const select = document.getElementById('select-submission-student');
      if (select) {
        select.innerHTML = '<option value="">-- Pilih Siswa untuk Diperiksa --</option>';
        cachedSubmissionStudents.forEach(st => {
          const opt = document.createElement('option');
          opt.value = st.id;
          const statusText = st.current_activity >= 10 ? '✓ Selesai 10 Modul' : `Sedang di Akt ${st.current_activity}`;
          const sumatifText = st.act8_score !== null ? ` | Sumatif: ${st.act8_score}` : '';
          opt.textContent = `${st.access_code} - ${st.name} (${st.class_name}) [${statusText}${sumatifText}]`;
          select.appendChild(opt);
        });

        if (targetStudentId) {
          select.value = targetStudentId;
          currentSelectedStudentId = targetStudentId;
        } else if (currentSelectedStudentId && cachedSubmissionStudents.some(s => s.id == currentSelectedStudentId)) {
          select.value = currentSelectedStudentId;
        } else if (cachedSubmissionStudents.length > 0) {
          select.value = cachedSubmissionStudents[0].id;
          currentSelectedStudentId = cachedSubmissionStudents[0].id;
        } else {
          currentSelectedStudentId = null;
        }
      }

      if (currentSelectedStudentId) {
        await renderStudentSubmissionDetail(currentSelectedStudentId);
      } else {
        const detailContainer = document.getElementById('submissions-detail-container');
        if (detailContainer) {
          detailContainer.innerHTML = `
            <div class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto font-bold">
                <i class="fa-solid fa-user-check"></i>
              </div>
              <h3 class="text-base font-bold text-slate-800">Silakan Pilih Siswa</h3>
              <p class="text-xs text-slate-500 max-w-md mx-auto">Pilih siswa dari daftar dropdown di atas atau klik tombol "Periksa" pada tabel Dasbor Kelas untuk meninjau portofolio pengerjaan mereka.</p>
            </div>
          `;
        }
      }
    } catch (e) {
      console.error('initTeacherSubmissions error:', e);
    }
  }

  function onSelectSubmissionStudent(studentId) {
    if (!studentId) return;
    currentSelectedStudentId = parseInt(studentId, 10);
    renderStudentSubmissionDetail(currentSelectedStudentId);
  }

  function refreshSubmissionView() {
    if (currentSelectedStudentId) {
      renderStudentSubmissionDetail(currentSelectedStudentId);
    } else {
      initTeacherSubmissions(currentSubmissionClass);
    }
  }

  function viewStudentDetailSubmission(studentId) {
    switchTeacherNav('submissions');
    initTeacherSubmissions('all', studentId);
  }

  function switchSubmissionDetailTab(tabName) {
    currentDetailSubTab = tabName;
    document.querySelectorAll('.subdetail-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.subdetail-tab-btn').forEach(b => {
      b.classList.remove('bg-indigo-600', 'text-white', 'shadow');
      b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    });

    const activePanel = document.getElementById(`subdetail-panel-${tabName}`);
    if (activePanel) activePanel.classList.remove('hidden');

    const activeBtn = document.getElementById(`subdetail-tab-${tabName}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow');
      activeBtn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    }
    renderMathJaxOrKaTeX();
  }

  async function renderStudentSubmissionDetail(studentId) {
    const container = document.getElementById('submissions-detail-container');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-indigo-600"></i>
        <p class="text-xs text-slate-500 font-bold">Memuat portofolio pengerjaan siswa...</p>
      </div>
    `;

    try {
      const res = await fetch(`api/teacher.php?action=get_student_submission&student_id=${studentId}`);
      const data = await res.json();
      if (!data.success) {
        container.innerHTML = `
          <div class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
            Gagal memuat data pengerjaan: ${data.message}
          </div>
        `;
        return;
      }

      const st = data.student;
      const progress = data.progress || [];
      const act1 = data.act1 || {};
      const act2 = data.act2 || {};
      const act4 = data.act4 || {};
      const act5 = data.act5 || {};
      const act8 = data.act8 || {};
      const act9 = data.act9 || {};

      const completedCount = progress.filter(p => p.status === 'completed').length;
      const progressPct = Math.round((completedCount / Math.max(1, progress.length)) * 100);

      // Render Observation Table rows for Akt 2
      let lkpdRowsHtml = '';
      if (Array.isArray(act2.observation_table) && act2.observation_table.length > 0) {
        lkpdRowsHtml = act2.observation_table.map((row, idx) => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-2.5 text-center font-bold text-slate-400">${idx + 1}</td>
            <td class="p-2.5 text-center font-bold text-indigo-700">${row.angle || '-'}</td>
            <td class="p-2.5 text-center text-rose-600 font-mono">${row.depan || '-'}</td>
            <td class="p-2.5 text-center text-sky-600 font-mono">${row.samping || '-'}</td>
            <td class="p-2.5 text-center text-emerald-600 font-mono">${row.miring || '-'}</td>
            <td class="p-2.5 text-center bg-rose-50 text-rose-700 font-bold font-mono">${row.sin || '-'}</td>
            <td class="p-2.5 text-center bg-sky-50 text-sky-700 font-bold font-mono">${row.cos || '-'}</td>
            <td class="p-2.5 text-center bg-amber-50 text-amber-700 font-bold font-mono">${row.tan || '-'}</td>
            <td class="p-2.5 text-slate-500 font-sans">${row.kondisi || '-'}</td>
          </tr>
        `).join('');
      } else {
        lkpdRowsHtml = `
          <tr>
            <td colspan="9" class="p-6 text-center text-slate-400 italic">
              Siswa belum mencatat baris data simulasi ke tabel LKPD.
            </td>
          </tr>
        `;
      }

      // Render Special Angles Table for Akt 4
      const a4Vals = (act4.table_answers) || {};
      const angles = ['0', '30', '45', '60', '90'];
      const ratios = [
        { key: 'sin', label: 'sin θ', color: 'rose' },
        { key: 'cos', label: 'cos θ', color: 'sky' },
        { key: 'tan', label: 'tan θ', color: 'amber' }
      ];

      const act4RowsHtml = ratios.map(r => `
        <tr>
          <td class="p-3 text-left pl-6 font-bold text-${r.color}-600 font-sans">${r.label}</td>
          ${angles.map(deg => {
            const val = a4Vals[`${r.key}_${deg}`] || '-';
            const isFilled = val && val !== '-';
            return `
              <td class="p-2.5 font-mono text-xs font-bold ${isFilled ? 'text-indigo-700 bg-indigo-50/50' : 'text-slate-400'}">
                ${val}
              </td>
            `;
          }).join('')}
        </tr>
      `).join('');

      // Render Act 5 Questions (Latihan Soal)
      let act5ItemsHtml = '';
      if (Array.isArray(act5.items) && act5.items.length > 0) {
        act5ItemsHtml = act5.items.map((it, idx) => {
          const badgeClass = it.is_correct ? 'bg-emerald-100 text-emerald-800' : (it.student_answer ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500');
          const badgeIcon = it.is_correct ? 'fa-check' : (it.student_answer ? 'fa-xmark' : 'fa-minus');
          const badgeText = it.is_correct ? 'Benar (+100)' : (it.student_answer ? 'Salah (0)' : 'Tidak Dijawab');

          return `
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                  Butir Soal #${it.number}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${badgeClass}">
                  <i class="fa-solid ${badgeIcon}"></i> ${badgeText}
                </span>
              </div>
              ${it.stimulus_text ? `<p class="text-xs text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">${cleanMathText(it.stimulus_text)}</p>` : ''}
              <p class="text-xs font-bold text-slate-800">${cleanMathText(it.question_text)}</p>

              <!-- Opsi Jawaban -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                ${Object.entries(it.options || {}).map(([optKey, optVal]) => {
                  const isChosen = it.student_answer === optKey;
                  const isKey = it.correct_answer === optKey;
                  let optStyle = 'border-slate-200 bg-white text-slate-700';
                  if (isKey) optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold';
                  if (isChosen && !isKey) optStyle = 'border-rose-300 bg-rose-50 text-rose-900 font-bold';

                  return `
                    <div class="p-2.5 rounded-xl border ${optStyle} flex items-center justify-between">
                      <div><b class="mr-1">${optKey}.</b> ${cleanMathText(optVal)}</div>
                      <div class="flex items-center gap-1">
                        ${isChosen ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Pilihan Siswa</span>' : ''}
                        ${isKey ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">Kunci</span>' : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${it.explanation ? `
                <div class="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950">
                  <b class="text-indigo-800 block mb-1"><i class="fa-solid fa-lightbulb text-amber-500"></i> Pembahasan Soal:</b>
                  <div class="whitespace-pre-line leading-relaxed font-sans">${cleanMathText(it.explanation)}</div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      } else {
        act5ItemsHtml = '<p class="text-xs text-slate-400 italic text-center py-6">Belum ada butir soal pada aktivitas ini.</p>';
      }

      // Render Act 8 Questions (Sumatif 10 Butir)
      let act8ItemsHtml = '';
      if (Array.isArray(act8.items) && act8.items.length > 0) {
        act8ItemsHtml = act8.items.map((it, idx) => {
          const badgeClass = it.is_correct ? 'bg-emerald-100 text-emerald-800' : (it.student_answer ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500');
          const badgeIcon = it.is_correct ? 'fa-check' : (it.student_answer ? 'fa-xmark' : 'fa-minus');
          const badgeText = it.is_correct ? 'Benar (+10)' : (it.student_answer ? 'Salah (0)' : 'Tidak Dijawab');

          return `
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                  Soal Sumatif #${it.number}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${badgeClass}">
                  <i class="fa-solid ${badgeIcon}"></i> ${badgeText}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div class="md:col-span-8 space-y-2">
                  ${it.stimulus_text ? `<p class="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">${cleanMathText(it.stimulus_text)}</p>` : ''}
                  <p class="text-xs font-bold text-slate-800">${cleanMathText(it.question_text)}</p>
                </div>
                ${it.stimulus_image_url ? `
                  <div class="md:col-span-4 bg-white p-2 rounded-xl border border-slate-200">
                    <img src="${getStimulusImageUrl(it.stimulus_image_url)}" onerror="var f=(this.src||'').split('/').pop().split('?')[0]; if(window.SVG_DATA && window.SVG_DATA[f]) this.src=window.SVG_DATA[f];" class="w-full h-auto rounded-lg">
                  </div>
                ` : ''}
              </div>

              <!-- Opsi Jawaban -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                ${Object.entries(it.options || {}).map(([optKey, optVal]) => {
                  const isChosen = it.student_answer === optKey;
                  const isKey = it.correct_answer === optKey;
                  let optStyle = 'border-slate-200 bg-white text-slate-700';
                  if (isKey) optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold';
                  if (isChosen && !isKey) optStyle = 'border-rose-300 bg-rose-50 text-rose-900 font-bold';

                  return `
                    <div class="p-2.5 rounded-xl border ${optStyle} flex items-center justify-between">
                      <div><b class="mr-1">${optKey}.</b> ${cleanMathText(optVal)}</div>
                      <div class="flex items-center gap-1">
                        ${isChosen ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Pilihan Siswa</span>' : ''}
                        ${isKey ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">Kunci</span>' : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${it.explanation ? `
                <div class="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950">
                  <b class="text-emerald-800 block mb-1"><i class="fa-solid fa-calculator text-emerald-600"></i> Langkah Penyelesaian Matematis:</b>
                  <div class="whitespace-pre-line leading-relaxed font-sans">${cleanMathText(it.explanation)}</div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      } else {
        act8ItemsHtml = '<p class="text-xs text-slate-400 italic text-center py-6">Belum ada soal sumatif.</p>';
      }

      // Render Act 9 Refleksi Siswa
      let act9ItemsHtml = '';
      if (Array.isArray(act9.reflections) && act9.reflections.length > 0) {
        act9ItemsHtml = act9.reflections.map(rf => `
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900">Pertanyaan Refleksi #${rf.id}</span>
              ${rf.rating ? `<span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold font-mono"><i class="fa-solid fa-star text-amber-500"></i> ${rf.rating} / 5</span>` : ''}
            </div>
            <p class="text-xs text-slate-600 font-medium">${rf.prompt_text}</p>
            <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
              ${rf.response_text ? rf.response_text : '<span class="text-slate-400 italic font-sans">Siswa belum mengisi respon refleksi ini.</span>'}
            </div>
          </div>
        `).join('');
      } else {
        act9ItemsHtml = '<p class="text-xs text-slate-400 italic text-center py-6">Belum ada instrumen refleksi.</p>';
      }

      // Render Timeline Progres 10 Modul
      const timelineHtml = progress.map(p => {
        let badgeColor = 'bg-slate-100 text-slate-500';
        let badgeIcon = 'fa-lock';
        let statusLabel = 'Terkunci';
        if (p.status === 'completed') {
          badgeColor = 'bg-emerald-100 text-emerald-800';
          badgeIcon = 'fa-check';
          statusLabel = 'Tuntas';
        } else if (p.status === 'in_progress') {
          badgeColor = 'bg-indigo-100 text-indigo-800';
          badgeIcon = 'fa-spinner fa-spin';
          statusLabel = 'Sedang Dikerjakan';
        }

        return `
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg ${badgeColor} flex items-center justify-center font-bold text-xs shrink-0">
                <i class="fa-solid ${badgeIcon}"></i>
              </span>
              <div>
                <b class="text-slate-800 block">Aktivitas ${p.activity_number}: ${p.title}</b>
                <span class="text-[11px] text-slate-400">${p.completed_at ? 'Selesai: ' + new Date(p.completed_at).toLocaleString('id-ID') : 'Belum selesai'}</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeColor}">
              ${statusLabel}
            </span>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <!-- Identitas & Ringkasan Portofolio Siswa -->
        <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-lg space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black text-amber-300 border border-white/20">
                ${(st.access_code || 'S').slice(0, 3)}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-black">${st.name}</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 border border-white/30 font-mono">
                    ${st.class_name} • ${st.access_code}
                  </span>
                </div>
                <p class="text-xs text-indigo-200 mt-1">Siswa SMAS Al Azhar Mandiri Palu • ID Akun: #${st.id}</p>
              </div>
            </div>

            <!-- Tombol Aksi Siswa -->
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="App.exportSpecificStudentSubmission(${st.id})" class="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md">
                <i class="fa-solid fa-file-arrow-down"></i> Unduh Lembar Kerja (.json)
              </button>
              <button onclick="App.copyStudentSubmissionJSON(${st.id})" class="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md">
                <i class="fa-solid fa-copy"></i> Salin JSON
              </button>
            </div>
          </div>

          <!-- 4 KPI Mini Nilai & Progres -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span class="text-[11px] text-indigo-200 block font-semibold">Progres 10 Modul</span>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-lg font-black font-mono text-white">${progressPct}%</span>
                <span class="text-[10px] text-indigo-200">(${completedCount}/10 Tuntas)</span>
              </div>
            </div>
            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span class="text-[11px] text-indigo-200 block font-semibold">Nilai Pemantik (Akt 1)</span>
              <span class="text-lg font-black font-mono ${act1.score !== null ? 'text-amber-300' : 'text-indigo-300'}">
                ${act1.score !== null ? act1.score : 'Belum Dinilai'}
              </span>
            </div>
            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span class="text-[11px] text-indigo-200 block font-semibold">Nilai LKPD (Akt 2)</span>
              <span class="text-lg font-black font-mono ${act2.score !== null ? 'text-emerald-300' : 'text-indigo-300'}">
                ${act2.score !== null ? act2.score : 'Belum Dinilai'}
              </span>
            </div>
            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span class="text-[11px] text-indigo-200 block font-semibold">Nilai Sumatif (Akt 8)</span>
              <span class="text-lg font-black font-mono ${act8.score !== null ? 'text-rose-300' : 'text-indigo-300'}">
                ${act8.score !== null ? act8.score + ' / 100' : 'Belum Selesai'}
              </span>
            </div>
          </div>
        </div>

        <!-- Tab Navigasi Aktivitas Detail Siswa -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          <button id="subdetail-tab-act1" onclick="App.switchSubmissionDetailTab('act1')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow">
            Akt 1: Pemantik
          </button>
          <button id="subdetail-tab-act2" onclick="App.switchSubmissionDetailTab('act2')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Akt 2: LKPD Siswa
          </button>
          <button id="subdetail-tab-act4" onclick="App.switchSubmissionDetailTab('act4')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Akt 4: Sudut Istimewa
          </button>
          <button id="subdetail-tab-act5" onclick="App.switchSubmissionDetailTab('act5')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Akt 5: Latihan (Skor: ${act5.score ?? '-'})
          </button>
          <button id="subdetail-tab-act8" onclick="App.switchSubmissionDetailTab('act8')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Akt 8: Sumatif (Skor: ${act8.score ?? '-'})
          </button>
          <button id="subdetail-tab-act9" onclick="App.switchSubmissionDetailTab('act9')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Akt 9: Refleksi
          </button>
          <button id="subdetail-tab-progress" onclick="App.switchSubmissionDetailTab('progress')" class="subdetail-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
            Rekap 10 Modul
          </button>
        </div>

        <!-- PANEL AKTIVITAS 1: PERTANYAAN PEMANTIK -->
        <div id="subdetail-panel-act1" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div class="border-b border-slate-100 pb-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-1">
              <i class="fa-solid fa-lightbulb"></i> Aktivitas 1: Pertanyaan Pemantik
            </div>
            <h3 class="text-base font-bold text-slate-800">Uraian Gagasan Matematis Mengukur Pohon Tanpa Memanjat</h3>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pertanyaan Pemantik:</span>
            <p class="text-xs font-semibold text-slate-700 leading-relaxed">${act1.question_text || 'Bagaimana cara mengukur tinggi pohon tanpa memanjatnya? Berdasarkan ilustrasi di samping, kemukakan ide, dugaan, dan strategi matematis kalian!'}</p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 uppercase tracking-wider">Uraian Jawaban yang Dikirim Siswa:</span>
              <span class="text-[11px] text-slate-400 font-mono">${act1.answer ? act1.answer.length + ' karakter' : 'Kosong'}</span>
            </div>
            <div class="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-200 text-slate-800 text-xs leading-relaxed font-sans whitespace-pre-line shadow-2xs">
              ${act1.answer ? act1.answer : '<span class="text-slate-400 italic font-sans">Siswa belum mengirimkan uraian jawaban untuk Aktivitas 1.</span>'}
            </div>
          </div>

          <!-- Form Penilaian Guru untuk Akt 1 -->
          <div class="p-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-2xl border border-indigo-200 space-y-4">
            <div class="flex items-center gap-2 font-bold text-xs text-indigo-950">
              <i class="fa-solid fa-pen-nib text-indigo-600"></i>
              <span>Penilaian & Umpan Balik Guru (Aktivitas 1):</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-3">
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Nilai Uraian (0 - 100):</label>
                <input type="number" id="sub-grade-act1" value="${act1.score ?? ''}" min="0" max="100" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 85">
              </div>
              <div class="md:col-span-7">
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Catatan & Umpan Balik Pembinaan Guru:</label>
                <input type="text" id="sub-feedback-act1" value="${act1.teacher_feedback || ''}" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500" placeholder="Tuliskan apresiasi atau bimbingan konstruktif...">
              </div>
              <div class="md:col-span-2">
                <button onclick="App.saveSubmissionManualGrade(${st.id}, 1)" class="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5">
                  <i class="fa-solid fa-floppy-disk"></i> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL AKTIVITAS 2: LKPD SIMULASI KONSEP -->
        <div id="subdetail-panel-act2" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 hidden">
          <div class="border-b border-slate-100 pb-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-1">
              <i class="fa-solid fa-table-list"></i> Aktivitas 2: LKPD Simulasi Konsep
            </div>
            <h3 class="text-base font-bold text-slate-800">Tabel Lembar Kerja Pengamatan & Jawaban Analisis Penemuan Konsep</h3>
          </div>

          <!-- Tabel Pengamatan LKPD -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Tabel Pengamatan Simulasi Segitiga:</span>
              <span class="text-[11px] text-slate-500 font-mono">${Array.isArray(act2.observation_table) ? act2.observation_table.length : 0} Baris Data Tercatat</span>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th class="p-2.5 text-center">No</th>
                    <th class="p-2.5 text-center">Sudut (θ)</th>
                    <th class="p-2.5 text-center text-rose-700">Depan (a)</th>
                    <th class="p-2.5 text-center text-sky-700">Samping (b)</th>
                    <th class="p-2.5 text-center text-emerald-700">Miring (c)</th>
                    <th class="p-2.5 text-center bg-rose-50 text-rose-700">Sin θ</th>
                    <th class="p-2.5 text-center bg-sky-50 text-sky-700">Cos θ</th>
                    <th class="p-2.5 text-center bg-amber-50 text-amber-700">Tan θ</th>
                    <th class="p-2.5">Kondisi Pengamatan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${lkpdRowsHtml}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3 Pertanyaan Analisis & Formulasi LKPD -->
          <div class="space-y-4">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">2. Jawaban Analisis & Penemuan Konsep:</span>

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <b class="text-xs text-indigo-900 block">Pertanyaan 1: Penyelidikan Skala & Kesebangunan Segitiga</b>
              <p class="text-[11px] text-slate-500">Ketika sudut θ tetap sama namun ukuran segitiga diubah (skala diperbesar/diperkecil), apakah nilai perbandingan sisi berubah?</p>
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                ${act2.q1 ? act2.q1 : (act2.conclusion ? act2.conclusion : '<span class="text-slate-400 italic">Belum dijawab.</span>')}
              </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <b class="text-xs text-indigo-900 block">Pertanyaan 2: Pola Perubahan Sudut 0°-90° & Kasus Sudut 90°</b>
              <p class="text-[11px] text-slate-500">Bagaimana kecenderungan panjang sisi depan, sisi samping, serta nilai sin, cos, tan saat sudut bertambah? Mengapa tan 90° tidak terdefinisi?</p>
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                ${act2.q2 ? act2.q2 : '<span class="text-slate-400 italic">Belum dijawab.</span>'}
              </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <b class="text-xs text-indigo-900 block">Pertanyaan 3: Formulasi Mandiri Definisi Perbandingan Trigonometri</b>
              <p class="text-[11px] text-slate-500">Simpulan formulasi definisi Sinus, Kosinus, dan Tangen menggunakan kalimat dan pemahaman sendiri:</p>
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                ${act2.q3 ? act2.q3 : '<span class="text-slate-400 italic">Belum dijawab.</span>'}
              </div>
            </div>
          </div>

          <!-- Form Penilaian Guru untuk Akt 2 -->
          <div class="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-4">
            <div class="flex items-center gap-2 font-bold text-xs text-emerald-950">
              <i class="fa-solid fa-pen-nib text-emerald-600"></i>
              <span>Penilaian & Umpan Balik Guru (Aktivitas 2 - LKPD):</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-3">
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Nilai LKPD (0 - 100):</label>
                <input type="number" id="sub-grade-act2" value="${act2.score ?? ''}" min="0" max="100" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 90">
              </div>
              <div class="md:col-span-7">
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Catatan Ulasan Ilmiah & Kesimpulan Siswa:</label>
                <input type="text" id="sub-feedback-act2" value="${act2.teacher_feedback || ''}" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500" placeholder="Tuliskan komentar analisis kesebangunan...">
              </div>
              <div class="md:col-span-2">
                <button onclick="App.saveSubmissionManualGrade(${st.id}, 2)" class="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5">
                  <i class="fa-solid fa-floppy-disk"></i> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL AKTIVITAS 4: TABEL SUDUT ISTIMEWA -->
        <div id="subdetail-panel-act4" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hidden">
          <div class="border-b border-slate-100 pb-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-1">
              <i class="fa-solid fa-table-cells"></i> Aktivitas 4: Verifikasi Nilai Sudut Istimewa
            </div>
            <h3 class="text-base font-bold text-slate-800">Tabel Nilai Eksak Sudut 0°, 30°, 45°, 60°, dan 90°</h3>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-center text-xs">
              <thead class="bg-indigo-600 text-white font-extrabold">
                <tr>
                  <th class="p-3 text-left pl-6">Rasio Trigonometri</th>
                  <th class="p-3">0°</th>
                  <th class="p-3">30°</th>
                  <th class="p-3">45°</th>
                  <th class="p-3">60°</th>
                  <th class="p-3">90°</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-slate-50/50">
                ${act4RowsHtml}
              </tbody>
            </table>
          </div>
          <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
            <span>Verifikasi Mandiri: Sistem memvalidasi seluruh 15 sel tabel sudut istimewa secara otomatis dengan toleransi representasi eksak akar kuadrat.</span>
          </div>
        </div>

        <!-- PANEL AKTIVITAS 5: LATIHAN SOAL -->
        <div id="subdetail-panel-act5" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hidden">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-1">
                <i class="fa-solid fa-circle-question"></i> Aktivitas 5: Latihan Soal Pemahaman
              </div>
              <h3 class="text-base font-bold text-slate-800">Hasil Pengerjaan 5 Butir Soal Formatif</h3>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 font-semibold block">Skor Latihan</span>
              <span class="text-xl font-black font-mono text-indigo-600">${act5.score !== null ? act5.score : '-'} / 100</span>
            </div>
          </div>

          <div class="space-y-4">
            ${act5ItemsHtml}
          </div>
        </div>

        <!-- PANEL AKTIVITAS 8: SUMATIF LITERASI NUMERASI -->
        <div id="subdetail-panel-act8" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hidden">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-1">
                <i class="fa-solid fa-award"></i> Aktivitas 8: Asesmen Sumatif Literasi Numerasi
              </div>
              <h3 class="text-base font-bold text-slate-800">Hasil Pengerjaan 10 Butir Asesmen Sumatif</h3>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 font-semibold block">Nilai Akhir Sumatif</span>
              <span class="text-xl font-black font-mono text-rose-600">${act8.score !== null ? act8.score : '-'} / 100</span>
            </div>
          </div>

          <div class="space-y-4">
            ${act8ItemsHtml}
          </div>
        </div>

        <!-- PANEL AKTIVITAS 9: REFLEKSI SISWA -->
        <div id="subdetail-panel-act9" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hidden">
          <div class="border-b border-slate-100 pb-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-1">
              <i class="fa-solid fa-comments"></i> Aktivitas 9: Refleksi Siswa
            </div>
            <h3 class="text-base font-bold text-slate-800">Respon Kuesioner Evaluasi Diri Siswa</h3>
          </div>

          <div class="space-y-4">
            ${act9ItemsHtml}
          </div>
        </div>

        <!-- PANEL REKAP 10 MODUL -->
        <div id="subdetail-panel-progress" class="subdetail-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hidden">
          <div class="border-b border-slate-100 pb-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-1">
              <i class="fa-solid fa-list-check"></i> Rekapitulasi Pembelajaran
            </div>
            <h3 class="text-base font-bold text-slate-800">Status 10 Modul Interaktif</h3>
          </div>

          <div class="space-y-2">
            ${timelineHtml}
          </div>
        </div>
      `;

      // Buka tab yang aktif saat ini
      switchSubmissionDetailTab(currentDetailSubTab);
      renderMathJaxOrKaTeX();
    } catch (err) {
      console.error(err);
      container.innerHTML = `
        <div class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
          Terjadi kesalahan saat memuat rincian siswa: ${err.message}
        </div>
      `;
    }
  }

  // Simpan nilai & umpan balik guru langsung dari submission viewer
  async function saveSubmissionManualGrade(studentId, actNum) {
    const gradeInput = document.getElementById(`sub-grade-act${actNum}`);
    const feedbackInput = document.getElementById(`sub-feedback-act${actNum}`);

    const score = gradeInput ? gradeInput.value.trim() : '0';
    const feedback = feedbackInput ? feedbackInput.value.trim() : '';

    if (score === '' || isNaN(score) || score < 0 || score > 100) {
      Swal.fire('Perhatian', 'Harap masukkan nilai numerik antara 0 sampai 100.', 'warning');
      return;
    }

    try {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grade_manual',
          student_id: studentId,
          activity_number: actNum,
          score: score,
          teacher_feedback: feedback
        })
      });
      const d = await resp.json();
      if (d.success) {
        Swal.fire({
          icon: 'success',
          title: 'Tersimpan!',
          text: `Nilai dan umpan balik Aktivitas ${actNum} berhasil disimpan ke database.`,
          timer: 1800,
          showConfirmButton: false
        });
        // Segarkan data
        renderStudentSubmissionDetail(studentId);
      } else {
        Swal.fire('Gagal', d.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal menyimpan nilai.', 'error');
    }
  }

  // Ekspor pengerjaan siswa tunggal (file .json)
  function exportSpecificStudentSubmission(studentId) {
    const data = StorageService.teacher.exportStudentSubmission(studentId);
    if (!data) {
      Swal.fire('Perhatian', 'Data pengerjaan siswa tidak ditemukan.', 'warning');
      return;
    }
    const studentCode = data.student.access_code || 'siswa';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `lembar_kerja_${studentCode}_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  // Salin JSON siswa ke clipboard
  function copyStudentSubmissionJSON(studentId) {
    const data = StorageService.teacher.exportStudentSubmission(studentId);
    if (!data) return;
    const str = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Tersalin!',
        text: 'Data pengerjaan siswa berhasil disalin ke clipboard.',
        timer: 1500,
        showConfirmButton: false
      });
    }).catch(() => {
      Swal.fire('Error', 'Gagal menyalin teks ke clipboard.', 'error');
    });
  }

  // Isi contoh data simulasi pengerjaan siswa (demo)
  async function populateSampleSubmissions() {
    const confirm = await Swal.fire({
      title: 'Isi Contoh Pengerjaan Demo?',
      text: 'Fitur ini akan mengisi simulasi jawaban pemantik, LKPD, sudut istimewa, latihan, sumatif, dan refleksi untuk 4 siswa (A1, A2, B5, C1) agar Anda dapat langsung meninjau tampilan portofolio.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Ya, Isi Data Demo',
      cancelButtonText: 'Batal'
    });
    if (!confirm.isConfirmed) return;

    try {
      const resp = await fetch('api/teacher.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'populate_sample_submissions' })
      });
      const data = await resp.json();
      if (data.success) {
        Swal.fire('Berhasil!', data.message, 'success');
        initTeacherSubmissions(currentSubmissionClass);
        loadTeacherRoster('all');
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal memproses data demo.', 'error');
    }
  }

  // Modal impor jawaban siswa
  async function openImportSubmissionModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Impor Jawaban Siswa',
      html: `
        <div class="space-y-3 text-left">
          <p class="text-xs text-slate-500">Pilih file lembar kerja siswa (.json) atau tempelkan teks JSON jawaban siswa di bawah ini:</p>
          <input type="file" id="swal-file-import" accept=".json" class="w-full text-xs p-2 border border-slate-300 rounded-xl mb-2">
          <textarea id="swal-text-import" rows="6" class="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono" placeholder="Atau paste teks JSON jawaban siswa di sini..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Impor Data',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6366f1',
      didOpen: () => {
        const fileInput = document.getElementById('swal-file-import');
        const textArea = document.getElementById('swal-text-import');
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => { textArea.value = ev.target.result; };
            reader.readAsText(file);
          }
        });
      },
      preConfirm: () => {
        const text = document.getElementById('swal-text-import').value.trim();
        if (!text) {
          Swal.showValidationMessage('Harap pilih file atau tempelkan teks JSON terlebih dahulu.');
          return false;
        }
        return text;
      }
    });

    if (formValues) {
      try {
        const resp = await fetch('api/teacher.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'import_student_submission', data: formValues })
        });
        const d = await resp.json();
        if (d.success) {
          Swal.fire('Berhasil!', d.message, 'success');
          initTeacherSubmissions(currentSubmissionClass);
          loadTeacherRoster('all');
        } else {
          Swal.fire('Gagal', d.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Gagal memproses file JSON.', 'error');
      }
    }
  }

  // Siswa: Unduh hasil tugas sendiri
  function exportCurrentStudentSubmission() {
    const data = StorageService.student.exportSubmission();
    if (!data) {
      Swal.fire('Perhatian', 'Sesi siswa tidak aktif atau belum ada data tersimpan.', 'warning');
      return;
    }
    const studentCode = (data.student && data.student.access_code) || 'siswa';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `tugas_trigonometri_${studentCode}_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil Diunduh!',
      text: 'File tugas trigonometri Anda telah diunduh (.json). File ini dapat Anda simpan atau kirimkan ke Bapak Guru Aswan.',
      confirmButtonColor: '#6366f1'
    });
  }

  return {
    init,
    loginStudent,
    loginTeacher,
    registerStudent,
    logout,
    loadActivity,
    submitAct1,
    submitAct2,
    submitAct3,
    submitAct4,
    submitAct5,
    submitAct6,
    submitAct7,
    submitAct8,
    submitAct9,
    recordToLKPDTable,
    setTriangleAngle,
    setTriangleScale,
    loadLKPDExampleData,
    clearLKPDTable,
    setAct3RefAngle,
    switchSimTab,
    insertSymbol,
    autoFillSpecialAngles,
    loadTeacherRoster,
    openGradingModal,
    openAddStudentModal,
    openEditStudentModal,
    resetStudentProgress,
    deleteStudent,
    switchTeacherNav,
    initTeacherQuestionBank,
    openEditQuestionModal,
    deleteQuestion,
    initTeacherReflections,
    openEditReflectionModal,
    deleteReflection,
    viewReflectionResponses,
    toggleExplanation,
    initTeacherSubmissions,
    onSelectSubmissionStudent,
    refreshSubmissionView,
    viewStudentDetailSubmission,
    switchSubmissionDetailTab,
    saveSubmissionManualGrade,
    exportSpecificStudentSubmission,
    copyStudentSubmissionJSON,
    populateSampleSubmissions,
    openImportSubmissionModal,
    exportCurrentStudentSubmission
  };
})();

// Ekspor ke window agar selalu dapat diakses secara global
window.App = App;

// Auto-run saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
