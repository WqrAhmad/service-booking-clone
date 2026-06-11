
// import { IUser } from './user.model'

export interface ILoginRequest {
  login: string
  password: string
  rememberMe: boolean
}

export interface IOptRequest {
  code: string
  email: string
}

export interface IToken {
  token: string

}

export interface ILoginResponse extends IToken {
  data: any
  access_token: string
  admin: object
  user: IToken
}
export interface IOptResponse {
  code: string
  email: string
}

export interface ISignUpRequest {
  company_name: string
  contact_person: string
  address: string
  country_code: number
  city: string
  language_code: number
  zipcode: string
  vat_no: string
  phone_no: string
  email: string
  password: string
  password_confirmation: string
}

export interface ISignUpResponse  {
  data: any
  user: ILoginResponse
}

export interface ILogoutRequest {
  token: string
}

export interface IForgotPasswordRequest {
  email: string
}

export type IForgotPasswordResponse = [false]

export interface IResetPasswordRequest {
  email: string
  password: string
  password_confirmation: string
}
export interface IUpdatePasswordRequest {
  current_password: string
  password: string
  password_confirmation: string
}
export interface IUpdateProfileRequest {
  name: string
  address: string
  avatar: string
  phone: string
}
