import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
      title={isDark ? 'Mode Gelap aktif. Klik untuk Mode Terang' : 'Mode Terang aktif. Klik untuk Mode Gelap'}
      className={`relative w-[60px] h-[32px] rounded-full bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] p-[3px] flex items-center justify-between cursor-pointer transition-colors shadow-inner select-none ${className}`}
    >
      {/* Background Icon Kiri (Sun) */}
      <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
        <Sun
          size={14}
          className={`transition-opacity duration-200 ${
            isDark ? 'text-[#64748B] opacity-70' : 'opacity-0'
          }`}
        />
      </div>

      {/* Background Icon Kanan (Moon) */}
      <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
        <Moon
          size={13}
          className={`transition-opacity duration-200 ${
            isDark ? 'opacity-0' : 'text-[#94A3B8] opacity-80'
          }`}
        />
      </div>

      {/* Sliding Thumb Hijau (Sesuai Gambar Referensi Persis) */}
      <div
        className={`absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-full bg-[#00875A] text-white flex items-center justify-center shadow-md transition-transform duration-200 ease-in-out ${
          isDark ? 'translate-x-[28px]' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon size={13} className="text-white fill-white" />
        ) : (
          <Sun size={14} className="text-white stroke-[2.2]" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
