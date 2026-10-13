import React from 'react';
import useLoginController from '../controller/useLoginController';
import Button from '@/components/ui/Button';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import bapendaLogo from '@/assets/bapenda-logo.png';

export const LoginView: React.FC = () => {
  const { email, setEmail, password, setPassword, handleLogin } = useLoginController();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1e3a8a, #0f172a 70%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '40px 36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '18px',
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
              padding: '10px',
              overflow: 'hidden',
            }}
          >
            <img src={bapendaLogo} alt="Logo Bapenda" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Dashboard Kinerja Strategis
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            BAPENDA PROVINSI JAWA BARAT
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Email Akun Kedinasan
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
              }}
            >
              <Mail size={18} color="#94a3b8" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@bapenda.jabarprov.go.id"
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Kata Sandi
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
              }}
            >
              <Lock size={18} color="#94a3b8" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            style={{ width: '100%', marginTop: '8px', background: '#16a34a' }}
            icon={<ArrowRight size={18} />}
          >
            Masuk ke Sistem
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
          © 2026 Bapenda Provinsi Jawa Barat • Sistem Informasi Kinerja
        </div>
      </div>
    </div>
  );
};

export default LoginView;
