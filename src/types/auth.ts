
export type User = {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium';
  emailVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  supabase: any;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateSubscription: (type: "free" | "premium") => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  verifyEmailWithCode: (code: string) => Promise<boolean>;
  resendVerificationEmail: (email?: string) => Promise<void>;
};

export type AuthUser = {
  id: string;
  email: string;
};
