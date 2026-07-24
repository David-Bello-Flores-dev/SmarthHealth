import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`sh-card ${className}`} {...props}>
      {children}
    </div>
  );
};