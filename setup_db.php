<?php
// setup_db.php - Script inisialisasi basis data dan data awal
header('Content-Type: text/plain; charset=utf-8');

$host = '127.0.0.1';
$port = 3306;
$username = 'root';
$password = '';
$dbname = 'db_trigonometri_interaktif';

try {
    // 1. Koneksi awal tanpa nama database
    $pdo = new PDO("mysql:host=$host;port=$port", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "1. Terhubung ke server MySQL/MariaDB...\n";

    // 2. Buat database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "2. Database `$dbname` siap digunakan.\n";

    // 3. Gunakan database
    $pdo->exec("USE `$dbname`;");

    // 4. Buat Tabel Sesuai Spesifikasi

    // Tabel classes
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            class_name VARCHAR(10) NOT NULL UNIQUE
        ) ENGINE=InnoDB;
    ");

    // Tabel users
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role ENUM('guru', 'siswa') NOT NULL,
            access_code VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(150) NOT NULL,
            class_id INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
        ) ENGINE=InnoDB;
    ");

    // Tabel activities
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            activity_number INT NOT NULL UNIQUE,
            title VARCHAR(150) NOT NULL,
            subtitle VARCHAR(255) NULL,
            is_locked_by_default BOOLEAN DEFAULT TRUE
        ) ENGINE=InnoDB;
    ");

    // Tabel student_progress
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS student_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            activity_id INT NOT NULL,
            status ENUM('locked', 'in_progress', 'completed') DEFAULT 'locked',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
            UNIQUE KEY user_activity_unique (user_id, activity_id)
        ) ENGINE=InnoDB;
    ");

    // Tabel questions
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            activity_id INT NOT NULL,
            stimulus_text TEXT NULL,
            stimulus_image_url VARCHAR(255) NULL,
            question_text TEXT NOT NULL,
            options JSON NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT NULL,
            order_num INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // Tabel student_answers
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS student_answers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            question_id INT NOT NULL,
            student_answer TEXT NULL,
            score FLOAT DEFAULT 0,
            teacher_feedback TEXT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // Tabel reflections
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reflections (
            id INT AUTO_INCREMENT PRIMARY KEY,
            prompt_text TEXT NOT NULL,
            type ENUM('scale', 'essay') DEFAULT 'essay',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    // Tabel reflection_responses
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reflection_responses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            reflection_id INT NOT NULL,
            response_text TEXT NOT NULL,
            rating INT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (reflection_id) REFERENCES reflections(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    echo "3. Seluruh tabel berhasil dibuat.\n";

    // 5. Seeding Data Kelas XA s.d. XF
    $classes = ['XA', 'XB', 'XC', 'XD', 'XE', 'XF'];
    $stmtClass = $pdo->prepare("INSERT IGNORE INTO classes (class_name) VALUES (?)");
    foreach ($classes as $c) {
        $stmtClass->execute([$c]);
    }
    echo "4. Data kelas XA - XF berhasil diisi.\n";

    // Ambil ID kelas
    $classMap = [];
    $stmt = $pdo->query("SELECT id, class_name FROM classes");
    while ($row = $stmt->fetch()) {
        $classMap[$row['class_name']] = $row['id'];
    }

    // 6. Seeding Akun Guru (Username: Aswan, Kode Akses: 100418)
    $stmtGuru = $pdo->prepare("
        INSERT INTO users (role, access_code, name, class_id) 
        VALUES ('guru', '100418', 'Aswan, M.Pd., Gr.', NULL)
        ON DUPLICATE KEY UPDATE name = 'Aswan, M.Pd., Gr.'
    ");
    $stmtGuru->execute();
    echo "5. Akun Guru (Aswan - 100418) berhasil dipersiapkan.\n";

    // 7. Seeding 10 Aktivitas
    $activitiesData = [
        [1, 'Pertanyaan Pemantik', 'Mengamati fenomena pengukuran tinggi pohon & gedung tanpa memanjat.', false],
        [2, 'LKPD Simulasi Konsep', 'Eksplorasi segitiga siku-siku & penemuan rasio sin, cos, tan.', true],
        [3, 'Materi Trigonometri', 'Definisi sisi depan, samping, miring & mnemonik Demi-Sami-Desa.', true],
        [4, 'Sudut Istimewa', 'Pembuktian geometris & tabel nilai sudut istimewa 0°, 30°, 45°, 60°, 90°.', true],
        [5, 'Latihan Soal', '5 butir latihan uji pemahaman konsep dasar dengan umpan balik instan.', true],
        [6, 'Simulasi Terapan', '3 Simulasi interaktif: Tinggi Pohon, Pendaratan Pesawat, Layang-layang.', true],
        [7, 'Contoh Literasi Numerasi', '5 Contoh soal kontekstual AKM/literasi numerasi dan pembahasannya.', true],
        [8, 'Sumatif Literasi Numerasi', 'Asesmen sumatif terstruktur berbasis stimulus narasi dan diagram.', true],
        [9, 'Refleksi Belajar', 'Evaluasi proses belajar dan pemahaman materi secara mandiri.', true],
        [10, 'Hasil Belajar', 'Laporan akhir pencapaian, sertifikat kompetensi & umpan balik guru.', true],
    ];

    $stmtAct = $pdo->prepare("
        INSERT INTO activities (activity_number, title, subtitle, is_locked_by_default)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle), is_locked_by_default = VALUES(is_locked_by_default)
    ");
    foreach ($activitiesData as $act) {
        $stmtAct->execute($act);
    }
    echo "6. 10 Modul Aktivitas berhasil didaftarkan.\n";

    // Ambil ID aktivitas
    $activityMap = [];
    $stmt = $pdo->query("SELECT id, activity_number FROM activities ORDER BY activity_number");
    while ($row = $stmt->fetch()) {
        $activityMap[$row['activity_number']] = $row['id'];
    }

    // 8. Seeding 108 Siswa SMAS Al-Azhar Mandiri Palu (Kelas XA, XB, XC)
    $studentsList = require __DIR__ . '/data_siswa.php';

    $stmtStudent = $pdo->prepare("
        INSERT INTO users (role, access_code, name, class_id)
        VALUES ('siswa', ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), class_id = VALUES(class_id)
    ");

    $stmtProg = $pdo->prepare("
        INSERT INTO student_progress (user_id, activity_id, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)
    ");

    foreach ($studentsList as $s) {
        $className = $s[0];
        $sName = $s[1];
        $code = $s[2];

        $classId = $classMap[$className] ?? null;
        $stmtStudent->execute([$code, $sName, $classId]);
        
        $uId = $pdo->lastInsertId();
        if (!$uId) {
            $st = $pdo->prepare("SELECT id FROM users WHERE access_code = ?");
            $st->execute([$code]);
            $uId = $st->fetchColumn();
        }

        // Set status progres: Aktivitas 1 in_progress, Aktivitas 2-10 locked
        for ($i = 1; $i <= 10; $i++) {
            $actId = $activityMap[$i];
            $status = ($i === 1) ? 'in_progress' : 'locked';
            $stmtProg->execute([$uId, $actId, $status]);
        }
    }
    echo "7. 108 Data siswa SMAS Al-Azhar Mandiri Palu dan progres awal berhasil dibuat.\n";

    // 9. Seeding Pertanyaan & Soal
    // Bersihkan tabel questions untuk menghindari duplikasi saat seeding ulang
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE questions;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    $stmtQ = $pdo->prepare("
        INSERT INTO questions (activity_id, stimulus_text, stimulus_image_url, question_text, options, correct_answer, explanation, order_num)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    // Aktivitas 1: Pertanyaan Pemantik
    $stmtQ->execute([
        $activityMap[1],
        "Di halaman sekolah SMAS Al Azhar Mandiri Palu terdapat sebuah pohon rindang yang menjulang tinggi. Pernahkah kalian berpikir bagaimana cara mengukur tinggi puncak pohon tersebut tanpa harus memanjatnya satu langkah pun? Hanya dengan berdiri di atas tanah, membidik puncak pohon dengan sudut elevasi tertentu, dan mengukur jarak langkah kaki kita, tinggi pohon dapat dihitung secara presisi! Rahasia matematika apakah yang menghubungkan sudut pandang, jarak horizontal, dan tinggi pohon tersebut?",
        "assets/images/stimulus_pohon.svg",
        "Bagaimana cara mengukur tinggi pohon tanpa memanjatnya? Berdasarkan ilustrasi di samping, kemukakan ide, dugaan, dan strategi matematis kalian!",
        null,
        "Menggunakan klinometer untuk mengukur sudut elevasi, mengukur jarak pengamat ke pohon, lalu menggunakan perbandingan trigonometri tangen (tan) ditambah tinggi pengamat.",
        "Konsep yang digunakan adalah perbandingan trigonometri sudut lancip pada segitiga siku-siku, khususnya fungsi tangen (depan/samping).",
        1
    ]);

    // Aktivitas 2: LKPD Pertanyaan Refleksi/Kesimpulan Simulasi
    $stmtQ->execute([
        $activityMap[2],
        "Setelah Anda menggeser sudut dan panjang segitiga siku-siku pada kanvas simulasi interaktif di atas, analisislah data rasio sisi-sisi yang Anda peroleh.",
        null,
        "Tuliskan kesimpulan Anda: Apa yang terjadi pada nilai rasio depan/miring, samping/miring, dan depan/samping ketika ukuran segitiga diperbesar tetapi besar sudutnya tetap sama? Mengapa?",
        null,
        "Nilai rasio tetap konstan (tidak berubah) karena segitiga-segitiga tersebut sebangun (kesebangunan). Rasio hanya bergantung pada besar sudut, inilah yang mendasari definisi perbandingan trigonometri sin, cos, dan tan.",
        "Sifat kesebangunan pada segitiga siku-siku menjamin bahwa rasio sisi hanya bergantung pada besar sudut lancipnya.",
        1
    ]);

    // Aktivitas 5: 5 Butir Latihan Soal Konsep Dasar
    $latihan5 = [
        [
            "Diberikan segitiga siku-siku ABC siku-siku di B. Jika panjang sisi tegak AB = 6 cm dan BC = 8 cm, maka tentukan nilai sin ∠A!",
            null,
            "Berapakah nilai perbandingan sinus dari sudut A (sin ∠A)?",
            json_encode([
                "A" => "6/10 (3/5)",
                "B" => "8/10 (4/5)",
                "C" => "6/8 (3/4)",
                "D" => "8/6 (4/3)",
                "E" => "10/8 (5/4)"
            ]),
            "B",
            "Langkah 1: Hitung sisi miring AC dengan Teorema Pythagoras: AC = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.\nLangkah 2: Sisi di depan sudut A adalah BC = 8 cm, dan sisi miring adalah AC = 10 cm.\nLangkah 3: sin ∠A = sisi depan / sisi miring = 8/10 = 4/5.",
            1
        ],
        [
            "Diketahui suatu sudut lancip α memiliki nilai tan α = 3/4. ",
            null,
            "Berdasarkan nilai tan α = 3/4, berapakah nilai cos α?",
            json_encode([
                "A" => "3/5",
                "B" => "4/5",
                "C" => "5/4",
                "D" => "5/3",
                "E" => "3/7"
            ]),
            "B",
            "tan α = depan/samping = 3/4.\nSisi miring = √(3² + 4²) = √(9 + 16) = √25 = 5.\nMaka cos α = samping/miring = 4/5.",
            2
        ],
        [
            "Pada segitiga siku-siku PQR yang siku-siku di titik Q, perhatikan sudut lancip P.",
            null,
            "Rasio perbandingan sisi samping sudut P terhadap sisi miring segitiga dinamakan...",
            json_encode([
                "A" => "Sinus (sin)",
                "B" => "Kosinus (cos)",
                "C" => "Tangen (tan)",
                "D" => "Cosecan (csc)",
                "E" => "Cotangen (cot)"
            ]),
            "B",
            "Mnemonik Sa-Mi: Kosinus (cos) adalah rasio sisi Samping dibagi sisi Miring.",
            3
        ],
        [
            "Sebuah tangga bersandar pada dinding tegak. Panjang tangga adalah 13 meter dan jarak ujung bawah tangga ke dinding adalah 12 meter.",
            null,
            "Tentukan nilai perbandingan tangen dari sudut kemiringan antara tangga dengan tanah!",
            json_encode([
                "A" => "5/12",
                "B" => "12/5",
                "C" => "5/13",
                "D" => "12/13",
                "E" => "13/5"
            ]),
            "A",
            "Tinggi dinding (sisi depan sudut) = √(13² - 12²) = √(169 - 144) = √25 = 5 meter.\nJarak bawah ke dinding (sisi samping) = 12 meter.\ntan θ = depan / samping = 5/12.",
            4
        ],
        [
            "Perhatikan nilai perbandingan sudut lancip θ di mana sin θ = 1/2.",
            null,
            "Besar sudut istimewa θ yang memenuhi adalah...",
            json_encode([
                "A" => "0°",
                "B" => "30°",
                "C" => "45°",
                "D" => "60°",
                "E" => "90°"
            ]),
            "B",
            "Nilai sin 30° adalah 1/2 (pada segitiga sama sisi yang dibagi dua).",
            5
        ]
    ];

    foreach ($latihan5 as $q) {
        $stmtQ->execute([
            $activityMap[5],
            $q[0],
            $q[1],
            $q[2],
            $q[3],
            $q[4],
            $q[5],
            $q[6]
        ]);
    }

    // Aktivitas 7: 5 Contoh Soal Literasi Numerasi (Contoh dengan Pembahasan)
    $contoh7 = [
        [
            "Petugas mercusuar di Pantai Anyer berada pada gardu pengawas setinggi 45 meter di atas permukaan laut. Dari puncak menara, petugas melihat sebuah perahu nelayan dengan sudut depresi 30°.",
            "assets/images/stimulus_mercusuar.svg",
            "Berapakah jarak horizontal dari kaki menara mercusuar ke perahu nelayan tersebut?",
            json_encode([
                "Tipe" => "Contoh Soal Kontekstual Literasi Numerasi",
                "Konsep" => "Sudut Depresi & Rasio Tangen"
            ]),
            "45√3 meter (sekitar 77,94 meter)",
            "Langkah Penyelesaian:\n1. Sudut depresi dari pengawas sama besarnya dengan sudut elevasi dari perahu nelayan ke puncak menara karena merupakan pasangan sudut dalam berseberangan (30°).\n2. Sisi depan sudut = tinggi menara = 45 meter.\n3. Sisi samping sudut = jarak horizontal (x).\n4. tan 30° = depan / samping\n   1/√3 = 45 / x  =>  x = 45√3 meter ≈ 77,94 meter.\nJadi, jarak perahu ke menara adalah 45√3 meter.",
            1
        ],
        [
            "Sebuah tiang listrik setinggi 12 meter harus diperkuat dengan memasang kawat penopang (guy wire) dari puncak tiang ke pasak di tanah. Kawat tersebut dipasang membentuk sudut elevasi 60° terhadap tanah mendatar.",
            "assets/images/stimulus_tiang_kawat.svg",
            "Tentukan panjang kawat penopang baja yang dibutuhkan!",
            json_encode([
                "Tipe" => "Contoh Soal Penerapan Keteknikan",
                "Konsep" => "Sinus Sudut Istimewa 60°"
            ]),
            "8√3 meter (sekitar 13,86 meter)",
            "Langkah Penyelesaian:\n1. Tinggi tiang = sisi di depan sudut 60° = 12 m.\n2. Panjang kawat = sisi miring (r).\n3. sin 60° = depan / miring\n   √3 / 2 = 12 / r\n   r = 24 / √3 = 8√3 meter ≈ 13,86 meter.\nJadi, panjang kawat baja yang dibutuhkan adalah 8√3 meter.",
            2
        ],
        [
            "Mobil pemadam kebakaran memiliki tangga hidrolik yang dapat direntangkan maksimal 25 meter. Sudut kemiringan aman maksimal tangga adalah 53° (sin 53° ≈ 0,8 dan cos 53° ≈ 0,6). Landasan tangga berada 2 meter di atas permukaan tanah.",
            "assets/images/stimulus_damkar.svg",
            "Berapakah ketinggian jendela gedung tertinggi yang dapat dicapai oleh tangga penyelamat tersebut?",
            json_encode([
                "Tipe" => "Contoh Soal Keselamatan & Mitigasi Bencana",
                "Konsep" => "Sinus dan Penambahan Tinggi Dasar Alat"
            ]),
            "22 meter dari permukaan tanah",
            "Langkah Penyelesaian:\n1. Jangkauan vertikal tangga dari landasan mobil (y) dihitung dengan sinus:\n   sin 53° = y / panjang tangga\n   0,8 = y / 25  =>  y = 25 × 0,8 = 20 meter.\n2. Tinggi jendela total dari permukaan tanah:\n   Tinggi total = y + tinggi landasan = 20 m + 2 m = 22 meter.\nJadi jendela lantai gedung setinggi 22 meter dapat dicapai petugas damkar.",
            3
        ],
        [
            "Sesuai regulasi aksesibilitas fasilitas umum ramah disabilitas, ramp kursi roda memiliki batas sudut kemiringan maksimal agar pengguna dapat mendorong mandiri tanpa tergelincir, yaitu sudut elevasi α di mana tan α = 1/12 (sekitar 4,76°). Sebuah gedung memiliki tangga setinggi 1,5 meter.",
            "assets/images/stimulus_ramp.svg",
            "Berapa panjang lintasan lantai miring (ram) yang harus dibangun untuk menghubungkan pelataran jalan ke pintu masuk gedung?",
            json_encode([
                "Tipe" => "Contoh Soal Desain Arsitektur Inklusif",
                "Konsep" => "Tangen dan Teorema Pythagoras"
            ]),
            "Panjang bidang datar 18 meter, panjang bidang miring ≈ 18,06 meter",
            "Langkah Penyelesaian:\n1. tan α = tinggi / panjang datar = 1/12.\n   1,5 / x = 1/12  =>  x = 1,5 × 12 = 18 meter.\n2. Panjang bidang miring ramp = √(18² + 1,5²) = √(324 + 2,25) = √326,25 ≈ 18,06 meter.\nDesain ini memastikan ramp ramah dan aman bagi difabel.",
            4
        ],
        [
            "Siswa ekstrakurikuler sains sedang mengukur ketinggian layang-layang tradisional. Benang layang-layang terulur sepanjang 80 meter dan ditarik kencang membentuk sudut 45° terhadap horizontal. Tangan siswa yang memegang gulungan benang berada 1,2 meter di atas tanah.",
            "assets/images/stimulus_layang.svg",
            "Hitung ketinggian layang-layang dari permukaan tanah (gunakan √2 ≈ 1,414)!",
            json_encode([
                "Tipe" => "Contoh Soal Sains Rekreasi",
                "Konsep" => "Sinus 45° dan Akumulasi Tinggi"
            ]),
            "40√2 + 1,2 meter ≈ 57,76 meter",
            "Langkah Penyelesaian:\n1. Tinggi dari tangan ke layang-layang: h1 = 80 × sin 45° = 80 × (1/2 √2) = 40√2 meter ≈ 56,56 meter.\n2. Total tinggi dari tanah: H = h1 + tinggi tangan = 56,56 + 1,2 = 57,76 meter.\nJadi, ketinggian layang-layang adalah 57,76 meter.",
            5
        ]
    ];

    foreach ($contoh7 as $c) {
        $stmtQ->execute([
            $activityMap[7],
            $c[0],
            $c[1],
            $c[2],
            $c[3],
            $c[4],
            $c[5],
            $c[6]
        ]);
    }

    // Aktivitas 8: Asesmen Sumatif Literasi Numerasi (5 Soal Pilihan Ganda Berstimulus)
    $sumatif8 = [
        [
            "STIMULUS 1: 'Pembangunan Ikonik Jembatan Penyeberangan'\nSebuah jembatan penyeberangan orang (JPO) modern dirancang dengan tangga landai untuk pejalan kaki. Tangga tersebut memiliki sudut kemiringan tetap 30° terhadap bidang datar jalan raya. Ketinggian bordes tengah jembatan dari aspal jalan raya adalah 6 meter.",
            "assets/images/stimulus_jpo.svg",
            "Berdasarkan stimulus di atas, berapakah panjang lintasan rel tangga yang harus dilalui seorang pejalan kaki dari lantai dasar hingga mencapai bordes tengah jembatan?",
            json_encode([
                "A" => "6 meter",
                "B" => "6√3 meter",
                "C" => "12 meter",
                "D" => "12√3 meter",
                "E" => "18 meter"
            ]),
            "C",
            "Pembahasan:\nDiketahui sudut elevasi kemiringan θ = 30°.\nSisi depan sudut (ketinggian) = 6 meter.\nPanjang lintasan tangga adalah sisi miring (s).\nsin 30° = depan / miring\n1/2 = 6 / s  =>  s = 6 × 2 = 12 meter.\nJawaban yang benar adalah C (12 meter).",
            1
        ],
        [
            "STIMULUS 2: 'Sistem Pendaratan Pesawat Komersial'\nSebuah pesawat terbang Boeing 737 sedang bersiap mendarat di Bandara Internasional Sultan Hasanuddin. Radar navigasi instrumen menunjukkan pesawat saat ini berada pada ketinggian jelajah turun 1.200 meter di atas permukaan laut. Sudut depresi garis pandang pilot ke titik sentuh ujung landasan pacu (touchdown zone) adalah 30°.",
            "assets/images/stimulus_pesawat.svg",
            "Berapakah jarak garis lurus langsung (glide path / sisi miring) dari moncong pesawat ke ujung landasan pacu tersebut?",
            json_encode([
                "A" => "1.200 meter",
                "B" => "1.200√3 meter",
                "C" => "2.000 meter",
                "D" => "2.400 meter",
                "E" => "2.400√3 meter"
            ]),
            "D",
            "Pembahasan:\nSudut depresi = 30°, yang setara dengan sudut elevasi dari landasan ke pesawat.\nKetinggian vertikal (depan) = 1.200 meter.\nJarak garis lurus (sisi miring r) dihitung dengan rasio sinus:\nsin 30° = ketinggian / r\n1/2 = 1.200 / r  =>  r = 1.200 × 2 = 2.400 meter.\nJawaban yang tepat adalah D (2.400 meter).",
            2
        ],
        [
            "STIMULUS 3: 'Pengukuran Pohon Warisan Hutan Adat'\nTim patroli kehutanan ingin mencatat tinggi pohon ulin raksasa di Kalimantan. Petugas berdiri sejauh 20 meter dari pangkal pohon dan membidikkan klinometer ke pucuk tertinggi pohon. Jarum klinometer menunjukkan sudut elevasi 45°. Jika tinggi mata petugas pengukur adalah 1,65 meter di atas tanah mendatar.",
            "assets/images/stimulus_ulin.svg",
            "Berapakah perkiraan tinggi total pohon ulin warisan tersebut?",
            json_encode([
                "A" => "20,00 meter",
                "B" => "21,65 meter",
                "C" => "28,30 meter",
                "D" => "31,65 meter",
                "E" => "40,00 meter"
            ]),
            "B",
            "Pembahasan:\nJarak horizontal ke pohon (sisi samping) = 20 meter.\nSudut elevasi α = 45°.\ntan 45° = sisi depan (t1) / 20\n1 = t1 / 20  =>  t1 = 20 meter.\nTinggi total pohon = t1 + tinggi mata pengukur = 20 m + 1,65 m = 21,65 meter.\nJawaban yang benar adalah B (21,65 meter).",
            3
        ],
        [
            "STIMULUS 4: 'Tiang Bendera Upacara Hari Kemerdekaan'\nPada upacara bendera 17 Agustus, dua orang siswa pengibar bendera berdiri di sisi timur dan barat tiang bendera. Siswa A di sisi timur memandang puncak tiang dengan sudut elevasi 60° pada jarak 10 meter dari tiang. Di sisi lain, siswa B berada pada jarak tertentu sehingga memandang puncak tiang dengan sudut elevasi 30°.",
            "assets/images/stimulus_upacara.svg",
            "Berapakah tinggi tiang bendera tersebut berdasarkan data pengamatan Siswa A?",
            json_encode([
                "A" => "5√3 meter",
                "B" => "10 meter",
                "C" => "10√3 meter",
                "D" => "20 meter",
                "E" => "20√3 meter"
            ]),
            "C",
            "Pembahasan:\nPengamatan Siswa A:\nJarak ke tiang (samping) = 10 m.\nSudut elevasi = 60°.\ntan 60° = tinggi tiang / 10\n√3 = tinggi tiang / 10  =>  tinggi tiang = 10√3 meter (sekitar 17,32 meter).\nJawaban yang tepat adalah C (10√3 meter).",
            4
        ],
        [
            "STIMULUS 5: 'Pemasangan Panel Surya Atap Ramah Lingkungan'\nSebuah sekolah SMA memasang panel surya di atap laboratorium fisika. Agar menerima radiasi sinar matahari optimal di Indonesia khatulistiwa, rangka penyangga dipasang miring dengan sudut kemiringan 45° terhadap atap datar. Jika panjang lembaran modul panel surya (sisi miring) adalah 2 meter.",
            "assets/images/stimulus_panel_surya.svg",
            "Berapakah proyeksi panjang bayangan horizontal panel surya tersebut pada permukaan atap datar?",
            json_encode([
                "A" => "√2 meter (≈ 1,414 m)",
                "B" => "2√2 meter",
                "C" => "1 meter",
                "D" => "0,5 meter",
                "E" => "√3 meter"
            ]),
            "A",
            "Pembahasan:\nProyeksi bayangan horizontal adalah sisi samping sudut kemiringan.\ncos 45° = samping / miring\n1/2 √2 = samping / 2  =>  samping = 2 × 1/2 √2 = √2 meter ≈ 1,414 meter.\nJawaban yang tepat adalah A (√2 meter).",
            5
        ],
        [
            "STIMULUS 6: 'Navigasi Mercusuar dan Keselamatan Pelayaran'\nSeorang petugas mercusuar mengamati sebuah perahu nelayan yang sedang berlayar menuju pelabuhan. Ketinggian lampu mercusuar berada pada 45 meter di atas permukaan laut. Petugas melihat perahu tersebut dengan sudut depresi 30°.",
            "assets/images/stimulus_mercusuar.svg",
            "Berdasarkan stimulus di atas, berapakah jarak horizontal perahu nelayan tersebut dari kaki mercusuar di tepi pantai?",
            json_encode([
                "A" => "15√3 meter",
                "B" => "45 meter",
                "C" => "45√3 meter",
                "D" => "90 meter",
                "E" => "90√3 meter"
            ]),
            "C",
            "Pembahasan:\nDiketahui tinggi mercusuar h = 45 meter dan sudut depresi = 30° (ekuivalen sudut elevasi dari kapal ke mercusuar).\ntan 30° = tinggi / jarak horizontal\n1/√3 = 45 / x => x = 45√3 meter (sekitar 77,94 meter).\nJawaban yang benar adalah C (45√3 meter).",
            6
        ],
        [
            "STIMULUS 7: 'Pemasangan Kawat Baja Penopang Tiang Listrik'\nPetugas PLN memasang kawat pancang baja (guy wire) untuk memperkokoh tiang transmisi listrik setinggi 12 meter dari permukaan tanah. Ujung atas kawat ditambatkan pada puncak tiang, sedangkan ujung bawahnya dipancangkan ke tanah sehingga membentuk sudut elevasi 60° terhadap tanah datar.",
            "assets/images/stimulus_tiang_kawat.svg",
            "Berapakah panjang minimal kawat pancang baja yang dibutuhkan untuk satu sisi penopang tiang tersebut?",
            json_encode([
                "A" => "6√3 meter",
                "B" => "8√3 meter",
                "C" => "12 meter",
                "D" => "12√3 meter",
                "E" => "24 meter"
            ]),
            "B",
            "Pembahasan:\nTinggi tiang (sisi depan) = 12 meter, sudut elevasi θ = 60°.\nsin 60° = sisi depan / panjang kawat\n(√3)/2 = 12 / r => r = 24 / √3 = 8√3 meter (sekitar 13,86 meter).\nJawaban yang benar adalah B (8√3 meter).",
            7
        ],
        [
            "STIMULUS 8: 'Operasi Penyelamatan Tangga Pemadam Kebakaran'\nTim pemadam kebakaran mengerahkan armada mobil tangga penyelamat untuk mengevakuasi korban kebakaran di lantai 3 sebuah ruko. Tangga teleskopik direntangkan sepanjang 20 meter dan disandarkan dengan sudut elevasi 30° terhadap bidang datar landasan mobil. Jika landasan mobil tangga berada pada ketinggian 1,5 meter di atas tanah.",
            "assets/images/stimulus_damkar.svg",
            "Berapakah ketinggian lantai jendela ruko yang berhasil dijangkau oleh ujung tangga pemadam tersebut dari permukaan tanah?",
            json_encode([
                "A" => "10,0 meter",
                "B" => "11,5 meter",
                "C" => "15,0 meter",
                "D" => "18,8 meter",
                "E" => "21,5 meter"
            ]),
            "B",
            "Pembahasan:\nPanjang tangga (sisi miring) = 20 m, sudut elevasi = 30°.\nJangkauan tangga dari landasan: y = 20 × sin 30° = 20 × 0,5 = 10 meter.\nKetinggian total dari tanah = 10 m + 1,5 m (tinggi landasan) = 11,5 meter.\nJawaban yang benar adalah B (11,5 meter).",
            8
        ],
        [
            "STIMULUS 9: 'Festival Layang-Layang Tradisional Pantai Barat'\nDalam festival layang-layang hias tahunan, seorang peserta menerbangkan layang-layang naga dengan tali sepanjang 100 meter yang ditarik tegang tanpa kendur. Sudut kemiringan tali layang-layang terhadap bidang tanah mendatar adalah 60°. Tinggi tangan pemegang benang berada 1 meter di atas tanah.",
            "assets/images/stimulus_layang.svg",
            "Berapakah tinggi posisi layang-layang tersebut dari permukaan tanah (nyatakan dalam bentuk eksak)?",
            json_encode([
                "A" => "50 meter",
                "B" => "50√2 + 1 meter",
                "C" => "50√3 meter",
                "D" => "50√3 + 1 meter",
                "E" => "100√3 + 1 meter"
            ]),
            "D",
            "Pembahasan:\nTinggi vertikal layang-layang dari tangan: h1 = 100 × sin 60° = 100 × (1/2 √3) = 50√3 meter.\nTinggi total dari permukaan tanah = h1 + tinggi tangan = 50√3 + 1 meter (sekitar 87,60 meter).\nJawaban yang benar adalah D (50√3 + 1 meter).",
            9
        ],
        [
            "STIMULUS 10: 'Standar Arsitektur Ramp Ramah Disabilitas'\nPeraturan Menteri PUPR menetapkan kemiringan ramp gedung umum ramah kursi roda maksimal memiliki rasio kemiringan 1 : 8 (tan θ = 1/8). Sebuah fasilitas kesehatan memiliki beranda teras dengan elevasi 1,2 meter di atas pelataran parkir.",
            "assets/images/stimulus_ramp.svg",
            "Berapakah panjang horizontal dasar lantai beton miring (ram) yang harus disiapkan kontraktor agar memenuhi standar rasio kemiringan tersebut?",
            json_encode([
                "A" => "6,4 meter",
                "B" => "8,0 meter",
                "C" => "9,6 meter",
                "D" => "10,8 meter",
                "E" => "12,0 meter"
            ]),
            "C",
            "Pembahasan:\nBerdasarkan rasio tan θ = tinggi / panjang horizontal:\n1/8 = 1,2 / x => x = 1,2 × 8 = 9,6 meter.\nJadi panjang horizontal lantai yang harus disediakan adalah 9,6 meter.\nJawaban yang benar adalah C (9,6 meter).",
            10
        ]
    ];

    foreach ($sumatif8 as $s) {
        $stmtQ->execute([
            $activityMap[8],
            $s[0],
            $s[1],
            $s[2],
            $s[3],
            $s[4],
            $s[5],
            $s[6]
        ]);
    }
    echo "8. Bank Soal Latihan (Akt 5), Contoh (Akt 7), dan Sumatif (Akt 8) berhasil diisi.\n";

    // 10. Seeding Instrumen Refleksi (Aktivitas 9)
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE reflections;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    $reflectionsData = [
        ["Bagaimana tingkat pemahaman Anda terhadap konsep rasio trigonometri (sin, cos, tan) setelah mempraktikkan simulasi interaktif ini?", "scale", true],
        ["Seberapa menarik dan membantukah media pembelajaran digital ini dalam memudahkan Anda memahami konsep abstrak matematika?", "scale", true],
        ["Aktivitas pembelajaran nomor berapa yang menurut Anda paling menantang dan memerlukan penjelasan tambahan dari Bapak Guru Aswan?", "essay", true],
        ["Tuliskan satu hikmah atau penerapan perbandingan trigonometri di kehidupan sehari-hari yang paling berkesan bagi Anda!", "essay", true]
    ];

    $stmtRef = $pdo->prepare("INSERT INTO reflections (prompt_text, type, is_active) VALUES (?, ?, ?)");
    foreach ($reflectionsData as $r) {
        $stmtRef->execute($r);
    }
    echo "9. Butir instrumen refleksi Aktivitas 9 berhasil didaftarkan.\n";

    // 11. Seeding Contoh Nilai dan Feedback untuk Siswa Sampel (Andi Pratama - A01)
    $stA01 = $pdo->prepare("SELECT id FROM users WHERE access_code = 'A01'");
    $stA01->execute();
    $a01Id = $stA01->fetchColumn();

    if ($a01Id) {
        // Jawaban Akt 1 (Essay)
        $stQ1 = $pdo->prepare("SELECT id FROM questions WHERE activity_id = ? LIMIT 1");
        $stQ1->execute([$activityMap[1]]);
        $q1Id = $stQ1->fetchColumn();
        if ($q1Id) {
            $pdo->prepare("
                INSERT INTO student_answers (user_id, question_id, student_answer, score, teacher_feedback)
                VALUES (?, ?, ?, 95, 'Analisis ide sangat kreatif! Penjelasan penggunaan sudut elevasi dan klinometer sangat tepat.')
                ON DUPLICATE KEY UPDATE score = 95
            ")->execute([$a01Id, $q1Id, 'Saya akan membuat klinometer sederhana dengan busur derajat, benang, dan pemberat untuk mengukur sudut elevasi ke puncak pohon. Kemudian mengukur jarak pengamat ke pohon. Dengan rumus t = t_pengamat + jarak * tan(sudut), tinggi pohon dapat dihitung secara akurat tanpa memanjat.']);
        }

        // Jawaban Akt 2 (LKPD)
        $stQ2 = $pdo->prepare("SELECT id FROM questions WHERE activity_id = ? LIMIT 1");
        $stQ2->execute([$activityMap[2]]);
        $q2Id = $stQ2->fetchColumn();
        if ($q2Id) {
            $pdo->prepare("
                INSERT INTO student_answers (user_id, question_id, student_answer, score, teacher_feedback)
                VALUES (?, ?, ?, 100, 'Luar biasa! Kesimpulan kesebangunan segitiga dirumuskan dengan sempurna.')
                ON DUPLICATE KEY UPDATE score = 100
            ")->execute([$a01Id, $q2Id, 'Rasio depan/miring, samping/miring, dan depan/samping nilainya selalu konstan karena kedua segitiga sebangun. Hal ini membuktikan bahwa rasio trigonometri murni bergantung pada besar sudut, bukan ukuran panjang segitiganya.']);
        }
    }

    echo "\n=== PROSES INISIALISASI DATABASE SELESAI DENGAN SUKSES! ===\n";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
