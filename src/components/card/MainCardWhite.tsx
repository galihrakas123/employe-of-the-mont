import React from 'react';

interface MainCardWhiteProps {
  children: React.ReactNode;
  className?: string;
  padding?: string | number;
}

export const MainCardWhite: React.FC<MainCardWhiteProps> = ({
  children,
  className = '',
  padding = '20px',
}) => {
  return (
    <div
      className={`card-white ${className}`}
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #edf2f7',
        padding,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  );
};

export default MainCardWhite;
