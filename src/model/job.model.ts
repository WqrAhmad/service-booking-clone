export interface IJob {
  id: number | null
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}


export interface IAddJobRequest {
  id: number | null
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}
export interface IJobResponse {
  id: number
  name:string
  description:string
  platform_fee:string
  is_active:string
  
}
export interface IUpdateJobRequest {
  id: number
  name:string
  description:string
  platform_fee:string
  is_active:string
  

}

export interface IDeleteJobRequest {
  id: string
}
export interface IJobDeleteResponse {
  id: string
}
export interface IJobDelteResponse {
  id: string
}
export interface IFileUploadResponse {
  data: object
}

export type IJobState = IJob
