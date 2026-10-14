import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  togglePin: () => void;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
  isExpanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial pinned state from localStorage, default true
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar_pinned');
    return saved !== null ? saved === 'true' : true;
  });

  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Pin hanya berlaku di layar lebar; di layar kecil sidebar tampil sebagai rail ikon agar konten tidak terhimpit
  const [isDesktop, setIsDesktop] = useState<boolean>(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar_pinned', String(isPinned));
  }, [isPinned]);

  const togglePin = () => {
    setIsPinned((prev) => !prev);
  };

  // Sidebar is fully expanded if it is either pinned (desktop only) OR currently hovered
  const isExpanded = (isPinned && isDesktop) || isHovered;

  return (
    <SidebarContext.Provider
      value={{
        isPinned,
        setIsPinned,
        togglePin,
        isHovered,
        setIsHovered,
        isExpanded,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
