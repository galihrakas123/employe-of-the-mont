import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';

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
  /** Tampilkan kolom pencarian di dalam dropdown (bawaan aktif) */
  searchable?: boolean;
}

// Pencarian tidak peka huruf besar/kecil dan mengabaikan spasi berlebih
const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Pilih...',
  className = '',
  compact = false,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
  const q = normalize(query);
  const filtered = q ? options.filter((opt) => normalize(opt.label).includes(q)) : options;

  // Saat dibuka: kosongkan pencarian, sorot opsi terpilih, fokus ke kolom cari
  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(Math.max(0, options.findIndex((opt) => opt.value === value)));
    if (searchable) searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Pastikan opsi yang disorot tetap terlihat saat navigasi keyboard
  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const close = (focusTrigger = true) => {
    setIsOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const select = (option: CustomSelectOption) => {
    onChange(option.value);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) select(filtered[activeIndex]);
    } else if (e.key === 'Escape') {
      // Jangan sampai Esc ikut membatalkan pilihan unit di halaman
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div className={`relative flex flex-col font-roboto ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Label diatas dropdown jika tersedia (Label/Large: Roboto Medium 14px #212121) */}
      {label && (
        <span className="text-[14px] font-medium text-[#212121] dark:text-[#F8FAFC] mb-1.5 leading-none">
          {label}
        </span>
      )}

      {/* Select Trigger Box (Sesuai Desain Sistem: h-[44px], rounded-[12px], border-[#E0E0E0], open: border-[#00875A]) */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={label ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full ${compact ? 'min-w-0 h-10' : 'min-w-[150px] h-[44px]'} flex items-center justify-between gap-3 px-3.5 rounded-[12px] transition-all text-left outline-none ${
          isOpen
            ? 'border-2 border-[#00875A] bg-white dark:!bg-[#0F172A] shadow-sm'
            : 'border border-[#E0E0E0] dark:border-[#334155] bg-[#F5F5F5] dark:!bg-[#0F172A] hover:bg-white dark:hover:!bg-[#1E293B] hover:border-[#00875A] focus-visible:border-[#00875A]'
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
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[200px] bg-white dark:!bg-[#1E293B] border-2 border-[#00875A] rounded-[16px] p-1.5 shadow-xl shadow-black/20 z-50 flex flex-col gap-1 transition-all animate-in fade-in zoom-in-95 duration-150">
          {/* Kolom pencarian */}
          {searchable && (
            <label className="flex items-center gap-2 h-9 px-2.5 mb-0.5 rounded-[10px] bg-[#F5F5F5] dark:!bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155] focus-within:border-[#00875A]">
              <Search size={15} className="text-[#00875A] shrink-0 stroke-[2.5]" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Cari..."
                aria-label={`Cari ${label ?? placeholder}`}
                className="w-full bg-transparent border-none outline-none text-[13px] text-[#212121] dark:text-[#F8FAFC] placeholder:text-[#94A3B8]"
              />
            </label>
          )}

          <div ref={listRef} role="listbox" className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3.5 py-3 text-[13px] text-[#94A3B8] text-center">Tidak ada yang cocok</div>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(option)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[14px] transition-all text-left ${
                      isSelected
                        ? 'bg-[#E8F8EE] dark:!bg-[#00875A]/25 text-[#00875A] dark:text-[#34D399] font-semibold'
                        : isActive
                          ? 'bg-[#F5F5F5] dark:!bg-[#0F172A] text-[#212121] dark:text-[#F8FAFC] font-normal'
                          : 'text-[#212121] dark:text-[#F8FAFC] font-normal'
                    } ${isActive && isSelected ? 'ring-1 ring-[#00875A]/40' : ''}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check size={18} className="text-[#00875A] shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
