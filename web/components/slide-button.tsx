import React from 'react';

interface SlideButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SlideButton({ children, onClick, className = '' }: SlideButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative px-6 py-3 font-semibold rounded-lg 
        transition-all duration-300 ease-in-out
        hover:translate-x-2 hover:shadow-lg
        flex items-center gap-2
        ${className}
      `}
      style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--text-primary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--primary)';
      }}
    >
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {children}
      </span>
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}