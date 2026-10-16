import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Menu } from 'lucide-react';
import { getPeriode } from '@/services/periodeData';
import { useSidebar } from '../SidebarContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import avatarImg from '@/assets/avatar.png';

export const Header: React.FC = () => {
  const { togglePin, isPinned } = useSidebar();
  const [searchParams] = useSearchParams();
  const periode = getPeriode(searchParams.get('periode'));

  return (
    <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-6 sticky top-0 z-40 select-none font-roboto">
      {/* 1. Left: Hamburger Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePin}
          title={isPinned ? 'Tutup / Ciutkan Sidebar' : 'Buka & Kunci Sidebar'}
          className="w-10 h-10 rounded-lg hover:bg-[#F5F5F5] hover:text-[#00875A] flex items-center justify-center text-[#212121] transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* 2. Right: Theme Toggle, Periode, Profil */}
      <div className="flex items-center gap-3.5">
        {/* Switch Dark Mode / Light Mode sesuai Desain Referensi */}
        <ThemeToggle />

        {/* Periode Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-1.5 text-[12px] text-[#424242] font-medium">
          <Calendar size={14} className="text-[#00875A]" />
          <span>
            Periode: <strong className="text-[#212121] font-semibold">{periode.label}</strong>
          </span>
        </div>

        {/* User Profile Pill (Fadli Rosyid / Admin dengan Foto Profil Baru) */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E0E0E0] cursor-pointer hover:opacity-85 transition">
          <div className="w-10 h-10 rounded-xl bg-[#374151] flex items-center justify-center shadow-sm overflow-hidden border border-[#E0E0E0] shrink-0">
            <img
              src={avatarImg}
              alt="Avatar Fadli Rosyid"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text initials if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-[11px] text-white font-bold hidden">FR</span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[13px] font-semibold text-[#212121] leading-tight font-roboto">
              Fadli Rosyid
            </div>
            <div className="text-[11px] text-[#757575] font-normal font-roboto">
              Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
