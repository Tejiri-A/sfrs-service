import type { User, UserRole } from '../libs/types.js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}
