<?php
// import_students.php - Script impor data siswa SMAS Al-Azhar Mandiri Palu ke database MySQL
require_once __DIR__ . '/config/db.php';

header('Content-Type: text/plain; charset=utf-8');

$csvData = <<<EOD
NAMA,KODE AKSES,KELAS
Adynza Gerly Qhinaya,A1,XA
Aljero Waciq Taha Koruwu,A2,XA
Alyssa Diva Mustika Nafa,A3,XA
Anata Ma'rifatul Ilmi,A4,XA
Aqila Umairah Nursam Singi,A5,XA
Arif Sese Anas Nur Rahman,A6,XA
Athaya Khayra,A7,XA
Aulia Maharani,A8,XA
Azmar Ramadhan,A9,XA
Azza Dzakia Rafiah,A10,XA
Bricita Kristy Caroline Makarawung,A11,XA
Devanta Nayaka Shafa Askha,A12,XA
Dhea Fahikah Jumadi,A13,XA
Ezzah Firzanah Mumu,A14,XA
Fadel Ghiffary Gunawan,A15,XA
Fadilah Amaliya,A16,XA
Indah Citra Kirana,A17,XA
Kadek Neema Adishree,A18,XA
Khairullah Ijlal Heriawan,A19,XA
Kiana Anindya Putri,A20,XA
Maghfira Diva Azzahra,A21,XA
Mohammad Rio Rezky Ramadhan,A22,XA
Muh. Fadhiil Putra Asrum,A23,XA
Muh. Ulya,A24,XA
Muhammad Ammar,A25,XA
Muhammad Baihaqi,A26,XA
Muhammad Bilal,A27,XA
Natasyaqilah Cantika Maharani,A28,XA
Putri Viona,A29,XA
Rafly Akbar Maulana,A30,XA
Rizaldi Putra Pageno,A31,XA
Shaqila Deswita Salamon,A32,XA
Sultan Candrabumi,A33,XA
Sultan Malik Al Saleh,A34,XA
Zahirah Almaqfirah,A35,XA
Zayyanah Dzatil Izzah,A36,XA
Abdullah Umar Al Qara,B1,XB
Adhwaa Salsabila Shalda,B2,XB
Adibah Auliah,B3,XB
Agatha Athalia Arief,B4,XB
Ahmad Fayyadh Zainal,B5,XB
Ayu Mutiara,B6,XB
Brigitha Meily Ananda Sihombin,B7,XB
Difa Rania Arfaida,B8,XB
Ekaputta Joti Halim,B9,XB
Erina Salma Putri Aika,B10,XB
Fairul Aidil Asraaf,B11,XB
Fakhrani Alfiah,B12,XB
Fathiya Nisa Azzahra,B13,XB
Filza Gaysani,B14,XB
Indira Nurul Muthmainnah I. S. Basri,B15,XB
Izdihar Shafiyya,B16,XB
Jenifer Vania Sompa,B17,XB
Kalfaezy Ma'ruf,B18,XB
Mitsla Azzalfa,B19,XB
Moh Ichsan Farras,B20,XB
Moh. Jibril,B21,XB
Muhamad Rafi Al Ghazali,B22,XB
Muhammad Agha Nurwandi,B23,XB
Muhammad Faris Al Rhazi,B24,XB
Muhammad Khairun Hizril,B25,XB
Muhammad Samih Asyari,B26,XB
Nabila Danisy Aqila,B27,XB
Nesil Aydin Habibie,B28,XB
Nurul Ramadhani,B29,XB
Queentania Abigail Sembiring,B30,XB
Rafa Pahlevi,B31,XB
Rezky Muliyawan,B32,XB
Riskita Aqilah Putri,B33,XB
Shifwa Shaquilla,B34,XB
Syaza Khanza Humairah,B35,XB
Zaki Alif Mareno,B36,XB
Achmad Faizullah Anri,C1,XC
Ahmad Alfarisi Hafizhulhaq,C2,XC
Ahmad Khairul Azzam Lakawa,C3,XC
Alista Qisti Qurota R. I.,C4,XC
Andi Algifahri Batara Aqsha,C5,XC
Andi Tiarasari Zhafirah,C6,XC
Aqira Cyrilla Adzka,C7,XC
Azzelia Khanza Vania,C8,XC
Dama Natha Alauna,C9,XC
Dzakir Eka Saputra Wahyu,C10,XC
Emaili Iranda Faeyza,C11,XC
Febiola W. Wijaya,C12,XC
Filiciannisa Borman,C13,XC
Hadifa Nuradisya,C14,XC
Hallel Adjie Inggilingjati,C15,XC
Kadek Devan Kevin Sanjaya,C16,XC
Kanaya Nizma Tizani Pramesti,C17,XC
Kanza Khairunnisa Asyifa,C18,XC
Keisha Athalia,C19,XC
Kim Emmanuela Limbara,C20,XC
Muhammad Ilham Alif Ramadhan,C21,XC
Muhammad Narendra Rusmin,C22,XC
Muhammad Rizqullah Ananda Widodo,C23,XC
Muhammmad Fathul Abqari,C24,XC
Naufal Rafardhan,C25,XC
Nindya Azahra Putri,C26,XC
Qanita Lubna Rafeyla,C27,XC
Rais Muflih Shabara,C28,XC
Sumayya Salsabila,C29,XC
Syafiqah Ayuni,C30,XC
Syafiqah Azzahra,C31,XC
Thahira Al-Syirah Ramadhani,C32,XC
Tirza Natalie Chandra,C33,XC
Vildan Firdevs Ar Risyah,C34,XC
Xavi Syaban Dipo,C35,XC
Zhayrli Dwi Susan,C36,XC
EOD;

