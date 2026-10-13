import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Layers,
  Pin,
  LayoutGrid,
  LogOut,
} from 'lucide-react';
import { useSidebar } from '../SidebarContext';

export const Sidebar: React.FC = () => {
  const { isPinned, togglePin, isHovered, setIsHovered, isExpanded } = useSidebar();

  return (
    <aside
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
      className={`bg-white border-r border-[#E0E0E0] flex flex-col min-h-screen sticky top-0 h-screen z-50 select-none font-roboto transition-all duration-300 ease-in-out ${
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
          <div className="w-[42px] h-[42px] rounded-[14px] bg-white border border-[#E5E7EB] text-[#0F172A] flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <Layers size={21} className="text-[#0F172A]" />
          </div>

          {/* Teks: DASHBOARD SKKP / Bapenda Jabar */}
          {isExpanded && (
            <div className="overflow-hidden transition-opacity duration-200">
              <div className="text-[14px] font-black tracking-tight text-[#0F172A] uppercase leading-tight whitespace-nowrap">
                DASHBOARD SKKP
              </div>
              <div className="text-[12px] font-medium text-[#64748B] whitespace-nowrap mt-0.5">
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
                ? 'bg-[#E8F8EE] text-[#00875A] hover:bg-[#D5F2E0]'
                : 'bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#E5E7EB]'
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
                    ? 'bg-[#E6F4EA] text-[#00875A] font-semibold shadow-sm'
                    : 'text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5]'
                }`
              : `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#E6F4EA] text-[#00875A] shadow-sm'
                    : 'text-[#757575] hover:bg-[#F5F5F5] hover:text-[#212121]'
                }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutGrid size={20} className={isActive ? 'text-[#00875A]' : 'text-[#757575]'} />
              {isExpanded && <span className="whitespace-nowrap text-[13px]">Dashboard</span>}
            </>
          )}
        </NavLink>
      </nav>

      {/* 3. LOGOUT BUTTON AT BOTTOM (Matching Gambar Kedua Skin: Red LogOut Icon) */}
      <div className={`py-3 border-t border-[#F5F5F5] ${
        isExpanded ? 'px-3' : 'px-2 flex justify-center'
      }`}>
        <NavLink
          to="/login"
          title={!isExpanded ? 'Keluar' : undefined}
          className={
            isExpanded
              ? 'flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#E53935] hover:bg-[#FFEBEE] transition'
              : 'w-10 h-10 rounded-xl flex items-center justify-center text-[#E53935] hover:bg-[#FFEBEE] transition'
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
