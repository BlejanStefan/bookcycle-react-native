import React from 'react';
import Svg, { G, Path, Circle, Rect } from 'react-native-svg';

export default function BookIllustration({ size = 260 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400" fill="none">
      {/* RED DE CONEXIONES DE FONDO (Líneas finas) */}
      <G stroke="#334155" strokeWidth="2" strokeDasharray="4 4">
        <Path d="M 70 150 L 200 100 L 330 150 L 350 210 L 200 240 L 50 210 Z" />
        <Path d="M 200 100 L 200 240 M 70 150 L 200 160 L 330 150" />
        <Path d="M 120 140 L 200 240 L 280 140" />
      </G>
      {/* NODOS SECUNDARIOS DE LA RED */}
      <Circle cx="50" cy="210" r="6" fill="#475569" />
      <Circle cx="70" cy="150" r="6" fill="#10b981" />
      <Circle cx="330" cy="150" r="6" fill="#475569" />
      <Circle cx="350" cy="210" r="6" fill="#10b981" />
      <Circle cx="270" cy="105" r="5" fill="#f59e0b" /> {/* Toque dorado */}
      <Circle cx="100" cy="115" r="5" fill="#10b981" />
      {/* --- LIBRO ABIERTO (Estructura central) --- */}
      {/* Base/Lomo inferior del libro */}
      <Path
        d="M 200 320 C 170 320 120 300 60 300 L 60 310 C 120 310 170 330 200 330 C 230 330 280 310 340 310 L 340 300 C 280 300 230 320 200 320 Z"
        fill="#047857"
      />
      {/* Páginas izquierdas */}
      <Path
        d="M 200 310 C 160 310 110 285 70 285 L 110 170 C 150 170 180 195 200 200 Z"
        fill="#e2e8f0"
      />
      <Path
        d="M 200 315 C 160 315 110 290 75 290 L 112 175 C 152 175 182 200 200 205 Z"
        fill="#cbd5e1"
        opacity="0.7"
      />
      {/* Páginas derechas */}
      <Path
        d="M 200 310 C 240 310 290 285 330 285 L 290 170 C 250 170 220 195 200 200 Z"
        fill="#f8fafc"
      />
      <Path
        d="M 200 315 C 240 315 290 290 325 290 L 288 175 C 248 175 218 200 200 205 Z"
        fill="#e2e8f0"
        opacity="0.7"
      />
      {/* Líneas de texto simuladas en el libro */}
      <Path
        d="M 110 220 Q 150 225 180 215 M 105 240 Q 150 245 180 235 M 100 260 Q 150 265 180 255"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M 290 220 Q 250 225 220 215 M 295 240 Q 250 245 220 235 M 300 260 Q 250 265 220 255"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* --- ICONOS DE FLUJO CIRCULARES (Burbujas superiores) --- */}
      {/* 1. Icono Reloj (Tiempo/Disponibilidad) - Top Centro */}
      <Circle
        cx="200"
        cy="80"
        r="26"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <Circle
        cx="200"
        cy="80"
        r="20"
        stroke="#38bdf8"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M 200 70 L 200 80 L 210 85"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 2. Icono Ciclo Izquierdo (Intercambio rápido) */}
      <Circle
        cx="130"
        cy="140"
        r="26"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <Path
        d="M 120 140 A 10 10 0 1 1 135 149"
        stroke="#10b981"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 135 144 L 135 151 L 129 151"
        fill="#10b981"
        stroke="#10b981"
        strokeWidth="1"
      />
      {/* 3. Icono Carrito / Transacción - Centro Medio */}
      <Circle
        cx="200"
        cy="160"
        r="26"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <Path
        d="M 188 152 L 194 152 L 198 164 L 210 164 L 214 156 L 196 156"
        stroke="#fbbf24"
        strokeWidth="2.5"
        fill="none"
      />
      <Circle cx="200" cy="169" r="2.5" fill="#fbbf24" />
      <Circle cx="208" cy="169" r="2.5" fill="#fbbf24" />
      {/* 4. Icono Mensaje / Buzón - Derecha */}
      <Circle
        cx="270"
        cy="140"
        r="26"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="3"
      />
      <Rect
        x="258"
        y="131"
        width="24"
        height="16"
        rx="3"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="2.5"
      />
      <Path
        d="M 258 133 L 270 141 L 282 133"
        stroke="#2dd4bf"
        strokeWidth="2"
      />
      {/* 5. Icono Ciclo en Página (Intercambio directo) */}
      <Circle cx="130" cy="230" r="24" fill="#334155" />
      <Path
        d="M 122 230 A 8 8 0 1 1 134 237"
        stroke="#e2e8f0"
        strokeWidth="2.5"
        fill="none"
      />
      {/* 6. DISPOSITIVO SMARTPHONE CON CANDADO (Seguridad) - Centro Abajo */}
      <G transform="translate(182, 200)">
        <Rect
          x="0"
          y="0"
          width="36"
          height="60"
          rx="6"
          fill="#1e293b"
          stroke="#10b981"
          strokeWidth="3"
        />
        <Circle cx="18" cy="52" r="2" fill="#10b981" />
        {/* Candado */}
        <Rect x="12" y="26" width="12" height="10" rx="1" fill="#10b981" />
        <Path
          d="M 14 26 L 14 22 C 14 19 22 19 22 22 L 22 26"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
        />
      </G>
      {/* 7. Icono Lectura Móvil - Página Derecha */}
      <Circle cx="270" cy="230" r="24" fill="#334155" />
      <Rect
        x="261"
        y="217"
        width="18"
        height="26"
        rx="3"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2.5"
      />
      <Path
        d="M 266 224 L 274 224 M 266 230 L 274 230"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
    </Svg>
  );
}
