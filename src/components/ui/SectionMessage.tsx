import React from 'react';
import { X } from 'lucide-react';

export type SectionMessageVariant = 'error' | 'success' | 'warning' | 'info';

export interface SectionMessageProps {
  variant?: SectionMessageVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const SectionMessage: React.FC<SectionMessageProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  // Config icon pixel-perfect matching Gambar Pertama
  const renderIcon = () => {
    switch (variant) {
      case 'error':
        return (
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#E53935" />
            <rect x="11" y="7" width="2" height="6" rx="1" fill="white" />
            <circle cx="12" cy="16" r="1.2" fill="white" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#00875A" />
            <path
              d="M7.5 12L10.5 15L16.5 9"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5L1.5 21H22.5L12 2.5Z"
              fill="#FB8C00"
            />
            <rect x="11" y="9" width="2" height="5.5" rx="1" fill="white" />
            <circle cx="12" cy="17.5" r="1.2" fill="white" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1976D2" />
            <rect x="11" y="10" width="2" height="6" rx="1" fill="white" />
            <circle cx="12" cy="7" r="1.2" fill="white" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 sm:p-5 border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between gap-3.5 font-roboto transition-all ${className}`}
    >
      <div className="flex items-start gap-3.5 flex-1">
        {/* Left Indicator Icon */}
        {renderIcon()}

        {/* Message Content */}
        <div className="text-[13px] sm:text-[14px] text-[#212121] leading-relaxed flex-1">
          {title && (
            <div className="font-semibold text-[14px] text-[#212121] mb-1">
              {title}
            </div>
          )}
          <div className="text-[#424242] font-normal leading-normal">
            {children}
          </div>
        </div>
      </div>

      {/* Optional Dismiss Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#9E9E9E] hover:text-[#424242] p-1 rounded-lg hover:bg-[#F5F5F5] transition cursor-pointer"
          title="Tutup pesan"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SectionMessage;
