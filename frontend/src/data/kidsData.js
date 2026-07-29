export const KIDS_GAMES = [
  { id: 'puzzle', name: 'Quebra-Cabeça', icon: '🧩', description: 'Monte cenas bíblicas', unlocked: true },
  { id: 'quiz',   name: 'Quiz do Reino',  icon: '❓', description: 'Em breve!',          unlocked: false },
  { id: 'color',  name: 'Colorir',        icon: '🎨', description: 'Em breve!',          unlocked: false },
  { id: 'words',  name: 'Caça-Palavras',  icon: '🔤', description: 'Em breve!',          unlocked: false },
  { id: 'memory', name: 'Memória',        icon: '🧠', description: 'Em breve!',          unlocked: false },
];

export const PUZZLE_LEVELS = [
  {
    id: 1,
    name: 'Arca de Noé',
    difficulty: 'Fácil',
    cols: 3,
    rows: 3,
    coins: 5,
    bgColor: '#4a90d9',
    icon: '🐨',
    // SVG inline da cena - 400x300
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Céu -->
      <rect width="400" height="300" fill="#87CEEB"/>
      <!-- Sol -->
      <circle cx="350" cy="50" r="30" fill="#FFD700"/>
      <!-- Nuvens -->
      <ellipse cx="80" cy="45" rx="35" ry="15" fill="white"/>
      <ellipse cx="110" cy="40" rx="25" ry="12" fill="white"/>
      <ellipse cx="280" cy="60" rx="30" ry="12" fill="white"/>
      <!-- Água -->
      <rect y="200" width="400" height="100" fill="#2196F3"/>
      <!-- Ondas -->
      <path d="M0,210 Q50,200 100,210 Q150,220 200,210 Q250,200 300,210 Q350,220 400,210 L400,230 Q350,220 300,230 Q250,240 200,230 Q150,220 100,230 Q50,240 0,230Z" fill="#1976D2" opacity="0.5"/>
      <!-- Arca -->
      <rect x="120" y="150" width="160" height="70" rx="5" fill="#8B4513"/>
      <rect x="115" y="145" width="170" height="10" rx="3" fill="#A0522D"/>
      <polygon points="120,150 200,110 280,150" fill="#D2691E"/>
      <rect x="150" y="170" width="20" height="30" rx="2" fill="#FFD700"/>
      <rect x="190" y="170" width="20" height="30" rx="2" fill="#FFD700"/>
      <rect x="230" y="170" width="20" height="30" rx="2" fill="#FFD700"/>
      <!-- Animais (simplificados) -->
      <!-- Girafa -->
      <rect x="135" y="130" width="8" height="25" fill="#FFA500"/>
      <circle cx="139" cy="128" r="6" fill="#FFA500"/>
      <rect x="137" y="125" width="4" height="8" fill="#FFA500"/>
      <!-- Elefante -->
      <ellipse cx="260" cy="140" rx="15" ry="10" fill="#808080"/>
      <circle cx="250" cy="135" r="8" fill="#808080"/>
      <rect x="248" y="142" width="4" height="8" fill="#808080"/>
      <rect x="258" y="142" width="4" height="8" fill="#808080"/>
      <!-- Pomba -->
      <ellipse cx="200" cy="100" rx="10" ry="6" fill="white"/>
      <polygon points="190,100 180,95 180,105" fill="white"/>
      <circle cx="196" cy="98" r="1.5" fill="black"/>
    </svg>`
  },
  {
    id: 2,
    name: 'Davi e Golias',
    difficulty: 'Médio',
    cols: 4,
    rows: 3,
    coins: 10,
    bgColor: '#5D4037',
    icon: '⚔️',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Fundo deserto -->
      <rect width="400" height="300" fill="#F4A460"/>
      <rect y="180" width="400" height="120" fill="#DEB887"/>
      <!-- Montanhas -->
      <polygon points="0,180 60,80 120,180" fill="#8B7355"/>
      <polygon points="80,180 160,60 240,180" fill="#9B8B75"/>
      <polygon points="280,180 350,100 400,180" fill="#8B7355"/>
      <!-- Sol quente -->
      <circle cx="320" cy="50" r="35" fill="#FF6347" opacity="0.8"/>
      <!-- Golias (grande) -->
      <rect x="270" y="100" width="40" height="80" rx="5" fill="#8B0000"/>
      <circle cx="290" cy="90" r="18" fill="#DEB887"/>
      <rect x="285" y="85" width="10" height="15" fill="#808080"/>
      <rect x="320" y="110" width="8" height="60" rx="2" fill="#696969"/>
      <!-- Davi (pequeno) -->
      <rect x="110" y="140" width="20" height="40" rx="3" fill="#4169E1"/>
      <circle cx="120" cy="132" r="10" fill="#DEB887"/>
      <rect x="108" y="128" width="4" height="10" fill="#8B4513"/>
      <!-- Funda -->
      <line x1="125" y1="145" x2="145" y2="135" stroke="#8B4513" stroke-width="2"/>
      <circle cx="145" cy="135" r="3" fill="#696969"/>
    </svg>`
  },
  {
    id: 3,
    name: 'Estrela de Belém',
    difficulty: 'Difícil',
    cols: 4,
    rows: 4,
    coins: 15,
    bgColor: '#1a237e',
    icon: '⭐',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Noite -->
      <rect width="400" height="300" fill="#0D1B2A"/>
      <!-- Estrelas pequenas -->
      <circle cx="50" cy="30" r="1.5" fill="white"/>
      <circle cx="120" cy="50" r="1" fill="white"/>
      <circle cx="180" cy="25" r="1.5" fill="white"/>
      <circle cx="250" cy="45" r="1" fill="white"/>
      <circle cx="350" cy="35" r="1.5" fill="white"/>
      <circle cx="80" cy="80" r="1" fill="white"/>
      <circle cx="300" cy="70" r="1" fill="white"/>
      <circle cx="380" cy="90" r="1.5" fill="white"/>
      <circle cx="30" cy="110" r="1" fill="white"/>
      <!-- Estrela de Belém (grande) -->
      <polygon points="200,20 205,80 270,80 215,110 235,170 200,135 165,170 185,110 120,80 195,80" fill="#FFD700"/>
      <polygon points="200,40 203,80 240,80 210,100 220,140 200,120 180,140 190,100 160,80 197,80" fill="#FFF8DC"/>
      <!-- Brilho -->
      <circle cx="200" cy="90" r="15" fill="#FFD700" opacity="0.3"/>
      <!-- Manjedoura -->
      <rect x="150" y="200" width="100" height="40" rx="5" fill="#8B4513"/>
      <rect x="145" y="195" width="110" height="10" rx="2" fill="#A0522D"/>
      <!-- Palha -->
      <line x1="160" y1="215" x2="240" y2="215" stroke="#DAA520" stroke-width="2"/>
      <line x1="165" y1="220" x2="235" y2="220" stroke="#DAA520" stroke-width="2"/>
      <line x1="170" y1="225" x2="230" y2="225" stroke="#DAA520" stroke-width="2"/>
      <!-- Bebê Jesus (simplificado) -->
      <ellipse cx="200" cy="212" rx="12" ry="8" fill="#FFF8DC"/>
      <circle cx="200" cy="208" r="6" fill="#DEB887"/>
      <!-- José e Maria (silhuetas) -->
      <ellipse cx="130" cy="210" rx="12" ry="18" fill="#1a237e"/>
      <circle cx="130" cy="195" r="8" fill="#1a237e"/>
      <ellipse cx="270" cy="210" rx="12" ry="18" fill="#1a237e"/>
      <circle cx="270" cy="195" r="8" fill="#1a237e"/>
    </svg>`
  }
];
