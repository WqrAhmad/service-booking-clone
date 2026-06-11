export interface IUser {
  id: number | null
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  status: string
  phone: string
  avatar: string
  address: string
  password: string
  password_confirmation: string
}
export interface IUserToggle {
  id: number | null
 
  
}
export interface IAddUserRequest {
  id: number | null
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  status: string
  phone: string
  avatar: string
  address: string
  password: string
  password_confirmation: string
}

export interface IUpdateUserRequest {
  id: number | null
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  status: string
  phone: string
  avatar: string
  address: string
  password: string
  password_confirmation: string

  // role: 'SUPER_ADMIN' | 'ADMIN_USER' | 'COMPANY_ADMIN' | 'COMPANY_USER'|null;
  // token:string|null;
}
export interface IDeleteUserRequest {
  id: string
}
export interface IUserDeleteResponse {
  id: string
}
export interface IUserDelteResponse {
  id: string
}
export interface IFileUploadResponse {
  data: object
}

export type IUserState = IUser
