import type { PM } from '@kennys_wang/pm-core'

interface PasswordManager {
  getList: () => PM[];
  createAccount: (pm: Omit<PM, 'id'>) => void;
  deleteAccount: (id: string) => void;
  copyPassword: (id: string) => void;
  getAccount: (id: string, mask?: string) => PM;
  remarkAccount: (id: string, remark: string) => void;
  editAccount: (id: string, pwd: string) => void;
  moveAccount: (id: string, board: string) => void;
  findAccounts: (keyword: string, mask?: string) => PM[];
  getArchivedAccounts: (mask?: string) => PM[];
  clearArchivedAccounts: () => void;
  restore: (ids: string[]) => void;
  hasMainPassword: () => boolean;
  validateMainPassword: (pwd: string) => boolean;
  setMainPassword: (pwd: string) => void;
}

interface SystemOperation {
  setWin: (type: 'min' | 'max' | 'close') => void;
  isMaximized: () => Promise<boolean>;
}

declare global {
  interface Window {
    pm: PasswordManager;
    os: SystemOperation;
  }
}
