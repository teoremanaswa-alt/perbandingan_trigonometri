<?php
// Script membuat seluruh file ilustrasi stimulus SVG
$dir = __DIR__ . '/assets/images/';

$svgs = [
    'stimulus_mercusuar.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <defs>
    <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="360" fill="#e0f2fe"/>
  <!-- Sea -->
  <rect y="240" width="600" height="120" fill="url(#seaGrad)"/>
  <!-- Cliff -->
  <polygon points="0,180 120,180 140,240 0,240" fill="#78716c"/>
  <!-- Lighthouse -->
  <polygon points="50,180 70,60 90,60 110,180" fill="#f8fafc" stroke="#dc2626" stroke-width="8" stroke-dasharray="25,25"/>
  <rect x="65" y="45" width="30" height="20" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <polygon points="60,45 80,25 100,45" fill="#dc2626"/>
  <!-- Boat -->
  <polygon points="460,250 540,250 520,270 480,270" fill="#b45309"/>
  <polygon points="500,248 500,205 530,235" fill="#f8fafc"/>
  <!-- Sight Lines -->
  <!-- Horizontal line from lighthouse -->
  <line x1="80" y1="50" x2="500" y2="50" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="80" y1="50" x2="480" y2="250" stroke="#ef4444" stroke-width="3"/>
  <path d="M 140 50 A 60 60 0 0 1 135 75" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="145" y="70" font-family="Arial" font-size="13" font-weight="bold" fill="#ef4444">30° (Sudut Depresi)</text>
  <!-- Vertical height -->
  <line x1="40" y1="50" x2="40" y2="240" stroke="#2563eb" stroke-width="2"/>
  <text x="5" y="150" font-family="Arial" font-size="12" font-weight="bold" fill="#2563eb">h = 45m</text>
  <text x="270" y="275" font-family="Arial" font-size="13" font-weight="bold" fill="#0369a1">Jarak Horizontal (x = ?)</text>
</svg>',

    'stimulus_tiang_kawat.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#f0fdf4"/>
  <rect y="290" width="600" height="70" fill="#86efac"/>
  <!-- Pole -->
  <rect x="420" y="50" width="16" height="240" fill="#475569"/>
  <rect x="400" y="70" width="56" height="8" fill="#334155"/>
  <rect x="406" y="95" width="44" height="8" fill="#334155"/>
  <!-- Guy wire -->
  <line x1="160" y1="290" x2="428" y2="60" stroke="#f59e0b" stroke-width="4"/>
  <polygon points="155,290 165,290 160,298" fill="#000"/>
  <!-- Ground line -->
  <line x1="160" y1="290" x2="420" y2="290" stroke="#64748b" stroke-width="2"/>
  <!-- Angle -->
  <path d="M 210 290 A 50 50 0 0 0 195 255" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="215" y="275" font-family="Arial" font-size="14" font-weight="bold" fill="#ef4444">60°</text>
  <!-- Labels -->
  <text x="445" y="180" font-family="Arial" font-size="13" font-weight="bold" fill="#334155">Tinggi = 12 m</text>
  <text x="230" y="160" font-family="Arial" font-size="13" font-weight="bold" fill="#d97706" transform="rotate(-40, 230, 160)">Kawat Penopang (r = ?)</text>
</svg>',

    'stimulus_damkar.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#f8fafc"/>
  <rect y="290" width="600" height="70" fill="#94a3b8"/>
  <!-- Building -->
  <rect x="440" y="30" width="140" height="260" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <!-- Windows -->
  <rect x="460" y="60" width="30" height="40" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <rect x="520" y="60" width="30" height="40" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <rect x="460" y="130" width="30" height="40" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <rect x="520" y="130" width="30" height="40" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <!-- Fire Truck -->
  <rect x="80" y="240" width="180" height="50" fill="#dc2626" rx="6"/>
  <rect x="210" y="220" width="50" height="30" fill="#dc2626" rx="4"/>
  <circle cx="120" cy="290" r="18" fill="#1e293b"/>
  <circle cx="220" cy="290" r="18" fill="#1e293b"/>
  <!-- Ladder -->
  <line x1="160" y1="240" x2="450" y2="80" stroke="#f59e0b" stroke-width="8"/>
  <text x="240" y="145" font-family="Arial" font-size="13" font-weight="bold" fill="#b45309" transform="rotate(-30, 240, 145)">Tangga 25 m</text>
  <text x="180" y="230" font-family="Arial" font-size="12" font-weight="bold" fill="#dc2626">Sudut 53°</text>
  <text x="460" y="50" font-family="Arial" font-size="12" font-weight="bold" fill="#0369a1">Jendela Target</text>
</svg>',

    'stimulus_ramp.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#fdf4ff"/>
  <rect y="290" width="600" height="70" fill="#e2e8f0"/>
  <!-- Building Porch -->
  <rect x="440" y="180" width="140" height="110" fill="#a855f7"/>
  <!-- Ramp Slope -->
  <polygon points="100,290 440,180 440,290" fill="#d8b4fe"/>
  <!-- Wheelchair Symbol -->
  <circle cx="240" cy="210" r="14" fill="#6b21a8"/>
  <path d="M 235 224 A 16 16 0 1 0 255 244" fill="none" stroke="#6b21a8" stroke-width="4"/>
  <!-- Measurements -->
  <line x1="450" y1="180" x2="450" y2="290" stroke="#9333ea" stroke-width="2"/>
  <text x="460" y="240" font-family="Arial" font-size="13" font-weight="bold" fill="#9333ea">Tinggi = 1,5 m</text>
  <text x="220" y="315" font-family="Arial" font-size="13" font-weight="bold" fill="#475569">Kemiringan Ram tan α = 1/12</text>
</svg>',

    'stimulus_layang.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#ecfeff"/>
  <rect y="290" width="600" height="70" fill="#a7f3d0"/>
  <!-- Kid -->
  <circle cx="100" cy="240" r="14" fill="#0284c7"/>
  <rect x="93" y="254" width="14" height="36" fill="#0369a1"/>
  <!-- Kite -->
  <polygon points="460,40 485,75 460,110 435,75" fill="#f43f5e"/>
  <!-- Kite Tail -->
  <path d="M 460 110 Q 480 130 465 150 T 475 180" fill="none" stroke="#fb7185" stroke-width="3"/>
  <!-- String -->
  <line x1="107" y1="260" x2="460" y2="75" stroke="#64748b" stroke-width="2"/>
  <text x="260" y="150" font-family="Arial" font-size="13" font-weight="bold" fill="#475569" transform="rotate(-28, 260, 150)">Tali = 80 meter</text>
  <text x="140" y="255" font-family="Arial" font-size="13" font-weight="bold" fill="#0284c7">Sudut 45°</text>
  <line x1="460" y1="75" x2="460" y2="290" stroke="#059669" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="470" y="200" font-family="Arial" font-size="13" font-weight="bold" fill="#059669">Tinggi Total (H)</text>
</svg>',

    'stimulus_jpo.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#fff7ed"/>
  <rect y="280" width="600" height="80" fill="#64748b"/>
  <!-- JPO Bridge Top -->
  <rect x="360" y="100" width="220" height="24" fill="#f97316"/>
  <!-- Pillar -->
  <rect x="360" y="124" width="20" height="156" fill="#ea580c"/>
  <!-- Inclined Stair -->
  <polygon points="80,280 360,124 360,134 80,290" fill="#fb923c"/>
  <line x1="80" y1="280" x2="360" y2="124" stroke="#c2410c" stroke-width="3"/>
  <!-- Angle 30 -->
  <path d="M 130 280 A 50 50 0 0 0 120 258" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="140" y="270" font-family="Arial" font-size="14" font-weight="bold" fill="#ef4444">30°</text>
  <!-- Height -->
  <line x1="395" y1="124" x2="395" y2="280" stroke="#2563eb" stroke-width="2"/>
  <text x="405" y="200" font-family="Arial" font-size="13" font-weight="bold" fill="#2563eb">Tinggi Bordes = 6 m</text>
  <text x="160" y="180" font-family="Arial" font-size="13" font-weight="bold" fill="#c2410c">Panjang Lintasan Tangga (s = ?)</text>
</svg>',

    'stimulus_pesawat.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <defs>
    <linearGradient id="skyP" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>
  <rect width="600" height="360" fill="url(#skyP)"/>
  <rect y="300" width="600" height="60" fill="#334155"/>
  <!-- Runway dashes -->
  <line x1="450" y1="330" x2="580" y2="330" stroke="#f8fafc" stroke-width="4" stroke-dasharray="15,10"/>
  <!-- Airplane -->
  <g transform="translate(80, 70)">
    <!-- Fuselage -->
    <ellipse cx="60" cy="20" rx="45" ry="12" fill="#0284c7"/>
    <!-- Wing -->
    <polygon points="45,20 20,-10 35,-10 65,20" fill="#0369a1"/>
    <!-- Tail -->
    <polygon points="15,20 5,-5 15,-5 25,20" fill="#0369a1"/>
  </g>
  <!-- Altitude Line -->
  <line x1="140" y1="90" x2="140" y2="300" stroke="#2563eb" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="60" y="200" font-family="Arial" font-size="13" font-weight="bold" fill="#2563eb">Ketinggian = 1.200 m</text>
  <!-- Glide path (Sisi miring) -->
  <line x1="140" y1="90" x2="480" y2="300" stroke="#ef4444" stroke-width="3"/>
  <!-- Horizontal pilot view line -->
  <line x1="140" y1="90" x2="480" y2="90" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5"/>
  <path d="M 200 90 A 60 60 0 0 1 190 120" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="210" y="115" font-family="Arial" font-size="13" font-weight="bold" fill="#ef4444">30° (Sudut Depresi)</text>
  <text x="270" y="210" font-family="Arial" font-size="13" font-weight="bold" fill="#dc2626">Jarak Langsung Glide Path (r = ?)</text>
</svg>',

    'stimulus_ulin.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#f0fdf4"/>
  <rect y="290" width="600" height="70" fill="#4ade80"/>
  <!-- Giant Ulin Tree -->
  <rect x="420" y="40" width="40" height="250" fill="#713f12" rx="4"/>
  <circle cx="440" cy="50" r="60" fill="#15803d"/>
  <!-- Ranger with clinometer -->
  <circle cx="160" cy="225" r="14" fill="#0284c7"/>
  <rect x="153" y="239" width="14" height="51" fill="#0369a1"/>
  <!-- Sight line -->
  <line x1="167" y1="230" x2="440" y2="50" stroke="#ef4444" stroke-width="3"/>
  <line x1="167" y1="230" x2="440" y2="230" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
  <path d="M 217 230 A 50 50 0 0 0 205 195" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="225" y="215" font-family="Arial" font-size="14" font-weight="bold" fill="#ef4444">45°</text>
  <!-- Measurements -->
  <text x="250" y="250" font-family="Arial" font-size="13" font-weight="bold" fill="#334155">Jarak Pengamat = 20 m</text>
  <text x="80" y="260" font-family="Arial" font-size="12" font-weight="bold" fill="#0369a1">Mata 1,65m</text>
  <text x="470" y="150" font-family="Arial" font-size="13" font-weight="bold" fill="#15803d">Tinggi Total = ?</text>
</svg>',

    'stimulus_upacara.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#f8fafc"/>
  <rect y="290" width="600" height="70" fill="#cbd5e1"/>
  <!-- Flag pole -->
  <line x1="300" y1="40" x2="300" y2="290" stroke="#94a3b8" stroke-width="6"/>
  <!-- Red White Flag -->
  <rect x="303" y="50" width="50" height="18" fill="#dc2626"/>
  <rect x="303" y="68" width="50" height="18" fill="#ffffff" stroke="#e2e8f0"/>
  <!-- Student A -->
  <circle cx="160" cy="240" r="12" fill="#3b82f6"/>
  <rect x="154" y="252" width="12" height="38" fill="#1d4ed8"/>
  <text x="145" y="305" font-family="Arial" font-size="12" font-weight="bold" fill="#1e40af">Siswa A</text>
  <!-- Line from A -->
  <line x1="160" y1="240" x2="300" y2="40" stroke="#ef4444" stroke-width="2.5"/>
  <text x="190" y="235" font-family="Arial" font-size="13" font-weight="bold" fill="#ef4444">60°</text>
  <text x="210" y="275" font-family="Arial" font-size="12" font-weight="bold" fill="#475569">10 m</text>
  <text x="315" y="160" font-family="Arial" font-size="13" font-weight="bold" fill="#dc2626">Tinggi Tiang (t = ?)</text>
</svg>',

    'stimulus_panel_surya.svg' => '
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <rect width="600" height="360" fill="#fefce8"/>
  <rect y="270" width="600" height="90" fill="#cbd5e1"/>
  <!-- Sun -->
  <circle cx="120" cy="60" r="30" fill="#facc15"/>
  <!-- Solar panel inclined -->
  <polygon points="200,270 420,114 430,126 210,282" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
  <!-- Solar grid lines -->
  <line x1="250" y1="234" x2="260" y2="246" stroke="#93c5fd" stroke-width="2"/>
  <line x1="310" y1="192" x2="320" y2="204" stroke="#93c5fd" stroke-width="2"/>
  <line x1="370" y1="150" x2="380" y2="162" stroke="#93c5fd" stroke-width="2"/>
  <!-- Angle 45 -->
  <path d="M 250 270 A 50 50 0 0 0 235 235" fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="260" y="255" font-family="Arial" font-size="14" font-weight="bold" fill="#ef4444">45°</text>
  <text x="280" y="145" font-family="Arial" font-size="13" font-weight="bold" fill="#1e3a8a" transform="rotate(-35, 280, 145)">Panjang Modul = 2 m</text>
  <line x1="200" y1="290" x2="425" y2="290" stroke="#059669" stroke-width="3"/>
  <text x="260" y="315" font-family="Arial" font-size="13" font-weight="bold" fill="#059669">Panjang Bayangan Horizontal (x = ?)</text>
</svg>'
];

foreach ($svgs as $filename => $content) {
    file_put_contents($dir . $filename, trim($content));
    echo "Dibuat: $filename\n";
}
echo "Semua file SVG berhasil dibuat!\n";
