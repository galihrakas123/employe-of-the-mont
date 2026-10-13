import React from 'react';
import { User, Mail, Award, Calendar, Users, MapPin, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { mockDetailProfile, P3dwLeaderboardData } from '@/services/dashboardMockData';

interface ProfileHeaderCardProps {
  unitData?: P3dwLeaderboardData;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ unitData }) => {
  const p = mockDetailProfile;
  const unitName = unitData ? unitData.namaP3dw : p.unitKerja;
  const korwil = unitData ? unitData.kanwil : p.korwil;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-6 font-roboto">
      {/* 1. Card Top Bar Title */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
        <div>
          <h3 className="text-[16px] font-semibold text-[#212121]">
            Profil Unit Kerja &amp; Kepala UPTD
          </h3>
          <p className="text-[12px] text-[#757575] mt-0.5">
            Informasi kepegawaian dan data administratif penanggung jawab unit
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#00875A] bg-[#E6F4EA] px-3 py-1 rounded-full border border-[#00875A]/20">
          Data Terverifikasi Bapenda
        </span>
      </div>

      {/* 2. Profil Kepala Cabang: Avatar & Identitas */}
      <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[#F1F5F9]">
        {/* Avatar Initials - Proporsional dengan teks */}
        <div className="w-11 h-11 rounded-xl bg-[#E6F4EA] border border-[#00875A]/30 text-[#00875A] flex items-center justify-center font-bold text-[15px] shrink-0 shadow-xs">
          {p.namaKepala.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>

        {/* Nama & Subtitle */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[17px] font-bold text-[#0F172A] leading-snug">
              {p.namaKepala}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#00875A] text-white">
              Kepala Cabang
            </span>
          </div>
          <p className="text-[13px] text-[#64748B] mt-0.5 font-medium">
            Kepala UPTD {unitName} • {korwil}
          </p>
        </div>
      </div>

      {/* 3. Detailed Info Grid - Membentang Penuh (Fill Semua Sisi Kiri Tanpa Ruang Kosong) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-[12px]">
        {/* 1. NIP */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <User size={13} className="text-[#00875A]" /> NIP
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.nip}</strong>
        </div>

        {/* 2. Pangkat & Golongan */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <Award size={13} className="text-[#00875A]" /> Pangkat &amp; Golongan
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.pangkat}</strong>
        </div>

        {/* 3. Jabatan */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <Briefcase size={13} className="text-[#00875A]" /> Jabatan
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.jabatan}</strong>
        </div>

        {/* 4. Unit Kerja */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <MapPin size={13} className="text-[#00875A]" /> Unit Kerja
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{unitName}</strong>
        </div>

        {/* 5. Masa Jabatan */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <Calendar size={13} className="text-[#00875A]" /> Masa Jabatan
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.masaJabatan}</strong>
        </div>

        {/* 6. Pendidikan Terakhir */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <GraduationCap size={13} className="text-[#00875A]" /> Pendidikan Terakhir
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.pendidikan}</strong>
        </div>

        {/* 7. Jumlah Pegawai */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <Users size={13} className="text-[#00875A]" /> Jumlah Pegawai
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.jumlahPegawai}</strong>
        </div>

        {/* 8. Sertifikasi Kompetensi */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#00875A]" /> Sertifikasi Kompetensi
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold">{p.sertifikasi || 'Tersertifikasi s/d 2028'}</strong>
        </div>

        {/* 9. Kontak Resmi */}
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] md:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
            <Mail size={13} className="text-[#00875A]" /> Kontak Resmi
          </span>
          <strong className="block text-[#0F172A] mt-1 font-semibold truncate" title={p.kontak}>
            {p.kontak}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
