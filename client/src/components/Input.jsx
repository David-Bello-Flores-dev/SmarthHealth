import React from 'react';

export const Input = ({ label, error, className = '', id, ...props }) => {
  return (
    <div className={`sh-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="sh-input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`sh-input ${error ? 'sh-input-error' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[--color-status-danger] font-medium">
          {error}
        </span>
      )}
    </div>
  );
};