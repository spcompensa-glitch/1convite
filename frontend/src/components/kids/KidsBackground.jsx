import React from 'react';

export default function KidsBackground({ children }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 40%, #FFF9C4 70%, #C8E6C9 100%)',
    }}>
      {/* SVG de fundo */}
      <svg
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sol */}
        <circle cx="350" cy="60" r="40" fill="#FFD54F" opacity="0.9">
          <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Raios do sol */}
        <g opacity="0.3" stroke="#FFD54F" strokeWidth="2">
          <line x1="350" y1="10" x2="350" y2="0">
            <animate attributeName="y2" values="0;-5;0" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="385" y1="25" x2="395" y2="15">
            <animate attributeName="x2" values="395;400;395" dur="2.5s" repeatCount="indefinite" />
          </line>
          <line x1="395" y1="60" x2="405" y2="60" />
          <line x1="315" y1="25" x2="305" y2="15" />
          <line x1="305" y1="60" x2="295" y2="60" />
        </g>

        {/* Nuvens */}
        <g opacity="0.8">
          <ellipse cx="80" cy="80" rx="40" ry="18" fill="white">
            <animate attributeName="cx" values="80;90;80" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="110" cy="75" rx="30" ry="14" fill="white">
            <animate attributeName="cx" values="110;120;110" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="60" cy="85" rx="25" ry="12" fill="white">
            <animate attributeName="cx" values="60;70;60" dur="8s" repeatCount="indefinite" />
          </ellipse>
        </g>
        <g opacity="0.6">
          <ellipse cx="250" cy="110" rx="35" ry="15" fill="white">
            <animate attributeName="cx" values="250;240;250" dur="10s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="280" cy="105" rx="25" ry="12" fill="white">
            <animate attributeName="cx" values="280;270;280" dur="10s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Arco-íris */}
        <g opacity="0.25" transform="translate(20, 150)">
          <path d="M0,120 Q100,0 200,120" fill="none" stroke="#FF1744" strokeWidth="6" />
          <path d="M5,120 Q100,10 195,120" fill="none" stroke="#FF9100" strokeWidth="6" />
          <path d="M10,120 Q100,20 190,120" fill="none" stroke="#FFEA00" strokeWidth="6" />
          <path d="M15,120 Q100,30 185,120" fill="none" stroke="#00E676" strokeWidth="6" />
          <path d="M20,120 Q100,40 180,120" fill="none" stroke="#2979FF" strokeWidth="6" />
          <path d="M25,120 Q100,50 175,120" fill="none" stroke="#D500F9" strokeWidth="6" />
        </g>

        {/* Estrelas / brilhos */}
        <g fill="#FFD54F" opacity="0.5">
          <polygon points="50,200 52,206 58,206 53,210 55,216 50,212 45,216 47,210 42,206 48,206">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </polygon>
          <polygon points="320,180 322,186 328,186 323,190 325,196 320,192 315,196 317,190 312,186 318,186">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </polygon>
          <polygon points="180,160 181,163 184,163 182,165 183,168 180,166 177,168 178,165 176,163 179,163">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
          </polygon>
        </g>

        {/* Colinas verdes */}
        <ellipse cx="100" cy="700" rx="200" ry="120" fill="#81C784" opacity="0.3" />
        <ellipse cx="350" cy="720" rx="180" ry="100" fill="#66BB6A" opacity="0.25" />

        {/* Floretes */}
        <circle cx="60" cy="580" r="4" fill="#FF80AB" opacity="0.5">
          <animate attributeName="cy" values="580;575;580" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="340" cy="560" r="3" fill="#CE93D8" opacity="0.5">
          <animate attributeName="cy" values="560;555;560" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="600" r="3.5" fill="#FFAB91" opacity="0.4">
          <animate attributeName="cy" values="600;595;600" dur="4.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
