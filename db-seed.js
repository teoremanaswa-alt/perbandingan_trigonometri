// assets/js/db-seed.js - Initial Seed Database untuk GitHub Pages (Client-Side Database)
// Berisi 108 Siswa SMAS Al Azhar Mandiri Palu, Akun Guru, 10 Modul Aktivitas, Bank Soal, dan Refleksi
window.INITIAL_DB_SEED = {
    "classes": [
        {
            "id": 1,
            "class_name": "XA"
        },
        {
            "id": 2,
            "class_name": "XB"
        },
        {
            "id": 3,
            "class_name": "XC"
        },
        {
            "id": 4,
            "class_name": "XD"
        },
        {
            "id": 5,
            "class_name": "XE"
        },
        {
            "id": 6,
            "class_name": "XF"
        }
    ],
    "activities": [
        {
            "id": 1,
            "activity_number": 1,
            "title": "Pertanyaan Pemantik",
            "subtitle": "Mengamati fenomena pengukuran tinggi pohon & gedung tanpa memanjat.",
            "is_locked_by_default": 0
        },
        {
            "id": 2,
            "activity_number": 2,
            "title": "LKPD Simulasi Konsep",
            "subtitle": "Eksplorasi segitiga siku-siku & penemuan rasio sin, cos, tan.",
            "is_locked_by_default": 1
        },
        {
            "id": 3,
            "activity_number": 3,
            "title": "Materi Trigonometri",
            "subtitle": "Definisi sisi depan, samping, miring & mnemonik Demi-Sami-Desa.",
            "is_locked_by_default": 1
        },
        {
            "id": 4,
            "activity_number": 4,
            "title": "Sudut Istimewa",
            "subtitle": "Pembuktian geometris & tabel nilai sudut istimewa 0°, 30°, 45°, 60°, 90°.",
            "is_locked_by_default": 1
        },
        {
            "id": 5,
            "activity_number": 5,
            "title": "Latihan Soal",
            "subtitle": "5 butir latihan uji pemahaman konsep dasar dengan umpan balik instan.",
            "is_locked_by_default": 1
        },
        {
            "id": 6,
            "activity_number": 6,
            "title": "Simulasi Terapan",
            "subtitle": "3 Simulasi interaktif: Tinggi Pohon, Pendaratan Pesawat, Layang-layang.",
            "is_locked_by_default": 1
        },
        {
            "id": 7,
            "activity_number": 7,
            "title": "Contoh Literasi Numerasi",
            "subtitle": "5 Contoh soal kontekstual AKM\/literasi numerasi dan pembahasannya.",
            "is_locked_by_default": 1
        },
        {
            "id": 8,
            "activity_number": 8,
            "title": "Sumatif Literasi Numerasi",
            "subtitle": "Asesmen sumatif terstruktur berbasis stimulus narasi dan diagram.",
            "is_locked_by_default": 1
        },
        {
            "id": 9,
            "activity_number": 9,
            "title": "Refleksi Belajar",
            "subtitle": "Evaluasi proses belajar dan pemahaman materi secara mandiri.",
            "is_locked_by_default": 1
        },
        {
            "id": 10,
            "activity_number": 10,
            "title": "Hasil Belajar",
            "subtitle": "Laporan akhir pencapaian, sertifikat kompetensi & umpan balik guru.",
            "is_locked_by_default": 1
        }
    ],
    "questions": [
        {
            "id": 1,
            "activity_id": 1,
            "stimulus_text": "Di halaman sekolah SMAS Al Azhar Mandiri Palu terdapat sebuah pohon rindang yang menjulang tinggi. Pernahkah kalian berpikir bagaimana cara mengukur tinggi puncak pohon tersebut tanpa harus memanjatnya satu langkah pun? Hanya dengan berdiri di atas tanah, membidik puncak pohon dengan sudut elevasi tertentu, dan mengukur jarak langkah kaki kita, tinggi pohon dapat dihitung secara presisi! Rahasia matematika apakah yang menghubungkan sudut pandang, jarak horizontal, dan tinggi pohon tersebut?",
            "stimulus_image_url": "assets\/images\/stimulus_pohon.svg",
            "question_text": "Bagaimana cara mengukur tinggi pohon tanpa memanjatnya? Berdasarkan ilustrasi di samping, kemukakan ide, dugaan, dan strategi matematis kalian!",
            "options": {
                "A": "3\/5",
                "B": "4\/5",
                "C": "3\/4",
                "D": "5\/3",
                "E": "4\/3"
            },
            "correct_answer": "A",
            "explanation": "sin θ = depan \/ miring = 3\/5.",
            "order_num": 1
        },
        {
            "id": 2,
            "activity_id": 2,
            "stimulus_text": "Setelah Anda menggeser sudut dan panjang segitiga siku-siku pada kanvas simulasi interaktif di atas, analisislah data rasio sisi-sisi yang Anda peroleh.",
            "stimulus_image_url": null,
            "question_text": "Tuliskan kesimpulan Anda: Apa yang terjadi pada nilai rasio depan\/miring, samping\/miring, dan depan\/samping ketika ukuran segitiga diperbesar tetapi besar sudutnya tetap sama? Mengapa?",
            "options": null,
            "correct_answer": "Nilai rasio tetap konstan (tidak berubah) karena segitiga-segitiga tersebut sebangun (kesebangunan). Rasio hanya bergantung pada besar sudut, inilah yang mendasari definisi perbandingan trigonometri sin, cos, dan tan.",
            "explanation": "Sifat kesebangunan pada segitiga siku-siku menjamin bahwa rasio sisi hanya bergantung pada besar sudut lancipnya.",
            "order_num": 1
        },
        {
            "id": 3,
            "activity_id": 5,
            "stimulus_text": "Diberikan segitiga siku-siku ABC siku-siku di B. Jika panjang sisi tegak AB = 6 cm dan BC = 8 cm, maka tentukan nilai sin ∠A!",
            "stimulus_image_url": null,
            "question_text": "Berapakah nilai perbandingan sinus dari sudut A (sin ∠A)?",
            "options": {
                "A": "6\/10 (3\/5)",
                "B": "8\/10 (4\/5)",
                "C": "6\/8 (3\/4)",
                "D": "8\/6 (4\/3)",
                "E": "10\/8 (5\/4)"
            },
            "correct_answer": "B",
            "explanation": "Langkah 1: Hitung sisi miring AC dengan Teorema Pythagoras: AC = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.\nLangkah 2: Sisi di depan sudut A adalah BC = 8 cm, dan sisi miring adalah AC = 10 cm.\nLangkah 3: sin ∠A = sisi depan \/ sisi miring = 8\/10 = 4\/5.",
            "order_num": 1
        },
        {
            "id": 4,
            "activity_id": 5,
            "stimulus_text": "Diketahui suatu sudut lancip α memiliki nilai tan α = 3\/4. ",
            "stimulus_image_url": null,
            "question_text": "Berdasarkan nilai tan α = 3\/4, berapakah nilai cos α?",
            "options": {
                "A": "3\/5",
                "B": "4\/5",
                "C": "5\/4",
                "D": "5\/3",
                "E": "3\/7"
            },
            "correct_answer": "B",
            "explanation": "tan α = depan\/samping = 3\/4.\nSisi miring = √(3² + 4²) = √(9 + 16) = √25 = 5.\nMaka cos α = samping\/miring = 4\/5.",
            "order_num": 2
        },
        {
            "id": 5,
            "activity_id": 5,
            "stimulus_text": "Pada segitiga siku-siku PQR yang siku-siku di titik Q, perhatikan sudut lancip P.",
            "stimulus_image_url": null,
            "question_text": "Rasio perbandingan sisi samping sudut P terhadap sisi miring segitiga dinamakan...",
            "options": {
                "A": "Sinus (sin)",
                "B": "Kosinus (cos)",
                "C": "Tangen (tan)",
                "D": "Cosecan (csc)",
                "E": "Cotangen (cot)"
            },
            "correct_answer": "B",
            "explanation": "Mnemonik Sa-Mi: Kosinus (cos) adalah rasio sisi Samping dibagi sisi Miring.",
            "order_num": 3
        },
        {
            "id": 6,
            "activity_id": 5,
            "stimulus_text": "Sebuah tangga bersandar pada dinding tegak. Panjang tangga adalah 13 meter dan jarak ujung bawah tangga ke dinding adalah 12 meter.",
            "stimulus_image_url": null,
            "question_text": "Tentukan nilai perbandingan tangen dari sudut kemiringan antara tangga dengan tanah!",
            "options": {
                "A": "5\/12",
                "B": "12\/5",
                "C": "5\/13",
                "D": "12\/13",
                "E": "13\/5"
            },
            "correct_answer": "A",
            "explanation": "Tinggi dinding (sisi depan sudut) = √(13² - 12²) = √(169 - 144) = √25 = 5 meter.\nJarak bawah ke dinding (sisi samping) = 12 meter.\ntan θ = depan \/ samping = 5\/12.",
            "order_num": 4
        },
        {
            "id": 7,
            "activity_id": 5,
            "stimulus_text": "Perhatikan nilai perbandingan sudut lancip θ di mana sin θ = 1\/2.",
            "stimulus_image_url": null,
            "question_text": "Besar sudut istimewa θ yang memenuhi adalah...",
            "options": {
                "A": "0°",
                "B": "30°",
                "C": "45°",
                "D": "60°",
                "E": "90°"
            },
            "correct_answer": "B",
            "explanation": "Nilai sin 30° adalah 1\/2 (pada segitiga sama sisi yang dibagi dua).",
            "order_num": 5
        },
        {
            "id": 8,
            "activity_id": 7,
            "stimulus_text": "Petugas mercusuar di Pantai Anyer berada pada gardu pengawas setinggi 45 meter di atas permukaan laut. Dari puncak menara, petugas melihat sebuah perahu nelayan dengan sudut depresi 30°.",
            "stimulus_image_url": "assets\/images\/stimulus_mercusuar.svg",
            "question_text": "Berapakah jarak horizontal dari kaki menara mercusuar ke perahu nelayan tersebut?",
            "options": {
                "Tipe": "Contoh Soal Kontekstual Literasi Numerasi",
                "Konsep": "Sudut Depresi & Rasio Tangen"
            },
            "correct_answer": "45√3 meter (sekitar 77,94 meter)",
            "explanation": "Langkah Penyelesaian:\n1. Sudut depresi dari pengawas sama besarnya dengan sudut elevasi dari perahu nelayan ke puncak menara karena merupakan pasangan sudut dalam berseberangan (30°).\n2. Sisi depan sudut = tinggi menara = 45 meter.\n3. Sisi samping sudut = jarak horizontal (x).\n4. tan 30° = depan \/ samping\n   1\/√3 = 45 \/ x  =>  x = 45√3 meter ≈ 77,94 meter.\nJadi, jarak perahu ke menara adalah 45√3 meter.",
            "order_num": 1
        },
        {
            "id": 9,
            "activity_id": 7,
            "stimulus_text": "Sebuah tiang listrik setinggi 12 meter harus diperkuat dengan memasang kawat penopang (guy wire) dari puncak tiang ke pasak di tanah. Kawat tersebut dipasang membentuk sudut elevasi 60° terhadap tanah mendatar.",
            "stimulus_image_url": "assets\/images\/stimulus_tiang_kawat.svg",
            "question_text": "Tentukan panjang kawat penopang baja yang dibutuhkan!",
            "options": {
                "Tipe": "Contoh Soal Penerapan Keteknikan",
                "Konsep": "Sinus Sudut Istimewa 60°"
            },
            "correct_answer": "8√3 meter (sekitar 13,86 meter)",
            "explanation": "Langkah Penyelesaian:\n1. Tinggi tiang = sisi di depan sudut 60° = 12 m.\n2. Panjang kawat = sisi miring (r).\n3. sin 60° = depan \/ miring\n   √3 \/ 2 = 12 \/ r\n   r = 24 \/ √3 = 8√3 meter ≈ 13,86 meter.\nJadi, panjang kawat baja yang dibutuhkan adalah 8√3 meter.",
            "order_num": 2
        },
        {
            "id": 10,
            "activity_id": 7,
            "stimulus_text": "Mobil pemadam kebakaran memiliki tangga hidrolik yang dapat direntangkan maksimal 25 meter. Sudut kemiringan aman maksimal tangga adalah 53° (sin 53° ≈ 0,8 dan cos 53° ≈ 0,6). Landasan tangga berada 2 meter di atas permukaan tanah.",
            "stimulus_image_url": "assets\/images\/stimulus_damkar.svg",
            "question_text": "Berapakah ketinggian jendela gedung tertinggi yang dapat dicapai oleh tangga penyelamat tersebut?",
            "options": {
                "Tipe": "Contoh Soal Keselamatan & Mitigasi Bencana",
                "Konsep": "Sinus dan Penambahan Tinggi Dasar Alat"
            },
            "correct_answer": "22 meter dari permukaan tanah",
            "explanation": "Langkah Penyelesaian:\n1. Jangkauan vertikal tangga dari landasan mobil (y) dihitung dengan sinus:\n   sin 53° = y \/ panjang tangga\n   0,8 = y \/ 25  =>  y = 25 × 0,8 = 20 meter.\n2. Tinggi jendela total dari permukaan tanah:\n   Tinggi total = y + tinggi landasan = 20 m + 2 m = 22 meter.\nJadi jendela lantai gedung setinggi 22 meter dapat dicapai petugas damkar.",
            "order_num": 3
        },
        {
            "id": 11,
            "activity_id": 7,
            "stimulus_text": "Sesuai regulasi aksesibilitas fasilitas umum ramah disabilitas, ramp kursi roda memiliki batas sudut kemiringan maksimal agar pengguna dapat mendorong mandiri tanpa tergelincir, yaitu sudut elevasi α di mana tan α = 1\/12 (sekitar 4,76°). Sebuah gedung memiliki tangga setinggi 1,5 meter.",
            "stimulus_image_url": "assets\/images\/stimulus_ramp.svg",
            "question_text": "Berapa panjang lintasan lantai miring (ram) yang harus dibangun untuk menghubungkan pelataran jalan ke pintu masuk gedung?",
            "options": {
                "Tipe": "Contoh Soal Desain Arsitektur Inklusif",
                "Konsep": "Tangen dan Teorema Pythagoras"
            },
            "correct_answer": "Panjang bidang datar 18 meter, panjang bidang miring ≈ 18,06 meter",
            "explanation": "Langkah Penyelesaian:\n1. tan α = tinggi \/ panjang datar = 1\/12.\n   1,5 \/ x = 1\/12  =>  x = 1,5 × 12 = 18 meter.\n2. Panjang bidang miring ramp = √(18² + 1,5²) = √(324 + 2,25) = √326,25 ≈ 18,06 meter.\nDesain ini memastikan ramp ramah dan aman bagi difabel.",
            "order_num": 4
        },
        {
            "id": 12,
            "activity_id": 7,
            "stimulus_text": "Siswa ekstrakurikuler sains sedang mengukur ketinggian layang-layang tradisional. Benang layang-layang terulur sepanjang 80 meter dan ditarik kencang membentuk sudut 45° terhadap horizontal. Tangan siswa yang memegang gulungan benang berada 1,2 meter di atas tanah.",
            "stimulus_image_url": "assets\/images\/stimulus_layang.svg",
            "question_text": "Hitung ketinggian layang-layang dari permukaan tanah (gunakan √2 ≈ 1,414)!",
            "options": {
                "Tipe": "Contoh Soal Sains Rekreasi",
                "Konsep": "Sinus 45° dan Akumulasi Tinggi"
            },
            "correct_answer": "40√2 + 1,2 meter ≈ 57,76 meter",
            "explanation": "Langkah Penyelesaian:\n1. Tinggi dari tangan ke layang-layang: h1 = 80 × sin 45° = 80 × (1\/2 √2) = 40√2 meter ≈ 56,56 meter.\n2. Total tinggi dari tanah: H = h1 + tinggi tangan = 56,56 + 1,2 = 57,76 meter.\nJadi, ketinggian layang-layang adalah 57,76 meter.",
            "order_num": 5
        },
        {
            "id": 13,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 1: 'Pembangunan Ikonik Jembatan Penyeberangan'\nSebuah jembatan penyeberangan orang (JPO) modern dirancang dengan tangga landai untuk pejalan kaki. Tangga tersebut memiliki sudut kemiringan tetap 30° terhadap bidang datar jalan raya. Ketinggian bordes tengah jembatan dari aspal jalan raya adalah 6 meter.",
            "stimulus_image_url": "assets\/images\/stimulus_jpo.svg",
            "question_text": "Berdasarkan stimulus di atas, berapakah panjang lintasan rel tangga yang harus dilalui seorang pejalan kaki dari lantai dasar hingga mencapai bordes tengah jembatan?",
            "options": {
                "A": "6 meter",
                "B": "6√3 meter",
                "C": "12 meter",
                "D": "12√3 meter",
                "E": "18 meter"
            },
            "correct_answer": "C",
            "explanation": "Pembahasan:\nDiketahui sudut elevasi kemiringan θ = 30°.\nSisi depan sudut (ketinggian) = 6 meter.\nPanjang lintasan tangga adalah sisi miring (s).\nsin 30° = depan \/ miring\n1\/2 = 6 \/ s  =>  s = 6 × 2 = 12 meter.\nJawaban yang benar adalah C (12 meter).",
            "order_num": 1
        },
        {
            "id": 14,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 2: 'Sistem Pendaratan Pesawat Komersial'\nSebuah pesawat terbang Boeing 737 sedang bersiap mendarat di Bandara Internasional Sultan Hasanuddin. Radar navigasi instrumen menunjukkan pesawat saat ini berada pada ketinggian jelajah turun 1.200 meter di atas permukaan laut. Sudut depresi garis pandang pilot ke titik sentuh ujung landasan pacu (touchdown zone) adalah 30°.",
            "stimulus_image_url": "assets\/images\/stimulus_pesawat.svg",
            "question_text": "Berapakah jarak garis lurus langsung (glide path \/ sisi miring) dari moncong pesawat ke ujung landasan pacu tersebut?",
            "options": {
                "A": "1.200 meter",
                "B": "1.200√3 meter",
                "C": "2.000 meter",
                "D": "2.400 meter",
                "E": "2.400√3 meter"
            },
            "correct_answer": "D",
            "explanation": "Pembahasan:\nSudut depresi = 30°, yang setara dengan sudut elevasi dari landasan ke pesawat.\nKetinggian vertikal (depan) = 1.200 meter.\nJarak garis lurus (sisi miring r) dihitung dengan rasio sinus:\nsin 30° = ketinggian \/ r\n1\/2 = 1.200 \/ r  =>  r = 1.200 × 2 = 2.400 meter.\nJawaban yang tepat adalah D (2.400 meter).",
            "order_num": 2
        },
        {
            "id": 15,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 3: 'Pengukuran Pohon Warisan Hutan Adat'\nTim patroli kehutanan ingin mencatat tinggi pohon ulin raksasa di Kalimantan. Petugas berdiri sejauh 20 meter dari pangkal pohon dan membidikkan klinometer ke pucuk tertinggi pohon. Jarum klinometer menunjukkan sudut elevasi 45°. Jika tinggi mata petugas pengukur adalah 1,65 meter di atas tanah mendatar.",
            "stimulus_image_url": "assets\/images\/stimulus_ulin.svg",
            "question_text": "Berapakah perkiraan tinggi total pohon ulin warisan tersebut?",
            "options": {
                "A": "20,00 meter",
                "B": "21,65 meter",
                "C": "28,30 meter",
                "D": "31,65 meter",
                "E": "40,00 meter"
            },
            "correct_answer": "B",
            "explanation": "Pembahasan:\nJarak horizontal ke pohon (sisi samping) = 20 meter.\nSudut elevasi α = 45°.\ntan 45° = sisi depan (t1) \/ 20\n1 = t1 \/ 20  =>  t1 = 20 meter.\nTinggi total pohon = t1 + tinggi mata pengukur = 20 m + 1,65 m = 21,65 meter.\nJawaban yang benar adalah B (21,65 meter).",
            "order_num": 3
        },
        {
            "id": 16,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 4: 'Tiang Bendera Upacara Hari Kemerdekaan'\nPada upacara bendera 17 Agustus, dua orang siswa pengibar bendera berdiri di sisi timur dan barat tiang bendera. Siswa A di sisi timur memandang puncak tiang dengan sudut elevasi 60° pada jarak 10 meter dari tiang. Di sisi lain, siswa B berada pada jarak tertentu sehingga memandang puncak tiang dengan sudut elevasi 30°.",
            "stimulus_image_url": "assets\/images\/stimulus_upacara.svg",
            "question_text": "Berapakah tinggi tiang bendera tersebut berdasarkan data pengamatan Siswa A?",
            "options": {
                "A": "5√3 meter",
                "B": "10 meter",
                "C": "10√3 meter",
                "D": "20 meter",
                "E": "20√3 meter"
            },
            "correct_answer": "C",
            "explanation": "Pembahasan:\nPengamatan Siswa A:\nJarak ke tiang (samping) = 10 m.\nSudut elevasi = 60°.\ntan 60° = tinggi tiang \/ 10\n√3 = tinggi tiang \/ 10  =>  tinggi tiang = 10√3 meter (sekitar 17,32 meter).\nJawaban yang tepat adalah C (10√3 meter).",
            "order_num": 4
        },
        {
            "id": 17,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 5: 'Pemasangan Panel Surya Atap Ramah Lingkungan'\nSebuah sekolah SMA memasang panel surya di atap laboratorium fisika. Agar menerima radiasi sinar matahari optimal di Indonesia khatulistiwa, rangka penyangga dipasang miring dengan sudut kemiringan 45° terhadap atap datar. Jika panjang lembaran modul panel surya (sisi miring) adalah 2 meter.",
            "stimulus_image_url": "assets\/images\/stimulus_panel_surya.svg",
            "question_text": "Berapakah proyeksi panjang bayangan horizontal panel surya tersebut pada permukaan atap datar?",
            "options": {
                "A": "√2 meter (≈ 1,414 m)",
                "B": "2√2 meter",
                "C": "1 meter",
                "D": "0,5 meter",
                "E": "√3 meter"
            },
            "correct_answer": "A",
            "explanation": "Pembahasan:\nProyeksi bayangan horizontal adalah sisi samping sudut kemiringan.\ncos 45° = samping \/ miring\n1\/2 √2 = samping \/ 2  =>  samping = 2 × 1\/2 √2 = √2 meter ≈ 1,414 meter.\nJawaban yang tepat adalah A (√2 meter).",
            "order_num": 5
        },
        {
            "id": 18,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 6: 'Navigasi Mercusuar dan Keselamatan Pelayaran'\nSeorang petugas mercusuar mengamati sebuah perahu nelayan yang sedang berlayar menuju pelabuhan. Ketinggian lampu mercusuar berada pada 45 meter di atas permukaan laut. Petugas melihat perahu tersebut dengan sudut depresi 30°.",
            "stimulus_image_url": "assets\/images\/stimulus_mercusuar.svg",
            "question_text": "Berdasarkan stimulus di atas, berapakah jarak horizontal perahu nelayan tersebut dari kaki mercusuar di tepi pantai?",
            "options": {
                "A": "15√3 meter",
                "B": "45 meter",
                "C": "45√3 meter",
                "D": "90 meter",
                "E": "90√3 meter"
            },
            "correct_answer": "C",
            "explanation": "Pembahasan:\nDiketahui tinggi mercusuar h = 45 meter dan sudut depresi = 30° (ekuivalen sudut elevasi dari kapal ke mercusuar).\ntan 30° = tinggi \/ jarak horizontal\n1\/√3 = 45 \/ x => x = 45√3 meter (sekitar 77,94 meter).\nJawaban yang benar adalah C (45√3 meter).",
            "order_num": 6
        },
        {
            "id": 19,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 7: 'Pemasangan Kawat Baja Penopang Tiang Listrik'\nPetugas PLN memasang kawat pancang baja (guy wire) untuk memperkokoh tiang transmisi listrik setinggi 12 meter dari permukaan tanah. Ujung atas kawat ditambatkan pada puncak tiang, sedangkan ujung bawahnya dipancangkan ke tanah sehingga membentuk sudut elevasi 60° terhadap tanah datar.",
            "stimulus_image_url": "assets\/images\/stimulus_tiang_kawat.svg",
            "question_text": "Berapakah panjang minimal kawat pancang baja yang dibutuhkan untuk satu sisi penopang tiang tersebut?",
            "options": {
                "A": "6√3 meter",
                "B": "8√3 meter",
                "C": "12 meter",
                "D": "12√3 meter",
                "E": "24 meter"
            },
            "correct_answer": "B",
            "explanation": "Pembahasan:\nTinggi tiang (sisi depan) = 12 meter, sudut elevasi θ = 60°.\nsin 60° = sisi depan \/ panjang kawat\n(√3)\/2 = 12 \/ r => r = 24 \/ √3 = 8√3 meter (sekitar 13,86 meter).\nJawaban yang benar adalah B (8√3 meter).",
            "order_num": 7
        },
        {
            "id": 20,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 8: 'Operasi Penyelamatan Tangga Pemadam Kebakaran'\nTim pemadam kebakaran mengerahkan armada mobil tangga penyelamat untuk mengevakuasi korban kebakaran di lantai 3 sebuah ruko. Tangga teleskopik direntangkan sepanjang 20 meter dan disandarkan dengan sudut elevasi 30° terhadap bidang datar landasan mobil. Jika landasan mobil tangga berada pada ketinggian 1,5 meter di atas tanah.",
            "stimulus_image_url": "assets\/images\/stimulus_damkar.svg",
            "question_text": "Berapakah ketinggian lantai jendela ruko yang berhasil dijangkau oleh ujung tangga pemadam tersebut dari permukaan tanah?",
            "options": {
                "A": "10,0 meter",
                "B": "11,5 meter",
                "C": "15,0 meter",
                "D": "18,8 meter",
                "E": "21,5 meter"
            },
            "correct_answer": "B",
            "explanation": "Pembahasan:\nPanjang tangga (sisi miring) = 20 m, sudut elevasi = 30°.\nJangkauan tangga dari landasan: y = 20 × sin 30° = 20 × 0,5 = 10 meter.\nKetinggian total dari tanah = 10 m + 1,5 m (tinggi landasan) = 11,5 meter.\nJawaban yang benar adalah B (11,5 meter).",
            "order_num": 8
        },
        {
            "id": 21,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 9: 'Festival Layang-Layang Tradisional Pantai Barat'\nDalam festival layang-layang hias tahunan, seorang peserta menerbangkan layang-layang naga dengan tali sepanjang 100 meter yang ditarik tegang tanpa kendur. Sudut kemiringan tali layang-layang terhadap bidang tanah mendatar adalah 60°. Tinggi tangan pemegang benang berada 1 meter di atas tanah.",
            "stimulus_image_url": "assets\/images\/stimulus_layang.svg",
            "question_text": "Berapakah tinggi posisi layang-layang tersebut dari permukaan tanah (nyatakan dalam bentuk eksak)?",
            "options": {
                "A": "50 meter",
                "B": "50√2 + 1 meter",
                "C": "50√3 meter",
                "D": "50√3 + 1 meter",
                "E": "100√3 + 1 meter"
            },
            "correct_answer": "D",
            "explanation": "Pembahasan:\nTinggi vertikal layang-layang dari tangan: h1 = 100 × sin 60° = 100 × (1\/2 √3) = 50√3 meter.\nTinggi total dari permukaan tanah = h1 + tinggi tangan = 50√3 + 1 meter (sekitar 87,60 meter).\nJawaban yang benar adalah D (50√3 + 1 meter).",
            "order_num": 9
        },
        {
            "id": 22,
            "activity_id": 8,
            "stimulus_text": "STIMULUS 10: 'Standar Arsitektur Ramp Ramah Disabilitas'\nPeraturan Menteri PUPR menetapkan kemiringan ramp gedung umum ramah kursi roda maksimal memiliki rasio kemiringan 1 : 8 (tan θ = 1\/8). Sebuah fasilitas kesehatan memiliki beranda teras dengan elevasi 1,2 meter di atas pelataran parkir.",
            "stimulus_image_url": "assets\/images\/stimulus_ramp.svg",
            "question_text": "Berapakah panjang horizontal dasar lantai beton miring (ram) yang harus disiapkan kontraktor agar memenuhi standar rasio kemiringan tersebut?",
            "options": {
                "A": "6,4 meter",
                "B": "8,0 meter",
                "C": "9,6 meter",
                "D": "10,8 meter",
                "E": "12,0 meter"
            },
            "correct_answer": "C",
            "explanation": "Pembahasan:\nBerdasarkan rasio tan θ = tinggi \/ panjang horizontal:\n1\/8 = 1,2 \/ x => x = 1,2 × 8 = 9,6 meter.\nJadi panjang horizontal lantai yang harus disediakan adalah 9,6 meter.\nJawaban yang benar adalah C (9,6 meter).",
            "order_num": 10
        }
    ],
    "reflections": [
        {
            "id": 1,
            "prompt_text": "Seberapa pahamkah Anda mengenai konsep sinus, kosinus, dan tangen setelah mengikuti pembelajaran ini?",
            "type": "scale",
            "is_active": 1
        },
        {
            "id": 2,
            "prompt_text": "Seberapa menarik dan membantukah media pembelajaran digital ini dalam memudahkan Anda memahami konsep abstrak matematika?",
            "type": "scale",
            "is_active": 1
        },
        {
            "id": 3,
            "prompt_text": "Aktivitas pembelajaran nomor berapa yang menurut Anda paling menantang dan memerlukan penjelasan tambahan dari guru?",
            "type": "essay",
            "is_active": 1
        },
        {
            "id": 4,
            "prompt_text": "Tuliskan satu hikmah atau penerapan perbandingan trigonometri di kehidupan sehari-hari yang paling berkesan bagi Anda!",
            "type": "essay",
            "is_active": 1
        }
    ],
    "users": [
        {
            "id": 1,
            "role": "guru",
            "access_code": "100418",
            "name": "Aswan, M.Pd., Gr.",
            "class_id": null
        },
        {
            "id": 33,
            "role": "siswa",
            "access_code": "A1",
            "name": "Adynza Gerly Qhinaya",
            "class_id": 1
        },
        {
            "id": 34,
            "role": "siswa",
            "access_code": "A2",
            "name": "Aljero Waciq Taha Koruwu",
            "class_id": 1
        },
        {
            "id": 35,
            "role": "siswa",
            "access_code": "A3",
            "name": "Alyssa Diva Mustika Nafa",
            "class_id": 1
        },
        {
            "id": 36,
            "role": "siswa",
            "access_code": "A4",
            "name": "Anata Ma'rifatul Ilmi",
            "class_id": 1
        },
        {
            "id": 37,
            "role": "siswa",
            "access_code": "A5",
            "name": "Aqila Umairah Nursam Singi",
            "class_id": 1
        },
        {
            "id": 38,
            "role": "siswa",
            "access_code": "A6",
            "name": "Arif Sese Anas Nur Rahman",
            "class_id": 1
        },
        {
            "id": 39,
            "role": "siswa",
            "access_code": "A7",
            "name": "Athaya Khayra",
            "class_id": 1
        },
        {
            "id": 40,
            "role": "siswa",
            "access_code": "A8",
            "name": "Aulia Maharani",
            "class_id": 1
        },
        {
            "id": 41,
            "role": "siswa",
            "access_code": "A9",
            "name": "Azmar Ramadhan",
            "class_id": 1
        },
        {
            "id": 43,
            "role": "siswa",
            "access_code": "A11",
            "name": "Bricita Kristy Caroline Makarawung",
            "class_id": 1
        },
        {
            "id": 44,
            "role": "siswa",
            "access_code": "A12",
            "name": "Devanta Nayaka Shafa Askha",
            "class_id": 1
        },
        {
            "id": 45,
            "role": "siswa",
            "access_code": "A13",
            "name": "Dhea Fahikah Jumadi",
            "class_id": 1
        },
        {
            "id": 46,
            "role": "siswa",
            "access_code": "A14",
            "name": "Ezzah Firzanah Mumu",
            "class_id": 1
        },
        {
            "id": 47,
            "role": "siswa",
            "access_code": "A15",
            "name": "Fadel Ghiffary Gunawan",
            "class_id": 1
        },
        {
            "id": 48,
            "role": "siswa",
            "access_code": "A16",
            "name": "Fadilah Amaliya",
            "class_id": 1
        },
        {
            "id": 49,
            "role": "siswa",
            "access_code": "A17",
            "name": "Indah Citra Kirana",
            "class_id": 1
        },
        {
            "id": 50,
            "role": "siswa",
            "access_code": "A18",
            "name": "Kadek Neema Adishree",
            "class_id": 1
        },
        {
            "id": 51,
            "role": "siswa",
            "access_code": "A19",
            "name": "Khairullah Ijlal Heriawan",
            "class_id": 1
        },
        {
            "id": 52,
            "role": "siswa",
            "access_code": "A20",
            "name": "Kiana Anindya Putri",
            "class_id": 1
        },
        {
            "id": 53,
            "role": "siswa",
            "access_code": "A21",
            "name": "Maghfira Diva Azzahra",
            "class_id": 1
        },
        {
            "id": 54,
            "role": "siswa",
            "access_code": "A22",
            "name": "Mohammad Rio Rezky Ramadhan",
            "class_id": 1
        },
        {
            "id": 55,
            "role": "siswa",
            "access_code": "A23",
            "name": "Muh. Fadhiil Putra Asrum",
            "class_id": 1
        },
        {
            "id": 56,
            "role": "siswa",
            "access_code": "A24",
            "name": "Muh. Ulya",
            "class_id": 1
        },
        {
            "id": 57,
            "role": "siswa",
            "access_code": "A25",
            "name": "Muhammad Ammar",
            "class_id": 1
        },
        {
            "id": 58,
            "role": "siswa",
            "access_code": "A26",
            "name": "Muhammad Baihaqi",
            "class_id": 1
        },
        {
            "id": 59,
            "role": "siswa",
            "access_code": "A27",
            "name": "Muhammad Bilal",
            "class_id": 1
        },
        {
            "id": 60,
            "role": "siswa",
            "access_code": "A28",
            "name": "Natasyaqilah Cantika Maharani",
            "class_id": 1
        },
        {
            "id": 61,
            "role": "siswa",
            "access_code": "A29",
            "name": "Putri Viona",
            "class_id": 1
        },
        {
            "id": 62,
            "role": "siswa",
            "access_code": "A30",
            "name": "Rafly Akbar Maulana",
            "class_id": 1
        },
        {
            "id": 63,
            "role": "siswa",
            "access_code": "A31",
            "name": "Rizaldi Putra Pageno",
            "class_id": 1
        },
        {
            "id": 64,
            "role": "siswa",
            "access_code": "A32",
            "name": "Shaqila Deswita Salamon",
            "class_id": 1
        },
        {
            "id": 65,
            "role": "siswa",
            "access_code": "A33",
            "name": "Sultan Candrabumi",
            "class_id": 1
        },
        {
            "id": 66,
            "role": "siswa",
            "access_code": "A34",
            "name": "Sultan Malik Al Saleh",
            "class_id": 1
        },
        {
            "id": 67,
            "role": "siswa",
            "access_code": "A35",
            "name": "Zahirah Almaqfirah",
            "class_id": 1
        },
        {
            "id": 68,
            "role": "siswa",
            "access_code": "A36",
            "name": "Zayyanah Dzatil Izzah",
            "class_id": 1
        },
        {
            "id": 69,
            "role": "siswa",
            "access_code": "B1",
            "name": "Abdullah Umar Al Qara",
            "class_id": 2
        },
        {
            "id": 70,
            "role": "siswa",
            "access_code": "B2",
            "name": "Adhwaa Salsabila Shalda",
            "class_id": 2
        },
        {
            "id": 71,
            "role": "siswa",
            "access_code": "B3",
            "name": "Adibah Auliah",
            "class_id": 2
        },
        {
            "id": 72,
            "role": "siswa",
            "access_code": "B4",
            "name": "Agatha Athalia Arief",
            "class_id": 2
        },
        {
            "id": 73,
            "role": "siswa",
            "access_code": "B5",
            "name": "Ahmad Fayyadh Zainal",
            "class_id": 2
        },
        {
            "id": 74,
            "role": "siswa",
            "access_code": "B6",
            "name": "Ayu Mutiara",
            "class_id": 2
        },
        {
            "id": 75,
            "role": "siswa",
            "access_code": "B7",
            "name": "Brigitha Meily Ananda Sihombin",
            "class_id": 2
        },
        {
            "id": 76,
            "role": "siswa",
            "access_code": "B8",
            "name": "Difa Rania Arfaida",
            "class_id": 2
        },
        {
            "id": 77,
            "role": "siswa",
            "access_code": "B9",
            "name": "Ekaputta Joti Halim",
            "class_id": 2
        },
        {
            "id": 78,
            "role": "siswa",
            "access_code": "B10",
            "name": "Erina Salma Putri Aika",
            "class_id": 2
        },
        {
            "id": 79,
            "role": "siswa",
            "access_code": "B11",
            "name": "Fairul Aidil Asraaf",
            "class_id": 2
        },
        {
            "id": 80,
            "role": "siswa",
            "access_code": "B12",
            "name": "Fakhrani Alfiah",
            "class_id": 2
        },
        {
            "id": 81,
            "role": "siswa",
            "access_code": "B13",
            "name": "Fathiya Nisa Azzahra",
            "class_id": 2
        },
        {
            "id": 82,
            "role": "siswa",
            "access_code": "B14",
            "name": "Filza Gaysani",
            "class_id": 2
        },
        {
            "id": 83,
            "role": "siswa",
            "access_code": "B15",
            "name": "Indira Nurul Muthmainnah I. S. Basri",
            "class_id": 2
        },
        {
            "id": 84,
            "role": "siswa",
            "access_code": "B16",
            "name": "Izdihar Shafiyya",
            "class_id": 2
        },
        {
            "id": 85,
            "role": "siswa",
            "access_code": "B17",
            "name": "Jenifer Vania Sompa",
            "class_id": 2
        },
        {
            "id": 86,
            "role": "siswa",
            "access_code": "B18",
            "name": "Kalfaezy Ma'ruf",
            "class_id": 2
        },
        {
            "id": 87,
            "role": "siswa",
            "access_code": "B19",
            "name": "Mitsla Azzalfa",
            "class_id": 2
        },
        {
            "id": 88,
            "role": "siswa",
            "access_code": "B20",
            "name": "Moh Ichsan Farras",
            "class_id": 2
        },
        {
            "id": 89,
            "role": "siswa",
            "access_code": "B21",
            "name": "Moh. Jibril",
            "class_id": 2
        },
        {
            "id": 90,
            "role": "siswa",
            "access_code": "B22",
            "name": "Muhamad Rafi Al Ghazali",
            "class_id": 2
        },
        {
            "id": 91,
            "role": "siswa",
            "access_code": "B23",
            "name": "Muhammad Agha Nurwandi",
            "class_id": 2
        },
        {
            "id": 92,
            "role": "siswa",
            "access_code": "B24",
            "name": "Muhammad Faris Al Rhazi",
            "class_id": 2
        },
        {
            "id": 93,
            "role": "siswa",
            "access_code": "B25",
            "name": "Muhammad Khairun Hizril",
            "class_id": 2
        },
        {
            "id": 94,
            "role": "siswa",
            "access_code": "B26",
            "name": "Muhammad Samih Asyari",
            "class_id": 2
        },
        {
            "id": 95,
            "role": "siswa",
            "access_code": "B27",
            "name": "Nabila Danisy Aqila",
            "class_id": 2
        },
        {
            "id": 96,
            "role": "siswa",
            "access_code": "B28",
            "name": "Nesil Aydin Habibie",
            "class_id": 2
        },
        {
            "id": 97,
            "role": "siswa",
            "access_code": "B29",
            "name": "Nurul Ramadhani",
            "class_id": 2
        },
        {
            "id": 98,
            "role": "siswa",
            "access_code": "B30",
            "name": "Queentania Abigail Sembiring",
            "class_id": 2
        },
        {
            "id": 99,
            "role": "siswa",
            "access_code": "B31",
            "name": "Rafa Pahlevi",
            "class_id": 2
        },
        {
            "id": 100,
            "role": "siswa",
            "access_code": "B32",
            "name": "Rezky Muliyawan",
            "class_id": 2
        },
        {
            "id": 101,
            "role": "siswa",
            "access_code": "B33",
            "name": "Riskita Aqilah Putri",
            "class_id": 2
        },
        {
            "id": 102,
            "role": "siswa",
            "access_code": "B34",
            "name": "Shifwa Shaquilla",
            "class_id": 2
        },
        {
            "id": 103,
            "role": "siswa",
            "access_code": "B35",
            "name": "Syaza Khanza Humairah",
            "class_id": 2
        },
        {
            "id": 104,
            "role": "siswa",
            "access_code": "B36",
            "name": "Zaki Alif Mareno",
            "class_id": 2
        },
        {
            "id": 105,
            "role": "siswa",
            "access_code": "C1",
            "name": "Achmad Faizullah Anri",
            "class_id": 3
        },
        {
            "id": 106,
            "role": "siswa",
            "access_code": "C2",
            "name": "Ahmad Alfarisi Hafizhulhaq",
            "class_id": 3
        },
        {
            "id": 107,
            "role": "siswa",
            "access_code": "C3",
            "name": "Ahmad Khairul Azzam Lakawa",
            "class_id": 3
        },
        {
            "id": 108,
            "role": "siswa",
            "access_code": "C4",
            "name": "Alista Qisti Qurota R. I.",
            "class_id": 3
        },
        {
            "id": 109,
            "role": "siswa",
            "access_code": "C5",
            "name": "Andi Algifahri Batara Aqsha",
            "class_id": 3
        },
        {
            "id": 110,
            "role": "siswa",
            "access_code": "C6",
            "name": "Andi Tiarasari Zhafirah",
            "class_id": 3
        },
        {
            "id": 111,
            "role": "siswa",
            "access_code": "C7",
            "name": "Aqira Cyrilla Adzka",
            "class_id": 3
        },
        {
            "id": 112,
            "role": "siswa",
            "access_code": "C8",
            "name": "Azzelia Khanza Vania",
            "class_id": 3
        },
        {
            "id": 113,
            "role": "siswa",
            "access_code": "C9",
            "name": "Dama Natha Alauna",
            "class_id": 3
        },
        {
            "id": 114,
            "role": "siswa",
            "access_code": "C10",
            "name": "Dzakir Eka Saputra Wahyu",
            "class_id": 3
        },
        {
            "id": 115,
            "role": "siswa",
            "access_code": "C11",
            "name": "Emaili Iranda Faeyza",
            "class_id": 3
        },
        {
            "id": 116,
            "role": "siswa",
            "access_code": "C12",
            "name": "Febiola W. Wijaya",
            "class_id": 3
        },
        {
            "id": 117,
            "role": "siswa",
            "access_code": "C13",
            "name": "Filiciannisa Borman",
            "class_id": 3
        },
        {
            "id": 118,
            "role": "siswa",
            "access_code": "C14",
            "name": "Hadifa Nuradisya",
            "class_id": 3
        },
        {
            "id": 119,
            "role": "siswa",
            "access_code": "C15",
            "name": "Hallel Adjie Inggilingjati",
            "class_id": 3
        },
        {
            "id": 120,
            "role": "siswa",
            "access_code": "C16",
            "name": "Kadek Devan Kevin Sanjaya",
            "class_id": 3
        },
        {
            "id": 121,
            "role": "siswa",
            "access_code": "C17",
            "name": "Kanaya Nizma Tizani Pramesti",
            "class_id": 3
        },
        {
            "id": 122,
            "role": "siswa",
            "access_code": "C18",
            "name": "Kanza Khairunnisa Asyifa",
            "class_id": 3
        },
        {
            "id": 123,
            "role": "siswa",
            "access_code": "C19",
            "name": "Keisha Athalia",
            "class_id": 3
        },
        {
            "id": 124,
            "role": "siswa",
            "access_code": "C20",
            "name": "Kim Emmanuela Limbara",
            "class_id": 3
        },
        {
            "id": 125,
            "role": "siswa",
            "access_code": "C21",
            "name": "Muhammad Ilham Alif Ramadhan",
            "class_id": 3
        },
        {
            "id": 126,
            "role": "siswa",
            "access_code": "C22",
            "name": "Muhammad Narendra Rusmin",
            "class_id": 3
        },
        {
            "id": 127,
            "role": "siswa",
            "access_code": "C23",
            "name": "Muhammad Rizqullah Ananda Widodo",
            "class_id": 3
        },
        {
            "id": 128,
            "role": "siswa",
            "access_code": "C24",
            "name": "Muhammmad Fathul Abqari",
            "class_id": 3
        },
        {
            "id": 129,
            "role": "siswa",
            "access_code": "C25",
            "name": "Naufal Rafardhan",
            "class_id": 3
        },
        {
            "id": 130,
            "role": "siswa",
            "access_code": "C26",
            "name": "Nindya Azahra Putri",
            "class_id": 3
        },
        {
            "id": 131,
            "role": "siswa",
            "access_code": "C27",
            "name": "Qanita Lubna Rafeyla",
            "class_id": 3
        },
        {
            "id": 132,
            "role": "siswa",
            "access_code": "C28",
            "name": "Rais Muflih Shabara",
            "class_id": 3
        },
        {
            "id": 133,
            "role": "siswa",
            "access_code": "C29",
            "name": "Sumayya Salsabila",
            "class_id": 3
        },
        {
            "id": 134,
            "role": "siswa",
            "access_code": "C30",
            "name": "Syafiqah Ayuni",
            "class_id": 3
        },
        {
            "id": 135,
            "role": "siswa",
            "access_code": "C31",
            "name": "Syafiqah Azzahra",
            "class_id": 3
        },
        {
            "id": 136,
            "role": "siswa",
            "access_code": "C32",
            "name": "Thahira Al-Syirah Ramadhani",
            "class_id": 3
        },
        {
            "id": 137,
            "role": "siswa",
            "access_code": "C33",
            "name": "Tirza Natalie Chandra",
            "class_id": 3
        },
        {
            "id": 138,
            "role": "siswa",
            "access_code": "C34",
            "name": "Vildan Firdevs Ar Risyah",
            "class_id": 3
        },
        {
            "id": 139,
            "role": "siswa",
            "access_code": "C35",
            "name": "Xavi Syaban Dipo",
            "class_id": 3
        },
        {
            "id": 140,
            "role": "siswa",
            "access_code": "C36",
            "name": "Zhayrli Dwi Susan",
            "class_id": 3
        },
        {
            "id": 141,
            "role": "siswa",
            "access_code": "A10",
            "name": "Azza Dzakia Rafiah",
            "class_id": 1
        }
    ],
    "student_progress": [
        {
            "user_id": 33,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 33,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 33,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 34,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 34,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 35,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 35,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 36,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 36,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 37,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 37,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 38,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 38,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 39,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 39,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 40,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 40,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 41,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 41,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 43,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 43,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 44,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 44,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 45,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 45,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 46,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 46,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 47,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 47,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 48,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 48,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 49,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 49,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 50,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 50,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 51,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 51,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 52,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 52,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 53,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 53,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 54,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 54,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 55,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 55,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 56,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 56,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 57,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 57,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 58,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 58,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 59,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 59,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 60,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 60,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 61,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 61,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 62,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 62,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 63,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 63,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 64,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 64,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 65,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 65,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 66,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 66,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 67,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 67,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 68,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 68,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 69,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 69,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 70,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 70,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 71,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 71,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 72,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 72,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 73,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 73,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 74,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 74,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 75,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 75,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 76,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 76,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 77,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 77,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 78,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 78,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 79,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 79,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 80,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 80,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 81,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 81,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 82,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 82,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 83,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 83,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 84,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 84,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 85,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 85,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 86,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 86,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 87,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 87,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 88,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 88,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 89,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 89,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 90,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 90,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 91,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 91,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 92,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 92,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 93,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 93,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 94,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 94,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 95,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 95,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 96,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 96,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 97,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 97,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 98,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 98,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 99,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 99,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 100,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 100,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 101,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 101,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 102,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 102,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 103,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 103,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 104,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 104,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 105,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 105,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 106,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 106,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 107,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 107,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 108,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 108,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 109,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 109,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 110,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 110,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 111,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 111,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 112,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 112,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 113,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 113,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 114,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 114,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 115,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 115,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 116,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 116,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 117,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 117,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 118,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 118,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 119,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 119,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 120,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 120,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 121,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 121,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 122,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 122,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 123,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 123,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 124,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 124,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 125,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 125,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 126,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 126,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 127,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 127,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 128,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 128,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 129,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 129,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 130,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 130,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 131,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 131,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 132,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 132,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 133,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 133,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 134,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 134,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 135,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 135,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 136,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 136,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 137,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 137,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 138,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 138,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 139,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 139,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 140,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 140,
            "activity_id": 10,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 1,
            "status": "in_progress"
        },
        {
            "user_id": 141,
            "activity_id": 2,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 3,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 4,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 5,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 6,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 7,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 8,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 9,
            "status": "locked"
        },
        {
            "user_id": 141,
            "activity_id": 10,
            "status": "locked"
        }
    ],
    "student_answers": [],
    "reflection_responses": [],
    "settings": {
        "exam_token": "TRIGONO2026"
    }
};
