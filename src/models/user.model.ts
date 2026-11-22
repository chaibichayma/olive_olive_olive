
export interface UserRole {
  id: number;
  name: string;
}

export interface UserTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface User {
  id: number;
  userId?: number;
  createdUser?: string;
  createdDate?: string;
  createdTime?: UserTime;
  searche?: string;
  displayName?: string;
  userName?: string;
  mail?: string;
  password?: string;
  userCode?: string;
  isActive?: boolean;
  roles?: UserRole[];
}

export interface UserRequest {
  id?: number;
  userId?: number;
  createdUser?: string;
  createdDate?: string;
  createdTime?: UserTime;
  searche?: string;
  displayName: string;
  userName: string;
  mail: string;
  password?: string;
  userCode?: string;
  isActive: boolean;
  roles: UserRole[];
}

export interface UserDeleteResponse {
  message: string;
  isValid?: boolean;
}
