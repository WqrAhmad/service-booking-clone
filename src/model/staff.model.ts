export interface IStaff {
  id: number | null
  email:string
  phone:string
  address:string
  name:string
  password:string
  password_confirmation:string
  permissions:[]
}


export interface IAddStaffRequest {
  id: number | null
  name:string
  email:string
  phone:string
  address:string
  password:string
  password_confirmation:string
  permissions:[]
  
}
export interface IStaffResponse {
  id: number
  email:string
  phone:string
  address:string
  name:string
  password:string
  password_confirmation:string
  permissions:[]
  
}
export interface IUpdateStaffRequest {
  id: number
  name:string
  email:string
  phone:string
  address:string
  password:string
  password_confirmation:string
  permissions:[]
  

}
export interface IDeleteStaffRequest {
  id: string
}
export interface IStaffDeleteResponse {
  id: string
}
export interface IStaffDelteResponse {
  id: string
}
export interface IFileUploadResponse {
  data: object
}

export type IStaffState = IStaff
