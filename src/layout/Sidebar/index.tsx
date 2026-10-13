import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Pin,
  LayoutGrid,
  LogOut,
} from 'lucide-react';
import { useSidebar } from '../SidebarContext';
import bapendaLogo from '@/assets/bapenda-logo.png';

export const Sidebar: React.FC = () => {
  const { isPinned, togglePin, isHovered, setIsHovered, isExpanded } = useSidebar();

  return (
    <aside
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
      className={`bg-white dark:bg-[#1E293B] border-r border-[#E0E0E0] dark:border-[#334155] flex flex-col min-h-screen sticky top-0 h-screen z-50 select-none font-roboto transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64 shadow-xl lg:shadow-none' : 'w-16'
      }`}
    >
      {/* 1. BRAND HEADER (Matching Referensi Persis) */}
      <div
        className={`pt-4 pb-3 flex items-center transition-all ${
          isExpanded ? 'px-4 justify-between' : 'justify-center px-0'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Rounded Box dengan outline halus & bayangan lembut */}
          <div className="w-[42px] h-[42px] rounded-[14px] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden p-1.5">
            <img src={bapendaLogo} alt="Logo Bapenda" className="w-full h-full object-contain" />
          </div>

          {/* Teks: DASHBOARD / KINERJA / Bapenda Jabar */}
          {isExpanded && (
            <div className="overflow-hidden transition-opacity duration-200 flex flex-col justify-center">
              <div className="text-[13px] font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] uppercase leading-none whitespace-nowrap">
                DASHBOARD
              </div>
              <div className="text-[12px] font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] uppercase leading-tight whitespace-nowrap mt-0.5">
                KINERJA
              </div>
              <div className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap mt-0.5">
                Bapenda Jabar
              </div>
            </div>
          )}
        </div>

        {/* Pin Button Melingkar Hijau Mint (Matching Gambar Referensi) */}
        {isExpanded && (
          <button
            onClick={togglePin}
            title={isPinned ? 'Lepas Pin (Auto Collapse)' : 'Kunci Menu (Pin Open)'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
              isPinned
                ? 'bg-[#E8F8EE] dark:bg-[#00875A]/20 text-[#00875A] dark:text-[#34D399] hover:bg-[#D5F2E0]'
                : 'bg-[#F3F4F6] dark:bg-[#0F172A] text-[#9CA3AF] dark:text-[#64748B] hover:text-[#4B5563] dark:hover:text-[#F8FAFC] hover:bg-[#E5E7EB]'
            }`}
          >
            <Pin
              size={16}
              className={`transition-transform duration-200 ${
                isPinned ? 'rotate-45 fill-[#00875A]' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* 2. NAVIGATION MENUS (Hanya Dashboard Sesuai Permintaan) */}
      <nav className={`flex-1 py-4 flex flex-col gap-2 overflow-y-auto ${
        isExpanded ? 'px-3' : 'px-2 items-center'
      }`}>
        {/* Menu: Dashboard (Active Icon: Green Container bg-[#E6F4EA] text-[#00875A]) */}
        <NavLink
          to="/beranda"
          title={!isExpanded ? 'Dashboard' : undefined}
          className={({ isActive }) =>
            isExpanded
              ? `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E6F4EA] dark:bg-[#00875A]/25 text-[#00875A] dark:text-[#34D399] font-semibold shadow-sm'
                    : 'text-[#616161] dark:text-[#94A3B8] hover:text-[#212121] dark:hover:text-[#F8FAFC] hover:bg-[#F5F5F5] dark:hover:bg-[#0F172A]'
                }`
              : `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#E6F4EA] dark:bg-[#00875A]/25 text-[#00875A] dark:text-[#34D399] shadow-sm'
                    : 'text-[#757575] dark:text-[#94A3B8] hover:bg-[#F5F5F5] dark:hover:bg-[#0F172A] hover:text-[#212121] dark:hover:text-[#F8FAFC]'
                }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutGrid size={20} className={isActive ? 'text-[#00875A] dark:text-[#34D399]' : 'text-[#757575] dark:text-[#94A3B8]'} />
              {isExpanded && <span className="whitespace-nowrap text-[13px]">Dashboard</span>}
            </>
          )}
        </NavLink>
      </nav>

      {/* 3. LOGOUT BUTTON AT BOTTOM (Matching Gambar Kedua Skin: Red LogOut Icon) */}
      <div className={`py-3 border-t border-[#F5F5F5] dark:border-[#334155] ${
        isExpanded ? 'px-3' : 'px-2 flex justify-center'
      }`}>
        <NavLink
          to="/login"
          title={!isExpanded ? 'Keluar' : undefined}
          className={
            isExpanded
              ? 'flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#E53935] hover:bg-[#FFEBEE] dark:hover:bg-[#E53935]/10 transition'
              : 'w-10 h-10 rounded-xl flex items-center justify-center text-[#E53935] hover:bg-[#FFEBEE] dark:hover:bg-[#E53935]/10 transition'
          }
        >
          <LogOut size={20} className="text-[#E53935] shrink-0" />
          {isExpanded && <span className="whitespace-nowrap">Keluar</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
