import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout';

import BerandaView from '@/pages/dashboard_kinerja/modules/beranda/view/BerandaView';
import DetailAnalisisView from '@/pages/dashboard_kinerja/modules/detail_analisis/view/DetailAnalisisView';
import LoginView from '@/pages/auth/modules/login/view/LoginView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/beranda" replace />} />
        <Route path="beranda" element={<BerandaView />} />
        <Route path="beranda/detail-analisis" element={<DetailAnalisisView />} />
      </Route>

      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Routes>
  );
};

export default AppRoutes;
