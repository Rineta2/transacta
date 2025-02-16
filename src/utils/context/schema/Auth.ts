export enum Role {
  SUPER_ADMIN = "super-admins",
  ADMIN = "admins",
}

export interface UserAccount {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  phoneNumber: string;
  createdAt: Date;
  photoURL: string;
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  logout: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
  getDashboardUrl: () => string;
}
