import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantClass = `btn-${variant}`;

  return (
    <button 
      className={`btn-base ${variantClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};