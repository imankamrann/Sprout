import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "font-bold py-3 px-6 rounded-2xl transition-all transform active:scale-95 border-b-4 focus:outline-none";
  
  let variantStyle = "";
  
  switch (variant) {
    case 'primary':
      variantStyle = "bg-sprout-green border-sprout-greenDark text-white hover:bg-green-400";
      break;
    case 'secondary':
      variantStyle = "bg-sprout-purple border-sprout-purpleDark text-white hover:bg-purple-400";
      break;
    case 'danger':
      variantStyle = "bg-red-500 border-red-700 text-white hover:bg-red-400";
      break;
    case 'outline':
      variantStyle = "bg-white border-gray-200 text-gray-500 hover:bg-gray-50";
      break;
    case 'gradient':
      variantStyle = "bg-gradient-to-r from-[#1CB0F6] to-[#A570FF] border-b-0 border-transparent text-white hover:brightness-110 shadow-lg";
      break;
  }

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};