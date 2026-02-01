import React from 'react';
import logo from '/assets/WealthSimpleLogo.svg';

interface SproutLogoProps {
  className?: string;
  onClick?: () => void;
}

export const SproutLogo: React.FC<SproutLogoProps> = ({ className = "h-8", onClick }) => (
  <div 
    className={`flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <img src={logo} alt="Wealthsimple Sprout" className={`${className} w-auto`} />
  </div>
);