echo "=== MEMULAI IMPORT DATA SISWA KE DATABASE ===\n";

// 1. Dapatkan daftar kelas
$classes = $pdo->query("SELECT id, class_name FROM classes")->fetchAll(PDO::FETCH_KEY_PAIR);
$classMap = array_flip($classes); // class_name => id

// Pastikan kelas XA, XB, XC ada
foreach (['XA', 'XB', 'XC', 'XD', 'XE', 'XF'] as $cName) {
    if (!isset($classMap[$cName])) {
        $st = $pdo->prepare("INSERT INTO classes (class_name) VALUES (?)");
        $st->execute([$cName]);
        $classMap[$cName] = $pdo->lastInsertId();
    }
}

// 2. Ambil daftar aktivitas 1 s.d. 10
$activities = $pdo->query("SELECT id, activity_number FROM activities ORDER BY activity_number ASC")->fetchAll();
if (empty($activities)) {
    die("Error: Tabel activities belum terisi! Jalankan setup_db.php terlebih dahulu.\n");
}

// 3. Bersihkan data dummy siswa lama (hanya role siswa, data guru Aswan tetap dipertahankan)
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
$pdo->exec("DELETE FROM student_answers WHERE user_id IN (SELECT id FROM users WHERE role = 'siswa');");
$pdo->exec("DELETE FROM student_progress WHERE user_id IN (SELECT id FROM users WHERE role = 'siswa');");
$pdo->exec("DELETE FROM reflection_responses WHERE user_id IN (SELECT id FROM users WHERE role = 'siswa');");
$pdo->exec("DELETE FROM users WHERE role = 'siswa';");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

echo "1. Data siswa sampel terdahulu telah dibersihkan.\n";

// 4. Parse baris data siswa
$lines = explode("\n", trim($csvData));
$header = array_shift($lines); // Buang header NAMA,KODE AKSES,KELAS

$stmtUser = $pdo->prepare("
    INSERT INTO users (role, access_code, name, class_id)
    VALUES ('siswa', ?, ?, ?)
");

$stmtProg = $pdo->prepare("
    INSERT INTO student_progress (user_id, activity_id, status)
    VALUES (?, ?, ?)
");

$count = 0;
$classCounts = [];

foreach ($lines as $line) {
    $line = trim($line);
    if (empty($line)) continue;

    $parts = str_getcsv($line);
    if (count($parts) < 3) continue;

    $name = trim($parts[0]);
    $accessCode = trim($parts[1]);
    $className = trim($parts[2]);

    $classId = $classMap[$className] ?? null;
    if (!$classId) {
        echo "Peringatan: Kelas $className tidak ditemukan untuk $name!\n";
        continue;
    }

    // Insert siswa
    $stmtUser->execute([$accessCode, $name, $classId]);
    $userId = $pdo->lastInsertId();

    // Buat progres 10 aktivitas (Aktivitas 1 in_progress, 2-10 locked)
    foreach ($activities as $act) {
        $status = ($act['activity_number'] == 1) ? 'in_progress' : 'locked';
        $stmtProg->execute([$userId, $act['id'], $status]);
    }

    $count++;
    $classCounts[$className] = ($classCounts[$className] ?? 0) + 1;
}

echo "2. Berhasil mengimpor $count siswa ke database MySQL!\n";
echo "   Rincian per kelas:\n";
foreach ($classCounts as $cls => $c) {
    echo "   - Kelas $cls: $c siswa\n";
}

echo "\n=== IMPORT SELESAI DENGAN SUKSES! ===\n";
