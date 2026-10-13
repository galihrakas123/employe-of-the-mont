import React from 'react';
import { Search } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Pencarian',
  onSearch,
  className = '',
  inputClassName = '',
  id,
  name,
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
  };

  const handleButtonClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div
      className={`h-[46px] flex items-center justify-between bg-white dark:!bg-[#0F172A] border border-[#E0E0E0] dark:border-[#334155] rounded-[14px] p-1.5 pl-4 shadow-xs transition-all focus-within:border-[#00875A] focus-within:ring-1 focus-within:ring-[#00875A] font-roboto ${
        disabled ? 'opacity-60 cursor-not-allowed bg-[#F8FAFC] dark:!bg-[#1E293B]' : ''
      } ${className}`}
    >
      {/* Input Field */}
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-transparent border-none outline-none text-[14px] text-[#212121] dark:text-[#F8FAFC] placeholder:text-[#9E9E9E] dark:placeholder:text-[#64748B] font-normal font-roboto pr-2 ${inputClassName}`}
      />

      {/* Green Search Action Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        aria-label="Cari"
        className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-[10px] bg-[#00875A] hover:bg-[#00724C] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 disabled:pointer-events-none"
      >
        <Search size={18} className="text-white stroke-[2.2]" />
      </button>
    </div>
  );
};

export default SearchBar;
