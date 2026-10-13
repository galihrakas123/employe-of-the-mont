import { User } from '@/types';

const defaultUsers: User[] = [
  {
    id: 'usr-1',
    nip: '19890412 201402 1 003',
    name: 'Ahmad Fauzi, S.Kom',
    email: 'ahmad.fauzi@bapenda.go.id',
    role: 'ADMIN',
    division: 'Bidang Pendataan & Penetapan Pajak',
    status: 'ACTIVE',
    createdAt: '2024-01-10',
  },
  {
    id: 'usr-2',
    nip: '19910620 201601 2 005',
    name: 'Siti Rahmawati, S.E',
    email: 'siti.rahmawati@bapenda.go.id',
    role: 'OPERATOR',
    division: 'Bidang Penagihan & Pemeriksaan',
    status: 'ACTIVE',
    createdAt: '2024-02-15',
  },
  {
    id: 'usr-3',
    nip: '19950110 202102 1 004',
    name: 'Doni Pratama',
    email: 'doni.kurir@bapenda.go.id',
    role: 'KURIR',
    division: 'Seksi Pengiriman & Distribusi',
    status: 'ACTIVE',
    createdAt: '2024-03-01',
  },
];

export const userService = {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => setTimeout(() => resolve(defaultUsers), 200));
  },

  async getCurrentUser(): Promise<User> {
    return defaultUsers[0];
  },

  async updateUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<boolean> {
    const user = defaultUsers.find((u) => u.id === id);
    if (user) {
      user.status = status;
      return true;
    }
    return false;
  },
};
