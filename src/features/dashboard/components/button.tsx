// Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties; // Optional for additional styling
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, style }) => (
  <button onClick={onClick} disabled={disabled} style={style} className="bingo-gacha-button">
    {children}
  </button>
);

export default Button;
