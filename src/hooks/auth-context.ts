import { createContext } from 'react';
import type { AuthContextType } from './auth-types.js';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
