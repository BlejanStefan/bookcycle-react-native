import React from 'react';
import Svg, { Text, TSpan } from 'react-native-svg';

export default function BookCycleLogo({ width = 160, height = 45 }) {
  return (
    // 💡 Aumentamos el viewBox a 220 45 para albergar un tamaño de letra mayor sin cortes
    <Svg width={width} height={height} viewBox="0 0 220 45" fill="none">
      <Text
        x="0"
        y="32" // Ajustado el eje Y para centrar la fuente más grande
        fontFamily={
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }
        fontSize="32" // 🚀 Escalado de 26 a 32 para que sea notablemente más grande
        fontWeight="bold"
      >
        <TSpan fill="#ffffff">Book</TSpan>
        <TSpan fill="#059669">Cy</TSpan>
        <TSpan fill="#10b981">cle</TSpan>
      </Text>
    </Svg>
  );
}
