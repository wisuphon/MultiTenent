export interface Tenant {
  id: number;
  companyName: string;
  subdomain: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  tenant: Tenant;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  subdomain: string;
}

export interface ApiResponse<T> {
  data: T;
}