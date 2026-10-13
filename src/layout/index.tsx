import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { SidebarProvider } from './SidebarContext';

export const MainLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800 font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <Header />
          <main className="flex-1 w-full box-border">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
