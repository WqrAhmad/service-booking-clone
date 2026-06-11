export interface IServices {
  id: number | null
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}

export interface IAddServicesRequest {
  id: number | null
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}
export interface IServicesResponse {
  id: number
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}
export interface IUpdateServicesRequest {
  id: number
  name:string
  description:string
  platform_fee:string
  is_active:string
  

}
export interface IDeleteServicesRequest {
  id: string
}
export interface IServicesDeleteResponse {
  id: string
}
export interface IServicesDelteResponse {
  id: string
}
export interface IFileUploadResponse {
  data: object
}

export type IServicesState = IServices
