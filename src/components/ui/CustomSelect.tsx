import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

export interface CustomSelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Tinggi 40px (bawaan 44px) untuk baris filter yang ringkas */
  compact?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Pilih...',
  className = '',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative flex flex-col font-roboto ${className}`} ref={containerRef}>
      {/* Label diatas dropdown jika tersedia (Label/Large: Roboto Medium 14px #212121) */}
      {label && (
        <span className="text-[14px] font-medium text-[#212121] dark:text-[#F8FAFC] mb-1.5 leading-none">
          {label}
        </span>
      )}

      {/* Select Trigger Box (Sesuai Desain Sistem: h-[44px], rounded-[12px], border-[#E0E0E0], open: border-[#00875A]) */}
      <button
        type="button"
        aria-label={label ?? placeholder}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-w-[150px] ${compact ? 'h-10' : 'h-[44px]'} flex items-center justify-between gap-3 px-3.5 rounded-[12px] transition-all text-left outline-none ${
          isOpen
            ? 'border-2 border-[#00875A] bg-white dark:!bg-[#0F172A] shadow-sm'
            : 'border border-[#E0E0E0] dark:border-[#334155] bg-[#F5F5F5] dark:!bg-[#0F172A] hover:bg-white dark:hover:!bg-[#1E293B] hover:border-[#00875A]'
        }`}
      >
        <span className="text-[14px] font-normal text-[#212121] dark:text-[#F8FAFC] truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp size={18} className="text-[#00875A] shrink-0 stroke-[2.5]" />
        ) : (
          <ChevronDown size={18} className="text-[#00875A] shrink-0 stroke-[2.5]" />
        )}
      </button>

      {/* Dropdown Menu Popup (Matching Referensi Gambar: Border-2 Hijau, Rounded-2xl, Background Mint untuk active item) */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[170px] bg-white dark:!bg-[#1E293B] border-2 border-[#00875A] rounded-[16px] p-1.5 shadow-xl shadow-black/20 z-50 flex flex-col gap-1 transition-all animate-in fade-in zoom-in-95 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[14px] transition-all text-left ${
                  isSelected
                    ? 'bg-[#E8F8EE] dark:!bg-[#00875A]/25 text-[#00875A] dark:text-[#34D399] font-semibold'
                    : 'text-[#212121] dark:text-[#F8FAFC] font-normal hover:bg-[#F5F5F5] dark:hover:!bg-[#0F172A]'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check size={18} className="text-[#00875A] shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
